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

<nav id="dock" aria-label="Taskbar">
  <span class="dock-sep"></span>
  <div id="tray">
    <span id="sysdot" title="System online"></span>
    <button id="clock" aria-label="Clock">--:--</button>
  </div>
</nav>

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
