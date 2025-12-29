# Stoop Website

This is the website and documentation site for Stoop, built with Next.js App Router and MDX.

## Development

From the root directory:

```bash
bun dev
```

Or from the website directory:

```bash
cd apps/website
bun install
bun run dev
```

The site will be available at `http://localhost:3000`.

## Build

From the root directory:

```bash
bun run build:website
```

Or from the website directory:

```bash
cd apps/website
bun install
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
- `ui/` - Design system components (Button, Badge, Card, Text, Code, Table, Stack)
- `components/` - Structural components (Layout)
- `lib/` - Utilities and global styles
- `stoop.theme.ts` - Stoop theme configuration
