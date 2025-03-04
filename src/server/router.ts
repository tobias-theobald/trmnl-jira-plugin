import { generateOauthUrl } from '@/server/jiraConnection';
import { getSettings } from '@/server/settings';

import { router } from './trpc';

export const appRouter = router({
    jiraConnection: {
        generateOauthUrl,
    },
    getSettings,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
