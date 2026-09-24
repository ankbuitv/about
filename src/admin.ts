export function renderAdmin(authed: boolean, passwordSet: boolean): string {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#07080c">
<title>Admin — ANKBUI OS</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
:root {
  --bg:#07080c; --ink:#e8eaf0; --dim:#9aa3b2; --faint:#5c6470; --accent:#8fd0ff;
  --edge:rgba(255,255,255,.08); --glass:rgba(16,18,25,.78);
  --sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:"SF Mono",ui-monospace,Menlo,Consolas,monospace;
}
* { box-sizing:border-box; margin:0; padding:0; }
html,body { min-height:100%; background:var(--bg); color:var(--ink); font-family:var(--sans); }
body { background:
  radial-gradient(900px 480px at 10% -10%, rgba(64,90,140,.22), transparent 60%),
  var(--bg); }
a { color:var(--accent); }
button,input,textarea,select { font:inherit; color:inherit; }
button { cursor:pointer; }
.top {
  height:52px; display:flex; align-items:center; justify-content:space-between;
  padding:0 18px; border-bottom:1px solid var(--edge);
  background:rgba(10,11,16,.72); backdrop-filter:blur(16px);
}
.brand { font-family:var(--mono); letter-spacing:.14em; font-size:12px; }
.brand b { color:var(--accent); font-weight:600; }
.wrap { width:min(1080px, calc(100% - 28px)); margin:22px auto 40px; }
.card {
  background:var(--glass); border:1px solid var(--edge); border-radius:16px;
  box-shadow:0 24px 60px rgba(0,0,0,.45);
}
.login { width:min(420px, 100%); margin:12vh auto; padding:28px; }
h1 { font-size:22px; letter-spacing:-.02em; }
.sub { color:var(--dim); margin:8px 0 18px; font-size:14px; }
label { display:block; font-size:12px; color:var(--faint); margin:12px 0 6px; letter-spacing:.04em; text-transform:uppercase; }
input,textarea,select {
  width:100%; background:rgba(255,255,255,.04); border:1px solid var(--edge);
  border-radius:10px; padding:10px 12px; outline:none;
}
textarea { min-height:280px; resize:vertical; font-family:var(--mono); font-size:13px; line-height:1.55; }
input:focus,textarea:focus,select:focus { border-color:rgba(143,208,255,.45); }
.row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.btn {
  border:1px solid var(--edge); background:rgba(255,255,255,.06); color:var(--ink);
  border-radius:10px; padding:9px 14px; text-decoration:none; display:inline-flex; align-items:center;
}
.btn.primary { background:rgba(143,208,255,.14); border-color:rgba(143,208,255,.3); color:var(--accent); }
.btn.warn { color:#ff8d8d; border-color:rgba(255,141,141,.3); }
.err { color:#ff8d8d; font-size:13px; margin-top:10px; }
.ok { color:#7ee39c; font-size:13px; margin-top:10px; }
.layout { display:grid; grid-template-columns:200px 1fr; gap:16px; }
.side { padding:10px; display:grid; align-content:start; gap:4px; }
.side button { text-align:left; background:none; border:0; color:var(--dim); padding:10px 12px; border-radius:10px; }
.side button.on, .side button:hover { background:rgba(255,255,255,.06); color:var(--ink); }
.main { padding:18px; }
.list { display:grid; gap:8px; margin-bottom:16px; }
.item {
  text-align:left; width:100%; background:rgba(255,255,255,.03); border:1px solid var(--edge);
  border-radius:12px; padding:10px 12px; color:var(--dim);
}
.item b { color:var(--ink); display:block; }
.item.on { border-color:rgba(143,208,255,.35); }
.meta { font-family:var(--mono); font-size:11px; color:var(--faint); }
.banner {
  margin-bottom:14px; padding:10px 12px; border-radius:10px;
  background:rgba(224,178,74,.1); border:1px solid rgba(224,178,74,.28); color:#e0b24a; font-size:13px;
}
.check { display:flex; align-items:center; gap:8px; margin:12px 0; text-transform:none; letter-spacing:0; color:var(--dim); font-size:14px; }
.check input { width:auto; }
.msg { white-space:pre-wrap; color:var(--dim); font-size:14px; margin-top:6px; }
.pills { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
.pill { display:inline-flex; align-items:center; font-size:11px; border-radius:999px; padding:2px 8px; border:1px solid var(--edge); color:var(--dim); }
.pill.on { color:var(--accent); border-color:rgba(143,208,255,.35); }
.url { word-break:break-all; font-family:var(--mono); font-size:12px; color:var(--dim); margin-top:4px; }
.preview { font-family:var(--mono); font-size:12px; color:var(--accent); margin-top:6px; word-break:break-all; }
@media (max-width:800px) { .layout { grid-template-columns:1fr; } .side { grid-auto-flow:column; overflow:auto; } }
</style>
</head>
<body>
<header class="top">
  <div class="brand"><b>◆</b> ANKBUI OS · ADMIN</div>
  <div class="row">
    <a class="btn" href="/">Desktop</a>
    <button class="btn" id="logout" hidden>Đăng xuất</button>
  </div>
</header>
<main class="wrap" id="app"></main>
<script>
var AUTHED = ${authed ? "true" : "false"};
var HAS_PASSWORD = ${passwordSet ? "true" : "false"};
(function () {
  var app = document.getElementById('app');
  var logoutBtn = document.getElementById('logout');
  var tab = 'notes';
  var data = null;
  var selected = '';
  var selectedLink = '';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function field(label, node) {
    var wrap = document.createElement('div');
    wrap.appendChild(el('label', null, label));
    wrap.appendChild(node);
    return wrap;
  }
  function showLogin() {
    logoutBtn.hidden = true;
    app.textContent = '';
    var card = el('form', 'card login');
    card.appendChild(el('h1', null, 'Đăng nhập'));
    if (!HAS_PASSWORD) {
      card.appendChild(el('p', 'sub', 'Chưa có mật khẩu admin. Trên máy deploy, chạy wrangler secret put ADMIN_PASSWORD. Ghi chú công khai vẫn hiện từ data/site.json.'));
      var pre = el('p', 'meta', 'wrangler secret put ADMIN_PASSWORD\\nwrangler secret put GITHUB_TOKEN\\nwrangler secret put DISCORD_WEBHOOK');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.marginTop = '8px';
      card.appendChild(pre);
      app.appendChild(card);
      return;
    }
    card.appendChild(el('p', 'sub', 'Quản lý ghi chú, shortlink, guestbook, hộp thư và trạng thái.'));
    var input = el('input');
    input.type = 'password';
    input.required = true;
    input.autocomplete = 'current-password';
    card.appendChild(field('Mật khẩu', input));
    var btn = el('button', 'btn primary', 'Vào admin');
    btn.type = 'submit';
    btn.style.marginTop = '16px';
    card.appendChild(btn);
    var msg = el('div', 'err');
    card.appendChild(msg);
    card.addEventListener('submit', function (ev) {
      ev.preventDefault();
      msg.textContent = '';
      fetch('/my/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input.value })
      }).then(function (r) {
        if (!r.ok) throw new Error('Sai mật khẩu');
        AUTHED = true;
        boot();
      }).catch(function (e) { msg.textContent = e.message || 'Không đăng nhập được'; });
    });
    app.appendChild(card);
  }

  function boot() {
    if (!AUTHED) { showLogin(); return; }
    logoutBtn.hidden = false;
    fetch('/my/admin/api/data').then(function (r) {
      if (r.status === 401) { AUTHED = false; showLogin(); return null; }
      return r.json();
    }).then(function (d) {
      if (!d) return;
      data = d;
      render();
    });
  }

  function render() {
    app.textContent = '';
    var layout = el('div', 'layout');
    var side = el('nav', 'card side');
    [['notes', 'Ghi chú'], ['links', 'Shortlinks'], ['guest', 'Guestbook'], ['inbox', 'Hộp thư'], ['status', 'Trạng thái']].forEach(function (item) {
      var b = el('button', tab === item[0] ? 'on' : '', item[1]);
      b.addEventListener('click', function () { tab = item[0]; render(); });
      side.appendChild(b);
    });
    var main = el('section', 'card main');
    if (!data.durable) {
      main.appendChild(el('div', 'banner', 'Chưa ghi được ra GitHub/KV. Đặt secret GITHUB_TOKEN (quyền contents) để lưu bền. Bản đang mở chỉ nằm trong bộ nhớ worker.'));
    }
    if (tab === 'notes') renderNotes(main);
    if (tab === 'links') renderLinks(main);
    if (tab === 'guest') renderGuest(main);
    if (tab === 'inbox') renderInbox(main);
    if (tab === 'status') renderStatus(main);
    layout.appendChild(side);
    layout.appendChild(main);
    app.appendChild(layout);
  }

  function save(body, done) {
    fetch('/my/admin/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error((res.j && res.j.error) || 'Lưu thất bại');
        data = res.j;
        if (done) done();
        render();
      }).catch(function (e) { alert(e.message); });
  }

  function renderNotes(main) {
    main.appendChild(el('h1', null, 'Ghi chú'));
    var list = el('div', 'list');
    var add = el('button', 'btn', 'Ghi chú mới');
    add.addEventListener('click', function () { selected = ''; render(); });
    main.appendChild(add);
    (data.notes || []).forEach(function (n) {
      var b = el('button', 'item' + (selected === n.slug ? ' on' : ''));
      b.appendChild(el('b', null, n.title));
      b.appendChild(el('span', 'meta', n.slug + ' · ' + n.date + (n.published === false ? ' · ẩn' : '')));
      b.addEventListener('click', function () { selected = n.slug; render(); });
      list.appendChild(b);
    });
    main.appendChild(list);
    var current = (data.notes || []).filter(function (n) { return n.slug === selected; })[0] || {
      slug: '', title: '', date: new Date().toISOString().slice(0, 10), body: '', published: true
    };
    var title = el('input'); title.value = current.title;
    var slug = el('input'); slug.value = current.slug;
    var date = el('input'); date.type = 'date'; date.value = (current.date || '').slice(0, 10);
    var body = el('textarea'); body.value = current.body || '';
    var pub = el('input'); pub.type = 'checkbox'; pub.checked = current.published !== false;
    var pubLabel = el('label', 'check', 'Công khai');
    pubLabel.prepend(pub);
    main.appendChild(field('Tiêu đề', title));
    main.appendChild(field('Slug', slug));
    main.appendChild(field('Ngày', date));
    main.appendChild(pubLabel);
    main.appendChild(field('Markdown', body));
    var actions = el('div', 'row');
    actions.style.marginTop = '14px';
    var saveBtn = el('button', 'btn primary', 'Lưu');
    saveBtn.addEventListener('click', function () {
      save({
        kind: 'note',
        slug: slug.value,
        title: title.value,
        date: date.value,
        body: body.value,
        published: pub.checked
      }, function () { selected = slug.value || selected; });
    });
    actions.appendChild(saveBtn);
    if (current.slug) {
      var del = el('button', 'btn warn', 'Xóa');
      del.addEventListener('click', function () {
        if (!confirm('Xóa ghi chú này?')) return;
        selected = '';
        save({ kind: 'note-delete', slug: current.slug });
      });
      actions.appendChild(del);
    }
    main.appendChild(actions);
  }

  function renderGuest(main) {
    main.appendChild(el('h1', null, 'Guestbook'));
    var list = data.guestbook || [];
    if (!list.length) main.appendChild(el('p', 'sub', 'Chưa có lời nhắn.'));
    list.forEach(function (g) {
      var box = el('div', 'item');
      box.appendChild(el('b', null, g.name + (g.hidden ? ' · ẩn' : '')));
      box.appendChild(el('div', 'meta', g.createdAt || ''));
      box.appendChild(el('div', 'msg', g.message));
      var actions = el('div', 'row');
      actions.style.marginTop = '8px';
      var hide = el('button', 'btn', g.hidden ? 'Hiện' : 'Ẩn');
      hide.addEventListener('click', function () { save({ kind: 'guest-hide', id: g.id, hidden: !g.hidden }); });
      var del = el('button', 'btn warn', 'Xóa');
      del.addEventListener('click', function () { save({ kind: 'guest-delete', id: g.id }); });
      actions.appendChild(hide);
      actions.appendChild(del);
      box.appendChild(actions);
      main.appendChild(box);
    });
  }

  function renderInbox(main) {
    main.appendChild(el('h1', null, 'Hộp thư'));
    var list = data.messages || [];
    if (!list.length) main.appendChild(el('p', 'sub', 'Chưa có thư từ form liên hệ.'));
    list.forEach(function (m) {
      var box = el('div', 'item');
      box.appendChild(el('b', null, m.name || 'Khách'));
      box.appendChild(el('div', 'meta', (m.email || '') + ' · ' + (m.createdAt || '')));
      box.appendChild(el('div', 'msg', m.message));
      var del = el('button', 'btn warn', 'Xóa');
      del.style.marginTop = '8px';
      del.addEventListener('click', function () { save({ kind: 'message-delete', id: m.id }); });
      box.appendChild(del);
      main.appendChild(box);
    });
  }

  function renderStatus(main) {
    main.appendChild(el('h1', null, 'Trạng thái'));
    var avail = el('select');
    [['available', 'Available'], ['busy', 'Busy']].forEach(function (opt) {
      var o = el('option', null, opt[1]);
      o.value = opt[0];
      if (data.availability === opt[0]) o.selected = true;
      avail.appendChild(o);
    });
    var now = el('input');
    now.value = data.now || '';
    now.maxLength = 180;
    main.appendChild(field('Badge', avail));
    main.appendChild(field('Đang làm gì', now));
    var btn = el('button', 'btn primary', 'Lưu trạng thái');
    btn.style.marginTop = '14px';
    btn.addEventListener('click', function () {
      save({ kind: 'status', availability: avail.value, now: now.value });
    });
    main.appendChild(btn);
  }

  function renderLinks(main) {
    main.appendChild(el('h1', null, 'Shortlinks'));
    main.appendChild(el('p', 'sub', 'Đường dẫn công khai là /l/tên. Bật màn hình chuyển hướng thì vào link sẽ thấy animation rồi mới mở. Tắt thì vào là chuyển ngay.'));
    var list = el('div', 'list');
    var links = data.links || [];
    if (!links.length) list.appendChild(el('p', 'sub', 'Chưa có shortlink.'));
    links.forEach(function (link) {
      var box = el('div', 'item' + (selectedLink === link.slug ? ' on' : ''));
      box.appendChild(el('b', null, '/l/' + link.slug));
      if (link.label) box.appendChild(el('div', 'meta', link.label));
      box.appendChild(el('div', 'url', link.url));
      var pills = el('div', 'pills');
      pills.appendChild(el('span', 'pill' + (link.animate ? ' on' : ''), link.animate ? 'Có animation' : 'Chuyển ngay'));
      box.appendChild(pills);
      var actions = el('div', 'row');
      actions.style.marginTop = '8px';
      var edit = el('button', 'btn', 'Sửa');
      edit.addEventListener('click', function () { selectedLink = link.slug; render(); });
      var toggle = el('button', 'btn', link.animate ? 'Tắt animation' : 'Bật animation');
      toggle.addEventListener('click', function () {
        save({ kind: 'link', slug: link.slug, previous: link.slug, url: link.url, label: link.label || '', animate: !link.animate });
      });
      var copy = el('button', 'btn', 'Copy');
      copy.addEventListener('click', function () {
        var pub = location.origin + '/l/' + encodeURIComponent(link.slug);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(pub).then(function () { copy.textContent = 'Đã chép'; });
        } else {
          copy.textContent = pub;
        }
      });
      var open = el('a', 'btn', 'Mở');
      open.href = '/l/' + encodeURIComponent(link.slug);
      open.target = '_blank';
      open.rel = 'noopener';
      var del = el('button', 'btn warn', 'Xóa');
      del.addEventListener('click', function () {
        if (!confirm('Xóa /l/' + link.slug + '?')) return;
        if (selectedLink === link.slug) selectedLink = '';
        save({ kind: 'link-delete', slug: link.slug });
      });
      actions.appendChild(edit);
      actions.appendChild(toggle);
      actions.appendChild(copy);
      actions.appendChild(open);
      actions.appendChild(del);
      box.appendChild(actions);
      list.appendChild(box);
    });
    main.appendChild(list);

    var current = links.filter(function (link) { return link.slug === selectedLink; })[0] || {
      slug: '', url: '', label: '', animate: false
    };
    var name = el('input');
    name.value = current.slug;
    name.placeholder = 'github';
    name.maxLength = 64;
    name.autocomplete = 'off';
    name.spellcheck = false;
    var dest = el('input');
    dest.value = current.url;
    dest.placeholder = 'https://';
    dest.inputMode = 'url';
    var label = el('input');
    label.value = current.label || '';
    label.placeholder = 'GitHub';
    label.maxLength = 80;
    var animate = el('input');
    animate.type = 'checkbox';
    animate.checked = !!current.animate;
    var animateLabel = el('label', 'check', 'Bật màn hình chuyển hướng');
    animateLabel.prepend(animate);
    var preview = el('div', 'preview', location.origin + '/l/' + (current.slug || 'ten'));
    name.addEventListener('input', function () {
      preview.textContent = location.origin + '/l/' + (name.value.trim() || 'ten');
    });
    main.appendChild(field('Tên', name));
    main.appendChild(preview);
    main.appendChild(field('URL đích', dest));
    main.appendChild(field('Nhãn trên màn hình', label));
    main.appendChild(animateLabel);
    var actions = el('div', 'row');
    actions.style.marginTop = '14px';
    var saveBtn = el('button', 'btn primary', current.slug ? 'Lưu shortlink' : 'Tạo shortlink');
    saveBtn.addEventListener('click', function () {
      var next = name.value.trim();
      save({
        kind: 'link',
        slug: next,
        previous: current.slug || '',
        url: dest.value,
        label: label.value,
        animate: animate.checked
      }, function () { selectedLink = next; });
    });
    actions.appendChild(saveBtn);
    var fresh = el('button', 'btn', 'Tạo mới');
    fresh.addEventListener('click', function () { selectedLink = ''; render(); });
    actions.appendChild(fresh);
    main.appendChild(actions);
  }

  logoutBtn.addEventListener('click', function () {
    fetch('/my/admin/logout', { method: 'POST' }).then(function () {
      AUTHED = false;
      showLogin();
    });
  });
  boot();
})();
</script>
</body>
</html>`;
}
