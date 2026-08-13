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
  --dock-h: 70px;
  --mb-h: 34px;
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
svg { display: block; }

/* ---------- desktop backdrop / wallpapers ---------- */
#desktop { position: fixed; inset: 0; overflow: hidden; }

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
body[data-wp="graphite"] #desktop::before {
  background:
    radial-gradient(1100px 700px at 20% -10%, rgba(120, 128, 142, 0.14), transparent 60%),
    radial-gradient(900px 620px at 85% 112%, rgba(90, 96, 110, 0.12), transparent 60%),
    #08090c;
}
body[data-wp="nebula"] #desktop::before {
  background:
    radial-gradient(1100px 720px at 15% -12%, rgba(140, 84, 190, 0.20), transparent 60%),
    radial-gradient(900px 620px at 88% 112%, rgba(70, 90, 200, 0.16), transparent 60%),
    radial-gradient(560px 380px at 62% 24%, rgba(200, 90, 150, 0.07), transparent 65%),
    #08070d;
}
body[data-wp="ocean"] #desktop::before {
  background:
    radial-gradient(1100px 720px at 18% -12%, rgba(40, 120, 160, 0.22), transparent 60%),
    radial-gradient(900px 620px at 86% 112%, rgba(40, 160, 130, 0.14), transparent 60%),
    #060a0d;
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

/* ---------- menu bar ---------- */
#menubar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--mb-h);
  z-index: 220;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 14px;
  background: rgba(10, 11, 16, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  user-select: none;
  -webkit-user-select: none;
}
.mb-left, .mb-right { display: flex; align-items: center; gap: 10px; }
.mb-logo { color: var(--accent); }
.mb-logo svg { width: 14px; height: 14px; }
.mb-name {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.14em;
  color: var(--ink);
  font-weight: 600;
}
#mb-app {
  font-size: 12.5px;
  color: var(--ink-faint);
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}
.mb-wifi { color: var(--ink-dim); }
.mb-wifi svg { width: 15px; height: 15px; }
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
  font-size: 12.5px;
  color: var(--ink-dim);
  padding: 4px 8px;
  border-radius: 7px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
#clock:hover { background: rgba(255, 255, 255, 0.07); color: var(--ink); }

/* ---------- app icon tiles ---------- */
.tile {
  display: grid;
  place-items: center;
  border-radius: 26%;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -8px 14px rgba(0, 0, 0, 0.22),
    0 6px 16px rgba(0, 0, 0, 0.4);
}
.tile svg { width: 54%; height: 54%; }
.tile-about    { background: linear-gradient(145deg, #5d9bff, #3560cf); }
.tile-projects { background: linear-gradient(145deg, #ffc46b, #df8a2d); }
.tile-github   { background: linear-gradient(145deg, #3d4350, #1d212b); }
.tile-terminal { background: linear-gradient(145deg, #2c3440, #14181f); }
.tile-terminal svg { color: #7ee39c; }
.tile-contact  { background: linear-gradient(145deg, #4ecfc0, #279187); }
.tile-settings { background: linear-gradient(145deg, #929cae, #59616f); }

/* ---------- desktop icons ---------- */
#icons {
  position: absolute;
  top: calc(var(--mb-h) + max(18px, env(safe-area-inset-top)));
  left: 20px;
  z-index: 2;
  display: grid;
  gap: 6px;
}
.dicon {
  width: 92px;
  padding: 12px 6px 9px;
  border-radius: 14px;
  display: grid;
  justify-items: center;
  gap: 8px;
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
.dicon .tile { width: 50px; height: 50px; }
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
.window.closing { animation: winclose 0.18s ease forwards; pointer-events: none; }
@keyframes winclose { to { opacity: 0; transform: scale(0.96); } }
.window.minimizing {
  animation: winmin 0.28s cubic-bezier(0.4, 0, 0.9, 0.6) forwards;
  pointer-events: none;
}
@keyframes winmin { to { opacity: 0; transform: translateY(46vh) scale(0.25); } }
.window.maxed {
  left: 10px !important;
  top: calc(var(--mb-h) + 8px) !important;
  width: calc(100vw - 20px) !important;
  height: calc(100vh - var(--mb-h) - var(--dock-h) - 30px) !important;
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
.titlebar .t-ico { display: grid; place-items: center; }
.titlebar .t-ico svg { width: 15px; height: 15px; }
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

/* resize handles */
.rz { position: absolute; z-index: 5; }
.rz-r { top: 44px; right: -3px; width: 8px; height: calc(100% - 58px); cursor: ew-resize; }
.rz-b { bottom: -3px; left: 14px; width: calc(100% - 32px); height: 8px; cursor: ns-resize; }
.rz-br { right: -3px; bottom: -3px; width: 16px; height: 16px; cursor: nwse-resize; }
.window.maxed .rz { display: none; }

/* snap ghost */
#snapghost {
  position: fixed;
  z-index: 8;
  display: none;
  border-radius: 14px;
  background: rgba(143, 208, 255, 0.08);
  border: 1px solid rgba(143, 208, 255, 0.35);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: none;
  transition: left 0.12s ease, top 0.12s ease, width 0.12s ease, height 0.12s ease;
}
#snapghost.show { display: block; }

/* ---------- dock ---------- */
#dock {
  position: fixed;
  left: 50%;
  bottom: max(12px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 22px;
  background: var(--glass-strong);
  border: 1px solid var(--edge);
  box-shadow: var(--shadow);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
}
.dock-app {
  position: relative;
  padding: 0;
  border-radius: 14px;
  transition: transform 0.18s cubic-bezier(0.3, 0.8, 0.4, 1.2);
}
.dock-app .tile { width: 46px; height: 46px; }
.dock-app:hover { transform: translateY(-6px) scale(1.07); }
.dock-app:active { transform: translateY(-2px) scale(1.02); }
.dock-app:focus-visible { outline: 1px solid var(--accent); border-radius: 14px; }
.dock-app .dot {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  transition: transform 0.2s;
}
.dock-app.open .dot { transform: translateX(-50%) scale(1); }
.dock-app .tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(3px);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  white-space: nowrap;
  color: var(--ink);
  background: rgba(10, 12, 17, 0.92);
  border: 1px solid var(--edge-bright);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, transform 0.15s;
}
.dock-app:hover .tip { opacity: 1; transform: translateX(-50%) translateY(0); }
.dock-sep { width: 1px; height: 34px; margin: 0 5px; background: rgba(255, 255, 255, 0.09); }

#datepop {
  position: fixed;
  right: 10px;
  top: calc(var(--mb-h) + 8px);
  z-index: 230;
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

/* ---------- context menu ---------- */
#ctx {
  position: fixed;
  z-index: 320;
  min-width: 210px;
  display: none;
  padding: 6px;
  border-radius: 13px;
  background: var(--glass-strong);
  border: 1px solid var(--edge-bright);
  box-shadow: var(--shadow);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
}
#ctx.show { display: block; animation: winopen 0.14s ease; }
.ctx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 11px;
  border-radius: 9px;
  font-size: 13px;
  color: var(--ink-dim);
  text-align: left;
}
.ctx-item svg { width: 14px; height: 14px; }
.ctx-item:hover { background: rgba(255, 255, 255, 0.08); color: var(--ink); }
.ctx-sep { height: 1px; margin: 5px 8px; background: rgba(255, 255, 255, 0.07); }

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
  padding: 9px 12px;
  border-radius: 10px;
  text-align: left;
  color: var(--ink-dim);
}
.pal-item .tile { width: 26px; height: 26px; border-radius: 8px; box-shadow: none; }
.pal-item .pi-plain { width: 26px; display: grid; place-items: center; color: var(--ink-faint); }
.pal-item .pi-plain svg { width: 16px; height: 16px; }
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
.proj-logo.lt { border: 0; color: #fff; font-family: var(--mono); font-weight: 700; font-size: 20px; }
.proj-logo.lt-0 { background: linear-gradient(145deg, #5d9bff, #3560cf); }
.proj-logo.lt-1 { background: linear-gradient(145deg, #ff9d6b, #d95f2d); }
.proj-logo.lt-2 { background: linear-gradient(145deg, #4ecfc0, #279187); }
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
.gh-fallback .big { display: flex; justify-content: center; margin-bottom: 12px; color: var(--ink-faint); }
.gh-fallback .big svg { width: 34px; height: 34px; }
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
  flex: 0 0 auto;
  min-width: 12px;
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
.wp-row { display: flex; gap: 10px; }
.swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
}
.swatch:hover { transform: scale(1.1); }
.swatch.on { border-color: var(--accent); }
.swatch[data-wp="aurora"]   { background: linear-gradient(145deg, #2c3e5e, #1d3a40); }
.swatch[data-wp="graphite"] { background: linear-gradient(145deg, #3a3e46, #191b20); }
.swatch[data-wp="nebula"]   { background: linear-gradient(145deg, #46305e, #232a55); }
.swatch[data-wp="ocean"]    { background: linear-gradient(145deg, #1e4a5e, #1a4a40); }

/* ---------- footer ---------- */
#deskfoot {
  position: fixed;
  right: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 2;
  font-size: 11.5px;
  font-family: var(--mono);
  color: var(--ink-faint);
  user-select: none;
}

/* ---------- responsive ---------- */
@media (max-width: 720px) {
  :root { --dock-h: 64px; --mb-h: 32px; }
  #mb-app { display: none; }
  #icons {
    left: 12px;
    right: 12px;
    grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
    justify-items: center;
  }
  .dicon { width: 78px; }
  .dicon .tile { width: 46px; height: 46px; }
  .window:not(.maxed) {
    left: 8px !important;
    top: calc(var(--mb-h) + 8px) !important;
    width: calc(100vw - 16px) !important;
    height: calc(100vh - var(--mb-h) - var(--dock-h) - 32px) !important;
  }
  .titlebar { height: 48px; flex: 0 0 48px; cursor: default; }
  .wbtn { width: 36px; height: 36px; }
  .wbtn.max { display: none; }
  .rz { display: none; }
  #dock { gap: 3px; padding: 7px 8px; max-width: calc(100vw - 16px); overflow-x: auto; }
  .dock-app .tile { width: 42px; height: 42px; }
  .dock-app:hover { transform: none; }
  .dock-app .tip { display: none; }
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
