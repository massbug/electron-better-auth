# electron-better-auth

This project implements GitHub OAuth authentication in Electron using Better Auth.

## Quick Start

### 1. Install Hono Backend Dependencies

First, navigate to the `hono` directory, install dependencies, and configure environment variables:

```sh
cd hono
bun install
cp .env.example .env
```

Then configure the environment variables in the `.env` file as needed (including `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, etc.).

### 2. Initialize Prisma Database

Run Prisma migrations to set up the database schema:

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

### 3. Start Hono Backend Service

Run in the `hono` directory:

```sh
bun run dev
```

The backend service runs on `http://localhost:3000` by default (modify according to your actual setup).

### 4. Install Electron App Dependencies

Run in the project root directory:

```sh
bun install
```

### 5. Run Electron App

#### Development Mode

```sh
bun run dev
```

#### Production Mode

```sh
bun run build
```

After the build completes, open the generated executable file.

## GitHub OAuth Configuration

### Development Environment Configuration

Configure in your GitHub OAuth application settings:

1. **Homepage URL**: `http://localhost:3000` (modify according to your actual Hono service setup)
2. **Authorization callback URL**: `http://localhost:5173` (modify according to your actual Electron dev server setup)

### Production Environment Configuration

Configure in your GitHub OAuth application settings:

1. **Homepage URL**: Your actual Hono backend service URL (e.g., `https://your-api-domain.com`)
2. **Authorization callback URL**: `{custom-protocol}://index.html` or other format as needed
   - Example: If your custom protocol is `myapp`, use `myapp://index.html`

### Custom Protocol Configuration

The custom protocol must be consistent in the following two files:

1. **`src/constants/protocol.ts`** (Electron main app)
2. **`hono/src/constants/protocol.ts`** (Hono backend service)

Modify the `PROTOCOL` constant value in both files, for example:

```typescript
export const PROTOCOL = 'your-custom-protocol'
```

**Important Notes:**
- The protocol values in both files must be consistent
- The protocol value should conform to URL scheme specifications (lowercase letters, numbers, hyphens)
- You need to rebuild the Electron app after making changes for them to take effect

## More Information

For detailed configuration and usage instructions about the Hono backend, please refer to `hono/README.md`.
