import { z } from 'zod';

import { publicProcedure } from '@/server/trpc';
import { JiraSourceType } from '@/types';
import { sanitizeTrmnlConnectionForFrontend } from '@/util/sanitize';

export const getSettings = publicProcedure.query(async ({ ctx }) => {
    const { trmnlConnection } = ctx;
    return sanitizeTrmnlConnectionForFrontend(trmnlConnection);
});

export const setSettings = publicProcedure
    .input(
        z.object({
            jiraSourceType: JiraSourceType.optional(),
            jiraCloudId: z.string().optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const { trmnlConnection, TrmnlConnectionRepository } = ctx;

        // Apply changes
        if (input.jiraSourceType) {
            trmnlConnection.jiraSourceType = input.jiraSourceType;
        }
        if (input.jiraCloudId) {
            trmnlConnection.jiraCloudId = input.jiraCloudId;
        }

        // Save to database
        await TrmnlConnectionRepository.save(trmnlConnection);

        return sanitizeTrmnlConnectionForFrontend(trmnlConnection);
    });
