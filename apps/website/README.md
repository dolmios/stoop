# Stoop Website

This is the website and documentation site for Stoop, built with Next.js App Router and MDX.

## Development

From the root directory:

```bash
# Build all packages and start dev server
bun run dev
```

Or from the website directory:

```bash
cd apps/website
bun install
bun run dev
```

**Note:** Make sure to build `stoop` and `stoop-ui` packages first if you've made changes to them:

```bash
# From root directory
bun run build:all
```

The site will be available at `http://localhost:3000`.

## Build

From the root directory:

```bash
# Build all packages + website
bun run build:website
```

Or from the website directory:

```bash
cd apps/website
bun install
bun run build
```

**Note:** The root `build:website` command automatically builds all packages before building the website. If building from the website directory directly, ensure packages are built first:

```bash
# From root directory
bun run build:all
cd apps/website
bun run build
```

This creates an optimized production build in the `.next/` directory.

## Deployment

This site is configured for deployment on Vercel with Next.js.

### Deploy to Vercel

1. Push your code to a Git repository
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and use the configuration from the root `vercel.json`:
   - Build command: `bun install && bun run build:website`
4. Deploy!

## Structure

- `app/` - Next.js App Router pages (MDX for docs, TSX for homepage)
- `ui/` - Re-exports from `stoop-ui` package (Button, Badge, Card, Text, Code, Table, Stack, etc.)
- `components/` - Structural components (Layout, Header, Footer, Navigation)
- `lib/` - Utilities and configuration
- `stoop.theme.ts` - Stoop theme configuration (used for documentation examples)
