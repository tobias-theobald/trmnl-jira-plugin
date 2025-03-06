import { TRPCError } from '@trpc/server';

import { dbInit } from '@/data-source';
import { publicProcedure } from '@/server/trpc';
import { getAtlassianProfile, getAtlassianSites } from '@/services/api/atlassianApi';
import { getValidAccessToken } from '@/services/jiraOauth';
import { createJwt } from '@/services/jwt';
import { generateJiraRedirectUri, OAUTH_JIRA_SCOPES } from '@/util/constants';
import { OAUTH_JIRA_CLIENT_ID } from '@/util/env';

export const generateOauthUrl = publicProcedure.query(async ({ ctx }) => {
    const { uuid, origin } = ctx;
    const oauthState = await createJwt(uuid, 'atlassian-state');
    const url = new URL('https://auth.atlassian.com/authorize');
    url.searchParams.set('audience', 'api.atlassian.com');
    url.searchParams.set('client_id', OAUTH_JIRA_CLIENT_ID);
    url.searchParams.set('scope', OAUTH_JIRA_SCOPES);
    url.searchParams.set('redirect_uri', generateJiraRedirectUri(origin));
    url.searchParams.set('state', oauthState);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('prompt', 'consent');
    return url.toString();
});

export const getJiraConnectionData = publicProcedure.query(async ({ ctx }) => {
    const {
        trmnlConnection: { jiraConnection },
    } = ctx;

    if (jiraConnection === undefined || jiraConnection === null) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Jira is not connected on this plugin instance',
        });
    }

    const accessToken = await getValidAccessToken(jiraConnection);
    const [profile, sites] = await Promise.all([getAtlassianProfile(accessToken), getAtlassianSites(accessToken)]);
    const { absoluteRefreshTokenExpiresAt } = jiraConnection;
    return { profile, sites, absoluteRefreshTokenExpiresAt };
});

export const disconnectJira = publicProcedure.mutation(async ({ ctx }) => {
    const { trmnlConnection } = ctx;
    if (!trmnlConnection.jiraConnection) {
        return;
    }

    const { jiraConnection } = trmnlConnection;
    const { TrmnlConnectionRepository, JiraConnectionRepository } = await dbInit();
    trmnlConnection.jiraConnection = null;
    await TrmnlConnectionRepository.save(trmnlConnection);

    // If this is the last connection to this Jira account, delete the Jira connection from our database
    if ((await JiraConnectionRepository.countBy({ atlassianAccountId: jiraConnection.atlassianAccountId })) === 1) {
        await JiraConnectionRepository.delete({ atlassianAccountId: jiraConnection.atlassianAccountId });
    }
});
