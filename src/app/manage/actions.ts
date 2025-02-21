'use server';

import { dbInit } from '@/data-source';
import { createJwt } from '@/util/jwt';

export const validateUuidAndGenerateJwt = async (uuid: string) => {
    const { TrmnlConnectionRepository } = await dbInit();

    // Check in database for this UUID
    const trmnlConnection = await TrmnlConnectionRepository.findOneBy({ uuid });
    if (!trmnlConnection) {
        return null;
    }

    // generate encrypted JWT against curious bystanders
    return createJwt(uuid);
};
