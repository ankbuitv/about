# ANKBUI OS

Personal site of **Bùi Đức Anh** (@ankbui) — an interactive mini desktop OS
running on Cloudflare Workers.

Open the site and you get a small personal computer: draggable glass windows,
a dock with magnification, three desktops, Launchpad, a lock screen, widgets,
notifications, an interactive terminal, live GitHub stats, and a `Ctrl + K`
command palette.

Unknown paths return **HTTP 404** with an OS-styled page. `/index.html`
redirects to `/`.

## Apps

- 👤 **About** — profile, availability badge, contact links
- 📁 **Projects** — ANP, CHRTV, C++ IDE, with stack and live/wip
- 📝 **Notes** — markdown notes, edited in admin
- 📊 **GitHub** — repos, pinned, recently pushed, contribution heatmap, star sparkline
- 💻 **Terminal** — `help`, `ls`, `cd`, `cat`, `echo`, `open`, `calc`, `theme`, `history`, `matrix`, `cowsay`, `neofetch`, …
- 📓 **Guestbook**
- ✉ **Contact** — form plus mailto
- ⚙ **Settings** — wallpaper, spotlight, motion, clock, lock timeout

## Desktop

- Dock magnification on a fine pointer. A second click on the focused dock icon minimizes.
- Launchpad from the logo, the dock, or the right-click menu.
- Three desktops. Switch with the menu-bar pills or `Ctrl+Alt+Left/Right`.
- Drag a window to a corner to snap a quarter, or to an edge for a half.
- New Terminal opens another terminal. History is kept in the browser.
- Lock screen after idle (2 / 5 / 15 minutes, or off). Click or press a key to unlock.
- Boot log checks preferences, avatar, notes, and GitHub before the desktop opens.

## Admin

Notes, guestbook, inbox, shortlinks, and the availability / now text are managed at
`/my/admin/`.

## Shortlinks

Public links live at `/l/name` — for example `https://ankb.qzz.io/l/github`.
The name is chosen in admin. Each link has a redirect-animation switch:

- On: a short handoff screen plays, then the browser opens the destination.
- Off: the browser is redirected immediately.

Only `http` and `https` destinations are accepted. Extra query parameters on
the short URL are forwarded. Links are not listed publicly.

```sh
bunx wrangler secret put ADMIN_PASSWORD
bunx wrangler secret put GITHUB_TOKEN    # contents write, so saves stick in data/site.json
bunx wrangler secret put DISCORD_WEBHOOK # optional, contact form
bunx wrangler secret put RESEND_API_KEY  # optional, emails CONFIG.email
```

`MAIL_FROM` and `GITHUB_BRANCH` (default `main`) can be set the same way.
Without `GITHUB_TOKEN` or a KV binding named `DATA`, the public notes still
come from `data/site.json`, but guestbook, contact, and admin edits do not
survive a worker restart.

`GITHUB_TOKEN` is a personal access token you create yourself. GitHub does not
issue one for this repo automatically.

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Repository access: only `ankbuitv/about`.
3. Permissions: Contents → Read and write.
4. Generate the token, copy it once, then `bunx wrangler secret put GITHUB_TOKEN` and paste it. Do not commit the token.

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

## Structure

```
src/
  index.ts       # Worker routes
  config.ts      # profile & project data
  github.ts      # GitHub stats, heatmap, pins, star history
  html.ts        # HTML shell, SEO, JSON-LD
  styles.ts      # desktop CSS
  extra-styles.ts
  client.ts      # window manager, dock, terminal, apps
  admin.ts       # /my/admin/
  redirect.ts    # /l/:name handoff
  store.ts       # notes, guestbook, messages
  og.ts          # dynamic PNG card
  notfound.ts    # 404 page
data/site.json   # seed notes, availability, now
```

© 2026 Bùi Đức Anh
