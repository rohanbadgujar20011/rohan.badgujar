/* =============================================
   PORTFOLIO — app.js
   Dynamic renderer from data.json
   ============================================= */

'use strict';

// ─── GLOBALS ───────────────────────────────────
let portfolioData = null;

// ─── SOCIAL ICON SVGs ──────────────────────────
const SOCIAL_ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  leetcode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H19.7a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>`,
  geeksforgeeks: `<span style="font-size:0.7rem;font-weight:900">GfG</span>`,
  hackerrank: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.146 18.337l-1.456-.004c-.062-.002-.115-.05-.115-.115V9.115c0-.065.054-.115.115-.115h1.456c.065 0 .115.054.115.115v9.107c0 .065-.054.115-.115.115zm3.71-4.596c-.215 1.02-.988 1.714-1.974 1.714h-.563v-3.428h.563c.986 0 1.759.694 1.974 1.714zm-.563-3.715h-1.974c-.065 0-.115.054-.115.115v5.716c0 .065.054.115.115.115h1.974c1.456 0 2.514-1.1 2.514-2.973 0-1.874-1.058-2.973-2.514-2.973zm-6.704 3.429H6.835V9.115c0-.065-.054-.115-.115-.115H5.263c-.065 0-.115.054-.115.115v9.107c0 .065.054.115.115.115h1.457c.062 0 .115-.05.115-.115v-3.657h1.557c.065 0 .115-.054.115-.115v-1.086c0-.065-.054-.115-.115-.115z"/></svg>`,
  codechef: `<span style="font-size:0.65rem;font-weight:900">CC</span>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
};

const SOCIAL_LABELS = {
  github: 'GitHub', linkedin: 'LinkedIn', leetcode: 'LeetCode',
  geeksforgeeks: 'GfG', hackerrank: 'HackerRank', codechef: 'CodeChef',
  email: 'Email', twitter: 'Twitter/X'
};

const CERT_ICONS = { Oracle: '☕', Microsoft: '🪟', VMware: '🍃', Broadcom: '🍃', Amazon: '☁️', AWS: '☁️', Google: '🔶' };
const ACHIEVEMENT_CONFIG = [
  { key: 'yearsExperience', label: 'Years Experience', icon: '💼', suffix: '+' },
  { key: 'usersServed', label: 'Active Users Served', icon: '👥', suffix: 'M+', divisor: 1000000 },
  { key: 'eventsPerDay', label: 'Kafka Events / Day', icon: '⚡', suffix: 'K+', divisor: 1000 },
  { key: 'latencyImprovement', label: 'P95 Latency Reduced', icon: '🚀', suffix: '%' },
  { key: 'throughputImprovement', label: 'Throughput Improved', icon: '📈', suffix: '%' },
  { key: 'projectsBuilt', label: 'Projects Built', icon: '🛠️', suffix: '+' }
];

// ─── LOADER ────────────────────────────────────
function hideLoader() {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
}

// ─── DATA LOADER ───────────────────────────────
// Reads from window.PORTFOLIO_DATA (set by data.js — works on file://).
// Falls back to fetching data.json when served over HTTP.
async function loadData() {
  if (window.PORTFOLIO_DATA) {
    portfolioData = window.PORTFOLIO_DATA;
    renderAll();
    return;
  }
  try {
    const res = await fetch('data.json?' + Date.now());
    portfolioData = await res.json();
    renderAll();
  } catch (e) {
    console.error('Failed to load portfolio data. Make sure data.js exists.', e);
  }
}

// ─── RENDER ALL ────────────────────────────────
function renderAll() {
  renderHero();
  renderAbout();
  renderExperience();
  renderSkills();
  renderProjects();
  renderEducation();
  renderCertifications();
  renderAchievements();
  renderContact();
  renderFooter();
  initAnimations();
}

// ─── HERO ──────────────────────────────────────
function renderHero() {
  const { profile, social } = portfolioData;

  // Bio
  const bioEl = document.getElementById('hero-bio');
  if (bioEl) bioEl.textContent = profile.bio;

  // Image
  const img = document.getElementById('hero-img');
  if (img && profile.profileImage) img.src = profile.profileImage;

  // Resume button
  const resumeBtn = document.getElementById('hero-resume-btn');
  if (resumeBtn && profile.resumeUrl) resumeBtn.href = profile.resumeUrl;

  // Socials
  const socialsEl = document.getElementById('hero-socials');
  if (socialsEl) {
    socialsEl.innerHTML = Object.entries(social)
      .filter(([, url]) => url)
      .map(([platform, url]) => `
        <a href="${url}" target="_blank" rel="noopener noreferrer"
           class="social-icon" title="${SOCIAL_LABELS[platform] || platform}"
           aria-label="${SOCIAL_LABELS[platform] || platform}">
          ${SOCIAL_ICONS[platform] || platform[0].toUpperCase()}
        </a>`).join('');
  }
}

// ─── ABOUT ─────────────────────────────────────
function renderAbout() {
  const { profile } = portfolioData;

  const bioEl = document.getElementById('about-bio');
  if (bioEl) bioEl.textContent = profile.bio;

  const statsEl = document.getElementById('about-stats');
  if (statsEl) {
    const stats = [
      { value: profile.yearsOfExperience, label: 'Years of Experience' },
      { value: profile.company.split(' ')[0], label: 'Current Company' },
      { value: profile.role.split('—')[0].trim(), label: 'Current Role' },
      { value: profile.location, label: 'Location' }
    ];
    statsEl.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join('');
  }
}

// ─── EXPERIENCE ────────────────────────────────
function renderExperience() {
  const timelineEl = document.getElementById('experience-timeline');
  if (!timelineEl) return;

  timelineEl.innerHTML = portfolioData.experience.map(exp => `
    <div class="timeline-item reveal-up">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-company">${exp.company}</div>
        <div class="timeline-header">
          <div class="timeline-role">${exp.role}</div>
          <div class="timeline-meta">
            <span class="timeline-date">${exp.startDate} – ${exp.endDate}</span>
            <span class="timeline-badge ${exp.current ? '' : 'past'}">${exp.current ? '● Current' : exp.type}</span>
          </div>
        </div>
        <div class="timeline-location">📍 ${exp.location} · ${exp.type}</div>
        <ul class="timeline-description">
          ${exp.description.map(d => `<li>${d}</li>`).join('')}
        </ul>
        <div class="timeline-tech">
          ${exp.technologies.map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

// ─── SKILLS ────────────────────────────────────
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = Object.entries(portfolioData.skills).map(([category, skills]) => `
    <div class="skill-category reveal-scale">
      <div class="skill-category-title">${category}</div>
      <div class="skill-chips">
        ${skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
      </div>
    </div>`).join('');
}

// ─── PROJECTS ──────────────────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = portfolioData.projects.map(p => `
    <div class="project-card reveal-up" data-category="${p.category}">
      <div class="project-img-wrap">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=project-img-placeholder>🚀</div>'" />` : '<div class="project-img-placeholder">🚀</div>'}
        ${p.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
      </div>
      <div class="project-body">
        <div class="project-name">${p.name}</div>
        <p class="project-desc">${p.description}</p>
        <div class="project-tech">
          ${p.technologies.map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
        <div class="project-actions">
          ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            ${SOCIAL_ICONS.github} GitHub
          </a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live Demo
          </a>` : ''}
        </div>
      </div>
    </div>`).join('');

  // Filter logic
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

// ─── EDUCATION ─────────────────────────────────
function renderEducation() {
  const grid = document.getElementById('education-grid');
  if (!grid) return;

  grid.innerHTML = portfolioData.education.map(edu => `
    <div class="education-card reveal-up">
      <div class="education-icon">🎓</div>
      <div>
        <div class="education-degree">${edu.degree}</div>
        <div class="education-field">${edu.field}</div>
        <div class="education-institution">${edu.institution}</div>
        <div class="education-meta">
          <span>${edu.startYear} – ${edu.endYear}</span>
          ${edu.grade ? `<span>· ${edu.grade}</span>` : ''}
        </div>
      </div>
    </div>`).join('');
}

// ─── CERTIFICATIONS ────────────────────────────
function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  grid.innerHTML = portfolioData.certifications.map(cert => {
    const issuerKey = Object.keys(CERT_ICONS).find(k => cert.issuer.includes(k));
    const icon = issuerKey ? CERT_ICONS[issuerKey] : '🏅';
    return `
      <div class="cert-card reveal-up">
        <div class="cert-icon">${icon}</div>
        <div>
          <div class="cert-name">${cert.name}</div>
          <div class="cert-issuer">${cert.issuer}</div>
          <div class="cert-date">${cert.date}</div>
        </div>
      </div>`;
  }).join('');
}

// ─── ACHIEVEMENTS ──────────────────────────────
function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;

  const achievements = portfolioData.achievements;
  grid.innerHTML = ACHIEVEMENT_CONFIG
    .filter(cfg => achievements[cfg.key] !== undefined && achievements[cfg.key] > 0)
    .map((cfg, i) => {
      const raw = achievements[cfg.key];
      const display = cfg.divisor ? Math.round(raw / cfg.divisor) : raw;
      return `
      <div class="achievement-card reveal-scale" style="--i:${i}">
        <div class="achievement-icon">${cfg.icon}</div>
        <div class="achievement-number" data-target="${display}" data-suffix="${cfg.suffix}">0</div>
        <div class="achievement-label">${cfg.label}</div>
      </div>`;
    }).join('');
}

// ─── CONTACT ───────────────────────────────────
function renderContact() {
  const grid = document.getElementById('contact-grid');
  if (!grid) return;
  const { profile, social } = portfolioData;

  const contacts = [
    { icon: '✉️', title: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: '💼', title: 'LinkedIn', value: 'Connect with me', href: social.linkedin },
    { icon: '⌨️', title: 'GitHub', value: 'View my work', href: social.github },
    { icon: '📄', title: 'Resume', value: 'Download PDF', href: profile.resumeUrl, download: true }
  ];

  grid.innerHTML = contacts.map(c => `
    <a href="${c.href}" ${c.download ? 'download' : 'target="_blank" rel="noopener"'} class="contact-card">
      <span class="contact-card-icon">${c.icon}</span>
      <div class="contact-card-title">${c.title}</div>
      <div class="contact-card-value">${c.value}</div>
    </a>`).join('');
}

// ─── FOOTER ────────────────────────────────────
function renderFooter() {
  const copy = document.getElementById('footer-copy');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} ${portfolioData.profile.name}. Crafted with passion.`;

  const socials = document.getElementById('footer-socials');
  if (socials) {
    socials.innerHTML = Object.entries(portfolioData.social)
      .filter(([, url]) => url)
      .map(([platform, url]) => `
        <a href="${url}" target="_blank" rel="noopener" class="footer-social-link" title="${SOCIAL_LABELS[platform] || platform}">
          ${SOCIAL_ICONS[platform] || platform[0].toUpperCase()}
        </a>`).join('');
  }
}

// ─── COUNTER ANIMATION ─────────────────────────
function animateCounters() {
  document.querySelectorAll('.achievement-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ─── INTERSECTION OBSERVER ─────────────────────
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => observer.observe(el));

  // Counter observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const achGrid = document.getElementById('achievements-grid');
  if (achGrid) counterObserver.observe(achGrid);
}

// ─── NAVBAR ────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');

  // Shrink on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }, { passive: true });

  // Mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  overlay.addEventListener('click', closeMobileMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ─── SCROLL SPY ────────────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === section.id);
      });
    }
  });
}

// ─── RIPPLE EFFECT ─────────────────────────────
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; background:rgba(255,255,255,0.25);
        width:100px; height:100px;
        left:${x - 50}px; top:${y - 50}px;
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const style = document.createElement('style');
  style.textContent = '@keyframes rippleAnim{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(style);
}

// ─── SMOOTH SCROLL ─────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  hideLoader();
  initNavbar();
  initSmoothScroll();
  loadData().then(() => {
    initRipple();
  });
});
