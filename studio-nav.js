(function () {
  // Shared cross-site navigation for the three Paper-App Studio sites.
  // Identical file in all three repos (instructor-study, trailheads, bestiary).
  // Each page sets which site it belongs to with data-site="study|trailheads|bestiary"
  // on the <script> tag; the bar auto-detects from the path as a fallback.

  var script = document.currentScript;
  var rootUrl = script ? new URL('.', script.src) : new URL('./', window.location.href);
  var path = window.location.pathname;

  var SITES = {
    study: { label: 'Study', home: 'https://buildlittleworlds.github.io/instructor-study/', match: ['/instructor-study'] },
    trailheads: { label: 'Trailheads', home: 'https://buildlittleworlds.github.io/paper-app-trailheads/', match: ['/paper-app-trailheads', '/trailheads'] },
    bestiary: { label: 'Bestiary', home: 'https://buildlittleworlds.github.io/paper-app-bestiary/', match: ['/paper-app-bestiary', '/bestiary'] }
  };
  var SPINE = ['study', 'trailheads', 'bestiary'];

  var ACCENTS = {
    study: { base: '#2f6f5e', soft: '#e7f1ee', deep: '#214f44' },
    trailheads: { base: '#c96b32', soft: '#faeee6', deep: '#8f4a1e' },
    bestiary: { base: '#5b4b8a', soft: '#efecf6', deep: '#3c3489' }
  };

  // Within-site "Sessions" dropdowns. Bestiary is a single hall-based page, so it has none.
  var SESSIONS = {
    study: [
      ['session-01/', '1', 'Map of Meaning'],
      ['session-02/randomness-lab/', '2', 'Randomness Lab'],
      ['session-03/', '3', 'Attention Spotlight'],
      ['session-04/', '4', 'Slop Detector'],
      ['session-05/', '5', 'Next Move'],
      ['session-06/', '6', 'Agreement Machine'],
      ['session-07/', '7', 'Debug Loop'],
      ['session-08/', '8', 'Naming of Things'],
      ['session-09/', '9', 'Argument You Run'],
      ['session-10/', '10', 'Second Opinion']
    ],
    trailheads: [
      ['session-03/', '3', 'What Counts as Context'],
      ['session-04/', '4', 'Who Writes the Rules'],
      ['session-05/', '5', 'Your R-pentomino'],
      ['session-06/', '6', 'Three Tests of "It Works"'],
      ['session-07/', '7', 'Change One Layer'],
      ['session-08/', '8', 'The Naming of Your Things']
    ]
  };

  // Extra within-site links that live only on the Study site.
  var STUDY_LINKS = [
    ['anthology/', 'Anthology', false],
    ['proceedings/', 'Gallery', true] // true == hide on small screens
  ];

  function detectSite() {
    if (script && script.getAttribute('data-site') && SITES[script.getAttribute('data-site')]) {
      return script.getAttribute('data-site');
    }
    for (var id in SITES) {
      if (SITES[id].match.some(function (frag) { return path.indexOf(frag) !== -1; })) return id;
    }
    return 'study';
  }

  var self = detectSite();
  var accent = ACCENTS[self];
  var sessions = SESSIONS[self] || [];

  function href(relativePath) {
    return new URL(relativePath, rootUrl).href;
  }

  function currentAttr(isActive) {
    return isActive ? ' aria-current="page"' : '';
  }

  function activeSessionKey() {
    var match = path.match(/\/session-(\d{2})\//);
    return match ? 'session-' + match[1] : null;
  }

  function studyExtraActive(prefix) {
    return new RegExp('/' + prefix.replace(/\/$/, '') + '/?$').test(path);
  }

  function atHome() {
    // At the site root (index), no session/sub-area matched.
    if (activeSessionKey()) return false;
    if (self === 'study' && (studyExtraActive('anthology') || studyExtraActive('proceedings'))) return false;
    return true;
  }

  function spineHtml() {
    return SPINE.map(function (id) {
      var site = SITES[id];
      var isSelf = id === self;
      var url = isSelf ? href('./') : site.home;
      var active = isSelf && atHome();
      return '<a class="studio-nav__site' + (isSelf ? ' studio-nav__site--self' : '') + '" href="' + url + '"' +
        currentAttr(active) + '>' + site.label + '</a>';
    }).join('');
  }

  function sessionsHtml() {
    if (!sessions.length) return '';
    var activeKey = activeSessionKey();
    var items = sessions.map(function (item) {
      var key = 'session-' + item[0].slice(8, 10);
      return '<a class="studio-nav__session" href="' + href(item[0]) + '"' + currentAttr(key === activeKey) + '>' +
        '<span>Session ' + item[1] + '</span>' +
        '<strong>' + item[2] + '</strong>' +
        '</a>';
    }).join('');
    return '<details class="studio-nav__menu">' +
      '<summary>Sessions</summary>' +
      '<div class="studio-nav__panel">' + items + '</div>' +
      '</details>';
  }

  function studyLinksHtml() {
    if (self !== 'study') return '';
    return STUDY_LINKS.map(function (item) {
      var optional = item[2] ? ' studio-nav__link--optional' : '';
      return '<a class="studio-nav__link' + optional + '" href="' + href(item[0]) + '"' +
        currentAttr(studyExtraActive(item[0])) + '>' + item[1] + '</a>';
    }).join('');
  }

  function installStyles() {
    if (document.getElementById('studio-nav-styles')) return;
    var style = document.createElement('style');
    style.id = 'studio-nav-styles';
    style.textContent = [
      '.studio-nav{--sn-accent:' + accent.base + ';--sn-soft:' + accent.soft + ';--sn-deep:' + accent.deep + ';position:sticky;top:0;z-index:50;background:rgba(253,252,249,.94);border-bottom:1px solid rgba(34,34,42,.12);backdrop-filter:blur(12px);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#22222a;}',
      '.studio-nav *{box-sizing:border-box;}',
      '.studio-nav__inner{width:min(72rem,calc(100% - 1.5rem));min-height:3.25rem;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;}',
      '.studio-nav__brand{display:inline-flex;align-items:center;gap:.5rem;color:var(--sn-deep);text-decoration:none;font-weight:850;font-size:.95rem;white-space:nowrap;}',
      '.studio-nav__brand::before{content:"";width:.65rem;height:.65rem;border-radius:50%;background:var(--sn-accent);box-shadow:0 0 0 4px var(--sn-soft);}',
      '.studio-nav__links{display:flex;align-items:center;justify-content:flex-end;gap:.2rem;}',
      '.studio-nav__spine{display:inline-flex;align-items:center;gap:.15rem;}',
      '.studio-nav__extra{display:inline-flex;align-items:center;gap:.15rem;margin-left:.35rem;padding-left:.5rem;border-left:1px solid rgba(34,34,42,.16);}',
      '.studio-nav a,.studio-nav summary{border-radius:999px;color:#34343b;text-decoration:none;font-size:.86rem;font-weight:760;line-height:1;cursor:pointer;}',
      '.studio-nav__site,.studio-nav__link,.studio-nav summary{display:inline-flex;align-items:center;min-height:2.15rem;padding:.55rem .78rem;}',
      '.studio-nav a:hover,.studio-nav a:focus-visible,.studio-nav summary:hover,.studio-nav summary:focus-visible{background:var(--sn-soft);color:var(--sn-deep);outline:none;}',
      '.studio-nav a[aria-current="page"]{background:var(--sn-accent);color:#fff;}',
      '.studio-nav__menu{position:relative;}',
      '.studio-nav__menu summary{list-style:none;}',
      '.studio-nav__menu summary::-webkit-details-marker{display:none;}',
      '.studio-nav__menu summary::after{content:"";width:.42rem;height:.42rem;margin-left:.45rem;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:translateY(-.12rem) rotate(45deg);}',
      '.studio-nav__menu[open] summary{background:var(--sn-soft);color:var(--sn-deep);}',
      '.studio-nav__panel{position:absolute;right:0;top:calc(100% + .55rem);width:min(26rem,calc(100vw - 1rem));display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.35rem;padding:.55rem;border:1px solid rgba(34,34,42,.14);border-radius:14px;background:#fffdf8;box-shadow:0 18px 46px rgba(34,34,42,.16);}',
      '.studio-nav__session{display:grid;gap:.1rem;border-radius:10px!important;padding:.6rem .7rem!important;line-height:1.25!important;}',
      '.studio-nav__session span{color:#6b6b76;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;font-weight:800;}',
      '.studio-nav__session strong{font-size:.88rem;font-weight:780;}',
      '.studio-nav__session[aria-current="page"] span{color:rgba(255,255,255,.78);}',
      '@media (max-width:640px){.studio-nav__inner{width:min(100% - .85rem,72rem);min-height:3rem;gap:.4rem;flex-wrap:wrap;}.studio-nav__brand{font-size:.82rem;}.studio-nav__brand::before{display:none;}.studio-nav__links{gap:.08rem;}.studio-nav__site,.studio-nav__link,.studio-nav summary{padding:.5rem .5rem;font-size:.78rem;}.studio-nav__extra{margin-left:.2rem;padding-left:.3rem;}.studio-nav__panel{position:fixed;left:.5rem;right:.5rem;top:auto;width:auto;grid-template-columns:1fr;max-height:70vh;overflow:auto;}.studio-nav__link--optional{display:none!important;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function installNav() {
    if (document.querySelector('.studio-nav')) return;
    var brandUrl = self === 'study' ? href('./') : SITES.study.home;
    var nav = document.createElement('nav');
    nav.className = 'studio-nav';
    nav.setAttribute('aria-label', 'Paper-App Studio navigation');

    var extra = sessionsHtml() + studyLinksHtml();
    nav.innerHTML =
      '<div class="studio-nav__inner">' +
        '<a class="studio-nav__brand" href="' + brandUrl + '">Paper-App Studio</a>' +
        '<div class="studio-nav__links">' +
          '<span class="studio-nav__spine">' + spineHtml() + '</span>' +
          (extra ? '<span class="studio-nav__extra">' + extra + '</span>' : '') +
        '</div>' +
      '</div>';
    document.body.insertBefore(nav, document.body.firstChild);

    var menu = nav.querySelector('.studio-nav__menu');
    if (menu) {
      document.addEventListener('click', function (event) {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') menu.open = false;
      });
    }
  }

  installStyles();
  if (document.body) {
    installNav();
  } else {
    document.addEventListener('DOMContentLoaded', installNav);
  }
})();
