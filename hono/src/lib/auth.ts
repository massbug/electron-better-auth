import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'
import { PROTOCOL } from '../constants'
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite', // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    'http://localhost:*',
    `${PROTOCOL}://`,
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: process.env.NODE_ENV === 'production' ? `${PROTOCOL}://index.html` : undefined,
    },
  },
  plugins: [
    openAPI(),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'None',
      secure: true,
    },
  },
})
