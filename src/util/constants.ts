export const OAUTH_JIRA_SCOPES = [
    'read:me', // required to read user information
    'offline_access', // required to get refresh tokens for offline access
    'read:board-scope:jira-software', // required for Jira Software
    'read:issue-details:jira', // required for Jira Software
    'read:jira-work', // required for Jira
].join(' ');

export const AUTHORIZATION_PREFIX_BEARER = 'Bearer ';

// see https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair
export const OAUTH_JIRA_REFRESH_TOKEN_EXPIRES_IN_SECONDS = 90 * 24 * 60 * 60; // 90 days
export const OAUTH_JIRA_REFRESH_TOKEN_ABSOLUTE_EXPIRES_IN_SECONDS = 30 * 24 * 60 * 60; // 365 days

export const generateOrigin = (requestHeaders: Headers) => {
    const host = requestHeaders.get('host');
    if (!host) {
        throw new Error('Host header not found');
    }
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}`;
};
export const generateJiraRedirectUri = (origin: string) => `${origin}/api/oauth/jira/callback`;
export const generateAtlassianStateCookieName = (uuid: string) => `atlassian-state-${uuid}`;
