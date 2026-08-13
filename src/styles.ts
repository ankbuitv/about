export const STYLES = `
:root {
  --bg: #07080c;
  --ink: #e8eaf0;
  --ink-dim: #9aa3b2;
  --ink-faint: #5c6470;
  --accent: #8fd0ff;
  --accent-soft: rgba(143, 208, 255, 0.14);
  --glass: rgba(16, 18, 25, 0.68);
  --glass-strong: rgba(13, 15, 21, 0.82);
  --edge: rgba(255, 255, 255, 0.08);
  --edge-bright: rgba(255, 255, 255, 0.14);
  --shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.4);
  --radius: 16px;
  --dock-h: 66px;
  --mono: "SF Mono", "JetBrains Mono", "Cascadia Code", ui-monospace, Menlo, Consolas, monospace;
  --sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

::selection { background: rgba(143, 208, 255, 0.25); }

button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
a { color: var(--accent); text-decoration: none; }
img { display: block; }

/* ---------- desktop backdrop ---------- */
#desktop {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

#desktop::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1100px 700px at 18% -10%, rgba(64, 90, 140, 0.20), transparent 60%),
    radial-gradient(900px 600px at 85% 110%, rgba(70, 140, 150, 0.12), transparent 60%),
    radial-gradient(600px 400px at 70% 20%, rgba(120, 90, 160, 0.07), transparent 65%),
    var(--bg);
}

#desktop::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 100%);
  pointer-events: none;
}

#spotlight {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    520px circle at var(--mx, 50%) var(--my, 35%),
    rgba(150, 190, 255, 0.055),
    transparent 70%
  );
  transition: opacity 0.4s;
}
body.no-spotlight #spotlight { opacity: 0; }

/* ---------- boot ---------- */
#boot {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: grid;
  place-items: center;
  background: var(--bg);
  transition: opacity 0.45s ease, visibility 0.45s;
}
#boot.gone { opacity: 0; visibility: hidden; }
#boot .mark {
  font-family: var(--mono);
  letter-spacing: 0.32em;
  font-size: 13px;
  color: var(--ink-dim);
  text-transform: uppercase;
  text-align: center;
}
#boot .bar {
  width: 148px;
  height: 2px;
  margin: 18px auto 0;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
#boot .bar i {
  display: block;
  height: 100%;
  width: 0;
  background: var(--accent);
  animation: bootbar 0.9s ease forwards;
}
@keyframes bootbar { to { width: 100%; } }

/* ---------- desktop icons ---------- */
#icons {
  position: absolute;
  top: max(26px, env(safe-area-inset-top));
  left: 22px;
  z-index: 2;
  display: grid;
  gap: 8px;
}
.dicon {
  width: 86px;
  padding: 12px 6px 10px;
  border-radius: 14px;
  display: grid;
  justify-items: center;
  gap: 7px;
  border: 1px solid transparent;
  transition: background 0.18s, border-color 0.18s, transform 0.18s;
  user-select: none;
  -webkit-user-select: none;
}
.dicon:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--edge);
  transform: translateY(-1px);
}
.dicon:focus-visible { outline: 1px solid var(--accent); }
.dicon .glyph {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  font-size: 23px;
  border-radius: 13px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--edge);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 6px 18px rgba(0, 0, 0, 0.35);
}
.dicon .label {
  font-size: 12px;
  color: var(--ink-dim);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}

/* ---------- windows ---------- */
.window {
  position: absolute;
  z-index: 10;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--glass);
  border: 1px solid var(--edge);
  box-shadow: var(--shadow);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  overflow: hidden;
  transform-origin: center center;
}
.window.focused { border-color: var(--edge-bright); }
.window.opening { animation: winopen 0.26s cubic-bezier(0.2, 0.9, 0.3, 1.05); }
@keyframes winopen {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.window.closing {
  animation: winclose 0.18s ease forwards;
  pointer-events: none;
}
@keyframes winclose {
  to { opacity: 0; transform: scale(0.96); }
}
.window.minimizing {
  animation: winmin 0.28s cubic-bezier(0.4, 0, 0.9, 0.6) forwards;
  pointer-events: none;
}
@keyframes winmin {
  to { opacity: 0; transform: translateY(46vh) scale(0.25); }
}
.window.maxed {
  left: 10px !important;
  top: 10px !important;
  width: calc(100vw - 20px) !important;
  height: calc(100vh - var(--dock-h) - 26px) !important;
  border-radius: 14px;
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 0 14px;
  height: 44px;
  flex: 0 0 44px;
  background: linear-gradient(rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}
.titlebar:active { cursor: grabbing; }
.titlebar .t-ico { font-size: 15px; }
.titlebar .t-title {
  flex: 1;
  font-size: 13px;
  font-weight: 550;
  color: var(--ink-dim);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.window.focused .titlebar .t-title { color: var(--ink); }
.wbtns { display: flex; gap: 6px; }
.wbtn {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: var(--ink-faint);
  font-size: 13px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
}
.wbtn:hover { background: rgba(255, 255, 255, 0.08); color: var(--ink); }
.wbtn.close:hover { background: rgba(255, 92, 92, 0.18); color: #ff7d7d; }

.wbody {
  flex: 1;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
}
.wbody::-webkit-scrollbar { width: 8px; }
.wbody::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 4px; }

/* ---------- dock ---------- */
#dock {
  position: fixed;
  left: 50%;
  bottom: max(12px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  border-radius: 20px;
  background: var(--glass-strong);
  border: 1px solid var(--edge);
  box-shadow: var(--shadow);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
}
.dock-app {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  font-size: 21px;
  transition: background 0.16s, transform 0.16s;
}
.dock-app:hover { background: rgba(255, 255, 255, 0.07); transform: translateY(-3px); }
.dock-app:focus-visible { outline: 1px solid var(--accent); }
.dock-app .dot {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  transition: transform 0.2s;
}
.dock-app.open .dot { transform: translateX(-50%) scale(1); }
.dock-sep {
  width: 1px;
  height: 30px;
  margin: 0 6px;
  background: rgba(255, 255, 255, 0.09);
}
#tray {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px 0 2px;
}
#sysdot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #57d98a;
  box-shadow: 0 0 8px rgba(87, 217, 138, 0.6);
}
#sysdot.err { background: #e0b24a; box-shadow: 0 0 8px rgba(224, 178, 74, 0.5); }
#clock {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink-dim);
  padding: 7px 8px;
  border-radius: 9px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
#clock:hover { background: rgba(255, 255, 255, 0.07); color: var(--ink); }

#datepop {
  position: fixed;
  right: 50%;
  bottom: calc(var(--dock-h) + 26px);
  transform: translateX(50%);
  z-index: 210;
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--glass-strong);
  border: 1px solid var(--edge);
  box-shadow: var(--shadow);
  backdrop-filter: blur(26px);
  -webkit-backdrop-filter: blur(26px);
  text-align: center;
  display: none;
}
#datepop.show { display: block; animation: winopen 0.2s ease; }
#datepop .big { font-size: 26px; font-family: var(--mono); }
#datepop .small { font-size: 13px; color: var(--ink-dim); margin-top: 2px; }

/* ---------- command palette ---------- */
#palette {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: none;
  background: rgba(4, 5, 8, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
#palette.show { display: block; }
#palette .box {
  width: min(560px, calc(100vw - 32px));
  margin: 14vh auto 0;
  border-radius: 16px;
  background: var(--glass-strong);
  border: 1px solid var(--edge-bright);
  box-shadow: var(--shadow);
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  overflow: hidden;
  animation: winopen 0.18s ease;
}
#pal-input {
  width: 100%;
  padding: 16px 18px;
  background: none;
  border: 0;
  outline: none;
  color: var(--ink);
  font: 15px var(--sans);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
#pal-input::placeholder { color: var(--ink-faint); }
#pal-list { max-height: 320px; overflow: auto; padding: 6px; }
.pal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  text-align: left;
  color: var(--ink-dim);
}
.pal-item .pi { font-size: 17px; width: 22px; text-align: center; }
.pal-item .pk {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  border: 1px solid var(--edge);
  border-radius: 6px;
  padding: 2px 7px;
}
.pal-item.sel, .pal-item:hover { background: rgba(255, 255, 255, 0.07); color: var(--ink); }
.pal-empty { padding: 18px; text-align: center; color: var(--ink-faint); font-size: 13px; }

/* ---------- shared app ui ---------- */
.pad { padding: 22px; }
.btnrow { display: flex; gap: 10px; flex-wrap: wrap; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
.btn.primary {
  background: var(--accent-soft);
  border-color: rgba(143, 208, 255, 0.3);
  color: var(--accent);
}
.btn.primary:hover { background: rgba(143, 208, 255, 0.2); }
.muted { color: var(--ink-dim); }
.faint { color: var(--ink-faint); }

/* ---------- about ---------- */
.about-hero { display: flex; gap: 20px; align-items: center; }
.avatar-ring {
  flex: 0 0 auto;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(from 210deg, rgba(143, 208, 255, 0.55), rgba(255, 255, 255, 0.06), rgba(143, 208, 255, 0.35));
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(7, 8, 12, 0.9);
  transition: transform 0.9s cubic-bezier(0.3, 0.7, 0.2, 1);
  will-change: transform;
}
.avatar-ring:hover .avatar { transform: rotate(720deg) scale(1.07); }
.about-name { font-size: 21px; font-weight: 640; letter-spacing: -0.01em; }
.about-user { font-family: var(--mono); font-size: 13px; color: var(--accent); }
.role-chip {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 12.5px;
  background: var(--accent-soft);
  border: 1px solid rgba(143, 208, 255, 0.25);
  color: var(--accent);
}
.about-meta { margin-top: 18px; display: grid; gap: 8px; font-size: 14px; color: var(--ink-dim); }
.about-meta a { color: var(--ink-dim); }
.about-meta a:hover { color: var(--accent); }
.about-actions { margin-top: 20px; }

/* ---------- projects ---------- */
.proj-grid { display: grid; gap: 14px; }
.proj-card {
  display: flex;
  gap: 15px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--edge);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.proj-card:hover {
  transform: translateY(-3px);
  border-color: rgba(143, 208, 255, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(143, 208, 255, 0.06);
  background: rgba(255, 255, 255, 0.05);
}
.proj-logo {
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--edge);
  overflow: hidden;
}
.proj-logo img { width: 32px; height: 32px; object-fit: contain; }
.proj-logo .fallback {
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 700;
  color: var(--accent);
}
.proj-name { font-weight: 620; font-size: 15.5px; }
.proj-desc { font-size: 13.5px; color: var(--ink-dim); margin: 3px 0 11px; }
.proj-actions { display: flex; gap: 8px; }
.proj-actions .btn { padding: 6px 13px; font-size: 12.5px; border-radius: 9px; }

/* ---------- github ---------- */
.gh-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.gh-id { font-family: var(--mono); font-size: 13.5px; color: var(--ink-dim); }
.gh-id b { color: var(--ink); font-weight: 600; }
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
  gap: 10px;
}
.stat {
  padding: 14px 8px 12px;
  border-radius: 13px;
  text-align: center;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--edge);
}
.stat .n { font-family: var(--mono); font-size: 22px; font-weight: 650; color: var(--ink); }
.stat .l { font-size: 11.5px; color: var(--ink-faint); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.07em; }
.gh-section { margin-top: 20px; }
.gh-section h3 {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--ink-faint);
  font-weight: 600;
  margin-bottom: 10px;
}
.lang-row { display: flex; flex-wrap: wrap; gap: 8px; }
.lang-chip {
  font-family: var(--mono);
  font-size: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--edge);
  color: var(--ink-dim);
}
.repo-list { display: grid; gap: 8px; }
.repo-item {
  display: block;
  padding: 11px 13px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--edge);
  transition: background 0.16s, border-color 0.16s, transform 0.16s;
}
.repo-item:hover { background: rgba(255, 255, 255, 0.055); border-color: var(--edge-bright); transform: translateY(-1px); }
.repo-top { display: flex; align-items: baseline; gap: 10px; }
.repo-name { font-family: var(--mono); font-size: 13.5px; color: var(--accent); }
.repo-meta { margin-left: auto; font-size: 12px; color: var(--ink-faint); font-family: var(--mono); white-space: nowrap; }
.repo-desc { font-size: 12.5px; color: var(--ink-dim); margin-top: 3px; }
.gh-fallback { text-align: center; padding: 30px 10px; color: var(--ink-dim); }
.gh-fallback .big { font-size: 30px; margin-bottom: 10px; }
.skel {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite linear;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* ---------- terminal ---------- */
.win-terminal .wbody { background: rgba(5, 6, 9, 0.88); }
#term {
  min-height: 100%;
  padding: 14px 16px 18px;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  cursor: text;
}
#term .line { white-space: pre-wrap; word-break: break-word; }
#term .prompt { color: #6fe3a1; }
#term .path { color: var(--accent); }
#term .dim { color: var(--ink-faint); }
#term .out { color: #c7cdd8; }
#term .err { color: #ff8d8d; }
#term .accent { color: var(--accent); }
#term a { text-decoration: underline; text-underline-offset: 3px; }
.term-input-row { display: flex; flex-wrap: wrap; align-items: baseline; }
#term-input {
  flex: 1;
  min-width: 60px;
  background: none;
  border: 0;
  outline: none;
  color: #e8eaf0;
  font: inherit;
  caret-color: transparent;
  padding: 0;
}
#term-caret {
  display: inline-block;
  width: 8px;
  height: 15px;
  margin-left: 1px;
  background: #e8eaf0;
  vertical-align: text-bottom;
  animation: blink 1.06s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* ---------- contact ---------- */
.contact-card { text-align: center; padding: 8px 0 4px; }
.contact-card .cc-ava {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 14px;
  border: 2px solid var(--edge-bright);
}
.contact-card h2 { font-size: 19px; font-weight: 640; }
.contact-card .email {
  display: inline-block;
  margin: 10px 0 20px;
  font-family: var(--mono);
  font-size: 13.5px;
  padding: 7px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid var(--edge);
  color: var(--ink-dim);
}
.contact-card .btnrow { justify-content: center; }

/* ---------- settings ---------- */
.set-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.set-row:last-child { border-bottom: 0; }
.set-info { flex: 1; }
.set-name { font-size: 14px; font-weight: 560; }
.set-desc { font-size: 12.5px; color: var(--ink-faint); }
.toggle {
  flex: 0 0 auto;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid var(--edge);
  position: relative;
  transition: background 0.18s;
}
.toggle::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink-dim);
  transition: transform 0.18s, background 0.18s;
}
.toggle.on { background: rgba(143, 208, 255, 0.3); }
.toggle.on::after { transform: translateX(18px); background: var(--accent); }

/* ---------- footer chip on desktop ---------- */
#deskfoot {
  position: fixed;
  right: 16px;
  top: 14px;
  z-index: 2;
  font-size: 11.5px;
  font-family: var(--mono);
  color: var(--ink-faint);
  user-select: none;
}

/* ---------- responsive ---------- */
@media (max-width: 720px) {
  :root { --dock-h: 62px; }
  #icons {
    left: 12px;
    right: 12px;
    grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
    justify-items: center;
  }
  .dicon { width: 76px; }
  .window:not(.maxed) {
    left: 8px !important;
    top: max(10px, env(safe-area-inset-top)) !important;
    width: calc(100vw - 16px) !important;
    height: calc(100vh - var(--dock-h) - 34px) !important;
  }
  .titlebar { height: 48px; flex: 0 0 48px; cursor: default; }
  .wbtn { width: 36px; height: 36px; }
  .wbtn.max { display: none; }
  #dock { gap: 2px; padding: 6px 8px; max-width: calc(100vw - 16px); overflow-x: auto; }
  .dock-app { width: 42px; height: 42px; font-size: 19px; }
  .dock-app:hover { transform: none; }
  #deskfoot { display: none; }
  .pad { padding: 18px; }
  .about-hero { flex-direction: column; text-align: center; }
  .about-meta { justify-items: center; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  #term-caret { animation: none; }
  .avatar-ring:hover .avatar { transform: scale(1.04); }
}
body.reduce-motion *, body.reduce-motion *::before, body.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
body.reduce-motion #term-caret { animation: none; }
`;
