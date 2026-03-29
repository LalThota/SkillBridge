/* ═══════════════════════════════════════════
   SKILLBRIDGE — APPLICATION LOGIC
   ═══════════════════════════════════════════ */

// ──── JOB DATA ────
const jobs = [
  { id: 0, title: 'Frontend Developer', company: 'NovaTech Solutions', pay: '$45/hr', type: 'Part-Time', category: 'development', location: 'Remote', duration: '3 months', color: 'linear-gradient(135deg, #4F46E5, #7C3AED)', letter: 'N', tags: ['React', 'TypeScript', 'CSS'], description: 'Build and maintain responsive web interfaces using React and TypeScript. Collaborate with the design team to implement pixel-perfect UI components.', requirements: ['2+ years React experience', 'TypeScript proficiency', 'CSS/Sass expertise', 'Git & CI/CD knowledge'] },
  { id: 1, title: 'UI/UX Designer', company: 'StartupHub', pay: '$40/hr', type: 'Freelance', category: 'design', location: 'Remote', duration: '2 months', color: 'linear-gradient(135deg, #06B6D4, #10B981)', letter: 'S', tags: ['Figma', 'Prototyping', 'User Research'], description: 'Design intuitive and visually stunning user interfaces for our SaaS platform. Conduct user research and create interactive prototypes.', requirements: ['3+ years UI/UX experience', 'Figma expert', 'Portfolio required', 'User research skills'] },
  { id: 2, title: 'Data Analyst', company: 'CloudMetrics', pay: '$55/hr', type: 'Contract', category: 'data', location: 'Hybrid — SF', duration: '6 months', color: 'linear-gradient(135deg, #F59E0B, #EF4444)', letter: 'C', tags: ['Python', 'SQL', 'Tableau'], description: 'Analyze large datasets to extract actionable insights. Build dashboards and reports for stakeholders using Tableau and Python.', requirements: ['Python & SQL proficiency', 'Tableau or Power BI', 'Statistical analysis', 'Communication skills'] },
  { id: 3, title: 'Content Writer', company: 'MediaFlow', pay: '$35/hr', type: 'Part-Time', category: 'writing', location: 'Remote', duration: '1 month', color: 'linear-gradient(135deg, #EC4899, #8B5CF6)', letter: 'M', tags: ['SEO', 'Blog Writing', 'Copywriting'], description: 'Create compelling blog posts, landing page copy, and marketing materials. Optimize content for search engines and engagement.', requirements: ['2+ years writing experience', 'SEO knowledge', 'Portfolio of published work', 'Strong grammar'] },
  { id: 4, title: 'Social Media Manager', company: 'BrandVibe', pay: '$30/hr', type: 'Freelance', category: 'marketing', location: 'Remote', duration: '3 months', color: 'linear-gradient(135deg, #14B8A6, #3B82F6)', letter: 'B', tags: ['Instagram', 'Analytics', 'Content Strategy'], description: 'Manage social media presence across platforms. Create content calendars, engage with audiences, and track performance metrics.', requirements: ['Social media expertise', 'Content creation skills', 'Analytics knowledge', 'Creative mindset'] },
  { id: 5, title: 'Backend Developer', company: 'DataSync', pay: '$50/hr', type: 'Contract', category: 'development', location: 'Remote', duration: '4 months', color: 'linear-gradient(135deg, #6366F1, #06B6D4)', letter: 'D', tags: ['Node.js', 'PostgreSQL', 'REST API'], description: 'Design and implement scalable backend services and RESTful APIs. Work with databases and cloud infrastructure.', requirements: ['Node.js or Python backend', 'Database design', 'API development', 'AWS or GCP experience'] },
  { id: 6, title: 'Graphic Designer', company: 'CreativeEdge', pay: '$38/hr', type: 'Freelance', category: 'design', location: 'Remote', duration: '2 months', color: 'linear-gradient(135deg, #F59E0B, #10B981)', letter: 'C', tags: ['Illustrator', 'Branding', 'Print Design'], description: 'Create visual assets including logos, brand guidelines, marketing collateral, and social media graphics for various clients.', requirements: ['Adobe Creative Suite', 'Brand identity experience', 'Typography skills', 'Creative portfolio'] },
  { id: 7, title: 'Mobile App Developer', company: 'AppForge', pay: '$52/hr', type: 'Part-Time', category: 'development', location: 'Hybrid — NYC', duration: '5 months', color: 'linear-gradient(135deg, #7C3AED, #EC4899)', letter: 'A', tags: ['React Native', 'iOS', 'Android'], description: 'Develop cross-platform mobile applications using React Native. Implement features, fix bugs, and optimize app performance.', requirements: ['React Native experience', 'iOS/Android knowledge', 'App Store deployment', 'Performance optimization'] },
  { id: 8, title: 'Data Visualization Specialist', company: 'InsightLab', pay: '$48/hr', type: 'Contract', category: 'data', location: 'Remote', duration: '3 months', color: 'linear-gradient(135deg, #06B6D4, #4F46E5)', letter: 'I', tags: ['D3.js', 'Python', 'Dashboards'], description: 'Create interactive data visualizations and dashboards. Transform complex datasets into clear, compelling visual stories.', requirements: ['D3.js or similar library', 'Data storytelling', 'Python data analysis', 'Design sensibility'] },
];

// ──── STATE ────
let currentPage = 'landing';
let currentFilter = 'all';

// ──── NAVIGATION ────
function navigateTo(page) {
  const landing = document.getElementById('page-landing');
  const appShell = document.getElementById('app-shell');

  if (page === 'landing') {
    landing.classList.add('page--active');
    appShell.style.display = 'none';
    currentPage = 'landing';
    window.scrollTo(0, 0);
    return;
  }

  landing.classList.remove('page--active');
  appShell.style.display = 'flex';
  currentPage = page;

  // Switch app pages
  document.querySelectorAll('.app-page').forEach(p => p.classList.remove('app-page--active'));
  const target = document.getElementById('app-' + page);
  if (target) target.classList.add('app-page--active');

  // Update sidebar links
  document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
  const link = document.querySelector(`.sidebar__link[data-page="${page}"]`);
  if (link) link.classList.add('sidebar__link--active');

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');

  // Render jobs if needed
  if (page === 'jobs') renderJobs();

  // Animate counters & progress bars
  setTimeout(() => {
    animateCounters();
    animateProgressBars();
  }, 200);

  window.scrollTo(0, 0);
}

// ──── SIDEBAR NAV CLICK ────
document.querySelectorAll('.sidebar__link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ──── MOBILE SIDEBAR ────
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
});
document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
});

// ──── HAMBURGER MENU ────
document.getElementById('hamburger')?.addEventListener('click', () => {
  const ham = document.getElementById('hamburger');
  ham.classList.toggle('active');
  document.getElementById('landing-nav-links')?.classList.toggle('mobile-open');
  document.querySelector('.landing-nav__actions')?.classList.toggle('mobile-open');
});

// ──── RENDER JOBS ────
function renderJobs(filter = currentFilter, search = '') {
  const grid = document.getElementById('jobs-grid');
  if (!grid) return;

  let filtered = jobs;
  if (filter !== 'all') filtered = filtered.filter(j => j.category === filter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  grid.innerHTML = filtered.map(job => `
    <div class="job-card" onclick="openJobModal(${job.id})">
      <div class="job-card__header">
        <div class="job-card__logo" style="background: ${job.color};">${job.letter}</div>
        <div>
          <div class="job-card__title">${job.title}</div>
          <div class="job-card__company">${job.company}</div>
        </div>
      </div>
      <div class="job-card__meta">
        ${job.tags.map(t => `<span class="job-card__tag">${t}</span>`).join('')}
        <span class="job-card__tag">${job.location}</span>
      </div>
      <div class="job-card__footer">
        <span class="job-card__pay">${job.pay}</span>
        <span class="job-card__type">${job.type} · ${job.duration}</span>
      </div>
    </div>
  `).join('');

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">No jobs found</p>
      <p>Try adjusting your search or filter criteria.</p>
    </div>`;
  }
}

// ──── FILTER CHIPS ────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    currentFilter = chip.dataset.filter;
    renderJobs(currentFilter, document.getElementById('job-search-input')?.value || '');
  });
});

// ──── LIVE SEARCH ────
document.getElementById('job-search-input')?.addEventListener('input', (e) => {
  renderJobs(currentFilter, e.target.value);
});

// ──── JOB MODAL ────
function openJobModal(id) {
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="modal__banner" style="background: ${job.color};">
      <div class="modal__banner-icon">${job.letter}</div>
    </div>
    <div class="modal__content">
      <div class="modal__badge">✓ Verified Employer</div>
      <h2 class="modal__title">${job.title}</h2>
      <p class="modal__company">${job.company}</p>
      <div class="modal__info-grid">
        <div class="modal__info-item"><small>Pay Rate</small><span>${job.pay}</span></div>
        <div class="modal__info-item"><small>Type</small><span>${job.type}</span></div>
        <div class="modal__info-item"><small>Location</small><span>${job.location}</span></div>
        <div class="modal__info-item"><small>Duration</small><span>${job.duration}</span></div>
      </div>
      <h3 class="modal__section-title">Description</h3>
      <p class="modal__description">${job.description}</p>
      <h3 class="modal__section-title">Requirements</h3>
      <ul class="modal__requirements">${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
      <h3 class="modal__section-title">Skills</h3>
      <div class="modal__tags">${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <button class="modal__apply-btn" onclick="handleApply(${job.id})">Apply Now →</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function handleApply(id) {
  const btn = document.querySelector('.modal__apply-btn');
  btn.textContent = '✓ Application Submitted!';
  btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';
  setTimeout(() => closeModal(), 1500);
}

// ──── ANIMATED COUNTERS ────
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (!target || el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    const prefix = el.dataset.prefix || '';
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString();
    }
    requestAnimationFrame(tick);
  });
}

// ──── HERO STAT COUNTERS ────
function animateHeroStats() {
  document.querySelectorAll('.hero__stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + '+';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ──── PROGRESS BARS ────
function animateProgressBars() {
  document.querySelectorAll('.progress-bar__fill').forEach(bar => {
    const w = bar.dataset.width;
    if (w) setTimeout(() => { bar.style.width = w + '%'; }, 300);
  });
}

// ──── SCROLL REVEAL ────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ──── INIT ────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  animateHeroStats();
});
