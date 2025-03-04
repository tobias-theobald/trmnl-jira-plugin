import { TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { dbInit } from '@/data-source';
import { verifyJwt } from '@/services/jwt';
import { AUTHORIZATION_PREFIX_BEARER, generateOrigin } from '@/util/constants';

export async function createContext({ req }: FetchCreateContextFnOptions) {
    const authorizationHeader = req.headers.get('authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith(AUTHORIZATION_PREFIX_BEARER)) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        });
    }
    const jwt = authorizationHeader.slice(AUTHORIZATION_PREFIX_BEARER.length);
    const uuid = await verifyJwt(jwt, 'manage');

    const { TrmnlConnectionRepository } = await dbInit();

    const trmnlConnection = await TrmnlConnectionRepository.findOneBy({ uuid });
    if (!trmnlConnection) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        });
    }

    let origin: string;
    try {
        origin = generateOrigin(req.headers);
    } catch (e) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid origin',
        });
    }

    return { uuid, trmnlConnection, origin };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
