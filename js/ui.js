/* =========================================================
   SkillSwap - عناصر الواجهة المشتركة
   الأيقونات، الشريط العلوي، القائمة الجانبية، النوافذ المنبثقة
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const PAGE = document.body.dataset.page || '';
const params = new URLSearchParams(location.search);

// ---------- الأيقونات (SVG) ----------
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<circle cx="12" cy="8" r="4.5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  swap: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.7 1.7-1.7H16c3 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  more: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  bellOff: '<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5M17 17H3s3-2 3-9a4.7 4.7 0 0 1 .3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
};
function icon(name, size = 20, extra = '') {
  return `<svg class="ic ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

// ---------- أدوات عامة ----------
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const avatarColors = ['#8b6ae0', '#3f9e76', '#d0619c', '#e0a030', '#5b7fd6', '#a05cc9'];
function colorFor(name) { let h = 0; for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) % 997; return avatarColors[h % avatarColors.length]; }
function avatar(u, size = 44, cls = '') {
  if (!u) return '';
  const st = `width:${size}px;height:${size}px;font-size:${Math.round(size * .42)}px`;
  if (u.photo) return `<img class="avatar ${cls}" style="${st}" src="${u.photo}" alt="${esc(u.name)}">`;
  return `<span class="avatar ${cls}" style="${st};background:${colorFor(u.name)}">${esc(u.name.trim().charAt(0))}</span>`;
}
function starRow(r, count) {
  if (!r) return `<span class="rating muted">${icon('star', 16)} جديدة</span>`;
  return `<span class="rating">${icon('star', 16, 'fill')} <b>${r.toFixed(1)}</b>${count != null ? ` <small>(${count} تقييم)</small>` : ''}</span>`;
}
function statusBadge(u) {
  const st = u.status || 'available';
  return `<span class="status ${st}"><i></i>${STATUS_OPTIONS[st] || ''}</span>`;
}
function fmtDate(iso) { return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }); }
function fmtTime(iso) { const d = new Date(iso); return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'); }
function fmtSession(s) {
  const d = new Date(s.date + 'T' + (s.time || '00:00'));
  return d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) + ' — ' + s.time;
}
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return `منذ ${Math.floor(s / 60)} د`;
  if (s < 86400) return `منذ ${Math.floor(s / 3600)} س`;
  if (s < 7 * 86400) return `منذ ${Math.floor(s / 86400)} يوم`;
  return fmtDate(iso);
}
function showToast(text) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
function options(list, selected, placeholder) {
  return (placeholder ? `<option value="">${placeholder}</option>` : '') +
    list.map(v => `<option ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
}
function emptyBox(ic, text, action = '') {
  return `<div class="empty-box"><span class="ei">${icon(ic, 30)}</span><p>${text}</p>${action}</div>`;
}
function skillChips(list, cls = '') {
  return list.length ? list.map(s => `<span class="chip-s ${cls}">${esc(s.skillName)}</span>`).join('') : '<span class="muted small">—</span>';
}

// ---------- النوافذ المنبثقة ----------
function openModal(html, cls = '') {
  closeModal();
  const m = document.createElement('div');
  m.className = 'modal show';
  m.id = 'modal';
  m.innerHTML = `<div class="modal-card ${cls}">${html}</div>`;
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
  document.body.appendChild(m);
  const f = $('input:not([type=hidden]), select, textarea', m);
  if (f && !cls.includes('nofocus')) setTimeout(() => f.focus(), 30);
  return m;
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); }

// نافذة تأكيد بنفس شكل التصميم: نص + زر أساسي + زر ثانوي
function popup({ text, ok, cancel = 'إلغاء', onOk, onCancel, danger = false, extra = '' }) {
  const m = openModal(`<p class="pop-text">${text}</p>${extra}
    <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-block" id="popOk">${ok}</button>
    ${cancel ? `<button class="btn btn-outline btn-block" id="popCancel">${cancel}</button>` : ''}`, 'pop nofocus');
  $('#popOk', m).onclick = () => { closeModal(); onOk && onOk(); };
  if ($('#popCancel', m)) $('#popCancel', m).onclick = () => { closeModal(); onCancel && onCancel(); };
  return m;
}

// ---------- التحقق من صحة النماذج ----------
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function validateForm(form) {
  let ok = true;
  $$('[data-rule]', form).forEach(input => {
    const v = (input.type === 'checkbox') ? (input.checked ? 'y' : '') : input.value.trim();
    let bad = false;
    switch (input.dataset.rule) {
      case 'required': bad = v.length === 0; break;
      case 'name':     bad = v.length < 3; break;
      case 'email':    bad = !emailRe.test(v); break;
      case 'password': bad = v.length < 8 || !/[0-9]/.test(v) || !/[A-Za-z؀-ۿ]/.test(v); break;
      case 'match':    bad = v !== $('#' + input.dataset.target, form).value || v === ''; break;
      case 'select':   bad = v === ''; break;
    }
    const holder = input.closest('.field') || input;
    holder.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  return ok;
}
document.addEventListener('input', e => { const f = e.target.closest && e.target.closest('.field'); if (f) f.classList.remove('invalid'); });
document.addEventListener('change', e => { const f = e.target.closest && e.target.closest('.field'); if (f) f.classList.remove('invalid'); });
function showAlert(form, cls, text) {
  $$('.alert', form).forEach(a => a.classList.remove('show'));
  const a = $('.' + cls, form);
  if (a) { if (text) a.textContent = text; a.classList.add('show'); }
}
// إظهار / إخفاء كلمة المرور
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-toggle-pass]');
  if (!btn) return;
  const inp = $('#' + btn.dataset.togglePass);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.classList.toggle('on', inp.type === 'text');
});

// =========================================================
//   الشريط العلوي (مشترك لكل الصفحات)
// =========================================================
function renderTopbar() {
  const u = me();
  const nav = [
    ['home', u ? 'dashboard.html' : 'index.html', 'الرئيسية'],
    ['skills', 'skills.html', 'المهارات'],
    ['how', 'index.html#how', 'كيف يعمل؟'],
    ['about', 'index.html#about', 'من نحن']
  ];
  const activeKey = (PAGE === 'dashboard' || PAGE === 'home') ? 'home' : (PAGE === 'skills' ? 'skills' : '');
  const right = u ? `
      <form class="tb-search" action="skills.html">${icon('search', 18)}<input name="q" placeholder="ابحث عن مهارة أو مستخدم..." value="${esc(params.get('q') || '')}"></form>
      <a class="tb-icon" href="chat.html" title="المحادثات">${icon('chat', 21)}<span class="dot-count" id="tbChat"></span></a>
      <div class="tb-drop"><button class="tb-icon" id="tbBell" title="الإشعارات">${icon('bell', 21)}<span class="dot-count" id="tbBellCount"></span></button>
        <div class="dropdown notif-drop" id="notifDrop"></div></div>
      <div class="tb-drop"><button class="tb-user" id="tbUser">${avatar(u, 40)}${icon('left', 16, 'chev')}</button>
        <div class="dropdown" id="userDrop">
          <div class="ud-head">${avatar(u, 40)}<div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div></div>
          <a href="profile.html">${icon('user', 18)} حسابي</a>
          <a href="exchanges.html">${icon('swap', 18)} تبادلاتي</a>
          <a href="chat.html">${icon('chat', 18)} المحادثات</a>
          <a href="settings.html">${icon('settings', 18)} الإعدادات</a>
          <button data-logout class="danger">${icon('logout', 18)} تسجيل الخروج</button>
        </div></div>`
    : `<a href="login.html" class="btn btn-outline btn-sm">تسجيل الدخول</a><a href="register.html" class="btn btn-primary btn-sm">ابدأ الآن</a>`;
  const html = `<header class="topbar"><div class="tb-inner">
      <div class="tb-actions">${right}</div>
      <nav class="tb-links" id="tbLinks">${nav.map(([k, h, t]) => `<a href="${h}" class="${k === activeKey ? 'active' : ''}">${t}</a>`).join('')}</nav>
      <button class="tb-icon tb-menu" id="tbMenu" aria-label="القائمة">${icon('menu', 22)}</button>
      <a href="${u ? 'dashboard.html' : 'index.html'}" class="logo" dir="ltr"><img src="img/logo.png" alt="SkillSwap"><span><b>Skill<i>Swap</i></b><small>Learn · Teach · Connect · Grow</small></span></a>
    </div></header>`;
  document.body.insertAdjacentHTML('afterbegin', html);
  $('#tbMenu').onclick = () => $('#tbLinks').classList.toggle('open');
  if (!u) return;
  $('#tbBell').onclick = e => {
    e.stopPropagation();
    $('#userDrop').classList.remove('show');
    const d = $('#notifDrop');
    d.classList.toggle('show');
    if (d.classList.contains('show')) { renderNotifDrop(); markNotificationsRead(u.id); updateTopbar(); }
  };
  $('#tbUser').onclick = e => { e.stopPropagation(); $('#notifDrop').classList.remove('show'); $('#userDrop').classList.toggle('show'); };
  document.addEventListener('click', e => { if (!e.target.closest('.tb-drop')) $$('.dropdown').forEach(d => d.classList.remove('show')); });
  updateTopbar();
}
function updateTopbar() {
  const u = me();
  if (!u || !$('#tbBellCount')) return;
  const n = notificationsOf(u.id).filter(x => !x.read).length;
  $('#tbBellCount').textContent = n || '';
  $('#tbChat').textContent = totalUnread(u.id) || '';
  if ($('#sideChat')) $('#sideChat').textContent = totalUnread(u.id) || '';
  if ($('#sideNotif')) $('#sideNotif').textContent = n || '';
}
const NOTIF_ICON = { request: 'swap', session: 'calendar', review: 'star', message: 'chat' };
function renderNotifDrop() {
  const u = me();
  const list = notificationsOf(u.id).slice(0, 6);
  $('#notifDrop').innerHTML = `<div class="dd-head"><b>الإشعارات</b><a href="notifications.html">عرض الكل</a></div>` + (list.length
    ? list.map(n => `<a class="dd-item ${n.read ? '' : 'unread'}" href="${esc(n.link || 'notifications.html')}"><span class="ni">${icon(NOTIF_ICON[n.kind] || 'bell', 18)}</span><span>${esc(n.text)}<small>${timeAgo(n.createdAt)}</small></span></a>`).join('')
    : `<div class="dd-empty">لا توجد إشعارات</div>`);
}

// تسجيل الخروج مع نافذة تأكيد
document.addEventListener('click', e => {
  const b = e.target.closest('[data-logout]');
  if (!b) return;
  e.preventDefault();
  popup({ text: 'هل أنتِ متأكدة من تسجيل الخروج؟', ok: 'تسجيل الخروج', cancel: 'البقاء مسجّلة', onOk: () => { logout(); location.href = 'index.html'; } });
});

// =========================================================
//   القائمة الجانبية لصفحات الحساب
// =========================================================
function accountLayout(active, content) {
  const items = [
    ['profile', 'user', 'حسابي', ''], ['exchanges', 'swap', 'تبادلاتي', ''], ['chat', 'chat', 'المحادثات', 'sideChat'],
    ['notifications', 'bell', 'الإشعارات', 'sideNotif'], ['settings', 'settings', 'الإعدادات', '']
  ];
  return `<div class="acc-layout"><aside class="side">
      ${items.map(([p, i, t, id]) => `<a href="${p}.html" class="${p === active ? 'active' : ''}">${icon(i, 20)} <span>${t}</span>${id ? `<em class="side-count" id="${id}"></em>` : ''}</a>`).join('')}
      <a href="#" data-logout>${icon('logout', 20)} <span>تسجيل الخروج</span></a>
    </aside><section class="acc-main">${content}</section></div>`;
}

// =========================================================
//   بطاقة مستخدمة (صفحة المهارات والرئيسية)
// =========================================================
function userCard(u, opts = {}) {
  const viewer = me();
  const teach = skillsOf(u.id, 'teach'), learn = skillsOf(u.id, 'learn');
  const fav = viewer && (viewer.favorites || []).includes(u.id);
  const revs = reviewsOf(u.id);
  return `<article class="ucard">
    <div class="uc-top">${avatar(u, 64)}
      <div class="uc-info"><a href="profile.html?id=${u.id}" class="uc-name">${esc(u.name)}</a>
        <div class="uc-meta">${starRow(avgRating(u.id), revs.length)}</div>${statusBadge(u)}</div>
      ${opts.score ? `<span class="score-pill">${opts.score}%</span>` : ''}
    </div>
    <p class="uc-bio">${esc(u.bio || (teach.length ? 'أستطيع تعليم ' + teach.map(s => s.skillName).join(' و ') : 'عضوة جديدة في SkillSwap'))}</p>
    <div class="uc-skills">
      <div><small>أستطيع تعليمه:</small><div class="chips">${skillChips(teach.slice(0, 3), 'teach')}</div></div>
      <div><small>أريد تعلمه:</small><div class="chips">${skillChips(learn.slice(0, 3), 'learn')}</div></div>
    </div>
    <div class="uc-actions">
      ${viewer && viewer.id === u.id ? `<a class="btn btn-outline btn-block" href="profile.html">ملفي الشخصي</a>` : `
      <button class="btn btn-primary" data-request-user="${u.id}">${icon('swap', 18)} طلب تبادل</button>
      <a class="btn btn-outline" href="profile.html?id=${u.id}">عرض الملف</a>
      <button class="btn-heart ${fav ? 'on' : ''}" data-fav="${u.id}" title="المفضلة">${icon('heart', 20)}</button>`}
    </div>
  </article>`;
}

// المفضلة
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fav]');
  if (!b) return;
  const u = me();
  if (!u) return location.href = 'login.html';
  const on = toggleFavorite(u.id, b.dataset.fav);
  $$(`[data-fav="${b.dataset.fav}"]`).forEach(x => x.classList.toggle('on', on));
  showToast(on ? 'أُضيفت للمفضلة' : 'أُزيلت من المفضلة');
});

// =========================================================
//   نافذة طلب التبادل
// =========================================================
function openRequestModal(otherId, wantedSkillId) {
  const viewer = me();
  if (!viewer) return location.href = 'login.html?next=' + encodeURIComponent('profile.html?id=' + otherId);
  const other = getUser(otherId);
  const mine = skillsOf(viewer.id, 'teach'), theirs = skillsOf(otherId, 'teach');
  if (!mine.length) {
    return popup({ text: 'عشان ترسلين طلب تبادل لازم يكون عندك مهارة وحدة على الأقل تقدرين تعلّمينها.', ok: 'إضافة مهارة', onOk: () => location.href = 'profile-edit.html' });
  }
  if (!theirs.length) return showToast('هذه المستخدمة لم تضف مهارات للتعليم بعد');
  const m = openModal(`<button class="m-x" data-close>${icon('x', 20)}</button>
    <div class="m-head">${avatar(other, 64)}<h3>طلب تبادل مع ${esc(other.name)}</h3></div>
    <form id="reqForm" novalidate>
      <div class="field"><label>المهارة التي تريدين تعلّمها</label>
        <select id="rqWanted" class="input" data-rule="select">${theirs.map(s => `<option value="${s.id}" ${s.id === Number(wantedSkillId) ? 'selected' : ''}>${esc(s.skillName)} (${s.level})</option>`).join('')}</select></div>
      <div class="field"><label>المهارة التي ستقدّمينها</label>
        <select id="rqOffer" class="input" data-rule="select"><option value="">اختاري مهارة</option>${mine.map(s => `<option value="${s.id}">${esc(s.skillName)} (${s.level})</option>`).join('')}</select>
        <span class="err">اختاري المهارة التي ستقدّمينها</span></div>
      <div class="field"><label>رسالة (اختياري)</label>
        <textarea id="rqMsg" class="input" rows="3" maxlength="300" placeholder="عرّفي بنفسك واقترحي وقتاً مناسباً"></textarea></div>
      <button class="btn btn-primary btn-block">${icon('send', 18)} إرسال الطلب</button>
    </form>`);
  $('#reqForm', m).addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(e.target)) return;
    try {
      sendRequest(viewer.id, otherId, $('#rqOffer').value, $('#rqWanted').value, $('#rqMsg').value);
      closeModal();
      showToast('تم إرسال طلب التبادل ✓');
      if (window.refreshPage) refreshPage();
    } catch (err) { showToast(err.message); }
  });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-request-user]');
  if (b) openRequestModal(Number(b.dataset.requestUser), b.dataset.skill);
});

// =========================================================
//   نافذة التقييم (حسب التصميم)
// =========================================================
const REVIEW_TAGS = ['معلّمة رائعة', 'شرح واضح', 'ملتزمة بالوقت', 'صبورة', 'مفيدة جداً'];
function openRatingModal(sessionId, onDone) {
  const viewer = me();
  const s = db.sessions.find(x => x.id === Number(sessionId));
  if (!s) return;
  if (hasReviewed(s.id, viewer.id)) return showToast('قيّمتِ هذه الجلسة من قبل');
  const c = db.conversations.find(x => x.id === s.convId);
  const o = getUser(otherUserId(c, viewer.id));
  let rating = 0;
  const tags = new Set();
  const m = openModal(`
    <div class="m-head">${avatar(o, 72)}<h3>${esc(s.topic || 'جلسة تبادل')} — ${esc(o.name)}</h3></div>
    <div class="star-pick" id="starPick">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}">${icon('star', 34, 'fill')}</button>`).join('')}</div>
    <textarea id="rvText" class="input" rows="3" maxlength="300" placeholder="اكتبي تقييمك..."></textarea>
    <div class="tag-pick">${REVIEW_TAGS.map(t => `<button type="button" class="tag" data-tag="${t}">${t}</button>`).join('')}</div>
    <button class="btn btn-primary btn-block" id="rvSend">إرسال التقييم</button>
    <button class="btn-link" data-close>تخطي</button>`, 'rate nofocus');
  $$('[data-star]', m).forEach(b => b.onclick = () => {
    rating = Number(b.dataset.star);
    $$('[data-star]', m).forEach(x => x.classList.toggle('on', Number(x.dataset.star) <= rating));
  });
  $$('[data-tag]', m).forEach(b => b.onclick = () => { b.classList.toggle('on'); tags.has(b.dataset.tag) ? tags.delete(b.dataset.tag) : tags.add(b.dataset.tag); });
  $('#rvSend', m).onclick = () => {
    if (!rating) return showToast('اختاري عدد النجوم أولاً');
    try { addReview(s.id, viewer.id, rating, $('#rvText').value, [...tags]); closeModal(); showToast('شكراً! تم إرسال التقييم ✓'); onDone && onDone(); }
    catch (err) { showToast(err.message); }
  };
}

// =========================================================
//   نوافذ القبول والرفض (تظهر مرة واحدة عند وصول الرد)
// =========================================================
function showResponsePopups() {
  const u = me();
  if (!u || $('#modal')) return;
  const n = db.notifications.find(x => x.userId === u.id && x.popup && !x.popupSeen);
  if (!n) return;
  n.popupSeen = true;
  commit();
  const r = db.requests.find(x => x.id === n.refId);
  if (!r) return;
  const other = getUser(r.receiverId), skill = getSkill(r.wantedSkillId);
  if (n.action === 'accepted') {
    popup({ text: `${esc(other ? other.name : '')} قبلت طلبك لمهارة ${esc(skill ? skill.skillName : '')}. ابدئي المحادثة الآن؟`,
            ok: 'نعم، ابدئي المحادثة', cancel: 'ليس الآن', onOk: () => location.href = 'chat.html?with=' + r.receiverId });
  } else {
    popup({ text: `${esc(other ? other.name : '')} اعتذرت عن طلبك لمهارة ${esc(skill ? skill.skillName : '')}.`,
            extra: `<p class="pop-reason">السبب: ${esc(n.reason || 'لم يُذكر سبب')}</p>`, ok: 'حسناً', cancel: '' });
  }
}
