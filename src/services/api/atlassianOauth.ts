import { z } from 'zod';

import { OAUTH_JIRA_CLIENT_ID, OAUTH_JIRA_CLIENT_SECRET } from '@/util/env';

export const AtlassianOauthTokenExchangeResponse = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(), // in seconds
    scope: z.string(),
});
export type AtlassianOauthTokenExchangeResponse = z.infer<typeof AtlassianOauthTokenExchangeResponse>;

const ensureResponseOk = async (response: Response) => {
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to exchange refresh token: ${response.statusText}`);
    }

    const parsedResponse = AtlassianOauthTokenExchangeResponse.safeParse(json);
    if (!parsedResponse.success) {
        console.error('Failed to parse response', parsedResponse.error);
        throw new Error(`Failed to parse code exchange response`);
    }

    return parsedResponse.data;
};

export const exchangeCode = async (code: string, redirectUri: string) => {
    // make a request to the Atlassian API to exchange the refresh token for a new access token
    const response = await fetch(`https://auth.atlassian.com/oauth/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: OAUTH_JIRA_CLIENT_ID,
            client_secret: OAUTH_JIRA_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
        }),
    });
    return ensureResponseOk(response);
};

export const exchangeRefreshToken = async (refreshToken: string) => {
    // make a request to the Atlassian API to exchange the refresh token for a new access token
    const response = await fetch(`https://auth.atlassian.com/oauth/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: OAUTH_JIRA_CLIENT_ID,
            client_secret: OAUTH_JIRA_CLIENT_SECRET,
            refresh_token: refreshToken,
        }),
    });
    return ensureResponseOk(response);
};
