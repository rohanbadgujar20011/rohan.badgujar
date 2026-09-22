/* =============================================
   ADMIN DASHBOARD — admin.js
   ============================================= */
'use strict';

let data = null;

// ─── LOAD DATA ─────────────────────────────────
async function loadData() {
  // Use window.PORTFOLIO_DATA (injected by data.js) — works on file://
  if (window.PORTFOLIO_DATA) {
    data = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA)); // deep clone
    initAll();
    return;
  }
  // Fallback: fetch data.json (works over HTTP)
  try {
    const res = await fetch('../data.json?' + Date.now());
    data = await res.json();
    initAll();
  } catch (e) {
    showAlert('global-error', 'Failed to load data. Make sure data.js or data.json exists in the portfolio root.');
  }
}

function initAll() {
  initDashboard();
  initProfile();
  initExperience();
  initProjects();
  initSkills();
  initEducation();
  initCertifications();
  initAchievements();
  initSocial();
  initSettings();
  initDashStats();
}

// ─── NAVIGATION ────────────────────────────────
function initNavigation() {
  document.querySelectorAll('.sidebar-link[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      switchPanel(panel);
    });
  });

  // Quick action buttons in dashboard
  document.querySelectorAll('[data-panel]').forEach(el => {
    if (!el.classList.contains('sidebar-link')) {
      el.addEventListener('click', () => switchPanel(el.dataset.panel));
    }
  });
}

function switchPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const panel = document.getElementById('panel-' + panelId);
  if (panel) panel.classList.add('active');
  const link = document.querySelector(`.sidebar-link[data-panel="${panelId}"]`);
  if (link) link.classList.add('active');
  const titles = {
    dashboard: 'Dashboard', profile: 'Profile', experience: 'Experience',
    projects: 'Projects', skills: 'Skills', education: 'Education',
    certifications: 'Certifications', achievements: 'Achievements',
    social: 'Social Links', settings: 'Settings', export: 'Export JSON'
  };
  document.getElementById('topbar-title').textContent = titles[panelId] || panelId;
}

// ─── DASH STATS ────────────────────────────────
function initDashStats() {
  const stats = [
    { label: 'Experience', value: data.experience.length, icon: '💼' },
    { label: 'Projects', value: data.projects.length, icon: '🚀' },
    { label: 'Skills', value: Object.values(data.skills).flat().length, icon: '⚙️' },
    { label: 'Certifications', value: data.certifications.length, icon: '🏆' }
  ];
  document.getElementById('dash-stats').innerHTML = stats.map(s => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;text-align:center">
      <div style="font-size:1.8rem;margin-bottom:8px">${s.icon}</div>
      <div style="font-size:1.6rem;font-weight:900;background:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${s.value}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">${s.label}</div>
    </div>`).join('');
}

// ─── PROFILE ───────────────────────────────────
function initProfile() {
  const p = data.profile;
  setVal('p-name', p.name); setVal('p-email', p.email);
  setVal('p-title', p.title); setVal('p-location', p.location);
  setVal('p-company', p.company); setVal('p-role', p.role);
  setVal('p-experience', p.yearsOfExperience); setVal('p-image', p.profileImage);
  setVal('p-tagline', p.tagline); setVal('p-bio', p.bio);
  setVal('p-resume', p.resumeUrl);
}
function saveProfile() {
  data.profile = {
    ...data.profile,
    name: getVal('p-name'), email: getVal('p-email'),
    title: getVal('p-title'), location: getVal('p-location'),
    company: getVal('p-company'), role: getVal('p-role'),
    yearsOfExperience: getVal('p-experience'), profileImage: getVal('p-image'),
    tagline: getVal('p-tagline'), bio: getVal('p-bio'),
    resumeUrl: getVal('p-resume')
  };
}

// ─── EXPERIENCE ────────────────────────────────
function initExperience() {
  renderExpList();
  document.getElementById('add-exp-btn').addEventListener('click', () => openExpModal());
  document.getElementById('save-exp-btn').addEventListener('click', saveExpModal);
}
function renderExpList() {
  const list = document.getElementById('exp-list');
  list.innerHTML = data.experience.map((exp, i) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${exp.role} <span class="badge badge-purple">${exp.type}</span></div>
        <div class="item-subtitle">${exp.company} · ${exp.startDate} – ${exp.endDate}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-secondary btn-sm" onclick="openExpModal(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('experience',${i})">Delete</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">No experience added yet.</p>';
}
function openExpModal(idx) {
  const exp = idx !== undefined ? data.experience[idx] : null;
  document.getElementById('exp-modal-title').textContent = exp ? 'Edit Experience' : 'Add Experience';
  document.getElementById('exp-edit-id').value = idx !== undefined ? idx : '';
  if (exp) {
    setVal('em-company', exp.company); setVal('em-role', exp.role);
    setVal('em-start', exp.startDate); setVal('em-end', exp.endDate);
    setVal('em-location', exp.location); setVal('em-type', exp.type);
    setVal('em-tech', (exp.technologies || []).join(', '));
    setVal('em-desc', (exp.description || []).join('\n'));
    document.getElementById('em-current').checked = exp.current;
  } else {
    ['em-company','em-role','em-start','em-end','em-location','em-type','em-tech','em-desc'].forEach(id => setVal(id,''));
    document.getElementById('em-current').checked = false;
  }
  openModal('exp-modal');
}
function saveExpModal() {
  const idx = document.getElementById('exp-edit-id').value;
  const exp = {
    id: idx !== '' ? data.experience[+idx].id : Date.now(),
    company: getVal('em-company'), role: getVal('em-role'),
    startDate: getVal('em-start'), endDate: getVal('em-end'),
    location: getVal('em-location'), type: getVal('em-type'),
    technologies: getVal('em-tech').split(',').map(s => s.trim()).filter(Boolean),
    description: getVal('em-desc').split('\n').map(s => s.trim()).filter(Boolean),
    current: document.getElementById('em-current').checked
  };
  if (!exp.company || !exp.role) return alert('Company and Role are required.');
  if (idx !== '') data.experience[+idx] = exp;
  else data.experience.unshift(exp);
  renderExpList();
  closeModal('exp-modal');
}

// ─── PROJECTS ──────────────────────────────────
function initProjects() {
  renderProjList();
  document.getElementById('add-proj-btn').addEventListener('click', () => openProjModal());
  document.getElementById('save-proj-btn').addEventListener('click', saveProjModal);
}
function renderProjList() {
  const list = document.getElementById('proj-list');
  list.innerHTML = data.projects.map((p, i) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${p.name} ${p.featured ? '<span class="badge badge-cyan">Featured</span>' : ''}</div>
        <div class="item-subtitle">${p.category} · ${(p.technologies||[]).slice(0,3).join(', ')}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-secondary btn-sm" onclick="openProjModal(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('projects',${i})">Delete</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">No projects added yet.</p>';
}
function openProjModal(idx) {
  const proj = idx !== undefined ? data.projects[idx] : null;
  document.getElementById('proj-modal-title').textContent = proj ? 'Edit Project' : 'Add Project';
  document.getElementById('proj-edit-id').value = idx !== undefined ? idx : '';
  if (proj) {
    setVal('pm-name', proj.name); setVal('pm-desc', proj.description);
    setVal('pm-github', proj.github); setVal('pm-demo', proj.demo);
    setVal('pm-image', proj.image); setVal('pm-category', proj.category);
    setVal('pm-tech', (proj.technologies||[]).join(', '));
    document.getElementById('pm-featured').checked = proj.featured;
  } else {
    ['pm-name','pm-desc','pm-github','pm-demo','pm-image','pm-tech'].forEach(id => setVal(id,''));
    setVal('pm-category','AI');
    document.getElementById('pm-featured').checked = false;
  }
  openModal('proj-modal');
}
function saveProjModal() {
  const idx = document.getElementById('proj-edit-id').value;
  const proj = {
    id: idx !== '' ? data.projects[+idx].id : Date.now(),
    name: getVal('pm-name'), description: getVal('pm-desc'),
    github: getVal('pm-github'), demo: getVal('pm-demo'),
    image: getVal('pm-image'), category: getVal('pm-category'),
    technologies: getVal('pm-tech').split(',').map(s=>s.trim()).filter(Boolean),
    featured: document.getElementById('pm-featured').checked
  };
  if (!proj.name || !proj.description) return alert('Name and description required.');
  if (idx !== '') data.projects[+idx] = proj;
  else data.projects.unshift(proj);
  renderProjList();
  closeModal('proj-modal');
}

// ─── SKILLS ────────────────────────────────────
function initSkills() {
  const editor = document.getElementById('skills-editor');
  editor.innerHTML = Object.entries(data.skills).map(([cat, skills]) => `
    <div class="form-group">
      <label class="form-label">${cat}</label>
      <input type="text" class="form-input skill-input" data-category="${cat}" value="${skills.join(', ')}" placeholder="Skill1, Skill2, Skill3" />
    </div>`).join('');
}
function saveSkills() {
  document.querySelectorAll('.skill-input').forEach(input => {
    const cat = input.dataset.category;
    data.skills[cat] = input.value.split(',').map(s=>s.trim()).filter(Boolean);
  });
}

// ─── EDUCATION ─────────────────────────────────
function initEducation() {
  renderEduList();
  document.getElementById('add-edu-btn').addEventListener('click', () => openEduModal());
  document.getElementById('save-edu-btn').addEventListener('click', saveEduModal);
}
function renderEduList() {
  const list = document.getElementById('edu-list');
  list.innerHTML = data.education.map((edu, i) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${edu.degree} in ${edu.field}</div>
        <div class="item-subtitle">${edu.institution} · ${edu.startYear}–${edu.endYear}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-secondary btn-sm" onclick="openEduModal(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('education',${i})">Delete</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">No education added yet.</p>';
}
function openEduModal(idx) {
  const edu = idx !== undefined ? data.education[idx] : null;
  document.getElementById('edu-modal-title').textContent = edu ? 'Edit Education' : 'Add Education';
  document.getElementById('edu-edit-id').value = idx !== undefined ? idx : '';
  if (edu) {
    setVal('edm-institution', edu.institution); setVal('edm-degree', edu.degree);
    setVal('edm-field', edu.field); setVal('edm-start', edu.startYear);
    setVal('edm-end', edu.endYear); setVal('edm-grade', edu.grade);
  } else {
    ['edm-institution','edm-degree','edm-field','edm-start','edm-end','edm-grade'].forEach(id=>setVal(id,''));
  }
  openModal('edu-modal');
}
function saveEduModal() {
  const idx = document.getElementById('edu-edit-id').value;
  const edu = {
    id: idx !== '' ? data.education[+idx].id : Date.now(),
    institution: getVal('edm-institution'), degree: getVal('edm-degree'),
    field: getVal('edm-field'), startYear: getVal('edm-start'),
    endYear: getVal('edm-end'), grade: getVal('edm-grade')
  };
  if (!edu.institution || !edu.degree) return alert('Institution and Degree required.');
  if (idx !== '') data.education[+idx] = edu;
  else data.education.push(edu);
  renderEduList();
  closeModal('edu-modal');
}

// ─── CERTIFICATIONS ────────────────────────────
function initCertifications() {
  renderCertList();
  document.getElementById('add-cert-btn').addEventListener('click', () => openCertModal());
  document.getElementById('save-cert-btn').addEventListener('click', saveCertModal);
}
function renderCertList() {
  const list = document.getElementById('cert-list');
  list.innerHTML = data.certifications.map((cert, i) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${cert.name}</div>
        <div class="item-subtitle">${cert.issuer} · ${cert.date}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-secondary btn-sm" onclick="openCertModal(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('certifications',${i})">Delete</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">No certifications added yet.</p>';
}
function openCertModal(idx) {
  const cert = idx !== undefined ? data.certifications[idx] : null;
  document.getElementById('cert-modal-title').textContent = cert ? 'Edit Certification' : 'Add Certification';
  document.getElementById('cert-edit-id').value = idx !== undefined ? idx : '';
  if (cert) {
    setVal('cm-name', cert.name); setVal('cm-issuer', cert.issuer);
    setVal('cm-date', cert.date); setVal('cm-url', cert.credentialUrl);
  } else {
    ['cm-name','cm-issuer','cm-date','cm-url'].forEach(id=>setVal(id,''));
  }
  openModal('cert-modal');
}
function saveCertModal() {
  const idx = document.getElementById('cert-edit-id').value;
  const cert = {
    id: idx !== '' ? data.certifications[+idx].id : Date.now(),
    name: getVal('cm-name'), issuer: getVal('cm-issuer'),
    date: getVal('cm-date'), credentialUrl: getVal('cm-url'), logo: ''
  };
  if (!cert.name || !cert.issuer) return alert('Name and Issuer required.');
  if (idx !== '') data.certifications[+idx] = cert;
  else data.certifications.push(cert);
  renderCertList();
  closeModal('cert-modal');
}

// ─── ACHIEVEMENTS ──────────────────────────────
function initAchievements() {
  const a = data.achievements;
  setVal('ach-leetcode', a.leetcodeProblems);
  setVal('ach-github', a.githubRepos);
  setVal('ach-years', a.yearsExperience);
  setVal('ach-projects', a.projectsBuilt);
  setVal('ach-certs', a.certifications);
  setVal('ach-contributions', a.contributions);
}
function saveAchievements() {
  data.achievements = {
    leetcodeProblems: +getVal('ach-leetcode'),
    githubRepos: +getVal('ach-github'),
    yearsExperience: +getVal('ach-years'),
    projectsBuilt: +getVal('ach-projects'),
    certifications: +getVal('ach-certs'),
    contributions: +getVal('ach-contributions')
  };
}

// ─── SOCIAL ────────────────────────────────────
function initSocial() {
  const editor = document.getElementById('social-editor');
  const labels = {
    github: 'GitHub', linkedin: 'LinkedIn', leetcode: 'LeetCode',
    geeksforgeeks: 'GeeksForGeeks', hackerrank: 'HackerRank',
    codechef: 'CodeChef', email: 'Email (mailto:)', twitter: 'Twitter/X'
  };
  editor.innerHTML = Object.entries(data.social).map(([key, url]) => `
    <div class="form-group">
      <label class="form-label">${labels[key] || key}</label>
      <input type="text" class="form-input social-input" data-key="${key}" value="${url}" placeholder="https://..." />
    </div>`).join('');
}
function saveSocial() {
  document.querySelectorAll('.social-input').forEach(input => {
    data.social[input.dataset.key] = input.value.trim();
  });
}

// ─── SETTINGS ──────────────────────────────────
function initSettings() {
  setVal('s-username', data.admin.username);
  setVal('s-password', data.admin.password);
}
function saveSettings() {
  data.admin = { username: getVal('s-username'), password: getVal('s-password') };
  // Persist to localStorage so login.html can read them without a server
  localStorage.setItem('admin_credentials', JSON.stringify(data.admin));
}

// ─── DASHBOARD ─────────────────────────────────
function initDashboard() {}

// ─── SAVE ALL ──────────────────────────────────
function saveAll() {
  saveProfile();
  saveSkills();
  saveAchievements();
  saveSocial();
  saveSettings();
  showAlert('global-success', '✅ Changes applied in memory! Use Export JSON to save to disk.');
  setTimeout(() => hideAlert('global-success'), 4000);
}

// ─── VALIDATION ────────────────────────────────
function validateData() {
  const errors = [];
  const warnings = [];
  const ok = [];

  if (!data.profile.name) errors.push('Profile name is required');
  else ok.push('Profile name present');

  if (!data.profile.email) errors.push('Profile email is required');
  else ok.push('Profile email present');

  if (!data.profile.bio) errors.push('Profile bio is required');
  else ok.push('Profile bio present');

  if (data.experience.length === 0) warnings.push('No experience entries');
  else ok.push(`${data.experience.length} experience entries`);

  if (data.projects.length === 0) warnings.push('No projects added');
  else ok.push(`${data.projects.length} projects`);

  // URL validation
  const urlFields = [
    ...data.projects.map(p => p.github).filter(Boolean),
    ...data.projects.map(p => p.demo).filter(Boolean),
    Object.values(data.social).filter(u => u && u.startsWith('http'))
  ].flat();
  urlFields.forEach(url => {
    try { new URL(url); }
    catch { warnings.push(`Invalid URL: ${url}`); }
  });

  // Duplicate projects
  const names = data.projects.map(p => p.name);
  const dups = names.filter((n, i) => names.indexOf(n) !== i);
  if (dups.length) errors.push(`Duplicate project names: ${dups.join(', ')}`);

  // Missing images
  const noImg = data.projects.filter(p => !p.image);
  if (noImg.length) warnings.push(`${noImg.length} project(s) missing image`);

  return { errors, warnings, ok };
}

// ─── EXPORT ────────────────────────────────────
function initExport() {
  document.getElementById('validate-btn').addEventListener('click', () => {
    saveAll();
    const { errors, warnings, ok } = validateData();
    const output = document.getElementById('validation-output');
    output.innerHTML = `<div class="validation-results">
      ${ok.map(m => `<div class="validation-item">✅ <span>${m}</span></div>`).join('')}
      ${warnings.map(m => `<div class="validation-item">⚠️ <span style="color:#facc15">${m}</span></div>`).join('')}
      ${errors.map(m => `<div class="validation-item">❌ <span style="color:#f87171">${m}</span></div>`).join('')}
    </div>`;
    const exportBtn = document.getElementById('export-btn');
    exportBtn.style.display = errors.length === 0 ? 'inline-flex' : 'none';
    if (errors.length > 0) {
      showAlert('global-error', `${errors.length} validation error(s). Fix them before exporting.`);
      setTimeout(() => hideAlert('global-error'), 5000);
    }
  });
  document.getElementById('export-btn').addEventListener('click', exportJSON);
}

function exportJSON() {
  saveAll();
  const json = JSON.stringify(data, null, 2);

  // Export data.js (powers the site on file://)
  const jsContent = `// Portfolio data — generated by Admin Dashboard on ${new Date().toLocaleString()}.\n// Replace data.js in your portfolio root folder to update the site.\n\nwindow.PORTFOLIO_DATA = ${json};\n`;
  downloadFile(jsContent, 'data.js', 'text/javascript');

  // Also export data.json (backup / HTTP server use)
  downloadFile(json, 'data.json', 'application/json');

  showAlert('global-success', '✅ data.js + data.json downloaded! Replace both files in your portfolio root folder.');
  setTimeout(() => hideAlert('global-success'), 6000);
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── DELETE ITEM ───────────────────────────────
function deleteItem(section, idx) {
  if (!confirm('Delete this item?')) return;
  data[section].splice(idx, 1);
  const renders = { experience: renderExpList, projects: renderProjList, education: renderEduList, certifications: renderCertList };
  if (renders[section]) renders[section]();
}

// ─── MODAL HELPERS ─────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ─── ALERT HELPERS ─────────────────────────────
function showAlert(id, msg) {
  const el = document.getElementById(id);
  if (el) { if (msg) el.textContent = msg; el.classList.add('visible'); }
}
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

// ─── FORM HELPERS ──────────────────────────────
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

// ─── SIDEBAR TOGGLE (mobile) ───────────────────
function initMobile() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// ─── LOGOUT ────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('admin_auth');
  localStorage.removeItem('admin_auth');
  window.location.href = 'login.html';
});

// ─── SAVE BUTTON ───────────────────────────────
document.getElementById('save-all-btn').addEventListener('click', saveAll);

// ─── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobile();
  loadData().then(() => {
    initExport();
  });
});
