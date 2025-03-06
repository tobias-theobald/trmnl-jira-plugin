import { z } from 'zod';

export const AtlassianProfile = z.object({
    account_id: z.string(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    picture: z.string().url().optional(),
});
export const getAtlassianProfile = async (accessToken: string) => {
    const response = await fetch(`https://api.atlassian.com/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }
    return AtlassianProfile.parse(await response.json());
};

export const AtlassianSite = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    scopes: z.array(z.string()),
    avatarUrl: z.string().url().optional(),
});
export const getAtlassianSites = async (accessToken: string) => {
    const response = await fetch(`https://api.atlassian.com/oauth/token/accessible-resources`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch Jira sites: ${response.statusText}`);
    }
    return AtlassianSite.array().parse(await response.json());
};
