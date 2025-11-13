## Installation

To install dependencies:

```sh
bun install
```

## Environment Variables

First, copy the environment variables example file:

```sh
cp .env.example .env
```

Then configure the environment variables in `.env` as needed.

## Database Setup

After configuring environment variables, you need to initialize the database by running Prisma migrations:

```sh
bunx prisma migrate dev
```

This command will:
- Create the database if it doesn't exist
- Apply all pending migrations
- Generate the Prisma Client

**Note:** If you need to reset the database, you can use:
```sh
bunx prisma migrate reset
```

## Running

To run:

```sh
bun run dev
```

Open http://localhost:3000

## Customization

### Adding Seed Data

You can add seed data in `prisma/seed.ts`:

```typescript
import { prisma } from '../src/lib/prisma.js'

export async function main() {
  // Add your seed data here
}
```

### Modifying Database Provider

You can modify the database provider in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite" // Can be changed to "postgresql", "mysql", etc.
  url      = env("DATABASE_URL")
}
```

You also need to modify the corresponding provider in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite', // Must match the provider in schema.prisma
  }),
  // ...
})
```

### Using authClient in Electron App

The root directory's `src/lib/auth-client.ts` exports `authClient` which can be used in your Electron app components like `src/App.tsx`:

```tsx
import { authClient } from './lib/auth-client'

function App() {
  // Use authClient methods here
  // Example: authClient.signIn.email(), authClient.signOut(), etc.
  return (
    <div>App</div>
  )
}
```

### OAuth

#### Production Configuration

To enable OAuth authentication in your Electron app for production, you need to modify the protocol to a custom protocol value.

You need to modify the `PROTOCOL` constant in the following two files:

1. **`src/constants/protocol.ts`** (Electron main app)
2. **`hono/src/constants/protocol.ts`** (Hono backend service)

Change the protocol value from the default `'myapp'` to your own custom protocol in both files, for example:

```typescript
export const PROTOCOL = 'your-custom-protocol'
```

**Important Notes:**
- The protocol values in both files must be consistent
- The protocol value should conform to URL scheme specifications (lowercase letters, numbers, hyphens)
- You need to rebuild the Electron app after making changes for them to take effect

#### GitHub OAuth Configuration

When setting up GitHub OAuth in your GitHub application settings, you need to configure the following URLs:

1. **Homepage URL**: Set this to your Hono backend service URL
   - Development: `http://localhost:3000`
   - Production: Your production Hono service URL (e.g., `https://your-api-domain.com`)

2. **Authorization callback URL**: 
   - Development: `http://localhost:5173` (Electron dev server)
   - Production: `{PROTOCOL}://index.html` or other format as needed by your application
     - Example: If your protocol is `myapp`, use `myapp://index.html`

**Example:**
If your protocol is `myapp` and your Hono service runs at `http://localhost:3000`:
- Homepage URL: `http://localhost:3000`
- Authorization callback URL (Development): `http://localhost:5173`
- Authorization callback URL (Production): `myapp://index.html`

Make sure to set the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables in your `.env` file with the values from your GitHub OAuth application.
