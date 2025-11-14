import type { PrismaClient } from './generated/prisma/client.js'
import { serve } from '@hono/node-server'
import { Scalar } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PROTOCOL } from './constants/index.js'
import { auth } from './lib/auth.js'

interface ContextWithPrisma {
  Variables: {
    prisma: PrismaClient
  }
}

const app = new Hono<ContextWithPrisma>()

app.use(
  '/api/auth/*',
  cors({
    origin: (origin) => {
      if (origin.startsWith(`${PROTOCOL}://`) || origin.startsWith('http://localhost')) {
        return origin
      }
      return null
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/docs', Scalar({
  pageTitle: 'API Documentation',
  sources: [
    // { url: '/api/open-api', title: 'API' },
    // Better Auth schema generation endpoint
    { url: '/api/auth/open-api/generate-schema', title: 'Auth' },
  ],
}))

app.on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.warn(`Server is running on http://localhost:${info.port}`)
  },
)
