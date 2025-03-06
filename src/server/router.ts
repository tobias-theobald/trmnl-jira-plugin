import { disconnectJira, generateOauthUrl, getJiraConnectionData } from '@/server/jiraConnection';
import { getSettings, setSettings } from '@/server/settings';

import { router } from './trpc';

export const appRouter = router({
    jiraConnection: {
        generateOauthUrl,
        disconnect: disconnectJira,
        getConnectionData: getJiraConnectionData,
    },
    settings: {
        get: getSettings,
        set: setSettings,
    },
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
