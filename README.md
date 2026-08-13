# ankbui-bio — Cloudflare Worker

A lightweight TypeScript bio page for Bùi Đức Anh.

## Important

This V2 intentionally does **not** depend on `@cloudflare/workers-types`.
That package caused the previous Bun build to fail because the pinned version did not exist.

## Deploy with Cloudflare Git integration

Cloudflare should detect Node/Bun and run:

```bash
bun install
```

Then configure the deploy command as:

```bash
bun run deploy
```

Build command can be left empty for a normal Worker deploy.

## Local

```bash
bun install
bun run dev
```

## Config

Edit the `CONFIG` object in `src/index.ts`.

GitHub stats are fetched from `ankbuitv`.
