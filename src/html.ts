import { CONFIG } from "./config";
import { STYLES } from "./styles";
import { CLIENT_JS } from "./client";

export function renderPage(origin: string): string {
  const title = `${CONFIG.name} — ${CONFIG.role}`;
  const description = `${CONFIG.name} (@${CONFIG.username}) — Backend Developer.`;
  const ogImage = `${origin}/avatar`;
  // Safe JSON for inline <script>: escape sequences that could close the tag.
  const configJson = JSON.stringify({
    os: CONFIG.os,
    name: CONFIG.name,
    username: CONFIG.username,
    github: CONFIG.github,
    role: CONFIG.role,
    location: CONFIG.location,
    email: CONFIG.email,
    avatarPrimary: CONFIG.avatarPrimary,
    projects: CONFIG.projects,
  })
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#07080c">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
<meta property="og:url" content="${origin}/">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/avatar">
<link rel="apple-touch-icon" href="/avatar">
<style>${STYLES}</style>
</head>
<body>
<div id="boot" aria-hidden="true">
  <div>
    <div class="mark">ANKBUI&nbsp;OS</div>
    <div class="bar"><i></i></div>
  </div>
</div>

<main id="desktop">
  <div id="icons" aria-label="Desktop apps"></div>
  <div id="deskfoot">© 2026 ${CONFIG.name}</div>
</main>

<div id="spotlight" aria-hidden="true"></div>

<header id="menubar">
  <div class="mb-left">
    <span class="mb-logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2 19.6 12 12 20.8 4.4 12Z"/></svg></span>
    <span class="mb-name">ANKBUI OS</span>
    <span id="mb-app">Desktop</span>
  </div>
  <div class="mb-right">
    <span id="sysdot" title="System online"></span>
    <span class="mb-wifi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.8 9.5a14.5 14.5 0 0 1 18.4 0M5.8 12.8a10 10 0 0 1 12.4 0M8.8 16.1a5.2 5.2 0 0 1 6.4 0"/><circle cx="12" cy="19.2" r="1.2" fill="currentColor" stroke="none"/></svg></span>
    <button id="clock" aria-label="Clock">--:--</button>
  </div>
</header>

<nav id="dock" aria-label="Dock">
  <span class="dock-sep"></span>
</nav>

<div id="snapghost" aria-hidden="true"></div>
<div id="ctx" role="menu" aria-label="Desktop menu"></div>

<div id="datepop" role="tooltip">
  <div class="big"></div>
  <div class="small"></div>
</div>

<div id="palette" role="dialog" aria-label="Command palette">
  <div class="box">
    <input id="pal-input" type="text" placeholder="Search apps and commands..." aria-label="Search apps and commands">
    <div id="pal-list"></div>
  </div>
</div>

<script>window.__OS__ = ${configJson};</script>
<script>${CLIENT_JS}</script>
</body>
</html>`;
}
