# ANKBUI OS

Personal site of **Bùi Đức Anh** (@ankbui) — an interactive mini desktop OS
running on Cloudflare Workers.

Open the site and you get a small personal computer: draggable glass windows,
a dock with live clock, an interactive terminal (`help`, `neofetch`, …),
live GitHub stats, and a `Ctrl + K` command palette.

## Apps

- 👤 **About** — profile, avatar, contact links
- 📁 **Projects** — ANP, CHRTV, C++ IDE
- 📊 **GitHub** — live public stats from the GitHub API (cached, with fallback)
- 💻 **Terminal** — `help`, `about`, `projects`, `github`, `stats`, `contact`, `neofetch`, `date`, `whoami`, `clear`
- ✉ **Contact** — email + GitHub
- ⚙ **Settings** — cursor spotlight, reduce motion, 12/24h clock

## Develop

```sh
bun install
bun run dev        # local dev server (wrangler dev)
bun run typecheck  # tsc --noEmit
```

## Deploy

```sh
bun install
bun run deploy
```

Optional: raise the GitHub API rate limit with a Worker secret
(never exposed to the frontend):

```sh
bunx wrangler secret put GITHUB_TOKEN
```

## Structure

```
src/
  index.ts    # Worker entry + routes (/, /api/github, /avatar)
  config.ts   # profile & project data
  github.ts   # GitHub API aggregation + edge caching
  html.ts     # HTML shell + SEO meta
  styles.ts   # CSS
  client.ts   # window manager, terminal, dock, command palette
```

© 2026 Bùi Đức Anh
