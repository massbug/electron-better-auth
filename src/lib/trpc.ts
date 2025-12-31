import type { AppRouter } from '../../electron/trpc/routers/_app'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { ipcLink } from 'electron-trpc-experimental/renderer'
import superjson from 'superjson'

export const queryClient = new QueryClient()

export const trpcClient = createTRPCClient<AppRouter>({
  links: [ipcLink({ transformer: superjson })],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})
