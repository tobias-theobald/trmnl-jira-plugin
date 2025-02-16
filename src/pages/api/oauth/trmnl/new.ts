import * as console from 'node:console';

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbInit } from '@/data-source';
import { OAUTH_TRMNL_CLIENT_ID, OAUTH_TRMNL_CLIENT_SECRET } from '@/util/env.js';

const ALLOWED_INSTALL_CALLBACK_URLS = ['https://usetrmnl.com/plugin_settings/new'];

const Query = z.object({
    code: z.string(),
    installation_callback_url: z.string().url(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }
    const queryParsed = Query.safeParse(req.query);
    if (!queryParsed.success) {
        res.status(400).json({ message: 'Invalid query parameters', errors: queryParsed.error });
        return;
    }
    const { code, installation_callback_url } = queryParsed.data;

    // Check origin
    if (!ALLOWED_INSTALL_CALLBACK_URLS.includes(installation_callback_url.split('?')[0])) {
        res.status(403).json({ message: 'Origin not allowed' });
        return;
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
            res.status(500).json({ message: 'Failed to fetch access token', error: response.statusText });
            return;
        }
        const data = await response.json();
        console.log(data);
        accessToken = data.access_token;
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch access token', error });
        return;
    }

    // Save access token
    const { TrmnlConnectionRepository } = await dbInit;

    // Check if connection already exists
    const existingConnection = await TrmnlConnectionRepository.findOneBy({ accessToken: accessToken });
    if (existingConnection) {
        console.info('Connection already exists');
        // Update connection
        await TrmnlConnectionRepository.save(existingConnection, {});
        res.redirect(installation_callback_url);
        return;
    }

    // Create new connection
    const connection = TrmnlConnectionRepository.create();
    connection.accessToken = accessToken;
    await TrmnlConnectionRepository.save(connection);
    console.info('New connection saved');
    res.redirect(installation_callback_url);
}
