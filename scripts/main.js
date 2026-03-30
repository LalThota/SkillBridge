import { gigs, learningTracks, notifications, chatbotHints } from '../data/mockData.js';

const STORAGE_TOKEN_KEY = 'skillbridgeToken';
const STORAGE_PROGRESS_KEY = 'skillbridgeProgress';
const DEMO_EMAIL = 'lal98thota@gmail.com';
const DEMO_PASSWORD = 'Lalsatya98';
const DEMO_NAME = 'Lal Thota';
const DEMO_TOKEN = 'skillbridge-demo-token';

const state = {
  page: 'dashboard',
  category: 'All',
  skill: 'All',
  maxPrice: 50000,
  query: '',
  completedSkills: new Set(['HTML & CSS']),
  badges: { 'HTML & CSS': 'Beginner' },
  currentLearningSkill: 'HTML & CSS',
  currentQuizAnswers: {},
  currentQuizSet: [],
  darkMode: false,
  xp: 120,
  streak: 4,
  selectedGig: null,
  completedGigs: 0,
  completedCourses: 1,
  activeDays: 1,
  activeDates: new Set(),
  lastActiveDate: '',
  learningActivityLog: {},
  calendarMonthOffset: 0,
  token: '',
  userName: 'Guest User'
};

const els = {
  loader: document.getElementById('loading-screen'),
  app: document.getElementById('app'),
  nav: document.getElementById('top-nav'),
  heroTyped: document.getElementById('hero-typed-text'),
  toastWrap: document.getElementById('toast-wrap'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  pageTitle: document.getElementById('page-title'),
  navLinks: document.querySelectorAll('[data-nav]'),
  topNavLinks: document.querySelectorAll('.top-nav__link[data-nav]'),
  pageSections: document.querySelectorAll('.page-section'),
  gigsGrid: document.getElementById('gigs-grid'),
  noGigs: document.getElementById('empty-gigs'),
  searchInput: document.getElementById('gig-search'),
  suggestBox: document.getElementById('search-suggestions'),
  categoryFilter: document.getElementById('filter-category'),
  skillFilter: document.getElementById('filter-skill'),
  priceFilter: document.getElementById('filter-price'),
  priceLabel: document.getElementById('price-value'),
  recsWrap: document.getElementById('recommended-gigs'),
  recsLearnWrap: document.getElementById('recommended-after-learn'),
  notificationsWrap: document.getElementById('notifications-list'),
  notificationsToggle: document.getElementById('btn-notifications'),
  notificationsDropdown: document.getElementById('notification-dropdown'),
  authModal: document.getElementById('auth-modal'),
  authForm: document.getElementById('auth-form'),
  authTabs: document.querySelectorAll('[data-auth-tab]'),
  authModeInput: document.getElementById('auth-mode'),
  skillProgress: document.getElementById('skill-progress-list'),
  learningSkillTitle: document.getElementById('learning-skill-title'),
  lessonNotes: document.getElementById('lesson-notes'),
  videoWrap: document.getElementById('video-embeds'),
  practiceTask: document.getElementById('practice-task'),
  quizWrap: document.getElementById('quiz-wrap'),
  quizResult: document.getElementById('quiz-result'),
  badgeWrap: document.getElementById('badge-earned'),
  learnSkillSelect: document.getElementById('learn-skill-select'),
  startLearningBtn: document.getElementById('btn-start-learning'),
  gigModal: document.getElementById('gig-modal'),
  gigModalBody: document.getElementById('gig-modal-body'),
  chartCanvas: document.getElementById('earnings-chart'),
  taskBoard: document.getElementById('task-board'),
  chatHints: document.getElementById('chat-hints'),
  chatInput: document.getElementById('chat-input'),
  chatSend: document.getElementById('chat-send'),
  chatLog: document.getElementById('chat-log'),
  darkToggle: document.getElementById('theme-toggle'),
  voiceBtn: document.getElementById('voice-search-btn'),
  statUsers: document.getElementById('stat-users'),
  statGigs: document.getElementById('stat-gigs'),
  statXP: document.getElementById('xp-value'),
  statStreak: document.getElementById('streak-value'),
  statCompletedGigs: document.getElementById('stat-completed-gigs'),
  statCompletedCourses: document.getElementById('stat-completed-courses'),
  statActiveDays: document.getElementById('stat-active-days'),
  calendarWrap: document.getElementById('active-days-calendar'),
  calendarMonthLabel: document.getElementById('calendar-month-label'),
  calendarPrevBtn: document.getElementById('calendar-prev'),
  calendarNextBtn: document.getElementById('calendar-next'),
  topNavLogin: document.getElementById('top-nav-login'),
  topNavSignup: document.getElementById('top-nav-signup'),
  topNavUserMenu: document.getElementById('top-nav-user-menu'),
  topNavUserChip: document.getElementById('top-nav-user-chip'),
  topNavUserDropdown: document.getElementById('top-nav-user-dropdown'),
  topNavUserLogout: document.getElementById('top-nav-user-logout'),
  sidebarUserName: document.getElementById('sidebar-user-name'),
  sidebarUserRole: document.getElementById('sidebar-user-role'),
  profileUserName: document.getElementById('profile-user-name')
};

const typingWords = ['Learn', 'Practice', 'Verify', 'Earn'];
let typeWordIndex = 0;
let typeCharIndex = 0;
let deleting = false;
let heroWordTimer = null;

function buildDemoUserPayload() {
  return {
    id: 'demo-user-1',
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    completedSkills: Array.from(state.completedSkills),
    badges: state.badges,
    xp: state.xp,
    streak: state.streak,
    completedGigs: state.completedGigs,
    completedCourses: state.completedCourses,
    activeDays: state.activeDays,
    activeDates: Array.from(state.activeDates),
    lastActiveDate: state.lastActiveDate
  };
}

async function init() {
  bindEvents();
  loadLocalProgress();
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token === DEMO_TOKEN) {
    state.token = token;
  } else if (token) {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }

  if (state.token) {
    showUserDashboard();
  } else {
    showLandingPage();
  }

  restoreSession();
  trackDailyActivity();
  fakeBoot();
}

function showLandingPage() {
  const landingSection = document.getElementById('page-landing');
  const userPageHeader = document.getElementById('user-page-header');
  const userSections = document.querySelectorAll('[data-page]');
  const layout = document.querySelector('.layout');

  els.pageSections.forEach((section) => section.classList.remove('page-section--active'));
  if (landingSection) {
    landingSection.removeAttribute('hidden');
    landingSection.classList.add('page-section--active');
  }

  userSections.forEach((section) => section.setAttribute('hidden', ''));
  if (userPageHeader) userPageHeader.setAttribute('hidden', '');
  if (layout) layout.classList.add('layout--full');
  
  // Update top-nav to show auth buttons only
  updateTopNavForGuest();

  // Landing sections use reveal classes and must be observed in guest mode.
  initRevealAnimation();

  // Keep hero stats meaningful on landing as well.
  initCounters();
  syncGamification();

  // Keep hero headline animated for guest view as well.
  startTypingHeadline();
}

function showUserDashboard() {
  const landingSection = document.getElementById('page-landing');
  const userPageHeader = document.getElementById('user-page-header');
  const userSections = document.querySelectorAll('[data-page]');
  const layout = document.querySelector('.layout');

  // Show user content, hide landing
  els.pageSections.forEach((section) => section.classList.remove('page-section--active'));
  if (landingSection) landingSection.setAttribute('hidden', '');
  userSections.forEach((section) => section.removeAttribute('hidden'));
  if (userPageHeader) userPageHeader.removeAttribute('hidden');
  if (layout) layout.classList.remove('layout--full');

  // Show auth info in top-nav
  updateTopNavForUser();

  // Initialize user dashboard
  renderNotifications();
  renderSkillSelect();
  renderSkillProgress();
  renderGigs();
  renderRecommendations();
  renderLearningModule(state.currentLearningSkill);
  initCounters();
  initRevealAnimation();
  initChart();
  initTaskBoard();
  renderChatHints();
  startTypingHeadline();
  syncGamification();
  updateDashboardStats();
  renderActiveDaysCalendar();
  navigate('dashboard');
}

function updateTopNavForGuest() {
  els.topNavLinks.forEach((link) => {
    link.style.display = 'none';
  });
  if (els.topNavLogin) els.topNavLogin.hidden = false;
  if (els.topNavSignup) els.topNavSignup.hidden = false;
  if (els.topNavUserMenu) els.topNavUserMenu.hidden = true;
  if (els.topNavUserDropdown) els.topNavUserDropdown.classList.remove('user-menu__dropdown--active');
}

function updateTopNavForUser() {
  els.topNavLinks.forEach((link) => {
    link.style.display = 'inline-block';
  });
  if (els.topNavLogin) els.topNavLogin.hidden = true;
  if (els.topNavSignup) els.topNavSignup.hidden = true;
  if (els.topNavUserMenu) els.topNavUserMenu.hidden = false;
  if (els.topNavUserChip) {
    els.topNavUserChip.textContent = state.userName;
  }
}

function performLogout() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  state.token = '';
  state.userName = 'Guest User';
  if (els.topNavUserDropdown) els.topNavUserDropdown.classList.remove('user-menu__dropdown--active');
  showToast('Logged out successfully.', 'success');
  renderUserIdentity();
  showLandingPage();
}

function renderUserIdentity() {
  if (els.sidebarUserName) {
    els.sidebarUserName.textContent = state.userName || 'Guest User';
  }
  if (els.sidebarUserRole) {
    els.sidebarUserRole.textContent = state.token ? 'Logged In Member' : 'Verified Freelancer';
  }
  if (els.profileUserName) {
    els.profileUserName.textContent = state.userName || 'Guest User';
  }
  if (state.token) {
    updateTopNavForUser();
  } else {
    updateTopNavForGuest();
  }
}

function fakeBoot() {
  setTimeout(() => {
    els.loader.classList.add('loading-screen--done');
    els.app.removeAttribute('hidden');
    const message = state.token ? 'Welcome back! SkillBridge is ready.' : 'Welcome to SkillBridge. Learn. Verify. Earn.';
    showToast(message, 'success');
  }, 220);
}

function bindEvents() {
  window.addEventListener('scroll', () => {
    els.nav.classList.toggle('top-nav--shrink', window.scrollY > 24);
  });

  document.querySelectorAll('[data-ripple]').forEach((btn) => {
    btn.addEventListener('click', createRipple);
  });

  els.navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const next = link.dataset.nav;
      navigate(next);
      if (window.innerWidth < 900) closeSidebar();
    });
  });

  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    els.sidebar.classList.add('sidebar--open');
    els.sidebarOverlay.classList.add('sidebar-overlay--active');
  });

  els.sidebarOverlay.addEventListener('click', closeSidebar);

  document.getElementById('btn-find-work').addEventListener('click', () => navigate('gigs'));
  document.getElementById('btn-start-learning-hero').addEventListener('click', () => navigate('learn'));

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', performLogout);
  }

  if (els.topNavUserChip) {
    els.topNavUserChip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (els.topNavUserDropdown) {
        els.topNavUserDropdown.classList.toggle('user-menu__dropdown--active');
      }
    });
  }

  if (els.topNavUserLogout) {
    els.topNavUserLogout.addEventListener('click', performLogout);
  }

  if (els.calendarPrevBtn) {
    els.calendarPrevBtn.addEventListener('click', () => {
      state.calendarMonthOffset -= 1;
      renderActiveDaysCalendar();
    });
  }

  if (els.calendarNextBtn) {
    els.calendarNextBtn.addEventListener('click', () => {
      state.calendarMonthOffset += 1;
      renderActiveDaysCalendar();
    });
  }

  document.querySelectorAll('[data-open-auth]').forEach((btn) => {
    btn.addEventListener('click', () => openAuth('login'));
  });
  document.querySelectorAll('[data-open-signup]').forEach((btn) => {
    btn.addEventListener('click', () => openAuth('signup'));
  });

  document.querySelectorAll('[data-close-auth]').forEach((btn) => {
    btn.addEventListener('click', closeAuth);
  });

  els.authTabs.forEach((tab) => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
  });

  els.authForm.addEventListener('submit', handleAuthSubmit);

  els.searchInput.addEventListener('input', (e) => {
    state.query = e.target.value.trim();
    renderSuggestions();
    renderGigs();
  });

  els.suggestBox.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-suggestion]');
    if (!btn) return;
    els.searchInput.value = btn.dataset.suggestion;
    state.query = btn.dataset.suggestion;
    els.suggestBox.innerHTML = '';
    renderGigs();
  });

  els.categoryFilter.addEventListener('change', (e) => {
    state.category = e.target.value;
    renderGigs();
  });

  els.skillFilter.addEventListener('change', (e) => {
    state.skill = e.target.value;
    renderGigs();
  });

  els.priceFilter.addEventListener('input', (e) => {
    state.maxPrice = Number(e.target.value);
    els.priceLabel.textContent = `₹${state.maxPrice.toLocaleString()}`;
    renderGigs();
  });

  els.notificationsToggle.addEventListener('click', () => {
    els.notificationsDropdown.classList.toggle('notification-dropdown--active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-center')) {
      els.notificationsDropdown.classList.remove('notification-dropdown--active');
    }
    if (!e.target.closest('.user-menu') && els.topNavUserDropdown) {
      els.topNavUserDropdown.classList.remove('user-menu__dropdown--active');
    }
  });

  els.learnSkillSelect.addEventListener('change', (e) => {
    state.currentLearningSkill = e.target.value;
    renderLearningModule(state.currentLearningSkill);
  });

  els.startLearningBtn.addEventListener('click', () => {
    navigate('learn');
    showToast(`Learning module opened for ${state.currentLearningSkill}.`, 'info');
  });

  document.getElementById('quiz-submit').addEventListener('click', submitQuiz);

  document.querySelectorAll('[data-close-gig-modal]').forEach((btn) => {
    btn.addEventListener('click', closeGigModal);
  });

  els.gigModal.addEventListener('click', (e) => {
    if (e.target === els.gigModal) closeGigModal();
  });

  els.darkToggle.addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('theme-dark', state.darkMode);
    showToast(state.darkMode ? 'Dark mode enabled.' : 'Light mode enabled.', 'info');
  });

  els.chatSend.addEventListener('click', handleChatSubmit);
  els.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });

  els.chatHints.addEventListener('click', (e) => {
    const hint = e.target.closest('button[data-chat-hint]');
    if (!hint) return;
    els.chatInput.value = hint.dataset.chatHint;
    handleChatSubmit();
  });

  els.voiceBtn.addEventListener('click', startVoiceSearch);
}

function navigate(page) {
  const isGuest = !state.token;
  const userSections = document.querySelectorAll('[data-page]');

  // Guard against blank states: if landing should be shown, force it.
  if (isGuest && page === 'landing') {
    showLandingPage();
    return;
  }

  state.page = page;
  userSections.forEach((section) => {
    const isTarget = section.id === `page-${page}`;
    section.classList.toggle('page-section--active', isTarget);
    section.toggleAttribute('hidden', !isTarget);
  });

  els.navLinks.forEach((link) => {
    if (link.classList.contains('sidebar-link')) {
      link.classList.toggle('sidebar-link--active', link.dataset.nav === page);
    }
  });

  els.topNavLinks.forEach((link) => {
    link.classList.toggle('top-nav__link--active', link.dataset.nav === page);
  });

  els.pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
}

function closeSidebar() {
  els.sidebar.classList.remove('sidebar--open');
  els.sidebarOverlay.classList.remove('sidebar-overlay--active');
}

function renderGigs() {
  const filtered = gigs.filter((gig) => {
    const matchesCategory = state.category === 'All' || gig.category === state.category;
    const matchesSkill = state.skill === 'All' || gig.skill === state.skill;
    const matchesPrice = gig.price <= state.maxPrice;
    const q = state.query.toLowerCase();
    const matchesQuery = !q || [gig.title, gig.skill, gig.company, gig.category].join(' ').toLowerCase().includes(q);
    return matchesCategory && matchesSkill && matchesPrice && matchesQuery;
  });

  els.gigsGrid.innerHTML = '';

  if (!filtered.length) {
    els.noGigs.hidden = false;
    return;
  }

  els.noGigs.hidden = true;

  filtered.forEach((gig) => {
    const hasSkill = state.completedSkills.has(gig.requiredSkill);
    const card = document.createElement('article');
    card.className = 'gig-card reveal';
    card.innerHTML = `
      <div class="gig-card__top">
        <span class="pill">${gig.category}</span>
        <span class="gig-card__price">₹${gig.price.toLocaleString()}</span>
      </div>
      <h3>${gig.title}</h3>
      <p class="gig-card__company">${gig.company}</p>
      <div class="gig-card__meta">
        <span>Skill: ${gig.skill}</span>
        <span>Time: ${gig.hours}</span>
      </div>
      <p class="gig-card__desc">${gig.description}</p>
      <div class="gig-card__actions">
        <button class="btn btn--ghost" data-ripple data-open-gig="${gig.id}">View Details</button>
        <button class="btn btn--primary" data-ripple data-open-gig="${gig.id}">${hasSkill ? 'Apply Now' : 'Check Skill Gap'}</button>
      </div>
    `;
    els.gigsGrid.appendChild(card);
  });

  els.gigsGrid.querySelectorAll('[data-open-gig]').forEach((btn) => {
    btn.addEventListener('click', () => openGigModal(Number(btn.dataset.openGig)));
  });
}

function renderSuggestions() {
  const q = state.query.toLowerCase();
  if (!q) {
    els.suggestBox.innerHTML = '';
    return;
  }

  const suggestions = gigs
    .flatMap((g) => [g.title, g.skill, g.company])
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .filter((value) => value.toLowerCase().includes(q))
    .slice(0, 6);

  els.suggestBox.innerHTML = suggestions.map((s) => `<button type="button" data-suggestion="${s}">${s}</button>`).join('');
}

function openGigModal(id) {
  const gig = gigs.find((item) => item.id === id);
  if (!gig) return;
  state.selectedGig = gig;

  const hasSkill = state.completedSkills.has(gig.requiredSkill);

  els.gigModalBody.innerHTML = `
    <h3>${gig.title}</h3>
    <p class="modal-company">${gig.company}</p>
    <div class="modal-stats">
      <span>Price: ₹${gig.price.toLocaleString()}</span>
      <span>Skill: ${gig.skill}</span>
      <span>Time: ${gig.hours}</span>
    </div>
    <p class="modal-desc">${gig.description}</p>
    ${
      hasSkill
        ? '<div class="modal-ok">You meet the skill requirement. You can apply now.</div>'
        : `<div class="modal-warning">You need <strong>${gig.requiredSkill}</strong> to perform this task.</div>
           <button class="btn btn--primary" id="modal-start-learning" data-ripple>Start Learning</button>`
    }
    <div class="modal-actions">
      <button class="btn btn--ghost" data-close-gig-modal>Close</button>
      <button class="btn btn--primary" id="modal-apply" data-ripple ${hasSkill ? '' : 'disabled'}>Apply</button>
    </div>
  `;

  els.gigModal.classList.add('modal-overlay--active');

  const learnBtn = document.getElementById('modal-start-learning');
  if (learnBtn) {
    learnBtn.addEventListener('click', () => {
      state.currentLearningSkill = gig.requiredSkill;
      els.learnSkillSelect.value = gig.requiredSkill;
      renderLearningModule(gig.requiredSkill);
      closeGigModal();
      navigate('learn');
      showToast(`Switched to ${gig.requiredSkill} learning track.`, 'info');
    });
  }

  const applyBtn = document.getElementById('modal-apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      closeGigModal();
      state.completedGigs += 1;
      gainXP(15);
      updateDashboardStats();
      persistProgress();
      await syncRemoteActivity();
      showToast('Application submitted successfully.', 'success');
    });
  }

  els.gigModalBody.querySelectorAll('[data-close-gig-modal]').forEach((btn) => btn.addEventListener('click', closeGigModal));
}

function closeGigModal() {
  els.gigModal.classList.remove('modal-overlay--active');
}

function renderSkillSelect() {
  const skills = Object.keys(learningTracks);
  els.learnSkillSelect.innerHTML = skills.map((skill) => `<option value="${skill}">${skill}</option>`).join('');
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let t = seed;
  return function rand() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(items, randomFn) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildFallbackQuestion(skill, index) {
  return {
    q: `${skill} Mandatory Question ${index + 1}: Select the correct statement for this course topic.`,
    options: ['Incorrect concept', 'Partially correct', 'Correct best-practice statement', 'Unrelated statement'],
    a: 2
  };
}

function normalizeQuestion(raw) {
  const baseOptions = Array.isArray(raw.options) ? [...raw.options] : [];
  while (baseOptions.length < 4) {
    baseOptions.push(`Option ${baseOptions.length + 1}`);
  }

  const optionPairs = baseOptions.map((text, idx) => ({ text, isAnswer: idx === raw.a }));
  const shuffledPairs = seededShuffle(optionPairs, Math.random);
  const answerIndex = shuffledPairs.findIndex((item) => item.isAnswer);

  return {
    q: raw.q,
    options: shuffledPairs.map((item) => item.text),
    a: answerIndex < 0 ? 0 : answerIndex
  };
}

function buildUserQuizSet(skill, quizPool) {
  const source = Array.isArray(quizPool) ? [...quizPool] : [];
  const userSeedKey = `${state.userName || 'Guest User'}|${skill}`;
  const random = mulberry32(hashString(userSeedKey));

  let ordered = seededShuffle(source, random);
  if (ordered.length < 10) {
    const missing = 10 - ordered.length;
    for (let i = 0; i < missing; i += 1) {
      ordered.push(buildFallbackQuestion(skill, ordered.length));
    }
  }

  const normalized = ordered.slice(0, 10).map((q) => normalizeQuestion(q));

  if (normalized.length < 10) {
    const missing = 10 - normalized.length;
    for (let i = 0; i < missing; i += 1) {
      normalized.push(normalizeQuestion(buildFallbackQuestion(skill, i)));
    }
  }

  return normalized.slice(0, 10);
}

function rewardLearningXP(skill) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `${today}:${skill}`;
  if (state.learningActivityLog[key]) return;
  state.learningActivityLog[key] = true;
  gainXP(10);
  persistProgress();
  syncRemoteActivity();
}

function renderLearningModule(skill) {
  const track = learningTracks[skill];
  if (!track) return;

  rewardLearningXP(skill);

  state.currentQuizAnswers = {};
  state.currentQuizSet = buildUserQuizSet(skill, track.quiz);
  if (!Array.isArray(state.currentQuizSet) || state.currentQuizSet.length !== 10) {
    state.currentQuizSet = Array.from({ length: 10 }).map((_, idx) =>
      normalizeQuestion(buildFallbackQuestion(skill, idx))
    );
  }
  els.quizResult.textContent = '';
  els.badgeWrap.textContent = '';

  els.learningSkillTitle.textContent = `${skill} Learning Module`;
  els.lessonNotes.innerHTML = track.notes.map((note) => `<li>${note}</li>`).join('');
  els.videoWrap.innerHTML = track.videos
    .map(
      (video) => `
      <div class="video-frame-wrap">
        <iframe src="${video}" title="${skill} tutorial" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `
    )
    .join('');
  els.practiceTask.textContent = track.practiceTask;

  els.quizWrap.innerHTML = state.currentQuizSet
    .map(
      (item, idx) => `
      <div class="quiz-item">
        <p>${idx + 1}. ${item.q}</p>
        <div class="quiz-options">
          ${item.options
            .map(
              (option, optionIndex) => `
            <label>
              <input type="radio" name="q-${idx}" value="${optionIndex}" />
              <span>${option}</span>
            </label>
          `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const renderedCount = els.quizWrap.querySelectorAll('.quiz-item').length;
  if (renderedCount !== 10) {
    const fallbackSet = Array.from({ length: 10 }).map((_, idx) => normalizeQuestion(buildFallbackQuestion(skill, idx)));
    state.currentQuizSet = fallbackSet;
    els.quizWrap.innerHTML = fallbackSet
      .map(
        (item, idx) => `
        <div class="quiz-item">
          <p>${idx + 1}. ${item.q}</p>
          <div class="quiz-options">
            ${item.options
              .map(
                (option, optionIndex) => `
              <label>
                <input type="radio" name="q-${idx}" value="${optionIndex}" />
                <span>${option}</span>
              </label>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');
  }
}

async function submitQuiz() {
  const skill = state.currentLearningSkill;
  const quizSet = state.currentQuizSet;
  if (!Array.isArray(quizSet) || quizSet.length !== 10) {
    showToast('Quiz setup issue detected. Please reload the course module.', 'warning');
    return;
  }

  let answered = 0;
  for (let idx = 0; idx < 10; idx += 1) {
    const checked = document.querySelector(`input[name="q-${idx}"]:checked`);
    if (checked) answered += 1;
  }

  if (answered < 10) {
    els.quizResult.textContent = `All 10 questions are compulsory. Please answer all questions before submitting.`;
    els.quizResult.className = 'quiz-result quiz-result--fail';
    showToast('All 10 questions are compulsory.', 'warning');
    return;
  }

  let score = 0;
  quizSet.forEach((q, idx) => {
    const checked = document.querySelector(`input[name="q-${idx}"]:checked`);
    if (checked && Number(checked.value) === q.a) score += 1;
  });

  if (score >= 7) {
    const wasCompleted = state.completedSkills.has(skill);
    state.completedSkills.add(skill);
    const level = score >= 9 ? 'Verified' : score >= 8 ? 'Intermediate' : 'Beginner';
    state.badges[skill] = level;

    if (!wasCompleted) {
      state.completedCourses += 1;
    }

    els.quizResult.textContent = `You scored ${score}/10. Course completed successfully.`;
    els.quizResult.className = 'quiz-result quiz-result--pass';
    els.badgeWrap.textContent = `You earned ${skill} ${level} Badge. Redirecting to gigs...`;
    showToast('Successfully completed the course. Moving to gigs.', 'success');
    gainXP(80);
    renderSkillProgress();
    renderRecommendations(skill);
    renderGigs();
    updateDashboardStats();
    persistProgress();
    await syncRemoteActivity();
    setTimeout(() => {
      navigate('gigs');
    }, 900);
  } else {
    els.quizResult.textContent = `You scored ${score}/10. You have not passed the course. Make sure to complete the course again and get back.`;
    els.quizResult.className = 'quiz-result quiz-result--fail';
    showToast('You have not passed the course. Complete it again and come back.', 'warning');
  }
}

function renderSkillProgress() {
  const skills = Object.keys(learningTracks);
  const completed = skills.filter((skill) => state.completedSkills.has(skill)).length;
  const progressPct = Math.round((completed / skills.length) * 100);

  els.skillProgress.innerHTML = skills
    .map((skill) => {
      const done = state.completedSkills.has(skill);
      const level = state.badges[skill] || 'Not verified';
      return `
        <div class="skill-progress-item">
          <div>
            <strong>${skill}</strong>
            <p>${done ? `Badge: ${level}` : 'Status: In progress'}</p>
          </div>
          <span class="${done ? 'ok' : 'pending'}">${done ? 'Completed' : 'Learning'}</span>
        </div>
      `;
    })
    .join('');

  document.getElementById('skills-complete-count').textContent = `${completed}/${skills.length}`;
  document.getElementById('skills-progress-bar').style.width = `${progressPct}%`;
}

function renderRecommendations(skillJustCompleted = '') {
  const sourceSkill = skillJustCompleted || state.currentLearningSkill;
  const recs = gigs.filter((gig) => gig.skill === sourceSkill).slice(0, 3);
  const html = recs
    .map(
      (gig) => `
      <article class="mini-gig">
        <h4>${gig.title}</h4>
        <p>${gig.company}</p>
        <div><span>₹${gig.price.toLocaleString()}</span><span>${gig.hours}</span></div>
        <button class="btn btn--ghost" data-rec-gig="${gig.id}" data-ripple>Open Gig</button>
      </article>
    `
    )
    .join('');

  els.recsWrap.innerHTML = html;
  els.recsLearnWrap.innerHTML = recs.length
    ? `<p>Now you can apply for these ${sourceSkill} gigs:</p>${html}`
    : '<p>No recommendations yet. Complete a skill quiz to unlock suggestions.</p>';

  document.querySelectorAll('[data-rec-gig]').forEach((btn) => btn.addEventListener('click', () => openGigModal(Number(btn.dataset.recGig))));
}

function renderNotifications() {
  els.notificationsWrap.innerHTML = notifications.map((note) => `<li>${note}</li>`).join('');
}

function renderChatHints() {
  els.chatHints.innerHTML = chatbotHints
    .map((hint) => `<button type="button" data-chat-hint="${hint}">${hint}</button>`)
    .join('');
}

function handleChatSubmit() {
  const text = els.chatInput.value.trim();
  if (!text) return;
  appendChat('You', text);

  const reply = getBotReply(text);
  setTimeout(() => appendChat('SkillBridge AI', reply), 450);
  els.chatInput.value = '';
}

function appendChat(author, msg) {
  const item = document.createElement('div');
  item.className = `chat-message ${author === 'You' ? 'chat-message--user' : ''}`;
  item.innerHTML = `<strong>${author}</strong><p>${msg}</p>`;
  els.chatLog.appendChild(item);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function getBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes('plan') || t.includes('learn')) {
    return 'Recommended plan: 1) 20 min notes, 2) 30 min video, 3) practice task, 4) quiz attempt. Repeat for 5 days.';
  }
  if (t.includes('gigs') || t.includes('apply')) {
    return 'Based on your current badges, prioritize HTML & CSS and JavaScript gigs under 30k for faster acceptance.';
  }
  if (t.includes('profile')) {
    return 'Boost profile conversion by adding 3 quantified achievements, 1 featured project, and a clear availability statement.';
  }
  return 'I can help with learning plans, gig matching, profile optimization, and interview preparation.';
}

function initCounters() {
  animateCount(els.statUsers, 500, '+');
  animateCount(els.statGigs, 50, '+');
}

function animateCount(el, target, suffix) {
  if (!el) return;
  const start = performance.now();
  const duration = 1600;

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = `${value.toLocaleString()}${progress === 1 ? suffix : ''}`;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function startTypingHeadline() {
  if (!els.heroTyped) return;
  if (heroWordTimer) {
    clearTimeout(heroWordTimer);
    heroWordTimer = null;
  }

  const current = typingWords[typeWordIndex % typingWords.length];
  if (!deleting) {
    typeCharIndex += 1;
  } else {
    typeCharIndex -= 1;
  }

  els.heroTyped.textContent = current.slice(0, typeCharIndex);

  let delay = deleting ? 70 : 120;
  if (!deleting && typeCharIndex === current.length) {
    deleting = true;
    delay = 850;
  } else if (deleting && typeCharIndex === 0) {
    deleting = false;
    typeWordIndex = (typeWordIndex + 1) % typingWords.length;
    delay = 260;
  }

  heroWordTimer = setTimeout(startTypingHeadline, delay);
}

function initRevealAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function showToast(message, type = 'info') {
  const toast = document.createElement('article');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  els.toastWrap.appendChild(toast);
  setTimeout(() => toast.classList.add('toast--show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 240);
  }, 2800);
}

function createRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  circle.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${e.clientX - rect.left - size / 2}px`;
  circle.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 500);
}

function setAuthMode(mode) {
  els.authModeInput.value = mode;
  els.authTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === mode));
  document.getElementById('auth-submit-text').textContent = mode === 'signup' ? 'Create account' : 'Continue';
}

function openAuth(mode) {
  setAuthMode(mode);
  els.authModal.classList.add('auth-modal--active');
}

function closeAuth() {
  els.authModal.classList.remove('auth-modal--active');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const mode = els.authModeInput.value;

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const passOk = password.length >= 6;

  clearFieldErrors();

  let hasError = false;
  if (mode === 'signup' && !name) {
    setFieldError('auth-name', 'Name is required.');
    hasError = true;
  }
  if (!emailOk) {
    setFieldError('auth-email', 'Enter a valid email address.');
    hasError = true;
  }
  if (!passOk) {
    setFieldError('auth-password', 'Password must be at least 6 characters.');
    hasError = true;
  }

  if (hasError) return;

  if (mode === 'signup') {
    showToast('Signup is disabled in demo mode. Use the demo login credentials.', 'info');
    return;
  }

  if (email.toLowerCase() !== DEMO_EMAIL) {
    setFieldError('auth-email', 'Demo email is required: lal98thota@gmail.com');
    return;
  }

  if (password !== DEMO_PASSWORD) {
    setFieldError('auth-password', 'Incorrect demo password. Use: Lalsatya98');
    return;
  }

  applySession(DEMO_TOKEN, buildDemoUserPayload());
  closeAuth();
  showToast('Logged in with demo account.', 'success');
}

function setFieldError(id, message) {
  const field = document.getElementById(id);
  const error = field.parentElement.querySelector('.field-error');
  if (error) error.textContent = message;
  field.classList.add('field--invalid');
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  document.querySelectorAll('.field--invalid').forEach((el) => el.classList.remove('field--invalid'));
}

function initChart() {
  if (!window.Chart || !els.chartCanvas) return;

  // eslint-disable-next-line no-new
  new Chart(els.chartCanvas, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Earnings (₹)',
          data: [3200, 4500, 3800, 5200, 6100, 4900, 7300],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.16)',
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function initTaskBoard() {
  if (!els.taskBoard) return;

  const cards = els.taskBoard.querySelectorAll('.task-card');
  const columns = els.taskBoard.querySelectorAll('.task-column__dropzone');

  cards.forEach((card) => {
    card.addEventListener('dragstart', () => card.classList.add('task-card--dragging'));
    card.addEventListener('dragend', () => card.classList.remove('task-card--dragging'));
  });

  columns.forEach((column) => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      const card = document.querySelector('.task-card--dragging');
      if (card) column.appendChild(card);
    });
  });
}

function gainXP(points) {
  state.xp += points;
  if (state.xp % 100 < points) state.streak += 1;
  syncGamification();
}

function syncGamification() {
  els.statXP.textContent = state.xp;
  els.statStreak.textContent = state.streak;
}

function updateDashboardStats() {
  els.statCompletedGigs.textContent = String(state.completedGigs);
  els.statCompletedCourses.textContent = String(state.completedCourses);
  els.statActiveDays.textContent = String(state.activeDays);
}

function renderActiveDaysCalendar() {
  if (!els.calendarWrap || !els.calendarMonthLabel) return;

  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + state.calendarMonthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = new Date().toISOString().slice(0, 10);

  els.calendarMonthLabel.textContent = viewDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = [];
  weekdays.forEach((day) => {
    cells.push(`<div class="activity-calendar__weekday">${day}</div>`);
  });

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push('<div class="activity-calendar__blank"></div>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isActive = state.activeDates.has(iso);
    const isToday = iso === todayIso;
    const cls = [
      'activity-calendar__day',
      isActive ? 'activity-calendar__day--active' : '',
      isToday ? 'activity-calendar__day--today' : ''
    ]
      .filter(Boolean)
      .join(' ');

    cells.push(`<div class="${cls}" title="${isActive ? 'Active day' : 'Inactive day'}">${day}</div>`);
  }

  els.calendarWrap.innerHTML = cells.join('');
}

function trackDailyActivity() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.activeDates.has(today)) {
    state.activeDates.add(today);
    state.activeDays = state.activeDates.size;
    state.lastActiveDate = today;
    gainXP(15);
    updateDashboardStats();
    renderActiveDaysCalendar();
    persistProgress();
    syncRemoteActivity();
  }
}

function loadLocalProgress() {
  const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
  if (!raw) {
    state.lastActiveDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.completedSkills)) state.completedSkills = new Set(parsed.completedSkills);
    if (parsed.badges && typeof parsed.badges === 'object') state.badges = parsed.badges;
    if (Number.isFinite(parsed.xp)) state.xp = parsed.xp;
    if (Number.isFinite(parsed.streak)) state.streak = parsed.streak;
    if (Number.isFinite(parsed.completedGigs)) state.completedGigs = parsed.completedGigs;
    if (Number.isFinite(parsed.completedCourses)) state.completedCourses = parsed.completedCourses;
    if (Number.isFinite(parsed.activeDays)) state.activeDays = parsed.activeDays;
    if (Array.isArray(parsed.activeDates)) state.activeDates = new Set(parsed.activeDates);
    if (typeof parsed.lastActiveDate === 'string') state.lastActiveDate = parsed.lastActiveDate;
    if (parsed.learningActivityLog && typeof parsed.learningActivityLog === 'object') {
      state.learningActivityLog = parsed.learningActivityLog;
    }
  } catch {
    state.lastActiveDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  }

  if (!state.activeDates.size && state.lastActiveDate) {
    state.activeDates.add(state.lastActiveDate);
  }
  if (state.activeDates.size) {
    state.activeDays = state.activeDates.size;
  }
}

function persistProgress() {
  localStorage.setItem(
    STORAGE_PROGRESS_KEY,
    JSON.stringify({
      completedSkills: Array.from(state.completedSkills),
      badges: state.badges,
      xp: state.xp,
      streak: state.streak,
      completedGigs: state.completedGigs,
      completedCourses: state.completedCourses,
      activeDays: state.activeDays,
      activeDates: Array.from(state.activeDates),
      learningActivityLog: state.learningActivityLog,
      lastActiveDate: state.lastActiveDate
    })
  );
}

function applySession(token, user) {
  state.token = token;
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  applyUserPayload(user);
  showUserDashboard();
}

function applyUserPayload(user) {
  if (!user) return;
  state.userName = (user.name || user.email || 'Guest User').trim();
  state.completedSkills = new Set(user.completedSkills || []);
  state.badges = user.badges || {};
  state.xp = Number.isFinite(user.xp) ? user.xp : state.xp;
  state.streak = Number.isFinite(user.streak) ? user.streak : state.streak;
  state.completedGigs = Number.isFinite(user.completedGigs) ? user.completedGigs : state.completedGigs;
  state.completedCourses = Number.isFinite(user.completedCourses) ? user.completedCourses : state.completedCourses;
  state.activeDays = Number.isFinite(user.activeDays) ? user.activeDays : state.activeDays;
  state.activeDates = new Set(Array.isArray(user.activeDates) ? user.activeDates : []);
  state.lastActiveDate = user.lastActiveDate || state.lastActiveDate;

  if (!state.activeDates.size && state.lastActiveDate) {
    state.activeDates.add(state.lastActiveDate);
  }
  if (state.activeDates.size) {
    state.activeDays = state.activeDates.size;
  }

  renderSkillProgress();
  renderGigs();
  renderRecommendations();
  syncGamification();
  updateDashboardStats();
  renderActiveDaysCalendar();
  persistProgress();
  renderUserIdentity();
}

async function restoreSession() {
  const token = state.token || localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token !== DEMO_TOKEN) {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    state.token = '';
    renderUserIdentity();
    showLandingPage();
    return;
  }

  state.token = DEMO_TOKEN;
  applyUserPayload(buildDemoUserPayload());
}

async function syncRemoteActivity() {
  // Frontend-only demo mode keeps progress in localStorage.
}

function startVoiceSearch() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Voice search is not supported in this browser.', 'warning');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => showToast('Listening... speak your gig query.', 'info');
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    state.query = transcript;
    els.searchInput.value = transcript;
    renderSuggestions();
    renderGigs();
    showToast(`Voice search: ${transcript}`, 'success');
  };
  recognition.onerror = () => showToast('Voice search failed. Try again.', 'warning');

  recognition.start();
}

init().catch(() => {
  showToast('Initialization failed. Please refresh.', 'warning');
});
