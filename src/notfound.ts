function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayPath(pathname: string): string {
  const raw = pathname && pathname.startsWith("/") ? pathname : `/${pathname || ""}`;
  let shown = raw;
  try {
    shown = decodeURIComponent(raw);
  } catch {
    shown = raw;
  }
  shown = shown.replace(/[\u0000-\u001f\u007f]/g, "");
  if (shown.length > 180) shown = `${shown.slice(0, 177)}...`;
  return shown || "/";
}

export function renderNotFound(pathname: string): string {
  const safePath = escapeHtml(displayPath(pathname));

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#07080c">
<title>404 — Không tìm thấy trang — ANKBUI OS</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
:root {
  --bg: #07080c;
  --ink: #e8eaf0;
  --ink-dim: #9aa3b2;
  --ink-faint: #5c6470;
  --accent: #8fd0ff;
  --err: #ff8d8d;
  --glass: rgba(16, 18, 25, 0.72);
  --edge: rgba(255, 255, 255, 0.08);
  --edge-bright: rgba(255, 255, 255, 0.14);
  --mono: "SF Mono", "JetBrains Mono", "Cascadia Code", ui-monospace, Menlo, Consolas, monospace;
  --sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { min-height: 100%; background: var(--bg); color: var(--ink); font-family: var(--sans); color-scheme: dark; }
body {
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
}
a { color: var(--accent); text-decoration: none; }
::selection { background: rgba(143, 208, 255, 0.25); }

.bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(1100px 700px at 18% -10%, rgba(64, 90, 140, 0.22), transparent 60%),
    radial-gradient(820px 560px at 88% 112%, rgba(160, 70, 90, 0.1), transparent 62%),
    radial-gradient(520px 360px at 70% 18%, rgba(120, 90, 160, 0.07), transparent 65%),
    var(--bg);
}
.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 42%, #000 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 42%, #000 20%, transparent 100%);
  pointer-events: none;
}

.bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 34px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: rgba(10, 11, 16, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  user-select: none;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
}
.brand:hover .name { color: var(--accent); }
.brand:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; border-radius: 6px; }
.logo { color: var(--accent); display: grid; place-items: center; }
.logo svg { width: 14px; height: 14px; }
.name {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.14em;
  font-weight: 600;
}
.app {
  font-size: 12.5px;
  color: var(--ink-faint);
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}
.bar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #e0b24a;
  box-shadow: 0 0 8px rgba(224, 178, 74, 0.55);
}
.code-pill {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-dim);
}

.stage {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: safe center;
  padding: calc(34px + 28px) 16px 28px;
}
.window {
  width: min(560px, 100%);
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
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: linear-gradient(rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.titlebar .mark { color: var(--err); display: grid; }
.titlebar .mark svg { width: 15px; height: 15px; }
.titlebar .label {
  font-size: 13px;
  color: var(--ink-dim);
}
.body { padding: 28px 26px 24px; text-align: center; }
.num {
  font-family: var(--mono);
  font-size: clamp(72px, 16vw, 104px);
  line-height: 0.9;
  letter-spacing: -0.05em;
  font-weight: 650;
  color: #e8eaf0;
  background: linear-gradient(180deg, #f4f7fb 20%, #8fd0ff 140%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 10px 28px rgba(143, 208, 255, 0.12));
}
h1 {
  margin-top: 14px;
  font-size: 22px;
  font-weight: 640;
  letter-spacing: -0.02em;
}
.lead {
  margin-top: 8px;
  color: var(--ink-dim);
  font-size: 14.5px;
}
.term {
  margin: 22px auto 0;
  text-align: left;
  padding: 14px 14px 12px;
  border-radius: 12px;
  background: rgba(5, 6, 9, 0.82);
  border: 1px solid var(--edge);
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.7;
  overflow: hidden;
}
.term .cmd { color: #c7cdd8; word-break: break-all; }
.prompt { color: #6fe3a1; }
.dim { color: var(--ink-faint); }
.pathc { color: var(--accent); }
.term .errline { color: var(--err); }
.caret {
  display: inline-block;
  width: 7px;
  height: 13px;
  margin-left: 2px;
  background: #e8eaf0;
  vertical-align: text-bottom;
  animation: blink 1.06s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
.actions { margin-top: 22px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 9px 16px;
  border-radius: 11px;
  font-size: 13.5px;
  font-weight: 550;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--edge);
  transition: background 0.16s, transform 0.16s, border-color 0.16s;
}
.btn:hover { background: rgba(255, 255, 255, 0.11); transform: translateY(-1px); border-color: var(--edge-bright); }
.btn:focus-visible { outline: 1px solid var(--accent); outline-offset: 3px; }
.btn.primary {
  background: rgba(143, 208, 255, 0.14);
  border-color: rgba(143, 208, 255, 0.3);
  color: var(--accent);
}
.btn.primary:hover { background: rgba(143, 208, 255, 0.22); }
.hint {
  margin-top: 16px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--ink-faint);
  letter-spacing: 0.04em;
}
.foot {
  position: fixed;
  right: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 2;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--ink-faint);
}
@media (max-width: 640px) {
  .app { display: none; }
  .body { padding: 24px 16px 20px; }
  .foot { display: none; }
  .term { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .window { animation: none; }
  .caret { animation: none; }
  .btn { transition: none; }
}
</style>
</head>
<body>
<div class="bg" aria-hidden="true"></div>
<header class="bar">
  <a class="brand" href="/" aria-label="ANKBUI OS, back to desktop">
    <span class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2 19.6 12 12 20.8 4.4 12Z"/></svg></span>
    <span class="name">ANKBUI OS</span>
  </a>
  <span class="app">Not Found</span>
  <span class="bar-right">
    <span class="dot" title="Path missing"></span>
    <span class="code-pill">404</span>
  </span>
</header>
<main class="stage">
  <section class="window" aria-labelledby="nf-title">
    <div class="titlebar">
      <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.2"/><path d="M12 8.2v4.4"/><path d="M12 16.2h.01"/></svg></span>
      <span class="label">system — file not found</span>
    </div>
    <div class="body">
      <p class="num" aria-hidden="true">404</p>
      <h1 id="nf-title">Không tìm thấy trang</h1>
      <p class="lead">This path is not mounted on ANKBUI OS.</p>
      <div class="term" aria-label="Terminal output">
        <div class="cmd"><span class="prompt">ankbui@os</span><span class="dim">:</span><span class="pathc">~</span><span class="dim">$</span> open ${safePath}</div>
        <div class="errline">open: ${safePath}: No such file or directory<span class="caret" aria-hidden="true"></span></div>
      </div>
      <div class="actions">
        <a class="btn primary" href="/" autofocus>Back to Desktop</a>
        <a class="btn" href="https://github.com/ankbuitv" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p class="hint">ERR_FILE_NOT_FOUND · HTTP 404</p>
    </div>
  </section>
</main>
<p class="foot">© 2026 Bùi Đức Anh</p>
</body>
</html>`;
}
