import { createTRPCContext } from '@trpc/tanstack-react-query';

import type { AppRouter } from '@/server/router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
