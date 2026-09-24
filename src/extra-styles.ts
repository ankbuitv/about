export const EXTRA_STYLES = `
#mb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}
#mb-brand:hover { background: rgba(255,255,255,.06); }
#spaces { display: flex; gap: 5px; margin-left: 4px; }
.space-btn {
  width: 16px; height: 7px; border-radius: 99px;
  background: rgba(255,255,255,.14);
  transition: width .18s, background .18s;
}
.space-btn.on { width: 26px; background: var(--accent); }
.space-btn:focus-visible { outline: 1px solid var(--accent); }
#bell { position: relative; width: 28px; height: 28px; border-radius: 8px; color: var(--ink-dim); display: grid; place-items: center; }
#bell svg { width: 15px; height: 15px; }
#bell:hover, #bell.on { background: rgba(255,255,255,.07); color: var(--ink); }
#bell-count {
  position: absolute; top: 2px; right: 1px; min-width: 14px; height: 14px; padding: 0 3px;
  border-radius: 99px; background: #ff7d7d; color: #1a0c0c; font-size: 9px; font-weight: 700;
  display: grid; place-items: center;
}
.avail {
  font-size: 11px; font-family: var(--mono); letter-spacing: .04em;
  padding: 3px 8px; border-radius: 99px; border: 1px solid rgba(126,227,156,.35);
  color: #7ee39c; background: rgba(126,227,156,.1);
}
.avail.busy { color: #e0b24a; border-color: rgba(224,178,74,.4); background: rgba(224,178,74,.1); }
#widgets {
  position: absolute; top: calc(var(--mb-h) + 22px); right: 22px; z-index: 2;
  width: 248px; display: grid; gap: 12px;
}
.widget {
  pointer-events: auto; text-align: left; width: 100%;
  padding: 14px 14px 12px; border-radius: 16px;
  background: var(--glass); border: 1px solid var(--edge);
  box-shadow: var(--shadow); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
}
.widget .k { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); }
.widget .bigtime { font-family: var(--mono); font-size: 32px; letter-spacing: -.03em; margin-top: 2px; }
.widget .sub { color: var(--ink-dim); font-size: 13px; }
.widget .stars { font-family: var(--mono); font-size: 28px; color: var(--accent); }
.now-line { margin-top: 8px; color: var(--ink-dim); font-size: 13.5px; }
#notifs, #launchpad, #lock { display: none; }
#notifs.show, #launchpad.show, #lock.show { display: block; }
#notifs {
  position: fixed; top: calc(var(--mb-h) + 8px); right: 10px; z-index: 240;
  width: min(360px, calc(100vw - 20px)); max-height: min(70vh, 520px); overflow: auto;
  padding: 12px; border-radius: 16px; background: var(--glass-strong); border: 1px solid var(--edge-bright);
  box-shadow: var(--shadow); backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
}
.notif-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.notif-head h2 { font-size: 13px; font-weight: 600; }
.notif {
  padding: 10px 10px 9px; border-radius: 12px; background: rgba(255,255,255,.035);
  border: 1px solid var(--edge); margin-top: 8px;
}
.notif b { display: block; font-size: 13.5px; }
.notif span { color: var(--ink-dim); font-size: 12.5px; }
.notif i { display: block; margin-top: 4px; font-style: normal; font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }
#launchpad {
  position: fixed; inset: 0; z-index: 280;
  background: rgba(5,6,10,.55); backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
}
.lp-box { width: min(760px, calc(100% - 32px)); margin: 12vh auto 0; }
#lp-search {
  width: 100%; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--edge-bright);
  background: rgba(12,14,20,.8); color: var(--ink); outline: none; font: 15px var(--sans);
}
.lp-grid { margin-top: 22px; display: grid; grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 8px; }
.lp-app {
  padding: 16px 8px 12px; border-radius: 16px; display: grid; justify-items: center; gap: 8px;
  border: 1px solid transparent;
}
.lp-app:hover, .lp-app:focus-visible { background: rgba(255,255,255,.06); border-color: var(--edge); }
.lp-app .tile { width: 58px; height: 58px; }
.lp-app .label { font-size: 12.5px; color: var(--ink-dim); }
#lock {
  position: fixed; inset: 0; z-index: 560; background: #07080c;
  display: none; place-items: center; text-align: center;
}
#lock.show { display: grid; }
#lock::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(800px 500px at 20% 10%, rgba(80,120,180,.2), transparent 60%),
    radial-gradient(700px 480px at 80% 90%, rgba(40,90,110,.16), transparent 60%);
}
.lock-card { position: relative; animation: lockdrift 18s ease-in-out infinite alternate; }
.lock-card img { width: 84px; height: 84px; border-radius: 50%; margin: 0 auto 16px; object-fit: cover; border: 2px solid var(--edge-bright); }
.lock-time { font-family: var(--mono); font-size: clamp(56px, 10vw, 92px); letter-spacing: -.04em; }
.lock-date { color: var(--ink-dim); margin-top: 6px; }
.lock-hint { margin-top: 22px; color: var(--ink-faint); font-size: 13px; letter-spacing: .04em; }
@keyframes lockdrift { to { transform: translate(18px, -26px); } }
#boot .bootbox { text-align: left; width: min(420px, calc(100vw - 48px)); }
#bootlog { margin-top: 16px; font-family: var(--mono); font-size: 12.5px; line-height: 1.7; color: var(--ink-dim); }
#bootlog .ok { color: #7ee39c; }
#bootlog .warn { color: #e0b24a; }
.tile-notes { background: linear-gradient(145deg, #c7b6ff, #6d5bd0); }
.tile-guestbook { background: linear-gradient(145deg, #ff9ec4, #d4537e); }
.tile-launchpad { background: linear-gradient(145deg, #8fd0ff, #3d7ec4); }
.window.offspace { display: none !important; }
.proj-top { display: flex; align-items: center; gap: 8px; }
.status-pill, .stack-chip {
  font-size: 11px; font-family: var(--mono); padding: 2px 7px; border-radius: 99px;
  border: 1px solid var(--edge); color: var(--ink-faint);
}
.status-pill.live { color: #7ee39c; border-color: rgba(126,227,156,.35); }
.status-pill.wip { color: #e0b24a; border-color: rgba(224,178,74,.35); }
.stack-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 12px; }
.proj-shot { width: 100%; max-height: 220px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--edge); }
.proj-cover {
  height: 120px; border-radius: 12px; margin-bottom: 12px; display: grid; place-items: center;
  background: rgba(255,255,255,.04); border: 1px solid var(--edge); font-family: var(--mono); font-size: 28px; color: var(--accent);
}
.heat-wrap { overflow-x: auto; padding-bottom: 4px; }
.heat { display: grid; grid-template-rows: repeat(7, 11px); grid-auto-flow: column; grid-auto-columns: 11px; gap: 3px; width: max-content; }
.heat i { width: 11px; height: 11px; border-radius: 2px; background: rgba(255,255,255,.06); display: block; }
.heat i[data-l="1"] { background: rgba(143,208,255,.28); }
.heat i[data-l="2"] { background: rgba(143,208,255,.48); }
.heat i[data-l="3"] { background: rgba(143,208,255,.72); }
.heat i[data-l="4"] { background: #8fd0ff; }
.heat-legend { display: flex; gap: 4px; align-items: center; color: var(--ink-faint); font-size: 11px; margin-top: 8px; }
.heat-legend i, .heat i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; background: rgba(255,255,255,.06); }
.heat-legend i[data-l="1"], .heat i[data-l="1"] { background: rgba(143,208,255,.28); }
.heat-legend i[data-l="2"], .heat i[data-l="2"] { background: rgba(143,208,255,.48); }
.heat-legend i[data-l="3"], .heat i[data-l="3"] { background: rgba(143,208,255,.72); }
.heat-legend i[data-l="4"], .heat i[data-l="4"] { background: #8fd0ff; }
.spark { width: 100%; height: 72px; display: block; }
.spark-meta { display: flex; justify-content: space-between; color: var(--ink-faint); font-size: 11px; font-family: var(--mono); }
.note-item, .guest-item { text-align: left; }
.note-body h1, .note-body h2, .note-body h3 { margin: 12px 0 8px; letter-spacing: -.02em; }
.note-body p, .note-body li { color: var(--ink-dim); margin: 6px 0; }
.note-body ul { padding-left: 18px; }
.note-body code { font-family: var(--mono); font-size: 12.5px; background: rgba(255,255,255,.05); padding: 1px 5px; border-radius: 5px; }
.note-body pre { overflow: auto; padding: 12px; border-radius: 10px; background: rgba(0,0,0,.35); border: 1px solid var(--edge); margin: 10px 0; }
.note-body pre code { background: none; padding: 0; }
.note-body blockquote { border-left: 2px solid var(--accent); padding-left: 10px; color: var(--ink-dim); margin: 10px 0; }
.note-body a { text-decoration: underline; text-underline-offset: 3px; }
.cform, .gform { display: grid; gap: 8px; margin-top: 14px; }
.cform input, .cform textarea, .gform input, .gform textarea, .note-search {
  width: 100%; background: rgba(255,255,255,.04); border: 1px solid var(--edge); border-radius: 10px;
  padding: 9px 11px; color: var(--ink); outline: none; font: inherit;
}
.cform textarea, .gform textarea { min-height: 90px; resize: vertical; }
.hp { position: absolute; left: -9999px; opacity: 0; height: 0; }
.form-msg { font-size: 13px; color: var(--ink-dim); min-height: 1.2em; }
.term, #term {
  min-height: 100%; padding: 14px 16px 18px; font-family: var(--mono); font-size: 13px; line-height: 1.7; cursor: text;
}
.term .line, #term .line { white-space: pre-wrap; word-break: break-word; }
.term .prompt, #term .prompt { color: #6fe3a1; }
.term .path, #term .path { color: var(--accent); }
.term .dim, #term .dim { color: var(--ink-faint); }
.term .out, #term .out { color: #c7cdd8; }
.term .err, #term .err { color: #ff8d8d; }
.term .accent, #term .accent { color: var(--accent); }
.term-input, #term-input {
  flex: 0 0 auto; min-width: 12px; background: none; border: 0; outline: none; color: #e8eaf0; font: inherit; caret-color: transparent; padding: 0;
}
.term-caret, #term-caret {
  display: inline-block; width: 8px; height: 15px; margin-left: 1px; background: #e8eaf0; vertical-align: text-bottom;
  animation: blink 1.06s steps(1) infinite;
}
#dock.mag { overflow: visible; }
#dock.mag .dock-app { transform-origin: bottom center; }
.lock-row { display: flex; gap: 6px; }
.lock-chip {
  padding: 6px 10px; border-radius: 9px; border: 1px solid var(--edge); color: var(--ink-dim); font-size: 12.5px;
}
.lock-chip.on { color: var(--accent); border-color: rgba(143,208,255,.35); background: var(--accent-soft); }
@media (max-width: 720px) {
  #widgets { display: none; }
  .avail { display: none; }
  #spaces { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .lock-card { animation: none; }
}
body.reduce-motion .lock-card { animation: none; }
`;
