export const CLIENT_B = `
  var termState = { history: [], hIdx: 0, draft: '' };
  try { termState.history = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch (e) { termState.history = []; }
  termState.hIdx = termState.history.length;
  var cwd = '~';

  function persistHist() {
    try { localStorage.setItem(HIST_KEY, JSON.stringify(termState.history.slice(-200))); } catch (e) { /* ignore */ }
  }
  function fsPath(path) {
    if (!path || path === '~' || path === '/') return '~';
    if (path.indexOf('~/') === 0) return path;
    if (cwd === '~') return '~/' + path.replace(/^\\/+/, '');
    return cwd.replace(/\\/$/, '') + '/' + path;
  }
  function listDir(path) {
    if (path === '~') return ['about.txt', 'contact.txt', 'projects/', 'notes/'];
    if (path === '~/projects') return CFG.projects.map(function (p) { return p.name; });
    if (path === '~/notes') return (siteData.notes || []).map(function (n) { return n.slug; });
    return null;
  }
  function readFile(path) {
    if (path === '~/about.txt' || path === 'about.txt') return CFG.name + '\\n' + CFG.role + '\\n' + CFG.location;
    if (path === '~/contact.txt' || path === 'contact.txt') return CFG.email + '\\nhttps://github.com/' + CFG.github;
    var note = path.replace(/^~\\/notes\\//, '');
    if (path.indexOf('~/notes/') === 0 || path.indexOf('notes/') === 0) {
      var slug = path.split('/').pop();
      var found = (siteData.notes || []).filter(function (n) { return n.slug === slug; })[0];
      return found ? found.title + '\\n' + (found.excerpt || '') : null;
    }
    var proj = CFG.projects.filter(function (p) { return p.name.toLowerCase() === note.toLowerCase() || path.endsWith('/' + p.name); })[0];
    if (proj) return proj.name + '\\n' + (proj.long || proj.description) + '\\n' + proj.site;
    return null;
  }
  function calcEval(expr) {
    var s = String(expr || '').replace(/\\s+/g, '');
    if (!s || !/^[\\d.+\\-*/%()]+$/.test(s)) throw new Error('bad expression');
    var i = 0;
    function peek() { return s.charAt(i); }
    function num() {
      var start = i;
      if (peek() === '-' || peek() === '+') i++;
      while (/[\\d.]/.test(peek())) i++;
      if (start === i) throw new Error('bad expression');
      return Number(s.slice(start, i));
    }
    function factor() {
      if (peek() === '(') { i++; var v = exprAdd(); if (peek() !== ')') throw new Error('bad expression'); i++; return v; }
      return num();
    }
    function term() {
      var v = factor();
      while (peek() === '*' || peek() === '/' || peek() === '%') {
        var op = peek(); i++;
        var r = factor();
        if (op === '*') v *= r; else if (op === '/') v /= r; else v %= r;
      }
      return v;
    }
    function exprAdd() {
      var v = term();
      while (peek() === '+' || peek() === '-') {
        var op = peek(); i++;
        var r = term();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    var out = exprAdd();
    if (i !== s.length || !isFinite(out)) throw new Error('bad expression');
    return out;
  }
  function cowsay(msg) {
    var text = msg || 'ankbui';
    var line = ' ' + new Array(text.length + 3).join('-');
    return [line, '< ' + text + ' >', line, '        \\\\   ^__^', '         \\\\  (oo)\\\\_______', '            (__)\\\\       )\\\\/\\\\', '                ||----w |', '                ||     ||'];
  }

  function renderTerminal(body) {
    var term = el('div', 'term');
    var out = el('div');
    term.appendChild(out);
    var row = el('div', 'term-input-row');
    var promptSpan = el('span');
    function paintPrompt() {
      promptSpan.textContent = '';
      promptSpan.appendChild(el('span', 'prompt', CFG.username + '@os'));
      promptSpan.appendChild(el('span', 'dim', ':'));
      promptSpan.appendChild(el('span', 'path', cwd));
      promptSpan.appendChild(el('span', 'dim', '$ '));
    }
    paintPrompt();
    var input = el('input', 'term-input');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'terminal input');
    var caret = el('span', 'term-caret');
    row.appendChild(promptSpan);
    row.appendChild(input);
    row.appendChild(caret);
    term.appendChild(row);
    body.appendChild(term);
    function sizeInput() { input.style.width = Math.max(1, input.value.length + 1) + 'ch'; }
    sizeInput();
    input.addEventListener('input', sizeInput);
    function scrollDown() { body.scrollTop = body.scrollHeight; }
    function print(text, cls) {
      String(text).split('\\n').forEach(function (bit) {
        var line = el('div', 'line ' + (cls || 'out'));
        line.textContent = bit;
        out.appendChild(line);
      });
      scrollDown();
    }
    function echoCmd(cmd) {
      var line = el('div', 'line');
      line.appendChild(el('span', 'prompt', CFG.username + '@os'));
      line.appendChild(el('span', 'dim', ':'));
      line.appendChild(el('span', 'path', cwd));
      line.appendChild(el('span', 'dim', '$ '));
      line.appendChild(el('span', 'out', cmd));
      out.appendChild(line);
    }
    var COMMANDS = {
      help: function () {
        print('help about projects notes guestbook github stats contact', 'dim');
        print('ls cd pwd cat echo open calc theme history neofetch date whoami clear', 'dim');
        print('matrix cowsay', 'dim');
      },
      about: function () { print(CFG.name); print(CFG.role); print(CFG.location); print(siteData.now || ''); },
      projects: function () { CFG.projects.forEach(function (p) { print(p.name + '  ' + p.status + '  ' + p.site, 'accent'); }); },
      notes: function () { openApp('notes'); (siteData.notes || []).forEach(function (n) { print(n.slug + '  ' + n.title); }); },
      guestbook: function () { openApp('guestbook'); },
      github: function () { openApp('github'); print('https://github.com/' + CFG.github, 'accent'); },
      stats: function () {
        if (!ghData) { print('fetching…', 'dim'); whenGh(function () { COMMANDS.stats(); }); return; }
        print('Repositories : ' + ghData.user.repos);
        print('Followers    : ' + ghData.user.followers);
        print('Stars        : ' + ghData.stars);
      },
      contact: function () { print(CFG.email); openApp('contact'); },
      clear: function () { out.textContent = ''; },
      date: function () { print(new Date().toString()); },
      whoami: function () { print(CFG.username); },
      pwd: function () { print(cwd); },
      ls: function (arg) {
        var target = arg ? fsPath(arg) : cwd;
        var items = listDir(target);
        if (!items) { print('ls: not a directory', 'err'); return; }
        print(items.join('  '));
      },
      cd: function (arg) {
        if (!arg || arg === '~') { cwd = '~'; paintPrompt(); return; }
        if (arg === '..') {
          var slash = cwd.lastIndexOf('/');
          cwd = slash === -1 ? '~' : cwd.slice(0, slash);
          paintPrompt();
          return;
        }
        var next = fsPath(arg).replace(/\\/$/, '');
        if (!listDir(next)) { print('cd: no such directory', 'err'); return; }
        cwd = next;
        paintPrompt();
      },
      cat: function (arg) {
        if (!arg) { print('cat: missing file', 'err'); return; }
        var text = readFile(fsPath(arg));
        if (text == null) print('cat: no such file', 'err'); else print(text);
      },
      echo: function (arg) { print(arg || ''); },
      open: function (arg) {
        if (!arg) { print('open: missing target', 'err'); return; }
        if (/^https?:\\/\\//.test(arg)) { window.open(arg, '_blank', 'noopener,noreferrer'); print(arg, 'accent'); return; }
        var id = arg.toLowerCase();
        if (APPS[id]) { openApp(id); print('opened ' + id, 'dim'); return; }
        var proj = CFG.projects.filter(function (p) { return p.name.toLowerCase() === id; })[0];
        if (proj) { window.open(proj.site, '_blank', 'noopener,noreferrer'); print(proj.site, 'accent'); return; }
        print('open: unknown target', 'err');
      },
      calc: function (arg) {
        try { print(String(calcEval(arg))); } catch (e) { print('calc: ' + e.message, 'err'); }
      },
      theme: function (arg) {
        if (!arg || arg === 'list') { print(WALLPAPERS.join('  ')); return; }
        if (arg === 'next') {
          prefs.wp = WALLPAPERS[(WALLPAPERS.indexOf(prefs.wp) + 1) % WALLPAPERS.length];
        } else if (WALLPAPERS.indexOf(arg) !== -1) prefs.wp = arg;
        else { print('theme: unknown wallpaper', 'err'); return; }
        savePrefs(); applyPrefs(); print('wallpaper ' + prefs.wp, 'accent');
      },
      history: function () { termState.history.forEach(function (h, i) { print(String(i + 1) + '  ' + h); }); },
      neofetch: function () {
        print('ANKBUI OS ' + (CFG.version || ''), 'accent');
        print('User         : ' + CFG.username);
        print('Role         : ' + CFG.role);
        print('Availability : ' + (siteData.availability || 'available'));
        print('Projects     : ' + CFG.projects.length);
        print('Notes        : ' + (siteData.notes || []).length);
        print('Repos        : ' + (ghData ? ghData.user.repos : 'n/a'));
        print('Stars        : ' + (ghData ? ghData.stars : 'n/a'));
      },
      matrix: function () {
        var glyphs = '01アイウエオカキクケコ';
        for (var r = 0; r < 8; r++) {
          var line = '';
          for (var c = 0; c < 42; c++) line += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
          print(line, 'accent');
        }
        print('wake up, ' + CFG.username + '.', 'dim');
      },
      cowsay: function (arg) { cowsay(arg).forEach(function (line) { print(line); }); }
    };
    function run(raw) {
      var cmd = raw.trim();
      echoCmd(cmd);
      if (cmd) {
        termState.history.push(cmd);
        persistHist();
        var bits = cmd.split(/\\s+/);
        var name = bits[0].toLowerCase();
        var arg = bits.slice(1).join(' ');
        if (COMMANDS[name]) COMMANDS[name](arg);
        else { print('command not found: ' + name, 'err'); print("type 'help'", 'dim'); }
      }
      termState.hIdx = termState.history.length;
      termState.draft = '';
      scrollDown();
    }
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        run(input.value);
        input.value = '';
        sizeInput();
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        if (termState.hIdx > 0) {
          if (termState.hIdx === termState.history.length) termState.draft = input.value;
          termState.hIdx--;
          input.value = termState.history[termState.hIdx];
          sizeInput();
        }
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        if (termState.hIdx < termState.history.length) {
          termState.hIdx++;
          input.value = termState.hIdx === termState.history.length ? termState.draft : termState.history[termState.hIdx];
          sizeInput();
        }
      } else if (ev.key === 'Tab') {
        ev.preventDefault();
        var parts = input.value.split(/\\s+/);
        var head = parts[0].toLowerCase();
        var pool = Object.keys(COMMANDS);
        if (parts.length > 1) {
          if (head === 'open') pool = Object.keys(APPS).concat(CFG.projects.map(function (p) { return p.name; }));
          else if (head === 'theme') pool = WALLPAPERS.concat(['next', 'list']);
          else if (head === 'cd') pool = ['projects', 'notes', '..', '~'];
          else if (head === 'cat') pool = ['about.txt', 'contact.txt'].concat((siteData.notes || []).map(function (n) { return 'notes/' + n.slug; }));
          else return;
          var cur = parts[parts.length - 1].toLowerCase();
          var matches = pool.filter(function (c) { return c.toLowerCase().indexOf(cur) === 0; });
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            input.value = parts.join(' ');
            sizeInput();
          } else if (matches.length > 1) print(matches.join('  '), 'dim');
          return;
        }
        var matches2 = pool.filter(function (c) { return c.indexOf(head) === 0; });
        if (matches2.length === 1) { input.value = matches2[0] + ' '; sizeInput(); }
        else if (matches2.length > 1) print(matches2.join('  '), 'dim');
      }
    });
    term.addEventListener('mouseup', function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) input.focus();
    });
    print(CFG.os + ' — type help', 'dim');
    setTimeout(function () { input.focus(); }, 40);
  }

  var APPS = {
    about: { title: 'About', label: 'About', color: '#6aa6ff', w: 480, h: 540, render: renderAbout },
    projects: { title: 'Projects', label: 'Projects', color: '#f6b35c', w: 620, h: 600, render: renderProjects },
    notes: { title: 'Notes', label: 'Notes', color: '#c7b6ff', w: 560, h: 560, render: renderNotes },
    github: { title: 'GitHub', label: 'GitHub', color: '#c9d3e3', w: 680, h: 680, render: renderGithub },
    terminal: { title: CFG.username + '@os', label: 'Terminal', color: '#7ee39c', w: 680, h: 460, render: renderTerminal },
    guestbook: { title: 'Guestbook', label: 'Guestbook', color: '#ff9ec4', w: 480, h: 560, render: renderGuestbook },
    contact: { title: 'Contact', label: 'Contact', color: '#5ad3c3', w: 460, h: 560, render: renderContact },
    settings: { title: 'Settings', label: 'Settings', color: '#aab4c5', w: 500, h: 520, render: renderSettings }
  };
  var DOCK_ORDER = ['about', 'projects', 'notes', 'github', 'terminal', 'guestbook', 'contact'];
  var ICON_ORDER = ['about', 'projects', 'notes', 'github', 'terminal', 'guestbook', 'contact', 'settings'];
  var wins = {};
  var zTop = 20;
  var openCount = 0;
  var termSeq = 0;
  var desktop = document.getElementById('desktop');
  var mbApp = document.getElementById('mb-app');
  var snapGhost = document.getElementById('snapghost');

  function setMbApp(label) { if (mbApp) mbApp.textContent = label || 'Desktop'; }
  function focusWin(id) {
    for (var wid in wins) wins[wid].el.classList.remove('focused');
    var w = wins[id];
    if (!w || w.space !== currentSpace) return;
    w.el.classList.add('focused');
    zTop += 1;
    w.el.style.zIndex = String(zTop);
    setMbApp(w.label);
  }
  function focusTopWindow() {
    var bestId = null, bestZ = -1;
    for (var wid in wins) {
      if (wins[wid].min || wins[wid].space !== currentSpace) continue;
      var z = parseInt(wins[wid].el.style.zIndex || '0', 10);
      if (z > bestZ) { bestZ = z; bestId = wid; }
    }
    if (bestId) focusWin(bestId); else setMbApp('Desktop ' + (currentSpace + 1));
  }
  function windowsFor(appId, spaceOnly) {
    var ids = [];
    for (var id in wins) {
      if (wins[id].appId !== appId) continue;
      if (spaceOnly && wins[id].space !== currentSpace) continue;
      ids.push(id);
    }
    return ids;
  }
  function updateDock() {
    document.querySelectorAll('.dock-app').forEach(function (b) {
      var id = b.getAttribute('data-app');
      if (!id || !APPS[id]) return;
      b.classList.toggle('open', windowsFor(id, true).length > 0);
    });
  }
  function closeWin(id) {
    var w = wins[id];
    if (!w) return;
    delete wins[id];
    updateDock();
    var done = function () { if (w.el.parentNode) w.el.parentNode.removeChild(w.el); focusTopWindow(); };
    if (motionOff()) { done(); return; }
    w.el.classList.add('closing');
    setTimeout(done, 200);
  }
  function minimizeWin(id) {
    var w = wins[id];
    if (!w || w.min) return;
    w.min = true;
    w.el.style.display = 'none';
    focusTopWindow();
  }
  function restoreWin(id) {
    var w = wins[id];
    if (!w) return;
    if (w.space !== currentSpace) setSpace(w.space);
    w.min = false;
    w.el.style.display = '';
    w.el.classList.remove('offspace');
    focusWin(id);
  }
  function toggleMax(id) {
    var w = wins[id];
    if (w) w.el.classList.toggle('maxed');
  }
  function workArea() {
    return { l: 10, t: MB_H + 8, w: window.innerWidth - 20, h: window.innerHeight - MB_H - 108 };
  }
  function ghostRect(zone) {
    var a = workArea();
    var hw = Math.round(a.w / 2 - 6);
    var hh = Math.round(a.h / 2 - 6);
    if (zone === 'left') return { l: a.l, t: a.t, w: hw, h: a.h };
    if (zone === 'right') return { l: a.l + a.w - hw, t: a.t, w: hw, h: a.h };
    if (zone === 'top') return { l: a.l, t: a.t, w: a.w, h: a.h };
    if (zone === 'bottom') return { l: a.l, t: a.t + Math.round(a.h / 2) + 4, w: a.w, h: hh };
    if (zone === 'tl') return { l: a.l, t: a.t, w: hw, h: hh };
    if (zone === 'tr') return { l: a.l + a.w - hw, t: a.t, w: hw, h: hh };
    if (zone === 'bl') return { l: a.l, t: a.t + a.h - hh, w: hw, h: hh };
    return { l: a.l + a.w - hw, t: a.t + a.h - hh, w: hw, h: hh };
  }
  function showGhost(zone) {
    var r = ghostRect(zone);
    snapGhost.style.left = r.l + 'px';
    snapGhost.style.top = r.t + 'px';
    snapGhost.style.width = r.w + 'px';
    snapGhost.style.height = r.h + 'px';
    snapGhost.classList.add('show');
  }
  function hideGhost() { snapGhost.classList.remove('show'); }
  function applySnap(win, zone) {
    var r = ghostRect(zone);
    win.classList.remove('maxed');
    if (zone === 'top') { win.classList.add('maxed'); return; }
    win.style.left = r.l + 'px';
    win.style.top = r.t + 'px';
    win.style.width = r.w + 'px';
    win.style.height = r.h + 'px';
  }
  function zoneAt(x, y) {
    var vw = window.innerWidth, vh = window.innerHeight, edge = 18, corner = 72;
    var nearL = x <= edge, nearR = x >= vw - edge, nearT = y <= MB_H + 8, nearB = y >= vh - 18;
    var cL = x <= corner, cR = x >= vw - corner, cT = y <= MB_H + corner, cB = y >= vh - corner;
    if ((nearL || nearT) && cL && cT) return 'tl';
    if ((nearR || nearT) && cR && cT) return 'tr';
    if ((nearL || nearB) && cL && cB) return 'bl';
    if ((nearR || nearB) && cR && cB) return 'br';
    if (nearL) return 'left';
    if (nearR) return 'right';
    if (nearT) return 'top';
    if (nearB) return 'bottom';
    return null;
  }
  function attachResize(win) {
    ['r', 'b', 'br'].forEach(function (dir) {
      var h = el('div', 'rz rz-' + dir);
      win.appendChild(h);
      h.addEventListener('pointerdown', function (ev) {
        if (isMobile()) return;
        ev.preventDefault();
        ev.stopPropagation();
        var rect = win.getBoundingClientRect();
        var sx = ev.clientX, sy = ev.clientY;
        function onMove(e) {
          if (dir === 'r' || dir === 'br') win.style.width = Math.max(300, rect.width + (e.clientX - sx)) + 'px';
          if (dir === 'b' || dir === 'br') win.style.height = Math.max(220, rect.height + (e.clientY - sy)) + 'px';
        }
        function onUp() {
          h.removeEventListener('pointermove', onMove);
          h.removeEventListener('pointerup', onUp);
        }
        h.addEventListener('pointermove', onMove);
        h.addEventListener('pointerup', onUp);
      });
    });
  }
  function openInstance(id, appId) {
    if (wins[id]) { restoreWin(id); return; }
    var app = APPS[appId];
    if (!app) return;
    var win = el('div', 'window win-' + appId);
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', app.label);
    var bar = el('div', 'titlebar');
    var tico = el('span', 't-ico');
    tico.innerHTML = ICONS[appId];
    tico.style.color = app.color;
    bar.appendChild(tico);
    bar.appendChild(el('span', 't-title', app.title));
    var btns = el('div', 'wbtns');
    var bMin = el('button', 'wbtn min', '–');
    var bMax = el('button', 'wbtn max', '□');
    var bClose = el('button', 'wbtn close', '×');
    bMin.setAttribute('aria-label', 'Minimize');
    bMax.setAttribute('aria-label', 'Maximize');
    bClose.setAttribute('aria-label', 'Close');
    btns.appendChild(bMin); btns.appendChild(bMax); btns.appendChild(bClose);
    bar.appendChild(btns);
    win.appendChild(bar);
    var bodyEl = el('div', 'wbody');
    win.appendChild(bodyEl);
    if (!isMobile()) {
      var ww = Math.min(app.w, window.innerWidth - 40);
      var wh = Math.min(app.h, window.innerHeight - 130);
      var offset = (openCount % 6) * 26;
      win.style.width = ww + 'px';
      win.style.height = wh + 'px';
      win.style.left = Math.max(12, Math.round((window.innerWidth - ww) / 2 - 40 + offset)) + 'px';
      win.style.top = Math.max(MB_H + 10, Math.round((window.innerHeight - wh) / 2 - 30 + offset)) + 'px';
      attachResize(win);
    }
    openCount++;
    desktop.appendChild(win);
    wins[id] = { el: win, min: false, space: currentSpace, appId: appId, label: app.label };
    app.render(bodyEl);
    focusWin(id);
    updateDock();
    if (!motionOff()) {
      win.classList.add('opening');
      setTimeout(function () { win.classList.remove('opening'); }, 280);
    }
    win.addEventListener('pointerdown', function () { focusWin(id); });
    bClose.addEventListener('click', function (ev) { ev.stopPropagation(); closeWin(id); });
    bMin.addEventListener('click', function (ev) { ev.stopPropagation(); minimizeWin(id); });
    bMax.addEventListener('click', function (ev) { ev.stopPropagation(); toggleMax(id); });
    bar.addEventListener('dblclick', function (ev) { if (!ev.target.closest('.wbtn') && !isMobile()) toggleMax(id); });
    bar.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('.wbtn') || isMobile()) return;
      var startX = ev.clientX, startY = ev.clientY, moved = false, zone = null;
      var wasMaxed = win.classList.contains('maxed');
      var rect = win.getBoundingClientRect();
      function onMove(e) {
        var dx = e.clientX - startX, dy = e.clientY - startY;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
        if (!moved && wasMaxed) {
          win.classList.remove('maxed');
          win.style.width = Math.min(app.w, window.innerWidth - 40) + 'px';
          rect = win.getBoundingClientRect();
          startX = e.clientX; startY = e.clientY; dx = 0; dy = 0;
        }
        moved = true;
        win.style.left = Math.min(Math.max(rect.left + dx, -rect.width + 80), window.innerWidth - 80) + 'px';
        win.style.top = Math.min(Math.max(rect.top + dy, MB_H), window.innerHeight - 50) + 'px';
        zone = zoneAt(e.clientX, e.clientY);
        if (zone) showGhost(zone); else hideGhost();
      }
      function onUp() {
        bar.removeEventListener('pointermove', onMove);
        bar.removeEventListener('pointerup', onUp);
        hideGhost();
        if (moved && zone) applySnap(win, zone);
      }
      bar.addEventListener('pointermove', onMove);
      bar.addEventListener('pointerup', onUp);
    });
  }
  function openApp(id) { openInstance(id, id); }
  function newTerminal() {
    termSeq += 1;
    openInstance('terminal-' + termSeq, 'terminal');
  }
  function dockActivate(appId) {
    var here = windowsFor(appId, true);
    if (!here.length) {
      var any = windowsFor(appId, false);
      if (any.length) { setSpace(wins[any[any.length - 1]].space); restoreWin(any[any.length - 1]); return; }
      if (appId === 'terminal') newTerminal(); else openApp(appId);
      return;
    }
    var id = here[here.length - 1];
    var w = wins[id];
    if (w.min) restoreWin(id);
    else if (w.el.classList.contains('focused')) minimizeWin(id);
    else focusWin(id);
  }

  (function buildChrome() {
    var icons = document.getElementById('icons');
    ICON_ORDER.forEach(function (id) {
      var b = el('button', 'dicon');
      b.appendChild(tileEl(id));
      b.appendChild(el('span', 'label', APPS[id].label));
      b.addEventListener('click', function () { if (id === 'terminal') dockActivate('terminal'); else openApp(id); });
      icons.appendChild(b);
    });
    var dock = document.getElementById('dock');
    var sep = dock.querySelector('.dock-sep');
    function dockBtn(id, label, action) {
      var b = el('button', 'dock-app');
      b.setAttribute('data-app', id);
      b.setAttribute('aria-label', label);
      b.appendChild(tileEl(id));
      b.appendChild(el('span', 'dot'));
      b.appendChild(el('span', 'tip', label));
      b.addEventListener('click', action);
      return b;
    }
    DOCK_ORDER.forEach(function (id) {
      dock.insertBefore(dockBtn(id, APPS[id].label, function () { dockActivate(id); }), sep);
    });
    dock.appendChild(dockBtn('launchpad', 'Launchpad', function () { toggleLaunch(); }));
    dock.appendChild(dockBtn('settings', 'Settings', function () { dockActivate('settings'); }));
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      dock.classList.add('mag');
      dock.addEventListener('pointermove', function (ev) {
        dock.querySelectorAll('.dock-app').forEach(function (b) {
          var r = b.getBoundingClientRect();
          var dist = Math.abs(ev.clientX - (r.left + r.width / 2));
          var t = Math.max(0, 1 - dist / 150);
          var scale = 1 + t * t * 0.62;
          b.style.transform = 'translateY(' + (-t * t * 16) + 'px) scale(' + scale.toFixed(3) + ')';
        });
      });
      dock.addEventListener('pointerleave', function () {
        dock.querySelectorAll('.dock-app').forEach(function (b) { b.style.transform = ''; });
      });
    }
  })();

  function toggleLaunch() {
    var lp = document.getElementById('launchpad');
    if (lp.classList.contains('show')) { lp.classList.remove('show'); lp.setAttribute('aria-hidden', 'true'); return; }
    lp.classList.add('show');
    lp.setAttribute('aria-hidden', 'false');
    lp.textContent = '';
    var box = el('div', 'lp-box');
    var search = el('input');
    search.id = 'lp-search';
    search.placeholder = 'Launchpad';
    var grid = el('div', 'lp-grid');
    function paint() {
      grid.textContent = '';
      var q = search.value.trim().toLowerCase();
      ICON_ORDER.forEach(function (id) {
        if (q && APPS[id].label.toLowerCase().indexOf(q) === -1) return;
        var b = el('button', 'lp-app');
        b.appendChild(tileEl(id));
        b.appendChild(el('span', 'label', APPS[id].label));
        b.addEventListener('click', function () { toggleLaunch(); if (id === 'terminal') newTerminal(); else openApp(id); });
        grid.appendChild(b);
      });
    }
    search.addEventListener('input', paint);
    box.appendChild(search);
    box.appendChild(grid);
    lp.appendChild(box);
    paint();
    setTimeout(function () { search.focus(); }, 20);
    lp.addEventListener('click', function (ev) { if (ev.target === lp) toggleLaunch(); });
  }

  function showLock() {
    if (locked || !booted) return;
    locked = true;
    var lock = document.getElementById('lock');
    lock.classList.add('show');
    lock.textContent = '';
    var card = el('div', 'lock-card');
    var img = el('img');
    setAvatar(img);
    card.appendChild(img);
    card.appendChild(el('div', null, CFG.name));
    var time = el('div', 'lock-time', document.getElementById('clock').textContent);
    time.id = 'lock-time';
    card.appendChild(time);
    var date = el('div', 'lock-date');
    date.id = 'lock-date';
    card.appendChild(date);
    card.appendChild(el('div', 'lock-hint', 'Click or press any key'));
    lock.appendChild(card);
    renderClock();
  }
  function hideLock() {
    locked = false;
    var lock = document.getElementById('lock');
    if (lock) lock.classList.remove('show');
    bumpIdle();
  }
  function bumpIdle() {
    clearTimeout(idleTimer);
    if (!prefs.lockMin || locked || !booted) return;
    idleTimer = setTimeout(showLock, prefs.lockMin * 60000);
  }

  var clockBtn = document.getElementById('clock');
  var datepop = document.getElementById('datepop');
  function renderClock() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var mm = (m < 10 ? '0' : '') + m;
    var text = prefs.clock24 ? ((h < 10 ? '0' : '') + h + ':' + mm) : ((h % 12 || 12) + ':' + mm + (h >= 12 ? ' PM' : ' AM'));
    clockBtn.textContent = text;
    var wc = document.getElementById('widget-clock');
    if (wc) wc.textContent = text;
    var wd = document.getElementById('widget-date');
    var pretty = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    if (wd) wd.textContent = pretty;
    var lt = document.getElementById('lock-time');
    if (lt) lt.textContent = text;
    var ld = document.getElementById('lock-date');
    if (ld) ld.textContent = pretty;
  }
  renderClock();
  setInterval(renderClock, 1000);
  clockBtn.addEventListener('click', function (ev) {
    ev.stopPropagation();
    datepop.querySelector('.big').textContent = clockBtn.textContent;
    datepop.querySelector('.small').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    datepop.classList.toggle('show');
  });

  var ctx = document.getElementById('ctx');
  function ctxItem(iconKey, label, act) {
    var b = el('button', 'ctx-item');
    var ic = el('span');
    ic.innerHTML = ICONS[iconKey] || '';
    b.appendChild(ic);
    b.appendChild(el('span', null, label));
    b.addEventListener('click', function () { ctx.classList.remove('show'); act(); });
    return b;
  }
  desktop.addEventListener('contextmenu', function (ev) {
    if (ev.target.closest('.window')) return;
    ev.preventDefault();
    ctx.textContent = '';
    ctx.appendChild(ctxItem('terminal', 'New Terminal', newTerminal));
    ctx.appendChild(ctxItem('launchpad', 'Launchpad', toggleLaunch));
    ctx.appendChild(ctxItem('lock', 'Lock screen', showLock));
    ctx.appendChild(ctxItem('refresh', 'Refresh GitHub', refreshGh));
    ctx.appendChild(el('div', 'ctx-sep'));
    ctx.appendChild(ctxItem('wallpaper', 'Next wallpaper', function () {
      prefs.wp = WALLPAPERS[(WALLPAPERS.indexOf(prefs.wp) + 1) % WALLPAPERS.length];
      savePrefs(); applyPrefs();
    }));
    ctx.appendChild(ctxItem('settings', 'Settings', function () { openApp('settings'); }));
    ctx.classList.add('show');
    ctx.style.left = Math.min(ev.clientX, window.innerWidth - 220) + 'px';
    ctx.style.top = Math.min(ev.clientY, window.innerHeight - 240) + 'px';
  });
  document.addEventListener('pointerdown', function (ev) {
    if (!ctx.contains(ev.target)) ctx.classList.remove('show');
    var panel = document.getElementById('notifs');
    var bell = document.getElementById('bell');
    if (panel.classList.contains('show') && !panel.contains(ev.target) && ev.target !== bell && !bell.contains(ev.target)) {
      panel.classList.remove('show');
      bell.classList.remove('on');
    }
  });

  var palette = document.getElementById('palette');
  var palInput = document.getElementById('pal-input');
  var palList = document.getElementById('pal-list');
  var palItems = [];
  var palSel = 0;
  var PAL_SOURCE = ICON_ORDER.map(function (id) {
    return { app: id, label: APPS[id].label, hint: 'App', act: function () { if (id === 'terminal') newTerminal(); else openApp(id); } };
  }).concat([
    { plain: 'launchpad', label: 'Launchpad', hint: 'View', act: toggleLaunch },
    { plain: 'lock', label: 'Lock screen', hint: 'View', act: showLock },
    { plain: 'terminal', label: 'New Terminal', hint: 'App', act: newTerminal },
    { plain: 'wallpaper', label: 'Next wallpaper', hint: 'Action', act: function () {
      prefs.wp = WALLPAPERS[(WALLPAPERS.indexOf(prefs.wp) + 1) % WALLPAPERS.length];
      savePrefs(); applyPrefs();
    } },
    { plain: 'refresh', label: 'Refresh GitHub stats', hint: 'Action', act: refreshGh }
  ]);
  function palRender() {
    var q = palInput.value.trim().toLowerCase();
    palItems = PAL_SOURCE.filter(function (it) { return !q || it.label.toLowerCase().indexOf(q) !== -1; });
    if (palSel >= palItems.length) palSel = 0;
    palList.textContent = '';
    if (!palItems.length) { palList.appendChild(el('div', 'pal-empty', 'Nothing found')); return; }
    palItems.forEach(function (it, i) {
      var b = el('button', 'pal-item' + (i === palSel ? ' sel' : ''));
      if (it.app) b.appendChild(tileEl(it.app));
      else {
        var pi = el('span', 'pi-plain');
        pi.innerHTML = ICONS[it.plain] || '';
        b.appendChild(pi);
      }
      b.appendChild(el('span', null, it.label));
      b.appendChild(el('span', 'pk', it.hint));
      b.addEventListener('click', function () { palette.classList.remove('show'); it.act(); });
      palList.appendChild(b);
    });
  }
  function palOpen() { palette.classList.add('show'); palInput.value = ''; palSel = 0; palRender(); setTimeout(function () { palInput.focus(); }, 20); }
  palInput.addEventListener('input', function () { palSel = 0; palRender(); });
  palInput.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); palSel = Math.min(palSel + 1, palItems.length - 1); palRender(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); palSel = Math.max(palSel - 1, 0); palRender(); }
    else if (ev.key === 'Enter' && palItems[palSel]) { ev.preventDefault(); palette.classList.remove('show'); palItems[palSel].act(); }
  });
  palette.addEventListener('click', function (ev) { if (ev.target === palette) palette.classList.remove('show'); });

  document.getElementById('mb-brand').addEventListener('click', toggleLaunch);
  document.getElementById('bell').addEventListener('click', function (ev) { ev.stopPropagation(); toggleNotifs(); });
  document.getElementById('avail').addEventListener('click', function () { openApp('about'); });
  document.getElementById('lock').addEventListener('pointerdown', hideLock);

  document.addEventListener('keydown', function (ev) {
    if (locked) { hideLock(); return; }
    bumpIdle();
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K')) {
      ev.preventDefault();
      if (palette.classList.contains('show')) palette.classList.remove('show'); else palOpen();
    } else if (ev.altKey && ev.ctrlKey && ev.key === 'ArrowRight') { ev.preventDefault(); setSpace(currentSpace + 1); }
    else if (ev.altKey && ev.ctrlKey && ev.key === 'ArrowLeft') { ev.preventDefault(); setSpace(currentSpace - 1); }
    else if (ev.key === 'Escape') {
      palette.classList.remove('show');
      document.getElementById('launchpad').classList.remove('show');
      document.getElementById('notifs').classList.remove('show');
      datepop.classList.remove('show');
      ctx.classList.remove('show');
    }
  });
  ['pointerdown', 'wheel'].forEach(function (name) {
    document.addEventListener(name, bumpIdle, { passive: true });
  });

  (function spotlight() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var raf = null;
    document.addEventListener('mousemove', function (ev) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        document.documentElement.style.setProperty('--mx', ev.clientX + 'px');
        document.documentElement.style.setProperty('--my', ev.clientY + 'px');
      });
    }, { passive: true });
  })();

  function bootLine(text, cls) {
    var log = document.getElementById('bootlog');
    if (!log) return;
    var line = el('div', cls || '', text);
    log.appendChild(line);
  }
  function finishBoot() {
    if (booted) return;
    booted = true;
    var boot = document.getElementById('boot');
    if (boot) {
      boot.classList.add('gone');
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 500);
    }
    notify('Desktop ready', CFG.os + ' ' + (CFG.version || ''));
    bumpIdle();
    renderSpaces();
    renderWidgets();
    if (!isMobile()) setTimeout(function () { openApp('about'); }, motionOff() ? 0 : 280);
  }
  bootLine(CFG.os + ' ' + (CFG.version || ''), 'dim');
  bootLine('preferences .......... ok', 'ok');
  bootLine('avatar ............... /avatar', 'ok');
  var siteReady = false;
  var ghReady = false;
  function maybeFinish() { if (siteReady && ghReady) { bootLine('desktop .............. ok', 'ok'); setTimeout(finishBoot, 240); } }
  var siteTimer = setTimeout(function () { if (!siteReady) { siteReady = true; bootLine('notes ................ deferred', 'warn'); maybeFinish(); } }, 2200);
  fetch('/api/site').then(function (r) { return r.json(); }).then(function (d) {
    applySite(d);
    if (!siteReady) bootLine('notes ................ ' + ((d.notes && d.notes.length) || 0), 'ok');
  }).catch(function () { if (!siteReady) bootLine('notes ................ seed', 'warn'); }).then(function () {
    clearTimeout(siteTimer);
    if (!siteReady) { siteReady = true; maybeFinish(); }
  });
  var ghTimed = false;
  var ghTimer = setTimeout(function () { ghTimed = true; bootLine('github ............... deferred', 'warn'); ghReady = true; maybeFinish(); }, 2200);
  loadGh().then(function () {
    if (!ghTimed) {
      clearTimeout(ghTimer);
      bootLine(ghData ? 'github ............... ok' : 'github ............... offline', ghData ? 'ok' : 'warn');
      ghReady = true;
      maybeFinish();
    }
  });
  applyPrefs();
  renderSpaces();
})();
`;
