// Client-side script for ANKBUI OS, served as an inline <script>.
// Kept free of backticks/template literals so it can live inside this template string.
export const CLIENT_JS = `
(function () {
  'use strict';

  var CFG = window.__OS__;
  var isMobile = function () { return window.matchMedia('(max-width: 720px)').matches; };
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MB_H = 34;

  /* ---------- svg icon set (static strings only) ---------- */
  function svgWrap(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var ICONS = {
    about: svgWrap('<circle cx="12" cy="8.2" r="3.6"/><path d="M5.2 19.4c.9-3.4 3.6-5.2 6.8-5.2s5.9 1.8 6.8 5.2"/>'),
    projects: svgWrap('<path d="M3.6 7.6a2 2 0 0 1 2-2h3.1l2 2.2h7.7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z"/>'),
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8C5.7.8.7 5.8.7 12.1c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.5v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.1 1.2a10.7 10.7 0 0 1 5.6 0c2.2-1.5 3.1-1.2 3.1-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.5 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.8 18.3.8 12 .8z"/></svg>',
    terminal: svgWrap('<rect x="3" y="4.6" width="18" height="14.8" rx="2.4"/><path d="m7 9.6 3 2.9-3 2.9"/><path d="M12.6 15.4H17"/>'),
    contact: svgWrap('<rect x="3" y="5.4" width="18" height="13.2" rx="2.4"/><path d="m4.4 7.6 7.6 5.6 7.6-5.6"/>'),
    settings: svgWrap('<path d="M4 7.3h8.6M17 7.3h3M4 12h3M11.4 12H20M4 16.7h8.6M17 16.7h3"/><circle cx="15" cy="7.3" r="1.9"/><circle cx="9.2" cy="12" r="1.9"/><circle cx="15" cy="16.7" r="1.9"/>'),
    refresh: svgWrap('<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 3.8v4.4h-4.4"/>'),
    wallpaper: svgWrap('<rect x="3" y="4.6" width="18" height="14.8" rx="2.4"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17.5 4.6-4.3 3.2 3 2.9-2.6 4.3 3.9"/>'),
    link: svgWrap('<path d="M10.2 13.8a4 4 0 0 0 5.6 0l3-3a4 4 0 1 0-5.6-5.6l-1.3 1.3"/><path d="M13.8 10.2a4 4 0 0 0-5.6 0l-3 3a4 4 0 1 0 5.6 5.6l1.3-1.3"/>'),
    offline: svgWrap('<path d="M2.8 9.5a14.5 14.5 0 0 1 18.4 0M5.8 12.8a10 10 0 0 1 12.4 0M8.8 16.1a5.2 5.2 0 0 1 6.4 0"/><circle cx="12" cy="19.2" r="1.2" fill="currentColor" stroke="none"/><path d="M4 4l16 16"/>')
  };
  function tileEl(appId, cls) {
    var t = document.createElement('span');
    t.className = 'tile tile-' + appId + (cls ? ' ' + cls : '');
    t.innerHTML = ICONS[appId];
    return t;
  }

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function extLink(href, cls, text) {
    var a = el('a', cls, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }
  function motionOff() {
    return prefersReduced || document.body.classList.contains('reduce-motion');
  }
  function setAvatar(img) {
    img.onerror = function () {
      img.onerror = function () {
        img.onerror = null;
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">' +
          '<rect width="128" height="128" fill="#141824"/>' +
          '<text x="64" y="82" font-family="monospace" font-size="52" fill="#8fd0ff" text-anchor="middle">BA</text>' +
          '</svg>'
        );
      };
      img.src = '/avatar';
    };
    img.src = CFG.avatarPrimary;
  }

  /* ---------- preferences ---------- */
  var PREF_KEY = 'ankbui-os-prefs';
  var WALLPAPERS = ['aurora', 'graphite', 'nebula', 'ocean'];
  var prefs = { spotlight: true, reduceMotion: false, clock24: true, wp: 'aurora' };
  try {
    var saved = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    for (var k in saved) if (k in prefs) prefs[k] = saved[k];
    if (WALLPAPERS.indexOf(prefs.wp) === -1) prefs.wp = 'aurora';
  } catch (e) { /* ignore */ }
  function savePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }
  function applyPrefs() {
    document.body.classList.toggle('no-spotlight', !prefs.spotlight);
    document.body.classList.toggle('reduce-motion', !!prefs.reduceMotion);
    document.body.setAttribute('data-wp', prefs.wp);
    renderClock();
  }

  /* ---------- boot ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var boot = document.getElementById('boot');
      if (!boot) return;
      boot.classList.add('gone');
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 600);
    }, motionOff() ? 0 : 750);
  });

  /* ---------- cursor spotlight ---------- */
  (function () {
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

  /* ---------- GitHub data (worker -> browser fallback) ---------- */
  var ghData = null;
  var ghFailed = false;
  var ghLoading = false;
  var ghWaiters = [];

  function whenGh(fn) {
    if (ghData || ghFailed) fn(); else ghWaiters.push(fn);
  }
  function ghSettled() {
    var dot = document.getElementById('sysdot');
    if (dot) {
      dot.classList.toggle('err', !!ghFailed);
      dot.title = ghFailed ? 'GitHub sync unavailable' : 'System online';
    }
    var w = ghWaiters.slice(); ghWaiters = [];
    w.forEach(function (fn) { fn(); });
  }
  function browserGh() {
    // Same-shape stats computed directly in the visitor's browser.
    // Each visitor has their own GitHub rate limit, so this almost always works.
    var base = 'https://api.github.com/users/' + CFG.github;
    return Promise.all([
      fetch(base).then(function (r) { if (!r.ok) throw new Error('gh'); return r.json(); }),
      fetch(base + '/repos?per_page=100&sort=pushed').then(function (r) { return r.ok ? r.json() : []; })
    ]).then(function (res) {
      var u = res[0], repos = res[1] || [];
      var stars = 0, forks = 0, langMap = {};
      repos.forEach(function (r) {
        stars += r.stargazers_count || 0;
        forks += r.forks_count || 0;
        if (r.language && !r.fork) langMap[r.language] = (langMap[r.language] || 0) + 1;
      });
      var languages = Object.keys(langMap).map(function (n) {
        return { name: n, count: langMap[n] };
      }).sort(function (a, b) { return b.count - a.count; }).slice(0, 6);
      ghData = {
        ok: true,
        user: {
          repos: u.public_repos, followers: u.followers,
          following: u.following, gists: u.public_gists, createdAt: u.created_at
        },
        stars: stars,
        forks: forks,
        languages: languages,
        recent: repos.slice(0, 5).map(function (r) {
          return {
            name: r.name, url: r.html_url, description: r.description || '',
            stars: r.stargazers_count || 0, language: r.language || '', pushedAt: r.pushed_at
          };
        }),
        recentEvents: 0,
        fetchedAt: new Date().toISOString()
      };
    });
  }
  function loadGh() {
    if (ghLoading) return;
    ghLoading = true;
    ghData = null;
    ghFailed = false;
    fetch('/api/github')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) { ghData = d; return null; }
        return browserGh();
      })
      .catch(function () { return browserGh(); })
      .catch(function () { ghFailed = true; })
      .then(function () {
        ghLoading = false;
        if (!ghData) ghFailed = true;
        ghSettled();
      });
  }
  loadGh();

  function refreshGh() {
    loadGh();
    whenGh(function () {
      var w = wins.github;
      if (w) {
        var body = w.el.querySelector('.wbody');
        body.textContent = '';
        renderGithub(body);
      }
    });
  }

  function countUp(node, target) {
    if (motionOff() || target < 2) { node.textContent = String(target); return; }
    var start = performance.now();
    var dur = 650;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- app renderers ---------- */
  function renderAbout(body) {
    var pad = el('div', 'pad');

    var hero = el('div', 'about-hero');
    var ring = el('div', 'avatar-ring');
    var img = el('img', 'avatar');
    img.alt = CFG.name;
    setAvatar(img);
    ring.appendChild(img);

    var info = el('div');
    info.appendChild(el('div', 'about-name', CFG.name));
    info.appendChild(el('div', 'about-user', '@' + CFG.username));
    info.appendChild(el('span', 'role-chip', CFG.role));
    hero.appendChild(ring);
    hero.appendChild(info);
    pad.appendChild(hero);

    var meta = el('div', 'about-meta');
    meta.appendChild(el('div', null, '\\uD83D\\uDCCD ' + CFG.location));
    var mailRow = el('div');
    mailRow.appendChild(document.createTextNode('\\u2709 '));
    var mailA = el('a', null, CFG.email);
    mailA.href = 'mailto:' + CFG.email;
    mailRow.appendChild(mailA);
    meta.appendChild(mailRow);
    var ghRow = el('div');
    ghRow.appendChild(document.createTextNode('\\uD83D\\uDC19 '));
    ghRow.appendChild(extLink('https://github.com/' + CFG.github, null, 'github.com/' + CFG.github));
    meta.appendChild(ghRow);
    pad.appendChild(meta);

    var actions = el('div', 'btnrow about-actions');
    var gh = extLink('https://github.com/' + CFG.github, 'btn primary', 'GitHub');
    var em = el('a', 'btn', 'Email');
    em.href = 'mailto:' + CFG.email;
    actions.appendChild(gh);
    actions.appendChild(em);
    pad.appendChild(actions);
    body.appendChild(pad);
  }

  function projectLogo(p, index) {
    var logo = el('div', 'proj-logo');
    var host = '';
    try { host = new URL(p.site).hostname; } catch (e) { /* ignore */ }
    var candidates = [];
    if (p.logo) candidates.push(p.logo);
    if (host) {
      candidates.push('https://icons.duckduckgo.com/ip3/' + host + '.ico');
      candidates.push('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=128');
      candidates.push(p.site.replace(/\\/+$/, '') + '/favicon.ico');
    }
    // de-dup
    candidates = candidates.filter(function (c, i) { return candidates.indexOf(c) === i; });

    var img = el('img');
    img.alt = p.name + ' logo';
    img.loading = 'lazy';
    var idx = 0;
    function letterTile() {
      logo.textContent = '';
      logo.className = 'proj-logo lt lt-' + (index % 3);
      logo.appendChild(document.createTextNode(p.name.charAt(0).toUpperCase()));
    }
    img.onerror = function () {
      idx++;
      if (idx < candidates.length) img.src = candidates[idx];
      else letterTile();
    };
    img.onload = function () {
      // A 0-sized or 1px tracking pixel is as bad as a broken icon.
      if (img.naturalWidth < 8) img.onerror();
    };
    if (candidates.length) img.src = candidates[0]; else letterTile();
    logo.appendChild(img);
    return logo;
  }

  function renderProjects(body) {
    var pad = el('div', 'pad');
    var grid = el('div', 'proj-grid');
    CFG.projects.forEach(function (p, i) {
      var card = el('div', 'proj-card');
      card.appendChild(projectLogo(p, i));
      var right = el('div');
      right.appendChild(el('div', 'proj-name', p.name));
      right.appendChild(el('div', 'proj-desc', p.description));
      var acts = el('div', 'proj-actions');
      acts.appendChild(extLink(p.site, 'btn primary', 'Open'));
      acts.appendChild(extLink(p.repo, 'btn', 'GitHub'));
      right.appendChild(acts);
      card.appendChild(right);
      grid.appendChild(card);
    });
    pad.appendChild(grid);
    body.appendChild(pad);
  }

  function renderGithub(body) {
    var pad = el('div', 'pad');
    var head = el('div', 'gh-head');
    var id = el('div', 'gh-id');
    id.appendChild(document.createTextNode('github.com/'));
    id.appendChild(el('b', null, CFG.github));
    head.appendChild(id);
    head.appendChild(extLink('https://github.com/' + CFG.github, 'btn primary', 'Open profile'));
    pad.appendChild(head);

    var content = el('div');
    pad.appendChild(content);
    body.appendChild(pad);

    // skeleton
    for (var i = 0; i < 3; i++) {
      var sk = el('div', 'skel');
      sk.style.marginBottom = '12px';
      sk.style.height = (i === 0 ? '64px' : '40px');
      sk.style.borderRadius = '12px';
      content.appendChild(sk);
    }

    whenGh(function () {
      content.textContent = '';
      if (!ghData) {
        var fb = el('div', 'gh-fallback');
        var big = el('div', 'big');
        big.innerHTML = ICONS.offline;
        fb.appendChild(big);
        fb.appendChild(el('div', null, 'GitHub stats are offline right now.'));
        var sub = el('div', 'faint', 'The profile is still one click away.');
        sub.style.marginTop = '4px';
        fb.appendChild(sub);
        var retryRow = el('div');
        retryRow.style.marginTop = '16px';
        var retry = el('button', 'btn', 'Retry');
        retry.addEventListener('click', refreshGh);
        retryRow.appendChild(retry);
        fb.appendChild(retryRow);
        content.appendChild(fb);
        return;
      }
      var stats = [
        ['Repositories', ghData.user.repos],
        ['Followers', ghData.user.followers],
        ['Following', ghData.user.following],
        ['Stars', ghData.stars],
        ['Forks', ghData.forks]
      ];
      var grid = el('div', 'stat-grid');
      stats.forEach(function (s) {
        var box = el('div', 'stat');
        var n = el('div', 'n', '0');
        box.appendChild(n);
        box.appendChild(el('div', 'l', s[0]));
        grid.appendChild(box);
        countUp(n, s[1]);
      });
      content.appendChild(grid);

      if (ghData.recentEvents > 0) {
        var act = el('div', 'gh-section');
        act.appendChild(el('h3', null, 'Activity'));
        act.appendChild(el('div', 'muted', ghData.recentEvents + ' public events recently'));
        content.appendChild(act);
      }

      if (ghData.languages && ghData.languages.length) {
        var langs = el('div', 'gh-section');
        langs.appendChild(el('h3', null, 'Top languages'));
        var row = el('div', 'lang-row');
        ghData.languages.forEach(function (l) {
          row.appendChild(el('span', 'lang-chip', l.name + ' \\u00B7 ' + l.count));
        });
        langs.appendChild(row);
        content.appendChild(langs);
      }

      if (ghData.recent && ghData.recent.length) {
        var rec = el('div', 'gh-section');
        rec.appendChild(el('h3', null, 'Recent repositories'));
        var list = el('div', 'repo-list');
        ghData.recent.forEach(function (r) {
          var a = extLink(r.url, 'repo-item');
          var top = el('div', 'repo-top');
          top.appendChild(el('span', 'repo-name', r.name));
          var meta = [];
          if (r.language) meta.push(r.language);
          meta.push('\\u2605 ' + r.stars);
          top.appendChild(el('span', 'repo-meta', meta.join('  ')));
          a.appendChild(top);
          if (r.description) a.appendChild(el('div', 'repo-desc', r.description));
          list.appendChild(a);
        });
        rec.appendChild(list);
        content.appendChild(rec);
      }
    });
  }

  function renderContact(body) {
    var pad = el('div', 'pad');
    var card = el('div', 'contact-card');
    var img = el('img', 'cc-ava');
    img.alt = CFG.name;
    setAvatar(img);
    card.appendChild(img);
    card.appendChild(el('h2', null, CFG.name));
    card.appendChild(el('div', 'muted', CFG.role + ' \\u00B7 ' + CFG.location));
    var email = el('span', 'email', CFG.email);
    card.appendChild(el('div')).appendChild(email);
    var row = el('div', 'btnrow');
    var send = el('a', 'btn primary', 'Send Email');
    send.href = 'mailto:' + CFG.email;
    row.appendChild(send);
    row.appendChild(extLink('https://github.com/' + CFG.github, 'btn', 'GitHub'));
    card.appendChild(row);
    pad.appendChild(card);
    body.appendChild(pad);
  }

  function renderSettings(body) {
    var pad = el('div', 'pad');

    var wpRow = el('div', 'set-row');
    var wpInfo = el('div', 'set-info');
    wpInfo.appendChild(el('div', 'set-name', 'Wallpaper'));
    wpInfo.appendChild(el('div', 'set-desc', 'Ambient tone of the desktop'));
    wpRow.appendChild(wpInfo);
    var swRow = el('div', 'wp-row');
    WALLPAPERS.forEach(function (wp) {
      var s = el('button', 'swatch' + (prefs.wp === wp ? ' on' : ''));
      s.setAttribute('data-wp', wp);
      s.setAttribute('aria-label', 'Wallpaper ' + wp);
      s.title = wp.charAt(0).toUpperCase() + wp.slice(1);
      s.addEventListener('click', function () {
        prefs.wp = wp;
        savePrefs();
        applyPrefs();
        swRow.querySelectorAll('.swatch').forEach(function (x) {
          x.classList.toggle('on', x.getAttribute('data-wp') === wp);
        });
      });
      swRow.appendChild(s);
    });
    wpRow.appendChild(swRow);
    pad.appendChild(wpRow);

    var rows = [
      ['spotlight', 'Cursor spotlight', 'Ambient light that follows the cursor'],
      ['reduceMotion', 'Reduce motion', 'Minimize animations across the OS'],
      ['clock24', '24-hour clock', 'Show menu bar time as HH:MM']
    ];
    rows.forEach(function (r) {
      var row = el('div', 'set-row');
      var info = el('div', 'set-info');
      info.appendChild(el('div', 'set-name', r[1]));
      info.appendChild(el('div', 'set-desc', r[2]));
      row.appendChild(info);
      var t = el('button', 'toggle' + (prefs[r[0]] ? ' on' : ''));
      t.setAttribute('role', 'switch');
      t.setAttribute('aria-checked', String(!!prefs[r[0]]));
      t.setAttribute('aria-label', r[1]);
      t.addEventListener('click', function () {
        prefs[r[0]] = !prefs[r[0]];
        t.classList.toggle('on', !!prefs[r[0]]);
        t.setAttribute('aria-checked', String(!!prefs[r[0]]));
        savePrefs();
        applyPrefs();
      });
      row.appendChild(t);
      pad.appendChild(row);
    });
    body.appendChild(pad);
  }

  /* ---------- terminal ---------- */
  var termState = { history: [], hIdx: -1, draft: '' };

  function renderTerminal(body) {
    var term = el('div');
    term.id = 'term';
    var out = el('div');
    term.appendChild(out);

    var row = el('div', 'term-input-row');
    var promptSpan = el('span');
    promptSpan.appendChild(el('span', 'prompt', CFG.username + '@os'));
    promptSpan.appendChild(el('span', 'dim', ':'));
    promptSpan.appendChild(el('span', 'path', '~'));
    promptSpan.appendChild(el('span', 'dim', '$\\u00A0'));
    var input = el('input');
    input.id = 'term-input';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'terminal input');
    var caret = el('span');
    caret.id = 'term-caret';
    row.appendChild(promptSpan);
    row.appendChild(input);
    row.appendChild(caret);
    term.appendChild(row);
    body.appendChild(term);

    function sizeInput() {
      input.style.width = Math.max(1, input.value.length + 1) + 'ch';
    }
    sizeInput();
    input.addEventListener('input', sizeInput);

    function scrollDown() {
      body.scrollTop = body.scrollHeight;
    }
    function print(text, cls) {
      var line = el('div', 'line ' + (cls || 'out'));
      line.textContent = text;
      out.appendChild(line);
      scrollDown();
    }
    function printLink(prefix, url) {
      var line = el('div', 'line out');
      if (prefix) line.appendChild(document.createTextNode(prefix));
      line.appendChild(extLink(url, 'accent', url));
      out.appendChild(line);
      scrollDown();
    }
    function echoCmd(cmd) {
      var line = el('div', 'line');
      var p = el('span');
      p.appendChild(el('span', 'prompt', CFG.username + '@os'));
      p.appendChild(el('span', 'dim', ':'));
      p.appendChild(el('span', 'path', '~'));
      p.appendChild(el('span', 'dim', '$ '));
      line.appendChild(p);
      line.appendChild(el('span', 'out', cmd));
      out.appendChild(line);
    }

    var COMMANDS = {
      help: function () {
        print('Available commands:', 'dim');
        print('  help       show this list');
        print('  about      who is ' + CFG.username);
        print('  projects   list projects');
        print('  github     open GitHub profile');
        print('  stats      live GitHub stats');
        print('  contact    how to reach me');
        print('  neofetch   system info');
        print('  date       current date & time');
        print('  whoami     print user');
        print('  clear      clear the screen');
      },
      about: function () {
        print(CFG.name);
        print(CFG.role);
        print('Location: ' + CFG.location);
      },
      projects: function () {
        CFG.projects.forEach(function (p) {
          print(p.name, 'accent');
          printLink('  ', p.site);
        });
      },
      github: function () {
        printLink('Opening ', 'https://github.com/' + CFG.github);
        openApp('github');
      },
      stats: function () {
        if (!ghData && !ghFailed) {
          print('fetching live data\\u2026', 'dim');
          whenGh(function () { COMMANDS.stats(); });
          return;
        }
        if (!ghData) { print('github: stats unavailable right now', 'err'); return; }
        print('Repositories : ' + ghData.user.repos);
        print('Followers    : ' + ghData.user.followers);
        print('Following    : ' + ghData.user.following);
        print('Stars        : ' + ghData.stars);
        print('Forks        : ' + ghData.forks);
      },
      contact: function () {
        print('Email  : ' + CFG.email);
        printLink('GitHub : ', 'https://github.com/' + CFG.github);
      },
      clear: function () {
        out.textContent = '';
      },
      neofetch: function () {
        if (!ghData && !ghFailed) {
          print('fetching live data\\u2026', 'dim');
          whenGh(function () { COMMANDS.neofetch(); });
          return;
        }
        var v = function (x) { return ghData ? String(x) : 'n/a'; };
        print('       \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588', 'accent');
        print('      \\u2588 ANK BUI \\u2588', 'accent');
        print('       \\u2588\\u2588\\u2588\\u2588\\u2588\\u2588\\u2588', 'accent');
        print('');
        print('OS           : ' + CFG.os);
        print('User         : ' + CFG.username);
        print('Role         : ' + CFG.role);
        print('Location     : ' + CFG.location);
        print('Projects     : ' + CFG.projects.length);
        print('Repositories : ' + v(ghData && ghData.user.repos));
        print('Stars        : ' + v(ghData && ghData.stars));
        print('Followers    : ' + v(ghData && ghData.user.followers));
      },
      date: function () {
        print(new Date().toString());
      },
      whoami: function () {
        print(CFG.username);
      }
    };

    function run(raw) {
      var cmd = raw.trim();
      echoCmd(cmd);
      if (cmd) {
        termState.history.push(cmd);
        var name = cmd.split(/\\s+/)[0].toLowerCase();
        if (COMMANDS[name]) {
          COMMANDS[name]();
        } else {
          print('command not found: ' + name, 'err');
          print("type 'help' for available commands", 'dim');
        }
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
        var cur = input.value.trim().toLowerCase();
        if (!cur) return;
        var matches = Object.keys(COMMANDS).filter(function (c) { return c.indexOf(cur) === 0; });
        if (matches.length === 1) {
          input.value = matches[0] + ' ';
          sizeInput();
        } else if (matches.length > 1) {
          echoCmd(input.value);
          print(matches.join('  '), 'dim');
        }
      }
    });

    term.addEventListener('mouseup', function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) input.focus();
    });

    print(CFG.os + ' terminal \\u2014 type ', 'dim');
    out.lastChild.appendChild(el('span', 'accent', 'help'));
    out.lastChild.appendChild(document.createTextNode(' to get started.'));
    print('');
    setTimeout(function () { input.focus(); }, 60);
  }

  /* ---------- window manager ---------- */
  var APPS = {
    about:    { title: 'About \\u2014 ' + CFG.os, label: 'About',    color: '#6aa6ff', w: 470, h: 520, render: renderAbout },
    projects: { title: 'Projects',                 label: 'Projects', color: '#f6b35c', w: 560, h: 560, render: renderProjects },
    github:   { title: 'GitHub',                   label: 'GitHub',   color: '#c9d3e3', w: 620, h: 620, render: renderGithub },
    terminal: { title: CFG.username + '@os: ~',    label: 'Terminal', color: '#7ee39c', w: 640, h: 440, render: renderTerminal },
    contact:  { title: 'Contact',                  label: 'Contact',  color: '#5ad3c3', w: 420, h: 440, render: renderContact },
    settings: { title: 'Settings',                 label: 'Settings', color: '#aab4c5', w: 470, h: 470, render: renderSettings }
  };
  var DOCK_ORDER = ['about', 'projects', 'github', 'terminal', 'contact'];
  var ICON_ORDER = ['about', 'projects', 'github', 'terminal', 'contact', 'settings'];

  var wins = {};
  var zTop = 20;
  var openCount = 0;
  var desktop = document.getElementById('desktop');
  var mbApp = document.getElementById('mb-app');
  var snapGhost = document.getElementById('snapghost');

  function setMbApp(label) {
    if (mbApp) mbApp.textContent = label || 'Desktop';
  }

  function focusWin(id) {
    for (var wid in wins) wins[wid].el.classList.remove('focused');
    var w = wins[id];
    if (!w) return;
    w.el.classList.add('focused');
    zTop += 1;
    w.el.style.zIndex = String(zTop);
    setMbApp(APPS[id].label);
  }

  function focusTopWindow() {
    var bestId = null, bestZ = -1;
    for (var wid in wins) {
      if (wins[wid].min) continue;
      var z = parseInt(wins[wid].el.style.zIndex || '0', 10);
      if (z > bestZ) { bestZ = z; bestId = wid; }
    }
    if (bestId) focusWin(bestId); else setMbApp('Desktop');
  }

  function updateDock() {
    document.querySelectorAll('.dock-app').forEach(function (b) {
      var id = b.getAttribute('data-app');
      b.classList.toggle('open', !!wins[id]);
    });
  }

  function closeWin(id) {
    var w = wins[id];
    if (!w) return;
    delete wins[id];
    updateDock();
    var done = function () {
      if (w.el.parentNode) w.el.parentNode.removeChild(w.el);
      focusTopWindow();
    };
    if (motionOff()) { done(); return; }
    w.el.classList.add('closing');
    setTimeout(done, 220);
  }

  function minimizeWin(id) {
    var w = wins[id];
    if (!w || w.min) return;
    w.min = true;
    if (motionOff()) {
      w.el.style.display = 'none';
      focusTopWindow();
      return;
    }
    w.el.classList.add('minimizing');
    setTimeout(function () {
      if (w.min) w.el.style.display = 'none';
      w.el.classList.remove('minimizing');
      focusTopWindow();
    }, 300);
  }

  function restoreWin(id) {
    var w = wins[id];
    if (!w) return;
    if (w.min) {
      w.min = false;
      w.el.style.display = '';
      if (!motionOff()) {
        w.el.classList.add('opening');
        setTimeout(function () { w.el.classList.remove('opening'); }, 300);
      }
    }
    focusWin(id);
  }

  function toggleMax(id) {
    var w = wins[id];
    if (!w) return;
    w.el.classList.toggle('maxed');
  }

  function applySnap(win, zone) {
    win.classList.remove('maxed');
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = MB_H + 8;
    var height = vh - MB_H - 108;
    if (zone === 'left') {
      win.style.left = '10px';
      win.style.top = top + 'px';
      win.style.width = Math.round(vw / 2 - 15) + 'px';
      win.style.height = height + 'px';
    } else if (zone === 'right') {
      win.style.left = Math.round(vw / 2 + 5) + 'px';
      win.style.top = top + 'px';
      win.style.width = Math.round(vw / 2 - 15) + 'px';
      win.style.height = height + 'px';
    } else if (zone === 'top') {
      win.classList.add('maxed');
    }
  }
  function ghostRect(zone) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = MB_H + 8;
    var height = vh - MB_H - 108;
    if (zone === 'left') return { l: 10, t: top, w: Math.round(vw / 2 - 15), h: height };
    if (zone === 'right') return { l: Math.round(vw / 2 + 5), t: top, w: Math.round(vw / 2 - 15), h: height };
    return { l: 10, t: top, w: vw - 20, h: height };
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
        h.setPointerCapture(ev.pointerId);
        function onMove(e) {
          if (dir === 'r' || dir === 'br') {
            var nw = Math.max(300, Math.min(rect.width + (e.clientX - sx), window.innerWidth - rect.left - 8));
            win.style.width = nw + 'px';
          }
          if (dir === 'b' || dir === 'br') {
            var nh = Math.max(220, Math.min(rect.height + (e.clientY - sy), window.innerHeight - rect.top - 8));
            win.style.height = nh + 'px';
          }
        }
        function onUp() {
          h.removeEventListener('pointermove', onMove);
          h.removeEventListener('pointerup', onUp);
          h.removeEventListener('pointercancel', onUp);
        }
        h.addEventListener('pointermove', onMove);
        h.addEventListener('pointerup', onUp);
        h.addEventListener('pointercancel', onUp);
      });
    });
  }

  function openApp(id) {
    if (wins[id]) { restoreWin(id); return; }
    var app = APPS[id];
    if (!app) return;

    var win = el('div', 'window win-' + id);
    win.setAttribute('data-win', id);
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', app.label);

    var bar = el('div', 'titlebar');
    var tico = el('span', 't-ico');
    tico.innerHTML = ICONS[id];
    tico.style.color = app.color;
    bar.appendChild(tico);
    bar.appendChild(el('span', 't-title', app.title));
    var btns = el('div', 'wbtns');
    var bMin = el('button', 'wbtn min', '\\u2013');
    bMin.setAttribute('aria-label', 'Minimize');
    var bMax = el('button', 'wbtn max', '\\u25FB');
    bMax.setAttribute('aria-label', 'Maximize');
    var bClose = el('button', 'wbtn close', '\\u00D7');
    bClose.setAttribute('aria-label', 'Close');
    btns.appendChild(bMin);
    btns.appendChild(bMax);
    btns.appendChild(bClose);
    bar.appendChild(btns);
    win.appendChild(bar);

    var bodyEl = el('div', 'wbody');
    win.appendChild(bodyEl);

    // size + cascade position
    var vw = window.innerWidth, vh = window.innerHeight;
    if (!isMobile()) {
      var ww = Math.min(app.w, vw - 40);
      var wh = Math.min(app.h, vh - 130);
      win.style.width = ww + 'px';
      win.style.height = wh + 'px';
      var offset = (openCount % 6) * 26;
      win.style.left = Math.max(12, Math.round((vw - ww) / 2 - 60 + offset)) + 'px';
      win.style.top = Math.max(MB_H + 10, Math.round((vh - wh) / 2 - 50 + offset)) + 'px';
      attachResize(win);
    }
    openCount++;

    desktop.appendChild(win);
    wins[id] = { el: win, min: false };
    app.render(bodyEl);
    focusWin(id);
    updateDock();

    if (!motionOff()) {
      win.classList.add('opening');
      setTimeout(function () { win.classList.remove('opening'); }, 320);
    }

    win.addEventListener('pointerdown', function () { focusWin(id); });
    bClose.addEventListener('click', function (ev) { ev.stopPropagation(); closeWin(id); });
    bMin.addEventListener('click', function (ev) { ev.stopPropagation(); minimizeWin(id); });
    bMax.addEventListener('click', function (ev) { ev.stopPropagation(); toggleMax(id); });
    bar.addEventListener('dblclick', function (ev) {
      if (ev.target.closest('.wbtn')) return;
      if (!isMobile()) toggleMax(id);
    });

    // drag + edge snapping
    bar.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('.wbtn')) return;
      if (isMobile()) return;
      var startX = ev.clientX, startY = ev.clientY;
      var wasMaxed = win.classList.contains('maxed');
      var rect = win.getBoundingClientRect();
      var moved = false;
      var zone = null;
      bar.setPointerCapture(ev.pointerId);
      function onMove(e) {
        var dx = e.clientX - startX, dy = e.clientY - startY;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
        if (!moved && wasMaxed) {
          // un-maximize under the cursor
          win.classList.remove('maxed');
          win.style.width = Math.min(APPS[id].w, window.innerWidth - 40) + 'px';
          win.style.height = Math.min(APPS[id].h, window.innerHeight - 130) + 'px';
          rect = { left: e.clientX - parseInt(win.style.width, 10) / 2, top: e.clientY - 20, width: parseInt(win.style.width, 10), height: parseInt(win.style.height, 10) };
          startX = e.clientX; startY = e.clientY;
          dx = 0; dy = 0;
        }
        moved = true;
        var nx = Math.min(Math.max(rect.left + dx, -rect.width + 90), window.innerWidth - 90);
        var ny = Math.min(Math.max(rect.top + dy, MB_H), window.innerHeight - 60);
        win.style.left = nx + 'px';
        win.style.top = ny + 'px';

        zone = null;
        if (e.clientX <= 14) zone = 'left';
        else if (e.clientX >= window.innerWidth - 14) zone = 'right';
        else if (e.clientY <= MB_H + 6) zone = 'top';
        if (zone) showGhost(zone); else hideGhost();
      }
      function onUp() {
        bar.removeEventListener('pointermove', onMove);
        bar.removeEventListener('pointerup', onUp);
        bar.removeEventListener('pointercancel', onUp);
        hideGhost();
        if (moved && zone) applySnap(win, zone);
      }
      bar.addEventListener('pointermove', onMove);
      bar.addEventListener('pointerup', onUp);
      bar.addEventListener('pointercancel', onUp);
    });
  }

  /* ---------- desktop icons & dock ---------- */
  (function build() {
    var icons = document.getElementById('icons');
    ICON_ORDER.forEach(function (id) {
      var app = APPS[id];
      var b = el('button', 'dicon');
      b.setAttribute('data-app', id);
      b.appendChild(tileEl(id));
      b.appendChild(el('span', 'label', app.label));
      b.addEventListener('click', function () { openApp(id); });
      icons.appendChild(b);
    });

    var dock = document.getElementById('dock');
    var sep = dock.querySelector('.dock-sep');
    function dockBtn(id) {
      var app = APPS[id];
      var b = el('button', 'dock-app');
      b.setAttribute('data-app', id);
      b.setAttribute('aria-label', app.label);
      b.appendChild(tileEl(id));
      b.appendChild(el('span', 'dot'));
      b.appendChild(el('span', 'tip', app.label));
      b.addEventListener('click', function () {
        var w = wins[id];
        if (!w) openApp(id);
        else if (w.min) restoreWin(id);
        else focusWin(id);
      });
      return b;
    }
    DOCK_ORDER.forEach(function (id) { dock.insertBefore(dockBtn(id), sep); });
    dock.appendChild(dockBtn('settings'));
  })();

  /* ---------- clock ---------- */
  var clockBtn = document.getElementById('clock');
  var datepop = document.getElementById('datepop');
  function renderClock() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var mm = (m < 10 ? '0' : '') + m;
    var text;
    if (prefs.clock24) {
      text = (h < 10 ? '0' : '') + h + ':' + mm;
    } else {
      var ap = h >= 12 ? 'PM' : 'AM';
      var h12 = h % 12; if (h12 === 0) h12 = 12;
      text = h12 + ':' + mm + ' ' + ap;
    }
    clockBtn.textContent = text;
  }
  renderClock();
  setInterval(renderClock, 15000);
  clockBtn.addEventListener('click', function (ev) {
    ev.stopPropagation();
    var d = new Date();
    datepop.querySelector('.big').textContent = clockBtn.textContent;
    datepop.querySelector('.small').textContent = d.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    datepop.classList.toggle('show');
  });
  document.addEventListener('click', function (ev) {
    if (!datepop.contains(ev.target) && ev.target !== clockBtn) datepop.classList.remove('show');
  });

  /* ---------- context menu ---------- */
  var ctx = document.getElementById('ctx');
  function ctxItem(iconKey, label, act) {
    var b = el('button', 'ctx-item');
    var ic = el('span');
    ic.innerHTML = ICONS[iconKey];
    b.appendChild(ic);
    b.appendChild(el('span', null, label));
    b.addEventListener('click', function () { hideCtx(); act(); });
    return b;
  }
  function buildCtx() {
    ctx.textContent = '';
    ctx.appendChild(ctxItem('terminal', 'New Terminal', function () { openApp('terminal'); }));
    ctx.appendChild(ctxItem('refresh', 'Refresh GitHub stats', refreshGh));
    ctx.appendChild(el('div', 'ctx-sep'));
    ctx.appendChild(ctxItem('wallpaper', 'Next wallpaper', function () {
      var i = WALLPAPERS.indexOf(prefs.wp);
      prefs.wp = WALLPAPERS[(i + 1) % WALLPAPERS.length];
      savePrefs();
      applyPrefs();
    }));
    ctx.appendChild(ctxItem('settings', 'Settings', function () { openApp('settings'); }));
    ctx.appendChild(el('div', 'ctx-sep'));
    ctx.appendChild(ctxItem('about', 'About ' + CFG.os, function () { openApp('about'); }));
  }
  function hideCtx() { ctx.classList.remove('show'); }
  desktop.addEventListener('contextmenu', function (ev) {
    if (ev.target.closest('.window')) return; // native menu inside windows
    ev.preventDefault();
    buildCtx();
    ctx.classList.add('show');
    var w = ctx.offsetWidth, h = ctx.offsetHeight;
    ctx.style.left = Math.min(ev.clientX, window.innerWidth - w - 8) + 'px';
    ctx.style.top = Math.min(ev.clientY, window.innerHeight - h - 8) + 'px';
  });
  document.addEventListener('pointerdown', function (ev) {
    if (!ctx.contains(ev.target)) hideCtx();
  });

  /* ---------- command palette ---------- */
  var palette = document.getElementById('palette');
  var palInput = document.getElementById('pal-input');
  var palList = document.getElementById('pal-list');
  var palItems = [];
  var palSel = 0;

  var PAL_SOURCE = ICON_ORDER.map(function (id) {
    return { app: id, label: APPS[id].label, hint: 'App', act: function () { openApp(id); } };
  }).concat([
    { plain: 'link', label: 'Open GitHub profile', hint: 'Link', act: function () {
        window.open('https://github.com/' + CFG.github, '_blank', 'noopener,noreferrer');
      } },
    { plain: 'contact', label: 'Send email', hint: 'Link', act: function () {
        window.location.href = 'mailto:' + CFG.email;
      } },
    { plain: 'wallpaper', label: 'Next wallpaper', hint: 'Action', act: function () {
        var i = WALLPAPERS.indexOf(prefs.wp);
        prefs.wp = WALLPAPERS[(i + 1) % WALLPAPERS.length];
        savePrefs();
        applyPrefs();
      } },
    { plain: 'refresh', label: 'Refresh GitHub stats', hint: 'Action', act: refreshGh }
  ]);

  function palRender() {
    var q = palInput.value.trim().toLowerCase();
    palItems = PAL_SOURCE.filter(function (it) {
      return !q || it.label.toLowerCase().indexOf(q) !== -1;
    });
    if (palSel >= palItems.length) palSel = 0;
    palList.textContent = '';
    if (!palItems.length) {
      palList.appendChild(el('div', 'pal-empty', 'Nothing found'));
      return;
    }
    palItems.forEach(function (it, i) {
      var b = el('button', 'pal-item' + (i === palSel ? ' sel' : ''));
      if (it.app) {
        b.appendChild(tileEl(it.app));
      } else {
        var pi = el('span', 'pi-plain');
        pi.innerHTML = ICONS[it.plain];
        b.appendChild(pi);
      }
      b.appendChild(el('span', null, it.label));
      b.appendChild(el('span', 'pk', it.hint));
      b.addEventListener('click', function () { palClose(); it.act(); });
      b.addEventListener('mousemove', function () {
        if (palSel !== i) { palSel = i; palRender(); }
      });
      palList.appendChild(b);
    });
  }
  function palOpen() {
    palette.classList.add('show');
    palInput.value = '';
    palSel = 0;
    palRender();
    setTimeout(function () { palInput.focus(); }, 20);
  }
  function palClose() {
    palette.classList.remove('show');
  }
  palInput.addEventListener('input', function () { palSel = 0; palRender(); });
  palInput.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); palSel = Math.min(palSel + 1, palItems.length - 1); palRender(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); palSel = Math.max(palSel - 1, 0); palRender(); }
    else if (ev.key === 'Enter') {
      ev.preventDefault();
      var it = palItems[palSel];
      if (it) { palClose(); it.act(); }
    }
  });
  palette.addEventListener('click', function (ev) {
    if (ev.target === palette) palClose();
  });

  document.addEventListener('keydown', function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K')) {
      ev.preventDefault();
      if (palette.classList.contains('show')) palClose(); else palOpen();
    } else if (ev.key === 'Escape') {
      if (palette.classList.contains('show')) palClose();
      datepop.classList.remove('show');
      hideCtx();
    }
  });

  applyPrefs();

  // open About by default on large screens for a lived-in feel
  if (!isMobile()) {
    setTimeout(function () { openApp('about'); }, motionOff() ? 0 : 950);
  }
})();
`;
