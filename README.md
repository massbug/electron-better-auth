# template-electron-trpc

A desktop application development template based on Electron + tRPC + React.

## Usage

### Adding Routers

You can add routers in `electron/trpc/routers/_app.ts`:

```typescript
export const appRouter = createTRPCRouter({
  // Add your routers here
})
```

### Adding Context

You can add context in `electron/trpc/init.ts`:

```typescript
export const createTRPCContext = cache(async () => {
  return {
    // Add your context properties here
  }
})
```

### Using Context in Protected Procedures

You can use context in `protectedProcedure` for authentication and authorization checks:

```typescript
import { TRPCError } from '@trpc/server'

export const protectedProcedure = t.procedure.use(async (
  opts,
) => {
  const { ctx } = opts

  // Example: Check if user is authenticated
  if (!ctx.xxx) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      ...ctx,
    },
  })
})
```
