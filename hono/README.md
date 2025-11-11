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
