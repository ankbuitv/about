import { renderNotFound } from "./notfound";
import { findLink, loadSite, mergeLinkQuery, normalizeLinkSlug, type Env } from "./store";
import { escapeHtml } from "./util";

function notFound(pathname: string): Response {
  return new Response(renderNotFound(pathname), {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Robots-Tag": "noindex",
    },
  });
}

const MOTION_MS = 1400;
const REDUCED_MS = 650;

function hostOf(target: string): string {
  try {
    return new URL(target).hostname.replace(/^www\./, "");
  } catch {
    return target;
  }
}

function originOf(target: string): string {
  try {
    return new URL(target).origin;
  } catch {
    return target;
  }
}

export function renderRedirect(opts: { slug: string; label: string; target: string }): string {
  const host = hostOf(opts.target);
  const name = opts.label || host;
  const safeTarget = escapeHtml(opts.target);
  const safeName = escapeHtml(name);
  const safeHost = escapeHtml(host);
  const safeSlug = escapeHtml(opts.slug);
  const payload = JSON.stringify({ url: opts.target, delay: MOTION_MS, reduced: REDUCED_MS }).replace(
    /</g,
    "\\u003c",
  );
  const refreshSec = 2;

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#07080c">
<meta name="referrer" content="origin-when-cross-origin">
<meta http-equiv="refresh" content="${refreshSec};url=${safeTarget}">
<title>Đang chuyển hướng — ${safeName}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="${escapeHtml(originOf(opts.target))}">
<style>
:root {
  --bg: #07080c;
  --ink: #e8eaf0;
  --ink-dim: #9aa3b2;
  --ink-faint: #5c6470;
  --accent: #8fd0ff;
  --glass: rgba(16, 18, 25, 0.72);
  --edge: rgba(255, 255, 255, 0.08);
  --edge-bright: rgba(255, 255, 255, 0.14);
  --mono: "SF Mono", "JetBrains Mono", "Cascadia Code", ui-monospace, Menlo, Consolas, monospace;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --go: ${MOTION_MS}ms;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { min-height: 100%; background: var(--bg); color: var(--ink); font-family: var(--sans); color-scheme: dark; }
body { min-height: 100vh; min-height: 100dvh; overflow-x: hidden; }
a { color: var(--accent); text-decoration: none; }
::selection { background: rgba(143, 208, 255, 0.25); }
.bg {
  position: fixed; inset: 0;
  background:
    radial-gradient(1100px 700px at 18% -10%, rgba(64, 90, 140, 0.22), transparent 60%),
    radial-gradient(820px 560px at 88% 112%, rgba(70, 120, 160, 0.1), transparent 62%),
    var(--bg);
}
.bg::after {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 42%, #000 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 42%, #000 20%, transparent 100%);
  pointer-events: none;
}
.bar {
  position: fixed; top: 0; left: 0; right: 0; height: 34px; z-index: 5;
  display: flex; align-items: center; gap: 10px; padding: 0 14px;
  background: rgba(10, 11, 16, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
}
.brand { display: flex; align-items: center; gap: 10px; color: inherit; }
.brand:hover .name { color: var(--accent); }
.brand:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; border-radius: 6px; }
.logo { color: var(--accent); display: grid; place-items: center; }
.logo svg { width: 14px; height: 14px; }
.name { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.14em; font-weight: 600; }
.pill {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-dim);
  max-width: 46vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stage {
  position: relative; z-index: 1;
  min-height: 100vh; min-height: 100dvh;
  display: grid; place-items: safe center;
  padding: calc(34px + 28px) 16px 28px;
}
.window {
  width: min(520px, 100%);
  border-radius: 16px;
  background: var(--glass);
  border: 1px solid var(--edge-bright);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  overflow: hidden;
  animation: rise 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.05);
}
@keyframes rise {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.titlebar {
  height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 14px;
  background: linear-gradient(rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.titlebar .mark { color: var(--accent); display: grid; }
.titlebar .mark svg { width: 15px; height: 15px; }
.titlebar .label { font-size: 13px; color: var(--ink-dim); }
.titlebar .slug {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--ink-faint);
}
.body { padding: 26px 26px 22px; text-align: center; }
.kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--accent);
}
h1 { margin-top: 8px; font-size: 26px; letter-spacing: -0.03em; font-weight: 640; }
.lead { margin-top: 6px; color: var(--ink-dim); font-size: 14.5px; }
.lead b { color: var(--ink); font-weight: 600; }
.route {
  margin: 26px auto 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}
.node {
  width: 108px;
  flex: none;
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 10px 8px 8px;
  border-radius: 14px;
  border: 1px solid var(--edge);
  background: rgba(255, 255, 255, 0.03);
}
.node span {
  max-width: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--ink-dim);
}
.node.to {
  animation: arrive var(--go) ease forwards;
}
@keyframes arrive {
  0%, 68% { border-color: var(--edge); box-shadow: none; }
  100% { border-color: rgba(143, 208, 255, 0.55); box-shadow: 0 0 24px rgba(143, 208, 255, 0.22); }
}
.ring { width: 54px; height: 54px; display: block; }
.ring circle { fill: none; stroke-width: 2; }
.ring .bg { stroke: rgba(255, 255, 255, 0.08); }
.ring .fg {
  stroke: var(--accent);
  stroke-linecap: round;
  stroke-dasharray: 138;
  stroke-dashoffset: 138;
  animation: draw var(--go) cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
.mark-icon { display: block; }
.track {
  position: relative;
  flex: 1;
  height: 2px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
}
.beam {
  position: absolute; inset: 0 auto 0 0; width: 0;
  background: linear-gradient(90deg, transparent, #8fd0ff);
  border-radius: inherit;
  animation: fill var(--go) cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.bead {
  position: absolute; top: 50%; left: 0;
  width: 8px; height: 8px; margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px #8fd0ff, 0 0 26px rgba(143, 208, 255, 0.75);
  animation: bead var(--go) cubic-bezier(0.45, 0, 0.2, 1) forwards;
}
@keyframes fill { to { width: 100%; } }
@keyframes bead { to { left: 100%; } }
.full {
  margin: 18px auto 0;
  max-width: 100%;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.barline {
  margin: 14px auto 0;
  height: 3px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
.barline > span {
  display: block;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(143, 208, 255, 0.35), #8fd0ff);
  animation: fill var(--go) cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.status {
  margin-top: 10px;
  min-height: 1.2em;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-dim);
}
.status b { color: var(--accent); font-weight: 550; }
.actions { margin-top: 18px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 40px; padding: 9px 16px; border-radius: 11px;
  font-size: 13.5px; font-weight: 550; color: var(--ink);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--edge);
}
.btn:hover { background: rgba(255, 255, 255, 0.11); }
.btn:focus-visible { outline: 1px solid var(--accent); outline-offset: 3px; }
.btn.primary {
  background: rgba(143, 208, 255, 0.14);
  border-color: rgba(143, 208, 255, 0.3);
  color: var(--accent);
}
.hint {
  margin-top: 14px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: 0.03em;
}
@media (max-width: 520px) {
  .body { padding: 22px 16px 18px; }
  .route { flex-direction: column; }
  .node { width: min(100%, 220px); }
  .track { width: 2px; height: 36px; flex: none; }
  .beam {
    inset: 0 0 auto 0; width: 100%; height: 0;
    background: linear-gradient(180deg, transparent, #8fd0ff);
    animation-name: fill-y;
  }
  .bead { left: 50%; top: 0; animation-name: bead-y; }
}
@keyframes fill-y { to { height: 100%; } }
@keyframes bead-y { to { top: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .window, .node.to, .beam, .bead, .ring .fg, .barline > span { animation: none; }
  .ring .fg { stroke-dashoffset: 0; }
  .beam, .barline > span { width: 100%; height: 100%; }
}
</style>
</head>
<body>
<div class="bg" aria-hidden="true"></div>
<header class="bar">
  <a class="brand" href="/" aria-label="ANKBUI OS">
    <span class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2 19.6 12 12 20.8 4.4 12Z"/></svg></span>
    <span class="name">ANKBUI OS</span>
  </a>
  <span class="pill">/l/${safeSlug}</span>
</header>
<main class="stage">
  <section class="window" aria-labelledby="go-title">
    <div class="titlebar">
      <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2 19.6 12 12 20.8 4.4 12Z"/></svg></span>
      <span class="label">Chuyển hướng</span>
      <span class="slug">${safeSlug}</span>
    </div>
    <div class="body">
      <div class="kicker">REDIRECT</div>
      <h1 id="go-title">Đang chuyển hướng</h1>
      <p class="lead">Mở <b>${safeName}</b> sau một nhịp.</p>
      <div class="route" aria-hidden="true">
        <div class="node">
          <svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="22"/><path d="M32 22.2 40.6 32 32 41.8 23.4 32Z" fill="none" stroke="#8fd0ff" stroke-width="1.7" stroke-linejoin="round"/></svg>
          <span>ANKBUI</span>
        </div>
        <div class="track"><div class="beam"></div><div class="bead"></div></div>
        <div class="node to">
          <svg class="ring" viewBox="0 0 64 64" aria-hidden="true">
            <circle class="bg" cx="32" cy="32" r="22"/>
            <circle class="fg" cx="32" cy="32" r="22" transform="rotate(-90 32 32)"/>
            <path d="M27 37 37 27M37 27h-7M37 27v7" fill="none" stroke="#8fd0ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${safeHost}</span>
        </div>
      </div>
      <p class="full" title="${safeTarget}">${safeTarget}</p>
      <div class="barline" aria-hidden="true"><span></span></div>
      <p class="status" id="status" aria-live="polite">Đang mở đường · <b id="eta">1.4s</b></p>
      <div class="actions">
        <a class="btn primary" id="go" href="${safeTarget}" rel="noopener">Đi ngay</a>
        <a class="btn" href="/">Về desktop</a>
      </div>
      <p class="hint">Enter để đi · Esc để ở lại</p>
    </div>
  </section>
</main>
<script type="application/json" id="redirect-data">${payload}</script>
<script>
(function () {
  var data = JSON.parse(document.getElementById('redirect-data').textContent);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var delay = reduced ? data.reduced : data.delay;
  var status = document.getElementById('status');
  var eta = document.getElementById('eta');
  var lines = ['Đang mở đường', 'Đang kết nối', 'Sắp tới nơi'];
  var step = Math.max(160, Math.floor(delay / lines.length));
  lines.forEach(function (line, i) {
    setTimeout(function () {
      if (!status || !eta) return;
      status.textContent = '';
      status.appendChild(document.createTextNode(line + ' · '));
      status.appendChild(eta);
    }, step * i);
  });
  var started = performance.now();
  function frame(now) {
    var left = Math.max(0, delay - (now - started));
    if (eta) eta.textContent = (left / 1000).toFixed(1) + 's';
    if (left > 40) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  function leave() { location.replace(data.url); }
  setTimeout(leave, delay + 60);
  var go = document.getElementById('go');
  if (go) go.addEventListener('click', function (ev) { ev.preventDefault(); leave(); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { ev.preventDefault(); leave(); }
    if (ev.key === 'Escape') location.href = '/';
  });
})();
</script>
</body>
</html>`;
}

export async function shortlinkResponse(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" },
    });
  }
  const match = url.pathname.match(/^\/l\/([^/]+)\/?$/);
  if (!match) return notFound(url.pathname);
  let decoded = match[1];
  try {
    decoded = decodeURIComponent(match[1]);
  } catch {
    return notFound(url.pathname);
  }
  const slug = normalizeLinkSlug(decoded);
  if (!slug) return notFound(url.pathname);
  const data = await loadSite(env);
  const link = findLink(data.links, slug);
  if (!link) return notFound(url.pathname);
  const target = mergeLinkQuery(link.url, url);
  let dest: URL;
  try {
    dest = new URL(target);
  } catch {
    return notFound(url.pathname);
  }
  if (dest.origin === url.origin && dest.pathname.replace(/\/$/, "") === url.pathname.replace(/\/$/, "")) {
    return notFound(url.pathname);
  }
  if (!link.animate) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: target,
        "Cache-Control": "no-store",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  return new Response(renderRedirect({ slug: link.slug, label: link.label, target }), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
