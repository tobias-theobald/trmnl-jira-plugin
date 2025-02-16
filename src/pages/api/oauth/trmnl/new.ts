import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OAUTH_TRMNL_CLIENT_ID, OAUTH_TRMNL_CLIENT_SECRET } from '@/util/env.js';

const ALLOWED_INSTALL_CALLBACK_URLS = ['https://usetrmnl.com/plugin_settings/new'];

const Query = z.object({
    code: z.string(),
    installation_callback_url: z.string().url(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const queryParsed = Query.safeParse(req.query);
    if (!queryParsed.success) {
        return res.status(400).json({ message: 'Invalid query parameters', errors: queryParsed.error });
    }
    const { code, installation_callback_url } = queryParsed.data;

    // Check origin
    if (!ALLOWED_INSTALL_CALLBACK_URLS.includes(installation_callback_url.split('?')[0])) {
        return res.status(403).json({ message: 'Origin not allowed' });
    }

    // Fetch access token
    const body = {
        code,
        client_id: OAUTH_TRMNL_CLIENT_ID,
        client_secret: OAUTH_TRMNL_CLIENT_SECRET,
        grant_type: 'authorization_code',
    };
    let accessToken;
    try {
        const response = await fetch('https://usetrmnl.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            return res.status(500).json({ message: 'Failed to fetch access token', error: response.statusText });
        }
        const data = await response.json();
        console.log(data);
        accessToken = data.access_token;
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch access token', error });
    }
}
