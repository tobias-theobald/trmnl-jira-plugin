import { TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { dbInit } from '@/data-source';
import { verifyJwt } from '@/util/jwt';

const AUTHORIZATION_PREFIX_BEARER = 'Bearer ';

export async function createContext({ req }: FetchCreateContextFnOptions) {
    const authorizationHeader = req.headers.get('authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith(AUTHORIZATION_PREFIX_BEARER)) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        });
    }
    const jwt = authorizationHeader.slice(AUTHORIZATION_PREFIX_BEARER.length);
    const uuid = await verifyJwt(jwt);

    const { TrmnlConnectionRepository } = await dbInit();

    const trmnlConnection = await TrmnlConnectionRepository.findOneBy({ uuid });
    if (!trmnlConnection) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        });
    }

    return { uuid, trmnlConnection };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
