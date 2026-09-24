import { CLIENT_B } from "./client-b";

export const CLIENT_A = `
(function () {
  'use strict';
  var CFG = window.__OS__;
  var isMobile = function () { return window.matchMedia('(max-width: 720px)').matches; };
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MB_H = 34;
  var SPACE_COUNT = 3;

  function svgWrap(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var ICONS = {
    about: svgWrap('<circle cx="12" cy="8.2" r="3.6"/><path d="M5.2 19.4c.9-3.4 3.6-5.2 6.8-5.2s5.9 1.8 6.8 5.2"/>'),
    projects: svgWrap('<path d="M3.6 7.6a2 2 0 0 1 2-2h3.1l2 2.2h7.7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z"/>'),
    notes: svgWrap('<path d="M7 3.8h7.2L19 8.6V20a1.6 1.6 0 0 1-1.6 1.6H7A1.6 1.6 0 0 1 5.4 20V5.4A1.6 1.6 0 0 1 7 3.8z"/><path d="M14 3.8V8.6h5"/><path d="M8.2 12.2h7.6M8.2 15.4h5.4"/>'),
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8C5.7.8.7 5.8.7 12.1c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.5v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.1 1.2a10.7 10.7 0 0 1 5.6 0c2.2-1.5 3.1-1.2 3.1-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.5 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.8 18.3.8 12 .8z"/></svg>',
    terminal: svgWrap('<rect x="3" y="4.6" width="18" height="14.8" rx="2.4"/><path d="m7 9.6 3 2.9-3 2.9"/><path d="M12.6 15.4H17"/>'),
    guestbook: svgWrap('<path d="M5 6.2h14v9.2H8.2L5 18.2z"/>'),
    contact: svgWrap('<rect x="3" y="5.4" width="18" height="13.2" rx="2.4"/><path d="m4.4 7.6 7.6 5.6 7.6-5.6"/>'),
    settings: svgWrap('<path d="M4 7.3h8.6M17 7.3h3M4 12h3M11.4 12H20M4 16.7h8.6M17 16.7h3"/><circle cx="15" cy="7.3" r="1.9"/><circle cx="9.2" cy="12" r="1.9"/><circle cx="15" cy="16.7" r="1.9"/>'),
    launchpad: svgWrap('<rect x="4" y="4" width="6.2" height="6.2" rx="1.4"/><rect x="13.8" y="4" width="6.2" height="6.2" rx="1.4"/><rect x="4" y="13.8" width="6.2" height="6.2" rx="1.4"/><rect x="13.8" y="13.8" width="6.2" height="6.2" rx="1.4"/>'),
    refresh: svgWrap('<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 3.8v4.4h-4.4"/>'),
    wallpaper: svgWrap('<rect x="3" y="4.6" width="18" height="14.8" rx="2.4"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17.5 4.6-4.3 3.2 3 2.9-2.6 4.3 3.9"/>'),
    link: svgWrap('<path d="M10.2 13.8a4 4 0 0 0 5.6 0l3-3a4 4 0 1 0-5.6-5.6l-1.3 1.3"/><path d="M13.8 10.2a4 4 0 0 0-5.6 0l-3 3a4 4 0 1 0 5.6 5.6l1.3-1.3"/>'),
    lock: svgWrap('<rect x="5" y="10" width="14" height="9.2" rx="2"/><path d="M8 10V7.8a4 4 0 0 1 8 0V10"/>'),
    offline: svgWrap('<path d="M2.8 9.5a14.5 14.5 0 0 1 18.4 0M5.8 12.8a10 10 0 0 1 12.4 0M8.8 16.1a5.2 5.2 0 0 1 6.4 0"/><circle cx="12" cy="19.2" r="1.2" fill="currentColor" stroke="none"/><path d="M4 4l16 16"/>')
  };
  function tileEl(appId, cls) {
    var t = document.createElement('span');
    t.className = 'tile tile-' + appId + (cls ? ' ' + cls : '');
    t.innerHTML = ICONS[appId] || ICONS.about;
    return t;
  }
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
    img.alt = CFG.name;
    img.onerror = function () {
      img.onerror = null;
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="64" fill="#141824"/><text x="64" y="78" font-family="monospace" font-size="42" fill="#8fd0ff" text-anchor="middle">BA</text></svg>');
    };
    img.src = '/avatar';
  }

  var PREF_KEY = 'ankbui-os-prefs';
  var HIST_KEY = 'ankbui-os-hist';
  var WALLPAPERS = ['aurora', 'graphite', 'nebula', 'ocean'];
  var LOCK_CHOICES = [0, 2, 5, 15];
  var prefs = { spotlight: true, reduceMotion: false, clock24: true, wp: 'aurora', lockMin: 5 };
  try {
    var saved = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    for (var k in saved) if (k in prefs) prefs[k] = saved[k];
    if (WALLPAPERS.indexOf(prefs.wp) === -1) prefs.wp = 'aurora';
    if (LOCK_CHOICES.indexOf(prefs.lockMin) === -1) prefs.lockMin = 5;
  } catch (e) { /* ignore */ }
  function savePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }
  function applyPrefs() {
    document.body.classList.toggle('no-spotlight', !prefs.spotlight);
    document.body.classList.toggle('reduce-motion', !!prefs.reduceMotion);
    document.body.setAttribute('data-wp', prefs.wp);
    renderClock();
    bumpIdle();
  }

  var siteData = { availability: 'available', now: '', notes: [], guestbook: [] };
  var notifs = [];
  var unread = 0;
  var currentSpace = 0;
  var locked = false;
  var idleTimer = null;
  var booted = false;

  function notify(title, body) {
    notifs.unshift({ title: title, body: body, time: new Date().toLocaleTimeString() });
    if (notifs.length > 12) notifs.pop();
    unread++;
    renderNotifs();
  }
  function renderNotifs() {
    var count = document.getElementById('bell-count');
    if (count) {
      count.hidden = unread < 1;
      count.textContent = String(unread);
    }
    var panel = document.getElementById('notifs');
    if (!panel || !panel.classList.contains('show')) return;
    paintNotifs();
  }
  function paintNotifs() {
    var panel = document.getElementById('notifs');
    panel.textContent = '';
    var head = el('div', 'notif-head');
    head.appendChild(el('h2', null, 'Notifications'));
    var clear = el('button', 'btn', 'Clear');
    clear.addEventListener('click', function () { notifs = []; unread = 0; paintNotifs(); renderNotifs(); });
    head.appendChild(clear);
    panel.appendChild(head);
    if (!notifs.length) panel.appendChild(el('div', 'pal-empty', 'Nothing new'));
    notifs.forEach(function (n) {
      var box = el('div', 'notif');
      box.appendChild(el('b', null, n.title));
      box.appendChild(el('span', null, n.body));
      box.appendChild(el('i', null, n.time));
      panel.appendChild(box);
    });
  }
  function toggleNotifs() {
    var panel = document.getElementById('notifs');
    var bell = document.getElementById('bell');
    var open = panel.classList.toggle('show');
    bell.classList.toggle('on', open);
    bell.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { unread = 0; paintNotifs(); renderNotifs(); }
  }

  function renderSpaces() {
    var host = document.getElementById('spaces');
    if (!host) return;
    host.textContent = '';
    for (var i = 0; i < SPACE_COUNT; i++) {
      var b = el('button', 'space-btn' + (i === currentSpace ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('aria-label', 'Desktop ' + (i + 1));
      b.title = 'Desktop ' + (i + 1);
      (function (n) { b.addEventListener('click', function () { setSpace(n); }); })(i);
      host.appendChild(b);
    }
  }
  function setSpace(n) {
    currentSpace = (n + SPACE_COUNT) % SPACE_COUNT;
    applySpace();
    renderSpaces();
    focusTopWindow();
  }
  function applySpace() {
    for (var id in wins) wins[id].el.classList.toggle('offspace', wins[id].space !== currentSpace);
  }

  function renderWidgets() {
    var host = document.getElementById('widgets');
    if (!host) return;
    host.textContent = '';
    var clock = el('button', 'widget');
    clock.appendChild(el('div', 'k', 'Clock'));
    var big = el('div', 'bigtime', document.getElementById('clock').textContent || '--:--');
    big.id = 'widget-clock';
    clock.appendChild(big);
    var sub = el('div', 'sub');
    sub.id = 'widget-date';
    clock.appendChild(sub);
    clock.addEventListener('click', function () { document.getElementById('clock').click(); });
    host.appendChild(clock);

    var stars = el('button', 'widget');
    stars.appendChild(el('div', 'k', 'GitHub'));
    var sn = el('div', 'stars', ghData ? String(ghData.stars) : '—');
    stars.appendChild(sn);
    stars.appendChild(el('div', 'sub', ghData ? ghData.user.repos + ' public repos' : 'syncing stats'));
    stars.addEventListener('click', function () { openApp('github'); });
    host.appendChild(stars);

    var now = el('button', 'widget');
    now.appendChild(el('div', 'k', 'Now'));
    var badge = el('div', 'avail' + (siteData.availability === 'busy' ? ' busy' : ''), siteData.availability === 'busy' ? 'Busy' : 'Available');
    badge.style.display = 'inline-flex';
    badge.style.marginTop = '8px';
    now.appendChild(badge);
    now.appendChild(el('div', 'now-line', siteData.now || '—'));
    now.addEventListener('click', function () { openApp('about'); });
    host.appendChild(now);
    renderClock();
    paintAvail();
  }
  function paintAvail() {
    var pill = document.getElementById('avail');
    if (!pill) return;
    pill.hidden = false;
    pill.textContent = siteData.availability === 'busy' ? 'Busy' : 'Available';
    pill.classList.toggle('busy', siteData.availability === 'busy');
  }
  function applySite(d) {
    if (!d) return;
    siteData = d;
    renderWidgets();
    var notesWin = wins.notes;
    if (notesWin) { var nb = notesWin.el.querySelector('.wbody'); nb.textContent = ''; renderNotes(nb); }
    var guestWin = wins.guestbook;
    if (guestWin) { var gb = guestWin.el.querySelector('.wbody'); gb.textContent = ''; renderGuestbook(gb); }
  }

  var ghData = null;
  var ghFailed = false;
  var ghLoading = false;
  var ghWaiters = [];
  var ghPromise = null;
  function whenGh(fn) { if (ghData || ghFailed) fn(); else ghWaiters.push(fn); }
  function ghSettled() {
    var dot = document.getElementById('sysdot');
    if (dot) {
      dot.classList.toggle('err', !!ghFailed);
      dot.title = ghFailed ? 'GitHub sync unavailable' : 'System online';
    }
    var w = ghWaiters.slice(); ghWaiters = [];
    w.forEach(function (fn) { fn(); });
    renderWidgets();
    var gw = wins.github;
    if (gw) { var body = gw.el.querySelector('.wbody'); body.textContent = ''; renderGithub(body); }
  }
  function browserGh() {
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
      var languages = Object.keys(langMap).map(function (n) { return { name: n, count: langMap[n] }; })
        .sort(function (a, b) { return b.count - a.count; }).slice(0, 6);
      ghData = {
        ok: true,
        user: { repos: u.public_repos, followers: u.followers, following: u.following, gists: u.public_gists, createdAt: u.created_at },
        stars: stars, forks: forks, languages: languages,
        recent: repos.slice(0, 5).map(function (r) {
          return { name: r.name, url: r.html_url, description: r.description || '', stars: r.stargazers_count || 0, language: r.language || '', pushedAt: r.pushed_at };
        }),
        pinned: [], contributions: [], totalContributions: 0, starHistory: [],
        recentEvents: 0, fetchedAt: new Date().toISOString()
      };
    });
  }
  function loadGh() {
    if (ghPromise) return ghPromise;
    ghLoading = true;
    ghPromise = fetch('/api/github')
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) { ghData = d; return null; } return browserGh(); })
      .catch(function () { return browserGh(); })
      .catch(function () { ghFailed = true; })
      .then(function () {
        ghLoading = false;
        if (!ghData) ghFailed = true;
        ghSettled();
        if (ghData) notify('GitHub synced', ghData.user.repos + ' repos · ' + ghData.stars + ' stars');
        else notify('GitHub delayed', 'Stats will stay on the last good copy if one exists.');
      });
    return ghPromise;
  }
  function refreshGh() {
    ghPromise = null; ghData = null; ghFailed = false;
    loadGh();
  }
  function countUp(node, target) {
    if (motionOff() || target < 2) { node.textContent = String(target); return; }
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / 650);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderAbout(body) {
    var pad = el('div', 'pad');
    var hero = el('div', 'about-hero');
    var ring = el('div', 'avatar-ring');
    var img = el('img', 'avatar');
    setAvatar(img);
    ring.appendChild(img);
    var info = el('div');
    info.appendChild(el('div', 'about-name', CFG.name));
    info.appendChild(el('div', 'about-user', '@' + CFG.username));
    var chips = el('div', 'btnrow');
    chips.style.marginTop = '8px';
    chips.appendChild(el('span', 'role-chip', CFG.role));
    var av = el('span', 'avail' + (siteData.availability === 'busy' ? ' busy' : ''), siteData.availability === 'busy' ? 'Busy' : 'Available');
    chips.appendChild(av);
    info.appendChild(chips);
    hero.appendChild(ring);
    hero.appendChild(info);
    pad.appendChild(hero);
    if (siteData.now) pad.appendChild(el('p', 'now-line', siteData.now));
    var meta = el('div', 'about-meta');
    meta.appendChild(el('div', null, '📍 ' + CFG.location));
    var mailRow = el('div');
    mailRow.appendChild(document.createTextNode('✉ '));
    var mailA = el('a', null, CFG.email);
    mailA.href = 'mailto:' + CFG.email;
    mailRow.appendChild(mailA);
    meta.appendChild(mailRow);
    var ghRow = el('div');
    ghRow.appendChild(document.createTextNode('🐙 '));
    ghRow.appendChild(extLink('https://github.com/' + CFG.github, null, 'github.com/' + CFG.github));
    meta.appendChild(ghRow);
    pad.appendChild(meta);
    var actions = el('div', 'btnrow about-actions');
    actions.appendChild(extLink('https://github.com/' + CFG.github, 'btn primary', 'GitHub'));
    var em = el('a', 'btn', 'Email');
    em.href = 'mailto:' + CFG.email;
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
    }
    candidates = candidates.filter(function (c, i) { return candidates.indexOf(c) === i; });
    var img = el('img');
    img.alt = p.name + ' logo';
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
    img.onload = function () { if (img.naturalWidth < 8) img.onerror(); };
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
      var top = el('div', 'proj-top');
      top.appendChild(el('div', 'proj-name', p.name));
      top.appendChild(el('span', 'status-pill ' + (p.status === 'wip' ? 'wip' : 'live'), p.status === 'wip' ? 'WIP' : 'Live'));
      right.appendChild(top);
      right.appendChild(el('div', 'proj-desc', p.description));
      var acts = el('div', 'proj-actions');
      var details = el('button', 'btn', 'Details');
      details.addEventListener('click', function () { showProject(body, p, i); });
      acts.appendChild(details);
      acts.appendChild(extLink(p.site, 'btn primary', 'Open'));
      acts.appendChild(extLink(p.repo, 'btn', 'GitHub'));
      right.appendChild(acts);
      card.appendChild(right);
      grid.appendChild(card);
    });
    pad.appendChild(grid);
    body.appendChild(pad);
  }
  function showProject(body, p, index) {
    body.textContent = '';
    var pad = el('div', 'pad');
    var back = el('button', 'btn', 'Back');
    back.addEventListener('click', function () { body.textContent = ''; renderProjects(body); });
    pad.appendChild(back);
    if (p.shot) {
      var shot = el('img', 'proj-shot');
      shot.alt = p.name;
      shot.src = p.shot;
      shot.style.marginTop = '14px';
      pad.appendChild(shot);
    } else {
      var cover = el('div', 'proj-cover', p.name.charAt(0));
      cover.style.marginTop = '14px';
      pad.appendChild(cover);
    }
    var top = el('div', 'proj-top');
    top.appendChild(el('div', 'proj-name', p.name));
    top.appendChild(el('span', 'status-pill ' + (p.status === 'wip' ? 'wip' : 'live'), p.status === 'wip' ? 'WIP' : 'Live'));
    pad.appendChild(top);
    pad.appendChild(el('p', 'proj-desc', p.long || p.description));
    var stacks = el('div', 'stack-row');
    (p.stack || []).forEach(function (s) { stacks.appendChild(el('span', 'stack-chip', s)); });
    pad.appendChild(stacks);
    var acts = el('div', 'proj-actions');
    acts.appendChild(extLink(p.site, 'btn primary', 'Open site'));
    acts.appendChild(extLink(p.repo, 'btn', 'Repository'));
    pad.appendChild(acts);
    body.appendChild(pad);
  }

  function repoLink(r) {
    var a = extLink(r.url, 'repo-item');
    var top = el('div', 'repo-top');
    top.appendChild(el('span', 'repo-name', r.name));
    var meta = [];
    if (r.language) meta.push(r.language);
    meta.push('★ ' + r.stars);
    top.appendChild(el('span', 'repo-meta', meta.join('  ')));
    a.appendChild(top);
    if (r.description) a.appendChild(el('div', 'repo-desc', r.description));
    return a;
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
    for (var i = 0; i < 3; i++) {
      var sk = el('div', 'skel');
      sk.style.marginBottom = '12px';
      sk.style.height = '40px';
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
        var retry = el('button', 'btn', 'Retry');
        retry.style.marginTop = '12px';
        retry.addEventListener('click', refreshGh);
        fb.appendChild(retry);
        content.appendChild(fb);
        return;
      }
      var stats = [['Repositories', ghData.user.repos], ['Followers', ghData.user.followers], ['Following', ghData.user.following], ['Stars', ghData.stars], ['Forks', ghData.forks]];
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
      var heatSec = el('div', 'gh-section');
      heatSec.appendChild(el('h3', null, 'Contributions' + (ghData.totalContributions ? ' · ' + ghData.totalContributions : '')));
      if (ghData.contributions && ghData.contributions.length) {
        var wrap = el('div', 'heat-wrap');
        var heat = el('div', 'heat');
        ghData.contributions.forEach(function (c) {
          var cell = el('i');
          cell.setAttribute('data-l', String(c.level || 0));
          cell.style.gridRow = String((c.row || 0) + 1);
          cell.style.gridColumn = String((c.col || 0) + 1);
          cell.title = c.date + ': ' + c.count;
          heat.appendChild(cell);
        });
        wrap.appendChild(heat);
        heatSec.appendChild(wrap);
        var legend = el('div', 'heat-legend', 'Less');
        for (var lv = 0; lv < 5; lv++) {
          var sw = el('i');
          sw.setAttribute('data-l', String(lv));
          sw.style.background = '';
          legend.appendChild(sw);
        }
        legend.appendChild(document.createTextNode(' More'));
        heatSec.appendChild(legend);
      } else heatSec.appendChild(el('div', 'muted', 'Calendar is available when the desktop can reach GitHub.'));
      content.appendChild(heatSec);
      var sparkSec = el('div', 'gh-section');
      sparkSec.appendChild(el('h3', null, 'Star history'));
      if (ghData.starHistory && ghData.starHistory.length > 1) {
        sparkSec.appendChild(sparkline(ghData.starHistory));
        var meta = el('div', 'spark-meta');
        meta.appendChild(el('span', null, ghData.starHistory[0].date));
        meta.appendChild(el('span', null, ghData.starHistory[ghData.starHistory.length - 1].stars + ' stars'));
        sparkSec.appendChild(meta);
      } else sparkSec.appendChild(el('div', 'muted', 'Not enough public star timestamps yet.'));
      content.appendChild(sparkSec);
      if (ghData.languages && ghData.languages.length) {
        var langs = el('div', 'gh-section');
        langs.appendChild(el('h3', null, 'Top languages'));
        var row = el('div', 'lang-row');
        ghData.languages.forEach(function (l) { row.appendChild(el('span', 'lang-chip', l.name + ' · ' + l.count)); });
        langs.appendChild(row);
        content.appendChild(langs);
      }
      function repoSection(title, list) {
        if (!list || !list.length) return;
        var sec = el('div', 'gh-section');
        sec.appendChild(el('h3', null, title));
        var box = el('div', 'repo-list');
        list.forEach(function (r) { box.appendChild(repoLink(r)); });
        sec.appendChild(box);
        content.appendChild(sec);
      }
      repoSection('Pinned', ghData.pinned);
      repoSection('Recently pushed', ghData.recent);
    });
  }
  function sparkline(points) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 320 72');
    svg.setAttribute('class', 'spark');
    var max = 1;
    points.forEach(function (p) { if (p.stars > max) max = p.stars; });
    var d = '';
    points.forEach(function (p, i) {
      var x = points.length === 1 ? 0 : (i / (points.length - 1)) * 320;
      var y = 64 - (p.stars / max) * 56;
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    });
    var area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', d + ' L320 72 L0 72 Z');
    area.setAttribute('fill', 'rgba(143,208,255,0.12)');
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', d);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', '#8fd0ff');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(area);
    svg.appendChild(line);
    return svg;
  }

  function renderNotes(body) {
    var pad = el('div', 'pad');
    pad.appendChild(el('p', 'muted', 'Markdown notes. Edit them in /my/admin/.'));
    var list = el('div', 'repo-list');
    list.style.marginTop = '12px';
    var notes = siteData.notes || [];
    if (!notes.length) pad.appendChild(el('div', 'gh-fallback', 'No notes yet.'));
    notes.forEach(function (n) {
      var b = el('button', 'repo-item note-item');
      b.appendChild(el('div', 'repo-name', n.title));
      b.appendChild(el('div', 'repo-desc', (n.date || '') + (n.excerpt ? ' · ' + n.excerpt : '')));
      b.addEventListener('click', function () { openNote(body, n.slug); });
      list.appendChild(b);
    });
    pad.appendChild(list);
    body.appendChild(pad);
  }
  function openNote(body, slug) {
    body.textContent = '';
    var pad = el('div', 'pad');
    var back = el('button', 'btn', 'Back');
    back.addEventListener('click', function () { body.textContent = ''; renderNotes(body); });
    pad.appendChild(back);
    var slot = el('div', 'note-body');
    slot.style.marginTop = '14px';
    slot.appendChild(el('div', 'muted', 'Loading…'));
    pad.appendChild(slot);
    body.appendChild(pad);
    fetch('/api/notes/' + encodeURIComponent(slug)).then(function (r) { return r.json(); }).then(function (n) {
      slot.textContent = '';
      slot.appendChild(el('h2', null, n.title || slug));
      slot.appendChild(el('div', 'meta faint', n.date || ''));
      var article = el('div');
      article.innerHTML = n.html || '';
      slot.appendChild(article);
    }).catch(function () { slot.textContent = 'Could not open this note.'; });
  }

  function renderGuestbook(body) {
    var pad = el('div', 'pad');
    pad.appendChild(el('p', 'muted', 'Leave a short note. It shows up after it is stored.'));
    var form = el('form', 'gform');
    var name = el('input'); name.placeholder = 'Name'; name.maxLength = 40; name.required = true;
    var msg = el('textarea'); msg.placeholder = 'Message'; msg.maxLength = 500; msg.required = true;
    var hp = el('input', 'hp'); hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off';
    var status = el('div', 'form-msg');
    var send = el('button', 'btn primary', 'Sign');
    send.type = 'submit';
    form.appendChild(name); form.appendChild(msg); form.appendChild(hp); form.appendChild(send); form.appendChild(status);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.textContent = 'Sending…';
      fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, message: msg.value, website: hp.value })
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (res) {
        if (!res.ok) {
          status.textContent = res.j && res.j.error === 'storage_unconfigured'
            ? 'Guestbook storage is not connected yet.'
            : 'Could not save that note.';
          return;
        }
        status.textContent = 'Saved.';
        msg.value = '';
        fetch('/api/site').then(function (r) { return r.json(); }).then(applySite);
      }).catch(function () { status.textContent = 'Network error.'; });
    });
    pad.appendChild(form);
    var list = el('div', 'repo-list');
    list.style.marginTop = '16px';
    (siteData.guestbook || []).forEach(function (g) {
      var item = el('div', 'repo-item guest-item');
      item.appendChild(el('div', 'repo-name', g.name));
      item.appendChild(el('div', 'repo-desc', g.message));
      item.appendChild(el('div', 'faint', (g.createdAt || '').slice(0, 10)));
      list.appendChild(item);
    });
    if (!(siteData.guestbook || []).length) list.appendChild(el('div', 'faint', 'No signatures yet.'));
    pad.appendChild(list);
    body.appendChild(pad);
  }

  function renderContact(body) {
    var pad = el('div', 'pad');
    var card = el('div', 'contact-card');
    var img = el('img', 'cc-ava');
    setAvatar(img);
    card.appendChild(img);
    card.appendChild(el('h2', null, CFG.name));
    card.appendChild(el('div', 'muted', CFG.role + ' · ' + CFG.location));
    var badge = el('div', 'avail' + (siteData.availability === 'busy' ? ' busy' : ''), siteData.availability === 'busy' ? 'Busy' : 'Available');
    badge.style.display = 'inline-flex';
    badge.style.margin = '8px 0';
    card.appendChild(badge);
    var form = el('form', 'cform');
    form.style.textAlign = 'left';
    var name = el('input'); name.placeholder = 'Name'; name.required = true;
    var email = el('input'); email.type = 'email'; email.placeholder = 'Email'; email.required = true;
    var message = el('textarea'); message.placeholder = 'Message'; message.required = true;
    var hp = el('input', 'hp'); hp.tabIndex = -1; hp.autocomplete = 'off';
    var status = el('div', 'form-msg');
    var send = el('button', 'btn primary', 'Send');
    send.type = 'submit';
    form.appendChild(name); form.appendChild(email); form.appendChild(message); form.appendChild(hp); form.appendChild(send); form.appendChild(status);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.textContent = 'Sending…';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, message: message.value, website: hp.value })
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (res) {
        if (!res.ok) {
          status.textContent = 'Delivery is not connected. Email ' + CFG.email + ' instead.';
          return;
        }
        status.textContent = 'Sent.';
        message.value = '';
      }).catch(function () { status.textContent = 'Network error.'; });
    });
    card.appendChild(form);
    var row = el('div', 'btnrow');
    row.style.marginTop = '12px';
    row.style.justifyContent = 'center';
    var mail = el('a', 'btn', 'Mailto');
    mail.href = 'mailto:' + CFG.email;
    row.appendChild(mail);
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
      s.title = wp;
      s.addEventListener('click', function () {
        prefs.wp = wp; savePrefs(); applyPrefs();
        swRow.querySelectorAll('.swatch').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-wp') === wp); });
      });
      swRow.appendChild(s);
    });
    wpRow.appendChild(swRow);
    pad.appendChild(wpRow);
    var lockRow = el('div', 'set-row');
    var lockInfo = el('div', 'set-info');
    lockInfo.appendChild(el('div', 'set-name', 'Lock screen'));
    lockInfo.appendChild(el('div', 'set-desc', 'Show the clock after idle time'));
    lockRow.appendChild(lockInfo);
    var chips = el('div', 'lock-row');
    function paintLock() {
      chips.querySelectorAll('.lock-chip').forEach(function (c) {
        c.classList.toggle('on', Number(c.getAttribute('data-min')) === prefs.lockMin);
      });
    }
    LOCK_CHOICES.forEach(function (min) {
      var c = el('button', 'lock-chip', min ? min + 'm' : 'Off');
      c.setAttribute('data-min', String(min));
      c.addEventListener('click', function () { prefs.lockMin = min; savePrefs(); applyPrefs(); paintLock(); });
      chips.appendChild(c);
    });
    lockRow.appendChild(chips);
    pad.appendChild(lockRow);
    paintLock();
    [['spotlight', 'Cursor spotlight', 'Ambient light that follows the cursor'], ['reduceMotion', 'Reduce motion', 'Minimize animations across the OS'], ['clock24', '24-hour clock', 'Show menu bar time as HH:MM']].forEach(function (r) {
      var row = el('div', 'set-row');
      var info = el('div', 'set-info');
      info.appendChild(el('div', 'set-name', r[1]));
      info.appendChild(el('div', 'set-desc', r[2]));
      row.appendChild(info);
      var t = el('button', 'toggle' + (prefs[r[0]] ? ' on' : ''));
      t.setAttribute('role', 'switch');
      t.setAttribute('aria-checked', String(!!prefs[r[0]]));
      t.addEventListener('click', function () {
        prefs[r[0]] = !prefs[r[0]];
        t.classList.toggle('on', !!prefs[r[0]]);
        t.setAttribute('aria-checked', String(!!prefs[r[0]]));
        savePrefs(); applyPrefs();
      });
      row.appendChild(t);
      pad.appendChild(row);
    });
    body.appendChild(pad);
  }
`;

export const CLIENT_JS = CLIENT_A + CLIENT_B;
