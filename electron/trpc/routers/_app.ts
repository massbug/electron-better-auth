import { createTRPCRouter } from '../init'
import { oauthRouter } from './oauth'
import { transportRouter } from './transport'

export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  transport: transportRouter,
})

export type AppRouter = typeof appRouter
