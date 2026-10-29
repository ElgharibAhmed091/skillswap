/* =========================================================
   SkillSwap - التفاعلات الأساسية بلغة JavaScript
   (بيانات تجريبية مطابقة لقاعدة البيانات - تُستبدل لاحقاً بـ API)
   ========================================================= */

// ---------- بيانات تجريبية ----------
const skillsData = [
  { id: 1, user: 'ديما أحمد',    skill: 'JavaScript',      category: 'تطوير الويب',     level: 'متقدم', rating: 4.3, wants: 'Figma' },
  { id: 2, user: 'ديما أحمد',    skill: 'HTML & CSS',      category: 'تطوير الويب',     level: 'متقدم', rating: 4.3, wants: 'Figma' },
  { id: 3, user: 'وضحى سالم',    skill: 'Python',          category: 'البرمجة',         level: 'متوسط', rating: 4.0, wants: 'SQL' },
  { id: 4, user: 'انسجام علي',   skill: 'Figma',           category: 'التصميم',         level: 'متقدم', rating: 5.0, wants: 'JavaScript' },
  { id: 5, user: 'انسجام علي',   skill: 'Photoshop',       category: 'التصميم',         level: 'متقدم', rating: 5.0, wants: 'JavaScript' },
  { id: 6, user: 'ريناس خالد',   skill: 'أساسيات الشبكات', category: 'الشبكات والأمن',  level: 'متوسط', rating: 4.0, wants: 'Python' },
  { id: 7, user: 'غدي محمد',     skill: 'مهارات العرض',    category: 'المهارات الشخصية', level: 'متوسط', rating: 0,   wants: 'أساسيات الشبكات' },
  { id: 8, user: 'سخاء عبدالله', skill: 'SQL',             category: 'قواعد البيانات',  level: 'متقدم', rating: 4.0, wants: 'JavaScript' },
  { id: 9, user: 'غزل فهد',      skill: 'Java',            category: 'البرمجة',         level: 'متوسط', rating: 0,   wants: 'HTML & CSS' }
];

const avatarColors = ['#7c5cdb', '#6fbf9a', '#e98fc0', '#f4c35a', '#5b8def', '#b07cdb'];

// ---------- أدوات عامة ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function initials(name) { return name.trim().charAt(0); }
function colorFor(name) { return avatarColors[name.charCodeAt(0) % avatarColors.length]; }
function stars(r) {
  if (!r) return '<span class="muted">بدون تقييم بعد</span>';
  const full = Math.round(r);
  return '<span class="stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span> <small class="muted">' + r.toFixed(1) + '</small>';
}

function showToast(text) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- المستخدم الحالي (يُحفظ في المتصفح) ----------
const DEFAULT_USER = { name: 'ديما أحمد', email: 'dima@skillswap.sa', major: 'تطوير الويب', level: 'متقدم' };

function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function loadData(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
function currentUser() {
  return loadData('ss_current') || DEFAULT_USER;
}
// اسم مبدئي من البريد لو المستخدم لم يسجّل حساباً من قبل (مثال: alaa.ali@mail.com ← Alaa Ali)
function nameFromEmail(email) {
  return email.split('@')[0].replace(/[._\-0-9]+/g, ' ').trim()
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'مستخدم';
}

// عرض بيانات المستخدم في كل عنصر عليه data-user
function showUser() {
  const u = currentUser();
  const values = {
    name: u.name,
    first: u.name.split(' ')[0],
    initial: u.name.trim().charAt(0),
    email: u.email,
    major: u.major || 'غير محدد',
    level: u.level || 'غير محدد'
  };
  $$('[data-user]').forEach(el => { el.textContent = values[el.dataset.user]; });
}
showUser();

// تسجيل الخروج: حذف المستخدم الحالي
$$('[data-logout]').forEach(a => a.addEventListener('click', () => {
  try { localStorage.removeItem('ss_current'); } catch (e) {}
}));

// ---------- قائمة الجوال ----------
const toggle = $('.menu-toggle');
if (toggle) toggle.addEventListener('click', () => $('.nav-links').classList.toggle('open'));

// ---------- التحقق من صحة النماذج ----------
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(input, invalid) {
  input.classList.toggle('invalid', invalid);
  return !invalid;
}

function validateForm(form) {
  let ok = true;
  $$('[data-rule]', form).forEach(input => {
    const v = input.value.trim();
    let bad = false;
    switch (input.dataset.rule) {
      case 'required': bad = v.length === 0; break;
      case 'name':     bad = v.length < 3; break;
      case 'email':    bad = !emailRe.test(v); break;
      case 'password': bad = v.length < 8 || !/[0-9]/.test(v) || !/[A-Za-z]/.test(v); break;
      case 'match':    bad = v !== $('#' + input.dataset.target, form).value || v === ''; break;
      case 'select':   bad = v === ''; break;
    }
    if (!setError(input, bad)) ok = false;
  });
  return ok;
}

$$('form[data-validate]').forEach(form => {
  // إزالة الخطأ عند الكتابة
  $$('[data-rule]', form).forEach(i => i.addEventListener('input', () => i.classList.remove('invalid')));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const alertOk = $('.alert-success', form), alertErr = $('.alert-error', form);
    alertOk && alertOk.classList.remove('show');
    alertErr && alertErr.classList.remove('show');

    if (!validateForm(form)) {
      alertErr && alertErr.classList.add('show');
      return;
    }
    // حفظ المستخدم عند إنشاء حساب أو تسجيل الدخول
    if (form.id === 'registerForm') {
      const user = {
        name: $('#name', form).value.trim(),
        email: $('#regEmail', form).value.trim().toLowerCase(),
        major: $('#major', form).value,
        level: $('#level', form).value
      };
      const users = loadData('ss_users') || {};
      users[user.email] = user;
      saveData('ss_users', users);
      saveData('ss_current', user);
    }
    if (form.id === 'loginForm') {
      const email = $('#email', form).value.trim().toLowerCase();
      const users = loadData('ss_users') || {};
      saveData('ss_current', users[email] || { name: nameFromEmail(email), email: email, major: '', level: '' });
    }

    alertOk && alertOk.classList.add('show');
    const next = form.dataset.redirect;
    if (next) setTimeout(() => (window.location.href = next), 1000);
  });
});

// إظهار / إخفاء كلمة المرور
$$('[data-toggle-pass]').forEach(btn => btn.addEventListener('click', () => {
  const inp = $('#' + btn.dataset.togglePass);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? 'إظهار' : 'إخفاء';
}));

// ---------- صفحة المهارات: البحث والتصفية ----------
const skillsGrid = $('#skillsGrid');
if (skillsGrid) {
  let activeCat = 'الكل';
  const search = $('#searchSkill');
  const level = $('#levelFilter');

  function render() {
    const q = search.value.trim().toLowerCase();
    const lv = level.value;
    const list = skillsData.filter(s =>
      (activeCat === 'الكل' || s.category === activeCat) &&
      (lv === '' || s.level === lv) &&
      (s.skill.toLowerCase().includes(q) || s.user.includes(q))
    );
    skillsGrid.innerHTML = list.map(s => `
      <div class="card skill-card">
        <div class="top">
          <span class="badge badge-purple">${s.category}</span>
          <span class="badge ${s.level === 'متقدم' ? 'badge-green' : 'badge-yellow'}">${s.level}</span>
        </div>
        <h4>${s.skill}</h4>
        <div class="user-mini">
          <div class="avatar" style="background:${colorFor(s.user)}">${initials(s.user)}</div>
          <div><b>${s.user}</b><div>${stars(s.rating)}</div></div>
        </div>
        <p class="muted">ترغب في تعلّم: <b>${s.wants}</b></p>
        <button class="btn btn-primary btn-sm" data-request="${s.id}">إرسال طلب تبادل</button>
      </div>`).join('');
    $('#emptyState').style.display = list.length ? 'none' : 'block';
    $('#resultCount').textContent = list.length + ' نتيجة';
  }

  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    activeCat = c.dataset.cat;
    render();
  }));
  search.addEventListener('input', render);
  level.addEventListener('change', render);

  // نافذة طلب التبادل
  const modal = $('#requestModal');
  skillsGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-request]');
    if (!btn) return;
    const s = skillsData.find(x => x.id == btn.dataset.request);
    $('#modalSkill').textContent = s.skill;
    $('#modalUser').textContent = s.user;
    modal.classList.add('show');
  });
  $$('[data-close]').forEach(b => b.addEventListener('click', () => modal.classList.remove('show')));
  $('#requestForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(e.target)) return;
    modal.classList.remove('show');
    e.target.reset();
    showToast('تم إرسال طلب التبادل بنجاح ✓');
  });

  render();
}

// ---------- لوحة التحكم: قبول / رفض الطلبات ----------
$$('[data-action]').forEach(btn => btn.addEventListener('click', () => {
  const row = btn.closest('.list-item');
  const accepted = btn.dataset.action === 'accept';
  $('.req-actions', row).innerHTML = accepted
    ? '<span class="badge badge-green">مقبول</span>'
    : '<span class="badge badge-red">مرفوض</span>';
  showToast(accepted ? 'تم قبول الطلب وإنشاء مطابقة جديدة' : 'تم رفض الطلب وإرسال إشعار للمرسل');
}));

// ---------- الملف الشخصي: التبويبات ----------
$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.tab-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  $('#' + tab.dataset.tab).classList.add('active');
}));

// إضافة مهارة جديدة من الملف الشخصي
const addSkillForm = $('#addSkillForm');
if (addSkillForm) {
  addSkillForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(addSkillForm)) return;
    const name = $('#newSkill').value.trim();
    const type = $('#newSkillType').value;
    const target = type === 'تعليم' ? $('#teachTags') : $('#learnTags');
    const tag = document.createElement('span');
    tag.className = 'badge ' + (type === 'تعليم' ? 'badge-purple' : 'badge-yellow');
    tag.textContent = name;
    target.appendChild(tag);
    addSkillForm.reset();
    showToast('تمت إضافة المهارة: ' + name);
  });
}

// ---------- المحادثة ----------
const chatForm = $('#chatForm');
if (chatForm) {
  const box = $('#messages');
  box.scrollTop = box.scrollHeight;

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#msgInput');
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const div = document.createElement('div');
    div.className = 'msg me';
    div.textContent = text;
    const small = document.createElement('small');
    small.textContent = time;
    div.appendChild(small);
    box.appendChild(div);
    input.value = '';
    box.scrollTop = box.scrollHeight;
  });

  $$('.chat-list .item').forEach(it => it.addEventListener('click', () => {
    $$('.chat-list .item').forEach(x => x.classList.remove('active'));
    it.classList.add('active');
    $('#chatName').textContent = it.dataset.name;
  }));
}
