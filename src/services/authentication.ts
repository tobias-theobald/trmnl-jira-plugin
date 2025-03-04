import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbInit } from '@/data-source';
import type { TrmnlConnection } from '@/entity/TrmnlConnection';
import { AUTHORIZATION_PREFIX_BEARER } from '@/util/constants';

const MAX_LENGTH_ACCESS_TOKEN = 1000;

export const authenticateTrmnlWebhook = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<{ success: true; data: TrmnlConnection } | { success: false }> => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return { success: false };
    }
    const authzHeader = req.headers.authorization;
    const parsedAuthzHeader = z
        .string()
        .startsWith(AUTHORIZATION_PREFIX_BEARER)
        .max(MAX_LENGTH_ACCESS_TOKEN + AUTHORIZATION_PREFIX_BEARER.length)
        .safeParse(authzHeader);
    if (!parsedAuthzHeader.success) {
        res.status(401).json({ message: 'Unauthorized' });
        return { success: false };
    }
    const accessToken = parsedAuthzHeader.data.substring(AUTHORIZATION_PREFIX_BEARER.length);

    const { TrmnlConnectionRepository } = await dbInit();

    // Check if the access token exists in the database
    const connection = await TrmnlConnectionRepository.findOneBy({ accessToken });

    if (!connection) {
        res.status(403).json({ message: 'Connection not found' });
        return { success: false };
    }
    return { success: true, data: connection };
};
