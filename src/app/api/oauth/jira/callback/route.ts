import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { dbInit } from '@/data-source';
import { exchangeCode, getMe } from '@/services/api/atlassianOauth';
import { setExchangeResultInJiraConnection } from '@/services/jiraOauth';
import { verifyJwt } from '@/services/jwt';
import { generateAtlassianStateCookieName, generateJiraRedirectUri, generateOrigin } from '@/util/constants';

const RESTART_INSTRUCTIONS = 'Please reopen the manage plugin page from TRMNL and restart the connection process.';

const Query = z.object({
    code: z.string(),
    state: z.string(),
});

export async function GET(req: NextRequest): Promise<Response> {
    const origin = generateOrigin(req.headers);

    const queryParsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
    if (!queryParsed.success) {
        return Response.json({ message: 'Invalid query parameters', errors: queryParsed.error }, { status: 400 });
    }
    const { code, state } = queryParsed.data;
    const uuid = await verifyJwt(state, 'atlassian-state');

    const cookieStore = await cookies();
    const cookie = cookieStore.get(generateAtlassianStateCookieName(uuid));
    if (!cookie) {
        return Response.json({ message: `Invalid state. ${RESTART_INSTRUCTIONS}` }, { status: 403 });
    }
    const uuidFromCookie = await verifyJwt(cookie.value, 'atlassian-cookie');
    if (uuid !== uuidFromCookie) {
        return Response.json({ message: `Invalid cookie. ${RESTART_INSTRUCTIONS}` }, { status: 403 });
    }

    const { TrmnlConnectionRepository, JiraConnectionRepository } = await dbInit();
    const trmnlConnection = await TrmnlConnectionRepository.findOneBy({ uuid });

    if (!trmnlConnection) {
        return Response.json(
            { message: `TRMNL connection not found in database. ${RESTART_INSTRUCTIONS}` },
            { status: 403 },
        );
    }

    // Fetch access token
    let codeExchangeResult;
    try {
        codeExchangeResult = await exchangeCode(code, generateJiraRedirectUri(origin));
    } catch (e) {
        console.error(`Failed to exchange code: ${e}`);
        return Response.json({ message: 'Failed to exchange code' }, { status: 500 });
    }

    let profile;
    try {
        profile = await getMe(codeExchangeResult.access_token);
    } catch (e) {
        console.error(`Failed to fetch profile: ${e}`);
        return Response.json({ message: 'Failed to fetch profile' }, { status: 500 });
    }

    // Check if connection already exists
    const existingJiraConnection = await JiraConnectionRepository.findOneBy({ atlassianAccountId: profile.account_id });
    const jiraConnection = await setExchangeResultInJiraConnection(
        codeExchangeResult,
        profile.account_id,
        existingJiraConnection,
        () => JiraConnectionRepository.create(),
    );
    const associatedTrmnlConnections = await jiraConnection.trmnlConnections;
    if (!associatedTrmnlConnections.some((otherTrmnlConnection) => otherTrmnlConnection.uuid === uuid)) {
        associatedTrmnlConnections.push(trmnlConnection);
        jiraConnection.trmnlConnections = Promise.resolve(associatedTrmnlConnections);
    }
    await JiraConnectionRepository.save(jiraConnection);

    // Go back to the manage page
    return Response.redirect(new URL(`/manage?uuid=${encodeURIComponent(uuid)}`, origin));
}
