import { publicProcedure } from '@/server/trpc';
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

// export const getJiraConnectionData = publicProcedure.query(async ({ ctx }) => {
//     const { trmnlConnection } = ctx;
//     const jira = trmnlConnection.jiraConnection;
// });
