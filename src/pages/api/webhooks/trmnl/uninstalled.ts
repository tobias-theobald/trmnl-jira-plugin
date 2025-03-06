import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbInit } from '@/data-source';
import { authenticateTrmnlWebhook } from '@/services/authentication';

const TrmnlUninstalledWebhook = z.object({
    user_uuid: z.string().uuid(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authnResult = await authenticateTrmnlWebhook(req, res);
    if (!authnResult.success) {
        return;
    }
    const connection = authnResult.data;
    const { TrmnlConnectionRepository } = await dbInit();

    console.debug('Received uninstalled webhook', req.body);
    const bodyParsed = TrmnlUninstalledWebhook.safeParse(req.body);
    if (!bodyParsed.success) {
        res.status(400).json({ message: 'Invalid body', errors: bodyParsed.error });
        return;
    }

    if (connection.uuid !== bodyParsed.data.user_uuid) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
    }

    console.debug('Removing connection');
    await TrmnlConnectionRepository.delete({ accessToken: connection.accessToken });

    console.info('Plugin uninstalled successfully');
    res.status(200).json({ message: 'OK' });
}
