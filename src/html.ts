import { CONFIG } from "./config";
import { STYLES } from "./styles";
import { EXTRA_STYLES } from "./extra-styles";
import { CLIENT_JS } from "./client";
import { escapeHtml } from "./util";

export function renderPage(origin: string): string {
  const title = `${CONFIG.name} — ${CONFIG.role}`;
  const description = `${CONFIG.name} (@${CONFIG.username}) — Backend Developer.`;
  const ogImage = `${origin}/og.png`;
  const pageUrl = `${origin}/`;
  const configJson = JSON.stringify({
    os: CONFIG.os,
    version: CONFIG.version,
    name: CONFIG.name,
    username: CONFIG.username,
    github: CONFIG.github,
    role: CONFIG.role,
    location: CONFIG.location,
    email: CONFIG.email,
    projects: CONFIG.projects,
  })
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: CONFIG.name,
    alternateName: CONFIG.username,
    jobTitle: CONFIG.role,
    email: CONFIG.email,
    url: pageUrl,
    image: `${origin}/avatar`,
    sameAs: [`https://github.com/${CONFIG.github}`],
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="theme-color" content="#07080c">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/avatar">
<script type="application/ld+json">${jsonLd}</script>
<style>${STYLES}${EXTRA_STYLES}</style>
</head>
<body>
<div id="boot" aria-hidden="true">
  <div class="bootbox">
    <div class="mark">ANKBUI&nbsp;OS</div>
    <div id="bootlog"></div>
  </div>
</div>

<main id="desktop">
  <div id="icons" aria-label="Desktop apps"></div>
  <div id="widgets" aria-label="Desktop widgets"></div>
  <div id="deskfoot">© 2026 ${escapeHtml(CONFIG.name)}</div>
</main>

<div id="spotlight" aria-hidden="true"></div>

<header id="menubar">
  <div class="mb-left">
    <button id="mb-brand" type="button" aria-label="Open Launchpad">
      <span class="mb-logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2 19.6 12 12 20.8 4.4 12Z"/></svg></span>
      <span class="mb-name">ANKBUI OS</span>
    </button>
    <span id="mb-app">Desktop</span>
    <div id="spaces" role="tablist" aria-label="Desktops"></div>
  </div>
  <div class="mb-right">
    <button id="avail" class="avail" type="button" hidden></button>
    <span id="sysdot" title="System online"></span>
    <span class="mb-wifi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.8 9.5a14.5 14.5 0 0 1 18.4 0M5.8 12.8a10 10 0 0 1 12.4 0M8.8 16.1a5.2 5.2 0 0 1 6.4 0"/><circle cx="12" cy="19.2" r="1.2" fill="currentColor" stroke="none"/></svg></span>
    <button id="bell" type="button" aria-label="Notifications" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.2a6 6 0 0 1 12 0c0 5 1.6 6.4 1.6 6.4H4.4S6 14.2 6 9.2Z"/><path d="M10 18.2a2 2 0 0 0 4 0"/></svg><span id="bell-count" hidden></span></button>
    <button id="clock" aria-label="Clock">--:--</button>
  </div>
</header>

<nav id="dock" aria-label="Dock">
  <span class="dock-sep"></span>
</nav>

<div id="snapghost" aria-hidden="true"></div>
<div id="ctx" role="menu" aria-label="Desktop menu"></div>
<div id="datepop" role="tooltip"><div class="big"></div><div class="small"></div></div>
<div id="notifs" role="dialog" aria-label="Notifications"></div>
<div id="launchpad" role="dialog" aria-label="Launchpad"></div>
<div id="lock" role="dialog" aria-label="Lock screen"></div>

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
