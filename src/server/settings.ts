import { publicProcedure } from '@/server/trpc';
import { sanitizeTrmnlConnectionForFrontend } from '@/util/sanitize';

export const getSettings = publicProcedure.query(async ({ ctx }) => {
    const { trmnlConnection } = ctx;
    return sanitizeTrmnlConnectionForFrontend(trmnlConnection);
});
