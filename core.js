/* Core application shell, state, navigation, accessibility, and event handling. */
(function () {
  'use strict';

  const D = window.MLC_DATA;
  const STORAGE_KEY = 'mlc-charles-dorner-v1';
  const DEFAULT_STATE = {
    profile: { name: '', goal: 'Build practical machine learning literacy', minutes: '15', complete: false },
    completedLessons: [],
    checks: {},
    exploredAlgorithms: [],
    practice: { index: 0, answers: {}, best: 0, complete: false, attempts: 0 },
    quiz: { started: false, index: 0, answers: {}, submitted: false, lastPercent: 0, bestPercent: 0, history: [], improved: false, reviewMode: false },
    scenario: { current: 0, stage: 'category', answers: {}, completed: [] },
    cluster: { k: 3, seed: 7 },
    rl: { position: 0, reward: 0, moves: 0, visited: [0], message: 'Choose actions and watch reward shape the path.' },
    settings: { theme: 'dark', motion: 'full' },
    glossary: { query: '', category: 'All' },
    algorithmFilter: 'all',
    menuOpen: false,
    modal: null,
    lastScreen: 'welcome'
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function mergeDefaults(base, saved) {
    const result = clone(base);
    if (!saved || typeof saved !== 'object') return result;
    Object.keys(saved).forEach(key => {
      if (saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key]) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = { ...result[key], ...saved[key] };
      } else {
        result[key] = saved[key];
      }
    });
    return result;
  }

  function loadState() {
    try { return mergeDefaults(DEFAULT_STATE, JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); }
    catch (error) { console.warn('Saved progress could not be read.', error); return clone(DEFAULT_STATE); }
  }

  const state = loadState();
  const screens = {};
  let activeScreen = 'welcome';
  let shouldFocusHeading = false;

  const iconPaths = {
    sparkles: '<path d="m12 3-1.1 3.1a2 2 0 0 1-1.2 1.2L6.5 8.5l3.2 1.1a2 2 0 0 1 1.2 1.2L12 14l1.1-3.2a2 2 0 0 1 1.2-1.2l3.2-1.1-3.2-1.2a2 2 0 0 1-1.2-1.2L12 3Z"/><path d="m5 15-.7 1.9a1.2 1.2 0 0 1-.7.7L2 18.2l1.6.6a1.2 1.2 0 0 1 .7.7L5 21l.6-1.5a1.2 1.2 0 0 1 .7-.7l1.6-.6-1.6-.6a1.2 1.2 0 0 1-.7-.7L5 15Z"/><path d="m19 13-.6 1.6a1.2 1.2 0 0 1-.7.7l-1.6.6 1.6.6a1.2 1.2 0 0 1 .7.7L19 19l.6-1.8a1.2 1.2 0 0 1 .7-.7l1.6-.6-1.6-.6a1.2 1.2 0 0 1-.7-.7L19 13Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-6h6v6"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a4 4 0 0 0 4-4v-6a4 4 0 0 1 3-3.9"/>',
    brain: '<path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.3A3.5 3.5 0 0 0 4.5 15H5a4 4 0 0 0 4 4h1V5.5a1 1 0 0 0-.5-1Z"/><path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.3a3.5 3.5 0 0 1 1.5 6.7H19a4 4 0 0 1-4 4h-1V5.5a1 1 0 0 1 .5-1Z"/><path d="M7 10h3M14 10h3M7 15h3M14 15h3"/>',
    tags: '<path d="M20.6 13.6 11 4H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    cluster: '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="12" cy="17" r="2"/><path d="m8.7 8 2.2 6.8M15.4 7.5l-2.2 7.4M9 7h6"/>',
    gamepad: '<path d="M8 7h8a5 5 0 0 1 4.8 6.4l-1 3.4a2.5 2.5 0 0 1-4.1 1.1L14 16h-4l-1.7 1.9a2.5 2.5 0 0 1-4.1-1.1l-1-3.4A5 5 0 0 1 8 7Z"/><path d="M7 11v4M5 13h4M16 12h.01M18 14h.01"/>',
    blocks: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"/><path d="M7.2 16h9.6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>',
    book: '<path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 3V5Z"/><path d="M20 5a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 3V5Z"/>',
    library: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 4 15-3.5 1z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    gitbranch: '<circle cx="6" cy="4" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="20" r="2"/><path d="M6 6v12M8 12h4a6 6 0 0 0 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrowleft: '<path d="m15 18-6-6 6-6"/>',
    arrowright: '<path d="m9 18 6-6-6-6"/>',
    chevronright: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>',
    accessibility: '<circle cx="12" cy="4" r="2"/><path d="M4 8h16M12 6v15M8 21l4-8 4 8"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    refresh: '<path d="M20 7h-6V1M4 17h6v6"/><path d="M20 13a8 8 0 0 1-14.5 4M4 11A8 8 0 0 1 18.5 7"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>',
    inbox: '<path d="M4 4h16v16H4z"/><path d="M4 14h4l2 3h4l2-3h4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.2a4 4 0 0 1 0 7.6"/>',
    trend: '<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    split: '<path d="M6 3v5a4 4 0 0 0 4 4h8M14 8l4 4-4 4M6 21v-5"/>',
    tree: '<path d="M12 21V9M7 6l5 5 5-5M9 3l3 3 3-3M6 15h12"/>',
    forest: '<path d="m5 3-3 6h2l-3 6h3v6h2v-6h3L6 9h2L5 3ZM16 2l-4 7h3l-4 7h4v5h2v-5h4l-4-7h3l-4-7Z"/>',
    neighbors: '<circle cx="6" cy="7" r="2"/><circle cx="17" cy="5" r="2"/><circle cx="13" cy="17" r="2"/><circle cx="20" cy="15" r="1.5"/><path d="m8 8 4 7M15 6l-2 9M15 17l3.5-1.5"/>',
    compress: '<path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5"/><path d="m3 8 6 6M21 8l-6 6M3 16l6-6M21 16l-6-6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4 2.4c-.9.5-1.5 1.1-1.5 2.1M12 17h.01"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    footprints: '<path d="M8.5 14c2 1.4 2.6 3.3 1.5 5s-3.5 1.7-5-.2-1.2-4.6.6-5.3c.9-.4 1.9-.1 2.9.5ZM15.5 10c-2-1.4-2.6-3.3-1.5-5s3.5-1.7 5 .2 1.2 4.6-.6 5.3c-.9.4-1.9.1-2.9-.5Z"/><circle cx="5" cy="9" r="1"/><circle cx="8" cy="7" r="1"/><circle cx="19" cy="15" r="1"/><circle cx="16" cy="17" r="1"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    arrowup: '<path d="m12 19 0-14M6 11l6-6 6 6"/>',
    arrowdown: '<path d="m12 5 0 14M18 13l-6 6-6-6"/>',
    arrowright2: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowleft2: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 2.9 8 7 10 4.1-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>'
  };

  function icon(name, className) {
    const body = iconPaths[name] || iconPaths.sparkles;
    return `<svg class="${className || 'h-5 w-5'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('Progress could not be saved.', error); }
  }

  function uniquePush(array, value) { if (!array.includes(value)) array.push(value); }

  function completionMetrics() {
    const lessonIds = ['foundations', 'supervised', 'unsupervised', 'reinforcement'];
    const milestones = [
      ...lessonIds.map(id => state.completedLessons.includes(id)),
      state.exploredAlgorithms.length >= 3,
      state.scenario.completed.length >= D.scenarios.length,
      state.practice.complete,
      state.quiz.submitted
    ];
    const complete = milestones.filter(Boolean).length;
    return { complete, total: milestones.length, percent: Math.round((complete / milestones.length) * 100), milestones };
  }

  function xpTotal() {
    return state.completedLessons.length * 60 + state.exploredAlgorithms.length * 10 + state.scenario.completed.length * 35 + state.practice.best * 15 + Math.round(state.quiz.bestPercent * 1.5);
  }

  function earnedBadges() { return D.badges.filter(badge => badge.test(state)); }

  function objectiveStats() {
    const stats = { O1: { correct: 0, total: 0 }, O2: { correct: 0, total: 0 } };
    D.quizQuestions.forEach((q, index) => {
      stats[q.objective].total += 1;
      if (Number(state.quiz.answers[index]) === q.answer) stats[q.objective].correct += 1;
    });
    Object.values(stats).forEach(item => { item.percent = item.total ? Math.round((item.correct / item.total) * 100) : 0; });
    return stats;
  }

  function currentRoute() {
    const route = location.hash.replace(/^#\/?/, '').split('?')[0];
    if (D.screenOrder.includes(route)) return route;
    return state.profile.complete ? 'home' : 'welcome';
  }

  function navigate(screen, options) {
    if (!D.screenOrder.includes(screen)) screen = 'home';
    state.lastScreen = activeScreen;
    state.menuOpen = false;
    state.modal = null;
    save();
    shouldFocusHeading = !(options && options.focus === false);
    if (currentRoute() === screen) {
      activeScreen = screen;
      render();
    } else {
      location.hash = `#/${screen}`;
    }
  }

  function screenHeader(screen, intro, extras) {
    const info = D.screenInfo[screen];
    return `
      <header class="mb-7 md:mb-9">
        <div class="mb-3 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-cyan-300">
          <span>${icon(info.icon, 'h-4 w-4')}</span><span>${escapeHTML(info.eyebrow)}</span>${extras || ''}
        </div>
        <h1 id="screen-title" tabindex="-1" class="max-w-4xl text-3xl font-black tracking-tight text-theme sm:text-4xl lg:text-5xl">${escapeHTML(info.title)}</h1>
        ${intro ? `<p class="mt-4 max-w-3xl text-base leading-7 text-muted-theme sm:text-lg">${intro}</p>` : ''}
      </header>`;
  }

  function screenFooter(screen, options) {
    const info = D.screenInfo[screen];
    const prev = options && Object.prototype.hasOwnProperty.call(options, 'prev') ? options.prev : info.prev;
    const next = options && Object.prototype.hasOwnProperty.call(options, 'next') ? options.next : info.next;
    const nextLabel = (options && options.nextLabel) || (next && D.screenInfo[next] ? D.screenInfo[next].title : 'Continue');
    return `
      <nav aria-label="Screen navigation" class="mt-10 flex flex-col-reverse gap-3 border-t border-theme pt-6 sm:flex-row sm:items-center sm:justify-between">
        ${prev ? `<button class="secondary-button w-full sm:w-auto" data-nav="${prev}">${icon('arrowleft', 'h-5 w-5')} Back<span class="sr-only"> to ${escapeHTML(D.screenInfo[prev].title)}</span></button>` : '<span></span>'}
        ${next ? `<button class="primary-button w-full sm:w-auto" data-nav="${next}"><span>${escapeHTML(nextLabel)}</span>${icon('arrowright', 'h-5 w-5')}</button>` : `<button class="secondary-button w-full sm:w-auto" data-nav="home">${icon('home', 'h-5 w-5')} Return to dashboard</button>`}
      </nav>`;
  }

  function objectiveTag(id) {
    const obj = D.objectives.find(item => item.id === id);
    return `<span class="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-extrabold text-violet-200">${icon(obj.icon, 'h-3.5 w-3.5')}${obj.id}: ${escapeHTML(obj.label)}</span>`;
  }

  function statusChip(done, labels) {
    const yes = (labels && labels[0]) || 'Complete';
    const no = (labels && labels[1]) || 'Not complete';
    return done
      ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-extrabold text-emerald-300">${icon('check', 'h-3.5 w-3.5')}${yes}</span>`
      : `<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-400/10 px-2.5 py-1 text-xs font-extrabold text-slate-400">${no}</span>`;
  }

  function progressRing(percent, size) {
    const s = size || 64;
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, percent)) / 100) * circumference;
    return `<div class="relative inline-grid place-items-center" style="width:${s}px;height:${s}px">
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="6" class="text-slate-700/50"></circle>
        <circle cx="32" cy="32" r="25" fill="none" stroke="url(#ring-gradient)" stroke-width="6" stroke-linecap="round" class="progress-ring progress-ring__value" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
        <defs><linearGradient id="ring-gradient"><stop stop-color="#22d3ee"></stop><stop offset="1" stop-color="#a78bfa"></stop></linearGradient></defs>
      </svg>
      <span class="text-xs font-black text-theme">${percent}%</span>
    </div>`;
  }

  function renderSidebar() {
    const metrics = completionMetrics();
    const learner = state.profile.name ? escapeHTML(state.profile.name.split(/\s+/)[0]) : 'Learner';
    return `<aside class="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-2xl md:flex">
      <button class="group flex items-center gap-3 rounded-2xl p-2 text-left" data-nav="home" aria-label="ML Learning Companion home">
        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-400 text-slate-950 shadow-lg shadow-cyan-500/20">${icon('brain', 'h-6 w-6')}</span>
        <span><span class="block text-sm font-black text-theme">ML Learning</span><span class="block text-sm font-black gradient-text">Companion</span></span>
      </button>
      <div class="custom-scrollbar mt-7 flex-1 overflow-y-auto pr-1">
        ${D.navGroups.map(group => `<div class="mb-6"><p class="mb-2 px-3 text-[10px] font-black uppercase tracking-[.2em] text-slate-500">${group.label}</p><div class="space-y-1">${group.screens.map(id => {
          const info = D.screenInfo[id];
          return `<button class="nav-link ${activeScreen === id ? 'active' : ''} flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold" data-nav="${id}"><span>${icon(info.icon, 'h-[18px] w-[18px]')}</span><span class="min-w-0 flex-1 truncate">${escapeHTML(info.title)}</span>${state.completedLessons.includes(id) ? icon('check', 'h-4 w-4 text-emerald-300') : ''}</button>`;
        }).join('')}</div></div>`).join('')}
      </div>
      <div class="glass-card rounded-2xl p-3.5">
        <div class="flex items-center gap-3">${progressRing(metrics.percent, 52)}<div class="min-w-0"><p class="truncate text-sm font-black text-theme">${learner}'s path</p><p class="mt-1 text-xs text-muted-theme">${metrics.complete} of ${metrics.total} milestones</p></div></div>
        <div class="mt-3 flex gap-2"><button class="secondary-button min-h-0 flex-1 px-2 py-2 text-xs" data-action="toggle-theme">${icon(state.settings.theme === 'dark' ? 'sun' : 'moon', 'h-4 w-4')} Theme</button><button class="secondary-button min-h-0 px-3 py-2 text-xs" data-action="open-settings" aria-label="Open settings">${icon('settings', 'h-4 w-4')}</button></div>
      </div>
    </aside>`;
  }

  function renderTopbar() {
    const info = D.screenInfo[activeScreen] || D.screenInfo.home;
    const metrics = completionMetrics();
    return `<header class="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-2xl md:px-8">
      <div class="mx-auto flex max-w-6xl items-center gap-3">
        <button class="secondary-button desktop-hide min-h-0 px-3 py-2 md:hidden" data-action="toggle-menu" aria-label="Open navigation menu" aria-expanded="${state.menuOpen}">${icon('menu', 'h-5 w-5')}</button>
        <div class="min-w-0 flex-1"><p class="truncate text-xs font-extrabold uppercase tracking-[.16em] text-cyan-300">${escapeHTML(info.eyebrow)}</p><p class="truncate text-sm font-black text-theme sm:text-base">${escapeHTML(info.title)}</p></div>
        <div class="hidden items-center gap-2 sm:flex"><span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">${icon('bolt', 'mr-1 inline h-3.5 w-3.5 text-amber-300')} ${xpTotal()} XP</span><button class="secondary-button min-h-0 px-3 py-2" data-action="toggle-theme" aria-label="Toggle color theme">${icon(state.settings.theme === 'dark' ? 'sun' : 'moon', 'h-4 w-4')}</button></div>
        <button class="relative grid h-10 w-10 place-items-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-sm font-black text-cyan-100" data-nav="progress" aria-label="Open progress: ${metrics.percent} percent complete">${state.profile.name ? escapeHTML(state.profile.name.trim().slice(0, 1).toUpperCase()) : metrics.percent}</button>
      </div>
    </header>`;
  }

  function renderMobileMenu() {
    if (!state.menuOpen) return '';
    return `<div class="modal-backdrop fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm md:hidden" data-action="close-menu" role="presentation">
      <aside class="modal-card absolute inset-y-0 left-0 flex w-[min(88vw,22rem)] flex-col border-r border-white/10 bg-slate-950 p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Course menu" data-menu-panel>
        <div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-400 text-slate-950">${icon('brain', 'h-5 w-5')}</span><span class="font-black text-theme">Learning menu</span></div><button class="secondary-button min-h-0 px-3 py-2" data-action="close-menu" aria-label="Close menu">${icon('close', 'h-5 w-5')}</button></div>
        <div class="custom-scrollbar mt-6 flex-1 overflow-y-auto">${D.navGroups.map(group => `<div class="mb-5"><p class="mb-2 px-3 text-[10px] font-black uppercase tracking-[.2em] text-slate-500">${group.label}</p>${group.screens.map(id => `<button class="nav-link ${activeScreen === id ? 'active' : ''} mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold" data-nav="${id}">${icon(D.screenInfo[id].icon, 'h-5 w-5')}<span class="flex-1">${escapeHTML(D.screenInfo[id].title)}</span></button>`).join('')}</div>`).join('')}</div>
      </aside>
    </div>`;
  }

  function renderBottomNav() {
    const items = [
      ['home', 'home', 'Home'], ['path', 'route', 'Path'], ['practice', 'target', 'Practice'], ['progress', 'trophy', 'Progress']
    ];
    return `<nav class="bottom-safe fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-slate-950/90 px-2 pt-2 backdrop-blur-2xl md:hidden" aria-label="Primary mobile navigation">${items.map(([id, ic, label]) => `<button class="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-extrabold ${activeScreen === id ? 'text-cyan-300' : 'text-slate-400'}" data-nav="${id}">${icon(ic, 'h-5 w-5')}<span>${label}</span></button>`).join('')}</nav>`;
  }

  function renderModal() {
    if (!state.modal) return '';
    if (state.modal.type === 'algorithm') {
      const a = D.algorithms.find(item => item.id === state.modal.id);
      if (!a) return '';
      return `<div class="modal-backdrop fixed inset-0 z-[80] grid place-items-end bg-slate-950/75 p-0 backdrop-blur-sm sm:place-items-center sm:p-6" data-action="close-modal" role="presentation">
        <section class="modal-card custom-scrollbar glass-strong max-h-[92vh] w-full overflow-y-auto rounded-t-3xl p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="algorithm-modal-title" data-modal-panel>
          <div class="flex items-start gap-4"><span class="icon-shell h-14 w-14">${icon(a.icon, 'h-7 w-7')}</span><div class="min-w-0 flex-1"><p class="text-xs font-extrabold uppercase tracking-[.16em] text-cyan-300">${escapeHTML(a.family)} · ${escapeHTML(a.task)}</p><h2 id="algorithm-modal-title" class="mt-1 text-2xl font-black text-theme">${escapeHTML(a.name)}</h2><p class="mt-2 text-muted-theme">${escapeHTML(a.tagline)}</p></div><button class="secondary-button min-h-0 px-3 py-2" data-action="close-modal" aria-label="Close algorithm details">${icon('close', 'h-5 w-5')}</button></div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2"><div class="rounded-2xl border border-theme bg-white/5 p-4"><p class="text-xs font-black uppercase tracking-[.14em] text-slate-400">Input</p><p class="mt-2 text-sm leading-6 text-theme">${escapeHTML(a.input)}</p></div><div class="rounded-2xl border border-theme bg-white/5 p-4"><p class="text-xs font-black uppercase tracking-[.14em] text-slate-400">Output</p><p class="mt-2 text-sm leading-6 text-theme">${escapeHTML(a.output)}</p></div></div>
          <div class="mt-5"><h3 class="text-sm font-black text-theme">Strong fit when you need</h3><div class="mt-3 flex flex-wrap gap-2">${a.bestFor.map(x => `<span class="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-200">${escapeHTML(x)}</span>`).join('')}</div></div>
          <div class="mt-5 grid gap-5 sm:grid-cols-2"><div><h3 class="text-sm font-black text-theme">Application examples</h3><ul class="mt-3 space-y-2 text-sm text-muted-theme">${a.examples.map(x => `<li class="flex gap-2">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-emerald-300')}<span>${escapeHTML(x)}</span></li>`).join('')}</ul></div><div><h3 class="text-sm font-black text-theme">Watch for</h3><p class="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">${escapeHTML(a.watchFor)}</p></div></div>
          <div class="mt-5 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4"><p class="text-xs font-black uppercase tracking-[.14em] text-violet-200">Mental model</p><p class="mt-2 text-sm leading-6 text-theme">${escapeHTML(a.analogy)}</p></div>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button class="secondary-button" data-action="close-modal">Close</button><button class="primary-button" data-action="use-algorithm" data-id="${a.id}">Use in scenario lab ${icon('arrowright', 'h-5 w-5')}</button></div>
        </section>
      </div>`;
    }
    if (state.modal.type === 'settings') {
      return `<div class="modal-backdrop fixed inset-0 z-[80] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" data-action="close-modal" role="presentation"><section class="modal-card glass-strong w-full max-w-md rounded-3xl p-6" role="dialog" aria-modal="true" aria-labelledby="settings-title" data-modal-panel><div class="flex items-center justify-between"><h2 id="settings-title" class="text-xl font-black text-theme">Display and progress settings</h2><button class="secondary-button min-h-0 px-3 py-2" data-action="close-modal" aria-label="Close settings">${icon('close', 'h-5 w-5')}</button></div><div class="mt-6 space-y-3"><button class="secondary-button w-full justify-between" data-action="toggle-theme"><span class="flex items-center gap-3">${icon(state.settings.theme === 'dark' ? 'sun' : 'moon', 'h-5 w-5')} Color theme</span><span class="text-xs text-muted-theme">${state.settings.theme === 'dark' ? 'Dark' : 'Light'}</span></button><button class="secondary-button w-full justify-between" data-action="toggle-motion"><span class="flex items-center gap-3">${icon('accessibility', 'h-5 w-5')} Motion</span><span class="text-xs text-muted-theme">${state.settings.motion === 'reduced' ? 'Reduced' : 'Full'}</span></button><button class="secondary-button w-full justify-between" data-nav="profile"><span class="flex items-center gap-3">${icon('edit', 'h-5 w-5')} Edit learner profile</span>${icon('chevronright', 'h-4 w-4')}</button><button class="danger-button w-full" data-action="ask-reset">${icon('trash', 'h-5 w-5')} Reset all saved progress</button></div></section></div>`;
    }
    if (state.modal.type === 'reset') {
      return `<div class="modal-backdrop fixed inset-0 z-[90] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm" role="presentation"><section class="modal-card glass-strong w-full max-w-md rounded-3xl p-6" role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-rose-400/10 text-rose-300">${icon('trash', 'h-6 w-6')}</span><h2 id="reset-title" class="mt-5 text-xl font-black text-theme">Reset the prototype?</h2><p id="reset-description" class="mt-3 leading-6 text-muted-theme">This removes your profile, lesson checks, practice answers, quiz history, badges, and saved progress from this browser.</p><div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button class="secondary-button" data-action="close-modal">Keep progress</button><button class="danger-button" data-action="confirm-reset">Reset everything</button></div></section></div>`;
    }
    return '';
  }

  function renderAppShell(content) {
    const onboarding = activeScreen === 'welcome' || activeScreen === 'profile';
    if (onboarding) {
      return `<div class="app-backdrop min-h-screen"><main id="main-content" class="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4 sm:p-8">${content}</main>${renderModal()}</div>`;
    }
    return `<div class="app-backdrop min-h-screen">${renderSidebar()}<div class="min-h-screen md:pl-72">${renderTopbar()}<main id="main-content" class="mx-auto max-w-6xl px-4 pb-28 pt-7 sm:px-6 md:px-8 md:pb-12 md:pt-10"><div class="screen-enter">${content}</div></main></div>${renderMobileMenu()}${renderBottomNav()}${renderModal()}</div>`;
  }

  function render(options) {
    const target = document.getElementById('app');
    activeScreen = currentRoute();
    const renderer = screens[activeScreen] || screens.home;
    if (!renderer) return;
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.dataset.motion = state.settings.motion;
    document.title = `${D.screenInfo[activeScreen].title} · ${D.appName}`;
    target.innerHTML = renderAppShell(renderer());
    if (shouldFocusHeading && !(options && options.preserveFocus)) {
      requestAnimationFrame(() => {
        const h1 = document.getElementById('screen-title');
        if (h1) h1.focus({ preventScroll: true });
      });
      shouldFocusHeading = false;
    }
  }

  function toast(message, type) {
    const region = document.getElementById('toast-region');
    const item = document.createElement('div');
    const good = type !== 'error';
    item.className = `pointer-events-auto glass-strong flex items-start gap-3 rounded-2xl p-4 shadow-2xl ${good ? 'border-emerald-300/30' : 'border-rose-300/30'}`;
    item.innerHTML = `<span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${good ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}">${icon(good ? 'check' : 'question', 'h-4 w-4')}</span><p class="flex-1 text-sm font-bold leading-6 text-theme">${escapeHTML(message)}</p><button class="ghost-button min-h-0 px-2 py-1" aria-label="Dismiss notification">${icon('close', 'h-4 w-4')}</button>`;
    item.querySelector('button').addEventListener('click', () => item.remove());
    region.appendChild(item);
    setTimeout(() => item.remove(), 4200);
  }

  function confetti() {
    if (state.settings.motion === 'reduced') return;
    const layer = document.getElementById('confetti-layer');
    const colors = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb7185'];
    for (let i = 0; i < 40; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--duration', `${2.2 + Math.random() * 1.8}s`);
      piece.style.setProperty('--drift', `${-100 + Math.random() * 200}px`);
      piece.style.setProperty('--rotation', `${Math.random() * 360}deg`);
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 4300);
    }
  }

  function markLesson(id, silent) {
    const wasDone = state.completedLessons.includes(id);
    uniquePush(state.completedLessons, id);
    save();
    if (!wasDone && !silent) { toast('Lesson complete. Your progress has been saved.'); confetti(); }
  }

  function handleLessonAnswer(button) {
    const check = button.dataset.check;
    if (state.checks[check]) return;
    const value = Number(button.dataset.value);
    const correct = Number(button.dataset.correct);
    state.checks[check] = { value, correct: value === correct };
    save();
    render({ preserveFocus: true });
    toast(value === correct ? 'Correct — use the explanation to reinforce the rule.' : 'Not yet — review the explanation, then use the remediation link.', value === correct ? 'success' : 'error');
  }

  function clusterPoints() {
    let seed = state.cluster.seed || 1;
    const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const centers = [[72, 68], [224, 62], [145, 155], [268, 160]].slice(0, state.cluster.k);
    const points = [];
    centers.forEach((center, cluster) => {
      for (let i = 0; i < 10; i += 1) {
        points.push({ x: center[0] + (random() - .5) * 58, y: center[1] + (random() - .5) * 48, cluster });
      }
    });
    return { centers, points };
  }

  function resetRL() { state.rl = clone(DEFAULT_STATE.rl); save(); }

  function moveRL(direction) {
    const deltas = { up: -3, down: 3, left: -1, right: 1 };
    const current = state.rl.position;
    const row = Math.floor(current / 3);
    const col = current % 3;
    if ((direction === 'up' && row === 0) || (direction === 'down' && row === 2) || (direction === 'left' && col === 0) || (direction === 'right' && col === 2)) {
      state.rl.reward -= 2;
      state.rl.message = 'Wall: −2 reward. The agent should reduce the value of that action.';
    } else {
      const next = current + deltas[direction];
      if (next === 4) {
        state.rl.reward -= 3;
        state.rl.message = 'Blocked state: −3 reward. Try a safer action.';
      } else {
        state.rl.position = next;
        state.rl.moves += 1;
        state.rl.reward -= 1;
        uniquePush(state.rl.visited, next);
        if (next === 8) {
          state.rl.reward += 11;
          state.rl.message = 'Goal reached: +10 net for this move. Delayed value can propagate to earlier choices.';
          markLesson('reinforcement', true);
          setTimeout(confetti, 50);
        } else {
          state.rl.message = 'Valid move: −1. The small cost encourages efficient paths to the goal.';
        }
      }
    }
    save();
    render({ preserveFocus: true });
  }

  function currentPracticeQuestion() { return D.practiceQuestions[state.practice.index]; }
  function answerPractice(index) {
    const qIndex = state.practice.index;
    if (Object.prototype.hasOwnProperty.call(state.practice.answers, qIndex)) return;
    state.practice.answers[qIndex] = Number(index);
    save();
    render({ preserveFocus: true });
  }
  function nextPractice() {
    if (state.practice.index < D.practiceQuestions.length - 1) {
      state.practice.index += 1;
    } else {
      const score = D.practiceQuestions.reduce((sum, q, i) => sum + (Number(state.practice.answers[i]) === q.answer ? 1 : 0), 0);
      state.practice.best = Math.max(state.practice.best, score);
      state.practice.complete = true;
      state.practice.attempts += 1;
      markLesson('practice', true);
      toast(`Practice complete: ${score} of ${D.practiceQuestions.length} correct.`);
      if (score >= 5) confetti();
    }
    save(); render({ preserveFocus: true });
  }
  function resetPractice() {
    state.practice = { ...clone(DEFAULT_STATE.practice), best: state.practice.best, attempts: state.practice.attempts };
    save(); render();
  }

  function answerQuiz(index) {
    if (state.quiz.submitted) return;
    state.quiz.answers[state.quiz.index] = Number(index);
    save(); render({ preserveFocus: true });
  }
  function submitQuiz() {
    const answered = Object.keys(state.quiz.answers).length;
    if (answered < D.quizQuestions.length) {
      toast(`Answer all ${D.quizQuestions.length} questions before submitting. ${D.quizQuestions.length - answered} remain.`, 'error');
      return;
    }
    const score = D.quizQuestions.reduce((sum, q, i) => sum + (Number(state.quiz.answers[i]) === q.answer ? 1 : 0), 0);
    const percent = Math.round((score / D.quizQuestions.length) * 100);
    const priorBest = state.quiz.bestPercent;
    state.quiz.lastPercent = percent;
    state.quiz.bestPercent = Math.max(priorBest, percent);
    state.quiz.improved = state.quiz.history.length > 0 && percent > priorBest;
    state.quiz.history.push({ date: new Date().toISOString(), score, percent });
    state.quiz.submitted = true;
    state.quiz.reviewMode = false;
    save();
    if (percent >= 80) confetti();
    navigate('results');
  }
  function resetQuiz() {
    state.quiz.started = true;
    state.quiz.index = 0;
    state.quiz.answers = {};
    state.quiz.submitted = false;
    state.quiz.reviewMode = false;
    save(); navigate('quiz');
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function downloadGuide() {
    const text = `ML LEARNING COMPANION — CATEGORY DECISION GUIDE\n\n1. Do you have a known target outcome for past examples?\n   YES → Supervised learning.\n   • Categorical target → classification.\n   • Numeric target → regression.\n\n2. Do you have features but no target, and want to discover structure or compress data?\n   YES → Unsupervised learning.\n   • Discover groups → clustering (for example, K-means).\n   • Reduce features → dimensionality reduction (for example, PCA).\n\n3. Does an agent choose actions over time and receive rewards from an environment?\n   YES → Reinforcement learning (for example, Q-learning in a small discrete environment).\n\nALGORITHM MATCHES\n• Linear regression → continuous numeric prediction.\n• Logistic regression → class probability.\n• Decision tree → explainable rule-like prediction.\n• Random forest → robust nonlinear prediction on tabular data.\n• K-nearest neighbors → similarity-based prediction.\n• K-means → unlabeled compact clusters.\n• PCA → fewer transformed dimensions.\n• Q-learning → sequential decisions from reward.\n\nAlways check data quality, fit with the task, evaluation evidence, fairness, privacy, and the cost of errors.`;
    download('ML-Learning-Companion-Decision-Guide.txt', text);
    toast('Decision guide downloaded.');
  }

  function exportProgress() {
    const metrics = completionMetrics();
    const report = {
      learner: state.profile.name || 'Learner',
      generated: new Date().toISOString(),
      completion: metrics,
      xp: xpTotal(),
      completedLessons: state.completedLessons,
      exploredAlgorithms: state.exploredAlgorithms,
      practiceBest: `${state.practice.best}/${D.practiceQuestions.length}`,
      quizBest: `${state.quiz.bestPercent}%`,
      objectiveMastery: objectiveStats(),
      badges: earnedBadges().map(b => b.title)
    };
    download('ML-Learning-Companion-Progress.json', JSON.stringify(report, null, 2), 'application/json');
    toast('Progress report exported.');
  }

  function handleAction(button) {
    const action = button.dataset.action;
    switch (action) {
      case 'start-app': navigate('profile'); break;
      case 'toggle-menu': state.menuOpen = !state.menuOpen; render({ preserveFocus: true }); break;
      case 'close-menu': state.menuOpen = false; render({ preserveFocus: true }); break;
      case 'toggle-theme': state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; save(); render({ preserveFocus: true }); break;
      case 'toggle-motion': state.settings.motion = state.settings.motion === 'reduced' ? 'full' : 'reduced'; save(); render({ preserveFocus: true }); break;
      case 'open-settings': state.modal = { type: 'settings' }; render({ preserveFocus: true }); break;
      case 'close-modal': state.modal = null; render({ preserveFocus: true }); break;
      case 'ask-reset': state.modal = { type: 'reset' }; render({ preserveFocus: true }); break;
      case 'confirm-reset': localStorage.removeItem(STORAGE_KEY); Object.assign(state, clone(DEFAULT_STATE)); state.modal = null; save(); toast('Saved progress was reset.'); navigate('welcome'); break;
      case 'mark-complete': markLesson(button.dataset.screen); render({ preserveFocus: true }); break;
      case 'lesson-answer': handleLessonAnswer(button); break;
      case 'regen-clusters': state.cluster.seed += 13; save(); render({ preserveFocus: true }); break;
      case 'rl-reset': resetRL(); render({ preserveFocus: true }); break;
      case 'rl-move': moveRL(button.dataset.direction); break;
      case 'algorithm-filter': state.algorithmFilter = button.dataset.filter; save(); render({ preserveFocus: true }); break;
      case 'open-algorithm': uniquePush(state.exploredAlgorithms, button.dataset.id); state.modal = { type: 'algorithm', id: button.dataset.id }; save(); render({ preserveFocus: true }); break;
      case 'use-algorithm': state.modal = null; save(); navigate('scenario'); break;
      case 'scenario-category': window.MLC.handleScenarioCategory(button.dataset.value); break;
      case 'scenario-continue': state.scenario.stage = button.dataset.stage; save(); render({ preserveFocus: true }); break;
      case 'scenario-algorithm': window.MLC.handleScenarioAlgorithm(button.dataset.value); break;
      case 'scenario-next': window.MLC.nextScenario(); break;
      case 'scenario-reset': state.scenario = clone(DEFAULT_STATE.scenario); save(); render(); break;
      case 'practice-answer': answerPractice(button.dataset.value); break;
      case 'practice-next': nextPractice(); break;
      case 'practice-reset': resetPractice(); break;
      case 'quiz-start': state.quiz.started = true; state.quiz.index = 0; state.quiz.answers = {}; state.quiz.submitted = false; state.quiz.reviewMode = false; save(); render(); break;
      case 'quiz-answer': answerQuiz(button.dataset.value); break;
      case 'quiz-next': state.quiz.index = Math.min(D.quizQuestions.length - 1, state.quiz.index + 1); save(); render(); break;
      case 'quiz-prev': state.quiz.index = Math.max(0, state.quiz.index - 1); save(); render(); break;
      case 'quiz-submit': submitQuiz(); break;
      case 'quiz-retry': resetQuiz(); break;
      case 'quiz-review': state.quiz.reviewMode = !state.quiz.reviewMode; save(); render({ preserveFocus: true }); break;
      case 'download-guide': downloadGuide(); break;
      case 'export-progress': exportProgress(); break;
      case 'print-results': window.print(); break;
      default: break;
    }
  }

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-nav]');
    if (nav) { event.preventDefault(); navigate(nav.dataset.nav); return; }
    const action = event.target.closest('[data-action]');
    if (action) {
      const clickedBackdrop = action.classList.contains('modal-backdrop');
      if (clickedBackdrop && action.dataset.action === 'close-modal' && event.target.closest('[data-modal-panel]')) return;
      if (clickedBackdrop && action.dataset.action === 'close-menu' && event.target.closest('[data-menu-panel]')) return;
      event.preventDefault(); handleAction(action);
    }
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      const data = new FormData(event.target);
      state.profile.name = String(data.get('name') || '').trim() || 'Learner';
      state.profile.goal = String(data.get('goal') || D.objectives[0].short);
      state.profile.minutes = String(data.get('minutes') || '15');
      state.profile.complete = true;
      save(); toast(`Welcome, ${state.profile.name.split(/\s+/)[0]}. Your learning plan is ready.`); navigate('home');
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'cluster-k') {
      state.cluster.k = Number(event.target.value); save(); render({ preserveFocus: true });
      requestAnimationFrame(() => { const slider = document.getElementById('cluster-k'); if (slider) slider.focus(); });
    }
    if (event.target.id === 'glossary-search') {
      state.glossary.query = event.target.value; save(); render({ preserveFocus: true });
      requestAnimationFrame(() => { const input = document.getElementById('glossary-search'); if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } });
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'glossary-category') { state.glossary.category = event.target.value; save(); render({ preserveFocus: true }); }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && (state.modal || state.menuOpen)) { state.modal = null; state.menuOpen = false; render({ preserveFocus: true }); }
  });
  window.addEventListener('hashchange', () => { shouldFocusHeading = true; render(); window.scrollTo({ top: 0, behavior: state.settings.motion === 'reduced' ? 'auto' : 'smooth' }); });

  window.MLC = {
    D, state, screens, icon, escapeHTML, save, render, navigate, screenHeader, screenFooter,
    objectiveTag, statusChip, progressRing, completionMetrics, xpTotal, earnedBadges,
    objectiveStats, markLesson, clusterPoints, toast, confetti, uniquePush, currentPracticeQuestion
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.dataset.motion = state.settings.motion;
    if (!location.hash) location.hash = `#/${state.profile.complete ? 'home' : 'welcome'}`;
    else render();
  });
})();
