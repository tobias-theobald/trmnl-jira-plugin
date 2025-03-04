import type { JiraConnection } from '@/entity/JiraConnection';
import type { AtlassianOauthTokenExchangeResponse } from '@/services/api/atlassianOauth';
import { decryptToken, encryptToken } from '@/services/tokenDbCrypto';
import {
    OAUTH_JIRA_REFRESH_TOKEN_ABSOLUTE_EXPIRES_IN_SECONDS,
    OAUTH_JIRA_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
} from '@/util/constants';

export const setExchangeResultInJiraConnection = async (
    exchangeResult: AtlassianOauthTokenExchangeResponse,
    atlassianAccountId: string,
    jiraConnection: JiraConnection | null,
    createJiraConnection: () => JiraConnection,
) => {
    if (!jiraConnection) {
        jiraConnection = createJiraConnection();
        jiraConnection.absoluteRefreshTokenExpiresAt = new Date(
            Date.now() + OAUTH_JIRA_REFRESH_TOKEN_ABSOLUTE_EXPIRES_IN_SECONDS * 1000,
        );
        jiraConnection.atlassianAccountId = atlassianAccountId;
        jiraConnection.trmnlConnections = Promise.resolve([]);
    } else if (jiraConnection.atlassianAccountId !== atlassianAccountId) {
        throw new Error('Atlassian account ID mismatch');
    }
    jiraConnection.accessTokenEncrypted = await encryptToken(exchangeResult.access_token);
    jiraConnection.accessTokenExpiresAt = new Date(Date.now() + exchangeResult.expires_in * 1000);
    jiraConnection.refreshTokenEncrypted = await encryptToken(exchangeResult.refresh_token);
    jiraConnection.refreshTokenExpiresAt = new Date(Date.now() + OAUTH_JIRA_REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000);
    return jiraConnection;
};

const exchangeRefreshToken = async (refreshToken: string) => {
    // make a request to the Atlassian API to exchange the refresh token for a new access token
};

export const getValidAccessToken = async (jiraConnection: JiraConnection) => {
    const now = new Date();
    if (jiraConnection.absoluteRefreshTokenExpiresAt < now) {
        throw new Error('Refresh token permanently expired. Please re-authenticate.');
    }
    if (jiraConnection.accessTokenExpiresAt > now) {
        try {
            return await decryptToken(jiraConnection.accessTokenEncrypted);
        } catch (e) {
            console.warn(
                `Failed to decrypt access token for Jira connection with account ID ${jiraConnection.atlassianAccountId}`,
            );
        }
    }
    if (jiraConnection.refreshTokenExpiresAt < now) {
        throw new Error('Refresh token expired from lack of use. Please re-authenticate.');
    }
    // try to get a new access token using the refresh token
    // if successful, update the Jira connection in the database
    // TODO: implement
};
