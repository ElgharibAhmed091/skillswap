/* =========================================================
   SkillSwap - صفحات الموقع
   يعتمد على js/db.js (البيانات) و js/ui.js (عناصر الواجهة)
   ========================================================= */

let ME = me();
const PROTECTED = ['dashboard', 'profile', 'profile-edit', 'exchanges', 'notifications', 'chat', 'settings'];
let activeConv = null;                                            // المحادثة المفتوحة
let convSearch = '';                                              // البحث في المحادثات
let exTab = location.hash === '#sessions' ? 'sessions' : 'incoming'; // تبويب صفحة تبادلاتي

if (PROTECTED.includes(PAGE) && !ME) {
  location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search));
} else {
  if ((PAGE === 'login' || PAGE === 'register') && ME) location.replace('dashboard.html');
  renderTopbar();
  const pages = {
    home: renderHome, login: renderLogin, register: renderRegister, dashboard: renderDashboard, skills: renderSkills,
    profile: renderProfile, 'profile-edit': renderProfileEdit, exchanges: renderExchanges,
    notifications: renderNotifications, chat: renderChat, settings: renderSettings
  };
  if (pages[PAGE]) pages[PAGE]();
  showResponsePopups();
  // تحديث تلقائي لما تتغير البيانات من تبويب ثاني (رسالة أو طلب جديد)
  window.addEventListener('storage', e => {
    if (e.key !== DB_KEY) return;
    reloadDB(); ME = me();
    if (PROTECTED.includes(PAGE) && !ME) return location.replace('login.html');
    updateTopbar();
    if (PAGE === 'chat') return refreshChat();
    const a = document.activeElement;
    if ($('#modal') || (a && ['INPUT', 'TEXTAREA', 'SELECT'].includes(a.tagName))) return;
    window.refreshPage && refreshPage();
    showResponsePopups();
  });
}

function main(html) { const m = $('#app'); m.innerHTML = html; return m; }
function categoryCard(c, count) {
  return `<a class="cat-card" href="skills.html?cat=${encodeURIComponent(c.ar)}" style="--c:${c.color};--bg:${c.bg}">
    <span class="cat-ic">${icon(c.icon, 34)}</span><b>${c.en}</b><small>${c.ar}</small>${count != null ? `<em>${count} مستخدمة</em>` : ''}</a>`;
}

// =========================================================
//   الصفحة الرئيسية للزوار
// =========================================================
function renderHome() {
  const st = siteStats();
  const counts = categoryCounts();
  const steps = [
    ['user', 'أنشئي حسابك', 'سجّلي بياناتك واختاري المهارات اللي تعرفينها واللي تبين تتعلمينها.'],
    ['search', 'اكتشفي المهارات', 'ابحثي حسب التصنيف، والمنصة تقترح لك الأنسب بالمطابقة الذكية.'],
    ['swap', 'أرسلي طلب تبادل', 'اختاري المهارة اللي تقدمينها مقابل المهارة اللي تبينها.'],
    ['star', 'تعلّمي وقيّمي', 'تواصلي بالمحادثة، حددي جلسة، وبعدها قيّمي شريكتك.']
  ];
  main(`
  <section class="land-hero"><div class="wrap">
    <div class="lh-text">
      <span class="pill">${icon('sparkle', 16)} مجتمع تبادل المهارات</span>
      <h1>تبادل مهاراتك،<br>وتعلم مهارات جديدة<br><span>بدون مقابل.</span></h1>
      <p>شارك معرفتك، تعلم من غيرك،<br>وطوّر مهاراتك مع مجتمع SkillSwap.</p>
      <div class="row-btns"><a href="${ME ? 'dashboard.html' : 'register.html'}" class="btn btn-primary btn-lg">${ME ? 'اذهبي للوحتك' : 'ابدأ الآن'} ${icon('arrowLeft', 18)}</a>
        <a href="#how" class="btn btn-outline btn-lg">تعرف أكثر</a></div>
    </div>
    <div class="lh-art"><img src="img/hero-home.jpg" alt=""></div>
  </div>
  <div class="wrap"><div class="stats-bar">
    <div><span class="sb-ic">${icon('users', 24)}</span><b>${st.users}</b><small>مستخدم نشط</small></div>
    <div><span class="sb-ic">${icon('cap', 24)}</span><b>${st.skills}</b><small>مهارة مختلفة</small></div>
    <div><span class="sb-ic">${icon('swap', 24)}</span><b>${st.exchanges}</b><small>عملية تبادل</small></div>
    <div><span class="sb-ic">${icon('star', 24)}</span><b>${CATEGORIES.length}</b><small>تخصص ومجال</small></div>
  </div></div></section>

  <section class="sec" id="how"><div class="wrap">
    <h2 class="sec-title">كيف يعمل SkillSwap؟</h2><p class="sec-sub">أربع خطوات بسيطة وتبدئين رحلة التعلّم</p>
    <div class="steps">${steps.map(([i, t, d], n) => `<div class="step"><span class="step-n">${n + 1}</span><span class="step-ic">${icon(i, 28)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><h2>تصفح حسب التصنيف</h2><a href="skills.html">عرض الكل ${icon('arrowLeft', 16)}</a></div>
    <div class="cat-row">${CATEGORY_INFO.slice(0, 6).map(c => categoryCard(c, counts[c.ar])).join('')}</div>
  </div></section>

  <section class="sec" id="about"><div class="wrap about">
    <div><h2>من نحن</h2>
      <p>SkillSwap منصة لتبادل المهارات بين طالبات الكليات والجامعات. الفكرة بسيطة: كل طالبة عندها مهارة تتقنها ومهارة تتمنى تتعلمها، فبدل ما تدفع على دورة، تلاقي طالبة تبادلها المعرفة.</p>
      <p>المشروع من إعداد طالبات الكلية التقنية للبنات بمكة المكرمة ضمن مشروع التخرج.</p></div>
    <div class="about-cards">
      <div>${icon('bulb', 26)}<b>تعلّم مجاني</b><span>تبادل بدون مقابل مادي</span></div>
      <div>${icon('users', 26)}<b>مجتمع طلابي</b><span>طالبات بنفس اهتماماتك</span></div>
      <div>${icon('shield', 26)}<b>تقييمات موثوقة</b><span>بعد كل جلسة تبادل</span></div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap"><div class="cta">
    <div><h2>جاهزة تبدئين؟</h2><p>انضمي لمجتمع SkillSwap وابدئي تبادل المهارات اليوم.</p></div>
    <a href="${ME ? 'skills.html' : 'register.html'}" class="btn btn-light btn-lg">${ME ? 'اكتشفي المهارات' : 'إنشاء حساب'}</a>
  </div></div></section>
  <footer class="foot">© 2026 SkillSwap — الكلية التقنية للبنات بمكة المكرمة</footer>`);
}

// =========================================================
//   تسجيل الدخول
// =========================================================
function renderLogin() {
  main(`<section class="auth"><div class="wrap auth-grid">
    <div class="auth-card">
      <h1>تسجيل الدخول</h1>
      <form id="loginForm" novalidate>
        <div class="alert alert-error"></div>
        <div class="field"><label>البريد الإلكتروني</label>
          <div class="input-ic">${icon('mail', 19)}<input id="email" type="email" class="input" data-rule="email" placeholder="أدخل بريدك الإلكتروني"></div>
          <span class="err">أدخلي بريداً إلكترونياً صحيحاً</span></div>
        <div class="field"><label>كلمة المرور</label>
          <div class="input-ic">${icon('lock', 19)}<input id="password" type="password" class="input" data-rule="required" placeholder="أدخل كلمة المرور">
            <button type="button" class="eye" data-toggle-pass="password">${icon('eye', 19)}</button></div>
          <span class="err">كلمة المرور مطلوبة</span></div>
        <label class="check"><input type="checkbox" id="remember" checked> تذكّريني</label>
        <button class="btn btn-primary btn-block btn-lg">تسجيل الدخول</button>
      </form>
      <p class="auth-foot">ليس لديك حساب؟ <a href="register.html">إنشاء حساب</a></p>
    </div>
    <div class="auth-side">
      <h2>مرحبًا بعودتك! 👋</h2><p>سجل دخولك وابدأ تبادل المهارات.</p>
      <ul class="feat">
        <li>${icon('user', 20)} تعلم من خبرات الآخرين</li>
        <li>${icon('users', 20)} شارك معرفتك ومهاراتك</li>
        <li>${icon('camera', 20)} كوّن صداقات في نفس المجال</li>
      </ul>
      <img class="art" src="img/login-art.jpg" alt="">
    </div>
  </div></section>`);
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    if (!validateForm(f)) return;
    try {
      const u = await checkLogin($('#email').value, $('#password').value);
      setCurrentUser(u.id, $('#remember').checked);
      location.href = params.get('next') || 'dashboard.html';
    } catch (err) { showAlert(f, 'alert-error', err.message); }
  });
}

// =========================================================
//   إنشاء حساب (مع اختيار المهارات)
// =========================================================
function renderRegister() {
  const teachDefault = ['JavaScript', 'CSS', 'HTML', 'Python', 'UI/UX'];
  const learnDefault = ['React', 'Java', 'Design', 'Data Analysis', 'Marketing'];
  const picked = { teach: new Set(), learn: new Set() };
  main(`<section class="auth"><div class="wrap auth-grid">
    <div class="auth-card wide">
      <h1>إنشاء حساب</h1><p class="auth-sub">ابدأ رحلتك الآن مع SkillSwap</p>
      <form id="registerForm" novalidate>
        <div class="alert alert-error"></div>
        <div class="field"><label>الاسم الكامل</label><div class="input-ic">${icon('user', 19)}<input id="name" class="input" data-rule="name" maxlength="60" placeholder="أدخل اسمك الكامل"></div><span class="err">الاسم 3 أحرف على الأقل</span></div>
        <div class="field"><label>البريد الإلكتروني</label><div class="input-ic">${icon('mail', 19)}<input id="regEmail" type="email" class="input" data-rule="email" placeholder="example@email.com"></div><span class="err">أدخلي بريداً إلكترونياً صحيحاً</span></div>
        <div class="field"><label>كلمة المرور</label><div class="input-ic">${icon('lock', 19)}<input id="regPass" type="password" class="input" data-rule="password" placeholder="أدخل كلمة المرور"><button type="button" class="eye" data-toggle-pass="regPass">${icon('eye', 19)}</button></div><span class="err">8 أحرف على الأقل وتحتوي على حروف وأرقام</span></div>
        <div class="field"><label>تأكيد كلمة المرور</label><div class="input-ic">${icon('lock', 19)}<input id="regPass2" type="password" class="input" data-rule="match" data-target="regPass" placeholder="أعد كتابة كلمة المرور"><button type="button" class="eye" data-toggle-pass="regPass2">${icon('eye', 19)}</button></div><span class="err">كلمتا المرور غير متطابقتين</span></div>
        <div class="pick-group" data-type="teach"><label>ما المهارات التي تستطيع تعليمها؟</label>
          <div class="chips" id="teachChips">${teachDefault.map(s => `<button type="button" class="tag" data-skill="${s}">${s}</button>`).join('')}
            <button type="button" class="tag add" data-add="teach">${icon('plus', 14)} إضافة مهارة</button></div></div>
        <div class="pick-group" data-type="learn"><label>ما المهارات التي تريد تعلمها؟</label>
          <div class="chips" id="learnChips">${learnDefault.map(s => `<button type="button" class="tag" data-skill="${s}">${s}</button>`).join('')}
            <button type="button" class="tag add" data-add="learn">${icon('plus', 14)} إضافة مهارة</button></div></div>
        <div class="field"><label class="check"><input type="checkbox" id="terms" data-rule="required"> أوافق على <a href="#" id="termsLink">شروط استخدام SkillSwap وسياسة الخصوصية</a></label><span class="err">يجب الموافقة على الشروط</span></div>
        <button class="btn btn-primary btn-block btn-lg">إنشاء الحساب</button>
      </form>
      <p class="auth-foot">لديك حساب بالفعل؟ <a href="login.html">تسجيل الدخول</a></p>
    </div>
    <div class="auth-side">
      <h2 class="big">انضم إلى<br>مجتمع <span>SkillSwap</span></h2>
      <p>أنشئ حسابك وابدأ رحلة التعلم<br>وتبادل المهارات بدون مقابل.</p>
      <img class="art" src="img/register-art.jpg" alt="">
    </div>
  </div></section>`);

  const bindTag = b => b.onclick = () => {
    const type = b.closest('.pick-group').dataset.type;
    b.classList.toggle('on');
    b.classList.contains('on') ? picked[type].add(b.dataset.skill) : picked[type].delete(b.dataset.skill);
  };
  $$('[data-skill]').forEach(bindTag);
  $$('[data-add]').forEach(b => b.onclick = () => {
    const type = b.dataset.add;
    const m = openModal(`<h3>إضافة مهارة</h3><form id="addF"><div class="field"><input id="addName" class="input" maxlength="40" placeholder="اسم المهارة، مثال: Photoshop"></div>
      <button class="btn btn-primary btn-block">إضافة</button></form>`);
    $('#addF', m).onsubmit = e => {
      e.preventDefault();
      const name = $('#addName').value.trim();
      if (!name) return;
      closeModal();
      const t = document.createElement('button');
      t.type = 'button'; t.className = 'tag on'; t.dataset.skill = name; t.textContent = name;
      b.before(t); bindTag(t); picked[type].add(name);
    };
  });
  $('#termsLink').onclick = e => {
    e.preventDefault();
    openModal(`<button class="m-x" data-close>${icon('x', 20)}</button><h3>شروط الاستخدام وسياسة الخصوصية</h3>
      <ul class="terms"><li>المنصة مخصصة لتبادل المهارات بين الطالبات بدون مقابل مادي.</li>
      <li>الالتزام بالاحترام في المحادثات والجلسات، ويمكن حظر أي مستخدمة مسيئة.</li>
      <li>التقييمات يجب أن تكون صادقة وتعكس تجربة الجلسة.</li>
      <li>بياناتك تُحفظ في متصفح جهازك فقط، ويمكنك حذف حسابك في أي وقت من الإعدادات.</li></ul>
      <button class="btn btn-primary btn-block" data-close>فهمت</button>`, 'nofocus');
  };
  $('#registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    if (!validateForm(f)) return;
    try {
      const u = await createUser({ name: $('#name').value, email: $('#regEmail').value, password: $('#regPass').value,
                                   teach: [...picked.teach], learn: [...picked.learn] });
      setCurrentUser(u.id, true);
      location.href = 'dashboard.html?welcome=1';
    } catch (err) { showAlert(f, 'alert-error', err.message); window.scrollTo(0, 0); }
  });
}

// =========================================================
//   لوحة الترحيب بعد الدخول
// =========================================================
function renderDashboard() {
  window.refreshPage = renderDashboard;
  const counts = categoryCounts();
  const sugg = suggestionsFor(ME.id);
  const others = db.users.filter(u => u.id !== ME.id && isVisible(u) && !isBlocked(ME.id, u.id) && !sugg.some(s => s.user.id === u.id));
  const list = sugg.map(s => ({ u: s.user, score: s.score })).concat(others.map(u => ({ u }))).slice(0, 8);
  const incoming = db.requests.filter(r => r.receiverId === ME.id && r.status === 'pending').length;
  const next = sessionsOfUser(ME.id).filter(s => s.status === 'scheduled').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const noSkills = !skillsOf(ME.id).length;
  main(`<div class="wrap page">
    <div class="dash-head">
      <div><h1>مرحبًا، ${esc(ME.name.split(' ')[0])} 👋</h1><p>مستعدة لتتعلمين مهارة جديدة اليوم؟</p></div>
      <form class="big-search" action="skills.html">${icon('search', 20)}<input name="q" placeholder="ابحث عن مهارة تريد تعلمها..."><a href="skills.html" class="sq-btn" title="تصفية">${icon('sliders', 20)}</a></form>
    </div>
    ${noSkills ? `<div class="notice">${icon('info', 20)}<span>حسابك جديد! أضيفي المهارات اللي تعرفينها واللي تبين تتعلمينها عشان نقترح لك الأنسب.</span><a href="profile-edit.html" class="btn btn-primary btn-sm">إضافة مهاراتي</a></div>` : ''}
    ${incoming ? `<div class="notice">${icon('swap', 20)}<span>عندك ${incoming} ${incoming > 1 ? 'طلبات' : 'طلب'} تبادل ${incoming > 1 ? 'جديدة' : 'جديد'} بانتظار ردّك</span><a href="exchanges.html" class="btn btn-primary btn-sm">عرض الطلبات</a></div>` : ''}
    ${next ? `<div class="notice green">${icon('calendar', 20)}<span>جلستك القادمة: <b>${esc(next.topic || 'جلسة تبادل')}</b> — ${fmtSession(next)}</span><a href="exchanges.html#sessions" class="btn btn-outline btn-sm">التفاصيل</a></div>` : ''}
    <div class="dash-grid">
      <div class="promo"><div><h3>شارك معرفتك<br>وكن جزء من مجتمعنا</h3><a href="skills.html" class="btn btn-primary btn-sm">ابدأ التبادل الآن</a></div><img src="img/hero-skills.jpg" alt=""></div>
      <div><div class="sec-head"><h2>استكشف المهارات</h2><a href="skills.html">عرض الكل</a></div>
        <div class="cat-row small">${CATEGORY_INFO.slice(0, 5).map(c => categoryCard(c)).join('')}</div></div>
    </div>
    <div class="sec-head"><h2>مهارات قد تهمك</h2><a href="skills.html">عرض الكل</a></div>
    ${list.length ? `<div class="cards">${list.map(x => userCard(x.u, { score: x.score })).join('')}</div>`
      : emptyBox('users', 'لا توجد مستخدمات أخريات بعد. لما تسجّل طالبات ويضفن مهاراتهن بيظهرن هنا')}
  </div>`);
}

// =========================================================
//   اكتشف المهارات
// =========================================================
function renderSkills() {
  const f = { q: params.get('q') || '', cats: new Set(params.get('cat') ? [params.get('cat')] : []), levels: new Set(), type: new Set() };
  const counts = categoryCounts();
  main(`<div class="wrap page">
    <div class="crumbs"><a href="${ME ? 'dashboard.html' : 'index.html'}">الرئيسية</a> ${icon('left', 14)} <span>اكتشف المهارات</span></div>
    <div class="skills-layout">
      <aside class="filters-card" id="filters">
        <h3>${icon('filter', 20)} تصفية النتائج</h3>
        <h4>التصنيف</h4>
        <label class="cb"><input type="checkbox" data-all-cats ${f.cats.size ? '' : 'checked'}> جميع التصنيفات</label>
        ${CATEGORY_INFO.slice(0, 8).map(c => `<label class="cb"><input type="checkbox" data-cat="${c.ar}" ${f.cats.has(c.ar) ? 'checked' : ''}> <span style="color:${c.color}">${icon(c.icon, 18)}</span> ${c.ar}</label>`).join('')}
        <h4>المستوى</h4>
        ${LEVELS.map(l => `<label class="cb"><input type="checkbox" data-level="${l}"> ${l}</label>`).join('')}
        <h4>نوع التبادل</h4>
        <label class="cb"><input type="checkbox" data-type="teach"> تعليم مهارة</label>
        <label class="cb"><input type="checkbox" data-type="learn"> تعلّم مهارة</label>
        <button class="btn btn-primary btn-block" id="applyF">تطبيق الفلاتر</button>
        <button class="btn btn-outline btn-block" id="resetF">إعادة ضبط</button>
      </aside>
      <div class="skills-main">
        <section class="skills-hero">
          <div class="sh-text"><h1>اكتشف <span>المهارات</span></h1><p>ابحث عن ما تريد تعلمه من خلال تصنيفات متنوعة<br>وتواصل مع أشخاص مهرة في نفس المجال.</p>
            <form class="big-search" id="skSearch">${icon('search', 20)}<input id="skQ" placeholder="ابحث عن مهارة تريد تعلمها..." value="${esc(f.q)}"><button class="btn btn-primary">بحث</button></form></div>
          <img src="img/hero-skills.jpg" alt="">
        </section>
        <div class="sec-head"><h2>التصنيفات الشائعة</h2><a href="#" id="allCats">عرض الكل</a></div>
        <div class="cat-row">${CATEGORY_INFO.slice(0, 6).map(c => categoryCard(c, counts[c.ar])).join('')}</div>
        <div class="chips pop-chips">${popularSkills(10).map(s => `<button class="tag" data-pop="${esc(s)}">${esc(s)}</button>`).join('')}</div>
        <div class="sec-head"><h2>المستخدمات</h2><span class="muted" id="resCount"></span></div>
        <div class="cards three" id="results"></div>
      </div>
    </div>
  </div>`);

  const draw = () => {
    const q = norm(f.q);
    const users = db.users.filter(u => (!ME || u.id !== ME.id) && isVisible(u) && !(ME && isBlocked(ME.id, u.id)));
    const res = users.filter(u => {
      const sk = skillsOf(u.id);
      const pool = f.type.size ? sk.filter(s => f.type.has(s.type)) : sk;
      if (f.cats.size && !pool.some(s => f.cats.has(s.category))) return false;
      if (f.levels.size && !pool.some(s => f.levels.has(s.level))) return false;
      if (q && !norm(u.name).includes(q) && !pool.some(s => norm(s.skillName).includes(q))) return false;
      return true;
    }).sort((a, b) => avgRating(b.id) - avgRating(a.id));
    $('#resCount').textContent = res.length + ' نتيجة';
    $('#results').innerHTML = res.length ? res.map(u => userCard(u, { score: ME ? matchScore(ME.id, u.id) : 0 })).join('')
      : `<div class="span-all">${emptyBox('search', db.users.length < 2 ? 'لا توجد مستخدمات أخريات في المنصة بعد' : 'لا توجد نتائج مطابقة، جرّبي كلمة بحث أخرى أو أعيدي ضبط الفلاتر')}</div>`;
  };
  window.refreshPage = draw;
  const readFilters = () => {
    f.cats = new Set($$('[data-cat]:checked').map(x => x.dataset.cat));
    f.levels = new Set($$('[data-level]:checked').map(x => x.dataset.level));
    f.type = new Set($$('[data-type]:checked').map(x => x.dataset.type));
    $('[data-all-cats]').checked = !f.cats.size;
  };
  $$('#filters input').forEach(i => i.addEventListener('change', () => {
    if (i.hasAttribute('data-all-cats') && i.checked) $$('[data-cat]').forEach(x => x.checked = false);
    readFilters(); draw();
  }));
  $('#applyF').onclick = () => { readFilters(); draw(); $('#results').scrollIntoView({ behavior: 'smooth' }); };
  $('#resetF').onclick = () => { $$('#filters input').forEach(i => i.checked = false); $('[data-all-cats]').checked = true; f.q = ''; $('#skQ').value = ''; readFilters(); draw(); };
  $('#skSearch').onsubmit = e => { e.preventDefault(); f.q = $('#skQ').value; draw(); $('#results').scrollIntoView({ behavior: 'smooth' }); };
  $('#skQ').addEventListener('input', () => { f.q = $('#skQ').value; draw(); });
  $$('[data-pop]').forEach(b => b.onclick = () => { f.q = b.dataset.pop; $('#skQ').value = f.q; draw(); });
  $$('.cat-card').forEach(a => a.onclick = e => {
    e.preventDefault();
    const c = decodeURIComponent(a.getAttribute('href').split('cat=')[1]);
    $$('[data-cat]').forEach(x => x.checked = x.dataset.cat === c);
    readFilters(); draw();
  });
  $('#allCats').onclick = e => { e.preventDefault(); $$('[data-cat]').forEach(x => x.checked = false); readFilters(); draw(); };
  draw();
}

// =========================================================
//   حسابي / ملف مستخدمة أخرى
// =========================================================
function achievements(u) {
  const done = completedSessionsCount(u.id), avg = avgRating(u.id), revs = reviewsOf(u.id).length;
  const msgs = db.messages.filter(m => m.senderId === u.id).length;
  return [
    ['trophy', 'أول تبادل', done >= 1],
    ['award', '10 تبادلات مكتملة', done >= 10],
    ['bulb', 'مساهمة نشطة', skillsOf(u.id, 'teach').length >= 3 || msgs >= 20],
    ['star', 'تقييم ممتاز', revs >= 3 && avg >= 4.5]
  ];
}
function renderProfile() {
  window.refreshPage = renderProfile;
  const id = Number(params.get('id')) || ME.id;
  const u = getUser(id);
  if (!u || (u.id !== ME.id && !isVisible(u))) { main(accountLayout('profile', emptyBox('user', 'هذا الحساب غير موجود أو مخفي'))); return; }
  const mine = u.id === ME.id;
  const teach = skillsOf(u.id, 'teach'), learn = skillsOf(u.id, 'learn'), revs = reviewsOf(u.id), avg = avgRating(u.id);
  const fav = (ME.favorites || []).includes(u.id);
  main(accountLayout(mine ? 'profile' : '', `
    <div class="prof-top">
      <div class="card prof-card">
        ${avatar(u, 110, 'big')}
        <div><h1>${esc(u.name)}</h1><p class="muted">${esc(u.major || 'لم يُحدَّد التخصص')}</p>
          <div>${starRow(avg)}</div> ${statusBadge(u)}
          <p class="bio-line">${esc(u.bio || (mine ? 'اكتبي نبذة عنك من تعديل الملف الشخصي' : ''))}</p>
          ${mine ? `<a href="profile-edit.html" class="btn btn-outline btn-sm">${icon('edit', 16)} تعديل الملف الشخصي</a>`
            : (isBlocked(ME.id, u.id) ? '<span class="badge red">محظورة</span>' : `<div class="row-btns">
              <button class="btn btn-primary btn-sm" data-request-user="${u.id}">${icon('swap', 16)} طلب تبادل</button>
              ${canMessage(ME.id, u.id) ? `<a class="btn btn-outline btn-sm" href="chat.html?with=${u.id}">${icon('chat', 16)} مراسلة</a>` : ''}
              <button class="btn-heart ${fav ? 'on' : ''}" data-fav="${u.id}">${icon('heart', 18)}</button></div>`)}
        </div>
      </div>
      <div class="stat-card"><span>${icon('star', 26, 'fill')}</span><b>${avg ? avg.toFixed(1) : '—'}</b><small>التقييم</small></div>
      <div class="stat-card"><span>${icon('swap', 26)}</span><b>${activeExchanges(u.id)}</b><small>التبادلات الحالية</small></div>
      <div class="stat-card"><span>${icon('cap', 26)}</span><b>${completedSessionsCount(u.id)}</b><small>التبادلات المكتملة</small></div>
    </div>
    <div class="prof-grid">
      <div class="card"><h3>نبذة عني</h3><p>${esc(u.bio) || '<span class="muted">لا توجد نبذة بعد</span>'}</p>
        <div class="kv"><span>المستوى</span><b>${esc(u.level || '—')}</b></div>
        <div class="kv"><span>أوقات التوفر</span><b>${esc(u.availability || '—')}</b></div>
        <div class="kv"><span>تاريخ الانضمام</span><b>${fmtDate(u.createdAt)}</b></div></div>
      <div class="card"><h3>المهارات التي أريد تعلمها</h3><div class="chips">${skillChips(learn, 'learn')}${mine ? `<a class="tag add" href="profile-edit.html">${icon('plus', 14)} إضافة مهارة</a>` : ''}</div></div>
      <div class="card"><h3>المهارات التي أستطيع تعليمها</h3><div class="chips">${skillChips(teach, 'teach')}${mine ? `<a class="tag add" href="profile-edit.html">${icon('plus', 14)} إضافة مهارة</a>` : ''}</div></div>
    </div>
    <h3 class="h-sec">إنجازاتي</h3>
    <div class="ach-row">${achievements(u).map(([i, t, ok]) => `<div class="ach ${ok ? 'on' : ''}"><span>${icon(i, 26)}</span><b>${t}</b>${ok ? '' : '<small>لم يتحقق بعد</small>'}</div>`).join('')}</div>
    <h3 class="h-sec">التقييمات (${revs.length})</h3>
    <div class="card">${revs.length ? revs.map(r => {
      const w = getUser(r.reviewerId);
      return `<div class="review">${w ? avatar(w, 42) : ''}<div><b>${esc(w ? w.name : 'مستخدمة محذوفة')}</b> <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        <p>${esc(r.comment) || '<span class="muted">بدون تعليق</span>'}</p>
        ${(r.tags || []).length ? `<div class="chips">${r.tags.map(t => `<span class="chip-s">${esc(t)}</span>`).join('')}</div>` : ''}
        <small class="muted">${fmtDate(r.createdAt)}</small></div></div>`;
    }).join('') : emptyBox('star', 'لا توجد تقييمات بعد')}</div>`));
  updateTopbar();
}

// =========================================================
//   تعديل الملف الشخصي
// =========================================================
function renderProfileEdit() {
  const teach = skillsOf(ME.id, 'teach').map(s => s.skillName), learn = skillsOf(ME.id, 'learn').map(s => s.skillName);
  const lvl = t => (skillsOf(ME.id, t)[0] || {}).level || (t === 'teach' ? 'متوسط' : 'مبتدئ');
  let photo = ME.photo || '';
  const groups = { teach: [...teach], learn: [...learn] };
  const chipsHtml = t => groups[t].map((s, i) => `<span class="tag on">${esc(s)}<button type="button" data-rm="${t}:${i}">${icon('x', 13)}</button></span>`).join('') +
    `<button type="button" class="tag add" data-addg="${t}">${icon('plus', 14)} إضافة مهارة</button>`;
  main(accountLayout('profile', `
    <form class="card edit-card" id="editForm" novalidate>
      <h1>تعديل الملف الشخصي</h1>
      <div class="edit-top">
        <div class="photo-box"><div id="photoPrev">${avatar(Object.assign({}, ME, { photo }), 120, 'big')}</div>
          <label class="btn btn-light btn-sm">${icon('camera', 16)} تغيير الصورة<input type="file" id="photoIn" accept="image/*" hidden></label>
          ${photo ? '<button type="button" class="btn-link" id="rmPhoto">حذف الصورة</button>' : ''}</div>
        <div class="edit-fields">
          <div class="two">
            <div class="field"><label>الاسم الكامل</label><input id="edName" class="input" data-rule="name" maxlength="60" value="${esc(ME.name)}"><span class="err">الاسم 3 أحرف على الأقل</span></div>
            <div class="field"><label>البريد الإلكتروني</label><input id="edEmail" type="email" class="input" data-rule="email" value="${esc(ME.email)}"><span class="err">بريد غير صحيح</span></div>
          </div>
          <div class="two">
            <div class="field"><label>التخصص / المسمى</label><input id="edMajor" class="input" maxlength="60" placeholder="مثال: Web Developer" value="${esc(ME.major)}"></div>
            <div class="field"><label>الحالة</label><select id="edStatus" class="input">${Object.entries(STATUS_OPTIONS).map(([k, v]) => `<option value="${k}" ${ME.status === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
          </div>
          <div class="two">
            <div class="field"><label>المستوى العام</label><select id="edLevel" class="input">${options(LEVELS, ME.level)}</select></div>
            <div class="field"><label>أوقات التوفر</label><input id="edAvail" class="input" maxlength="80" placeholder="مثال: الأحد والثلاثاء مساءً" value="${esc(ME.availability)}"></div>
          </div>
          <div class="field"><label>نبذة عني</label><textarea id="edBio" class="input" rows="3" maxlength="300" placeholder="اكتبي نبذة قصيرة عنك">${esc(ME.bio)}</textarea></div>
        </div>
      </div>
      <div class="two skills-edit">
        ${['teach', 'learn'].map(t => `<div class="sk-group"><h3>${t === 'teach' ? 'المهارات التي أستطيع تعليمها' : 'المهارات التي أريد تعلمها'}</h3>
          <div class="chips" id="g-${t}">${chipsHtml(t)}</div>
          <label class="sub-l">مستوى المهارة</label>
          <div class="radios">${LEVELS.map(l => `<label><input type="radio" name="lv-${t}" value="${l}" ${lvl(t) === l ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>`).join('')}
      </div>
      <div class="row-btns end"><a href="profile.html" class="btn btn-outline">إلغاء</a><button class="btn btn-primary">حفظ التغييرات</button></div>
    </form>`));

  const redrawGroup = t => {
    $('#g-' + t).innerHTML = chipsHtml(t);
    $$('#g-' + t + ' [data-rm]').forEach(b => b.onclick = () => { const [g, i] = b.dataset.rm.split(':'); groups[g].splice(Number(i), 1); redrawGroup(g); });
    $('#g-' + t + ' [data-addg]').onclick = () => {
      const sugg = POPULAR_SKILLS.filter(s => !groups[t].some(x => norm(x) === norm(s)));
      const m = openModal(`<h3>إضافة مهارة</h3><form id="addF"><div class="field"><input id="addName" class="input" maxlength="40" list="skList" placeholder="اسم المهارة"></div>
        <datalist id="skList">${sugg.map(s => `<option value="${esc(s)}">`).join('')}</datalist>
        <div class="chips" style="margin-bottom:14px">${sugg.slice(0, 8).map(s => `<button type="button" class="tag" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>
        <button class="btn btn-primary btn-block">إضافة</button></form>`);
      $$('[data-q]', m).forEach(b => b.onclick = () => { $('#addName').value = b.dataset.q; });
      $('#addF', m).onsubmit = e => {
        e.preventDefault();
        const n = $('#addName').value.trim();
        if (!n) return;
        if (groups[t].some(x => norm(x) === norm(n))) return showToast('المهارة مضافة من قبل');
        groups[t].push(n); closeModal(); redrawGroup(t);
      };
    };
  };
  redrawGroup('teach'); redrawGroup('learn');

  $('#photoIn').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), size = 220;
      c.width = c.height = size;
      const k = Math.max(size / img.width, size / img.height);
      const w = img.width * k, h = img.height * k;
      c.getContext('2d').drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      photo = c.toDataURL('image/jpeg', .85);
      $('#photoPrev').innerHTML = avatar(Object.assign({}, ME, { photo }), 120, 'big');
    };
    img.src = URL.createObjectURL(file);
  };
  if ($('#rmPhoto')) $('#rmPhoto').onclick = () => { photo = ''; $('#photoPrev').innerHTML = avatar(Object.assign({}, ME, { photo: '' }), 120, 'big'); };

  $('#editForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(e.target)) return;
    const email = norm($('#edEmail').value);
    const other = findUserByEmail(email);
    if (other && other.id !== ME.id) return showToast('هذا البريد مستخدم في حساب آخر');
    ME = updateUser(ME.id, { name: $('#edName').value.trim(), email, major: $('#edMajor').value.trim(), status: $('#edStatus').value,
      level: $('#edLevel').value, availability: $('#edAvail').value.trim(), bio: $('#edBio').value.trim(), photo });
    // مزامنة المهارات: حذف المحذوفة وإضافة الجديدة وتحديث المستوى
    ['teach', 'learn'].forEach(t => {
      const level = ($(`input[name="lv-${t}"]:checked`) || {}).value || 'مبتدئ';
      skillsOf(ME.id, t).forEach(s => { if (!groups[t].some(n => norm(n) === norm(s.skillName))) deleteSkill(s.id); else updateSkill(s.id, { level }); });
      groups[t].forEach(n => { if (!skillsOf(ME.id, t).some(s => norm(s.skillName) === norm(n))) addSkill(ME.id, { skillName: n, category: guessCategory(n), type: t, level }); });
    });
    location.href = 'profile.html';
  });
}

// =========================================================
//   تبادلاتي: الطلبات والتبادلات والجلسات
// =========================================================
function renderExchanges() {
  window.refreshPage = renderExchanges;
  const incoming = db.requests.filter(r => r.receiverId === ME.id && r.status === 'pending');
  const sent = db.requests.filter(r => r.senderId === ME.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const matches = db.matches.filter(m => m.user1 === ME.id || m.user2 === ME.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const sessions = sessionsOfUser(ME.id).filter(s => s.status !== 'cancelled').sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const tabs = [['incoming', 'الطلبات الواردة', incoming.length], ['sent', 'طلباتي المرسلة', 0], ['active', 'التبادلات', 0], ['sessions', 'الجلسات', 0]];
  const ST = { pending: ['yellow', 'قيد الانتظار'], accepted: ['green', 'مقبول'], rejected: ['red', 'مرفوض'], cancelled: ['gray', 'ملغي'] };
  const reqRow = (r, other, actions) => {
    const off = getSkill(r.offeredSkillId), want = getSkill(r.wantedSkillId);
    return `<div class="row-item">${avatar(other, 50)}<div class="ri-body"><a href="profile.html?id=${other.id}"><b>${esc(other.name)}</b></a>
      <div class="swap-line"><span class="chip-s teach">${esc(off ? off.skillName : '—')}</span>${icon('swap', 16)}<span class="chip-s learn">${esc(want ? want.skillName : '—')}</span></div>
      ${r.message ? `<p class="req-msg">"${esc(r.message)}"</p>` : ''}${r.rejectReason ? `<p class="muted small">السبب: ${esc(r.rejectReason)}</p>` : ''}
      <small class="muted">${timeAgo(r.createdAt)}</small></div><div class="ri-actions">${actions}</div></div>`;
  };
  let body = '';
  if (exTab === 'incoming') body = incoming.length ? incoming.map(r => reqRow(r, getUser(r.senderId),
      `<button class="btn btn-primary btn-sm" data-accept="${r.id}">${icon('check', 16)} قبول</button><button class="btn btn-outline btn-sm" data-reject="${r.id}">رفض</button>`)).join('')
    : emptyBox('swap', 'لا توجد طلبات واردة حالياً');
  if (exTab === 'sent') body = sent.length ? sent.map(r => { const [c, t] = ST[r.status]; return reqRow(r, getUser(r.receiverId),
      `<span class="badge ${c}">${t}</span>${r.status === 'pending' ? `<button class="btn btn-outline btn-sm" data-cancel="${r.id}">إلغاء</button>` : ''}${r.status === 'accepted' ? `<a class="btn btn-primary btn-sm" href="chat.html?with=${r.receiverId}">مراسلة</a>` : ''}`); }).join('')
    : emptyBox('send', 'لم ترسلي أي طلبات بعد', '<a href="skills.html" class="btn btn-primary btn-sm">اكتشفي المهارات</a>');
  if (exTab === 'active') body = matches.length ? matches.map(m => {
      const o = getUser(m.user1 === ME.id ? m.user2 : m.user1), r = db.requests.find(x => x.id === m.requestId);
      return o ? reqRow(r, o, `<a class="btn btn-primary btn-sm" href="chat.html?with=${o.id}">${icon('chat', 16)} مراسلة</a><a class="btn btn-outline btn-sm" href="chat.html?with=${o.id}&schedule=1">${icon('calendar', 16)} جدولة جلسة</a>`) : '';
    }).join('') : emptyBox('users', 'لا توجد تبادلات بعد. أول ما يُقبل طلب بيظهر هنا');
  if (exTab === 'sessions') body = sessions.length ? sessions.map(s => {
      const c = db.conversations.find(x => x.id === s.convId), o = getUser(otherUserId(c, ME.id));
      const act = s.status === 'scheduled'
        ? `<button class="btn btn-primary btn-sm" data-done="${s.id}">${icon('check', 16)} تمت الجلسة</button><button class="btn btn-outline btn-sm" data-cancel-s="${s.id}">إلغاء</button>`
        : (hasReviewed(s.id, ME.id) ? '<span class="badge green">تم التقييم</span>' : `<button class="btn btn-primary btn-sm" data-rate="${s.id}">${icon('star', 16)} قيّمي الجلسة</button>`);
      return `<div class="row-item">${avatar(o, 50)}<div class="ri-body"><b>${esc(s.topic || 'جلسة تبادل')}</b><div class="muted">مع ${esc(o ? o.name : '')}</div>
        <small class="muted">${icon('clock', 14)} ${fmtSession(s)}</small></div>
        <div class="ri-actions"><span class="badge ${s.status === 'completed' ? 'green' : 'purple'}">${s.status === 'completed' ? 'مكتملة' : 'مجدولة'}</span>${act}</div></div>`;
    }).join('') : emptyBox('calendar', 'لا توجد جلسات. حدّدي جلسة من المحادثة بعد قبول الطلب');

  main(accountLayout('exchanges', `<div class="card"><h1>تبادلاتي</h1>
    <div class="tabs">${tabs.map(([k, t, n]) => `<button class="tab ${k === exTab ? 'active' : ''}" data-tab="${k}">${t}${n ? ` <em>${n}</em>` : ''}</button>`).join('')}</div>
    <div class="rows">${body}</div></div>`));
  updateTopbar();

  $$('[data-tab]').forEach(b => b.onclick = () => { exTab = b.dataset.tab; renderExchanges(); });
  $$('[data-accept]').forEach(b => b.onclick = () => {
    const r = db.requests.find(x => x.id === Number(b.dataset.accept)), o = getUser(r.senderId);
    respondRequest(r.id, true);
    popup({ text: `تم قبول طلب ${esc(o.name)}. ابدئي المحادثة الآن؟`, ok: 'نعم، ابدئي المحادثة', cancel: 'ليس الآن', onOk: () => location.href = 'chat.html?with=' + o.id, onCancel: renderExchanges });
  });
  $$('[data-reject]').forEach(b => b.onclick = () => {
    const m = openModal(`<h3>رفض الطلب</h3><div class="field"><label>السبب (اختياري)</label><textarea id="rjReason" class="input" rows="2" maxlength="150" placeholder="مثال: جدولي ممتلئ هذا الأسبوع"></textarea></div>
      <button class="btn btn-danger btn-block" id="rjOk">رفض الطلب</button><button class="btn btn-outline btn-block" data-close>إلغاء</button>`);
    $('#rjOk', m).onclick = () => { respondRequest(b.dataset.reject, false, $('#rjReason').value); closeModal(); showToast('تم رفض الطلب'); renderExchanges(); };
  });
  $$('[data-cancel]').forEach(b => b.onclick = () => popup({ text: 'إلغاء هذا الطلب؟', ok: 'إلغاء الطلب', cancel: 'رجوع', danger: true, onOk: () => { cancelRequest(b.dataset.cancel); renderExchanges(); } }));
  $$('[data-done]').forEach(b => b.onclick = () => { setSessionStatus(b.dataset.done, 'completed', ME.id); renderExchanges(); openRatingModal(b.dataset.done, renderExchanges); });
  $$('[data-cancel-s]').forEach(b => b.onclick = () => popup({ text: 'إلغاء هذه الجلسة؟', ok: 'إلغاء الجلسة', cancel: 'رجوع', danger: true, onOk: () => { setSessionStatus(b.dataset.cancelS, 'cancelled'); renderExchanges(); } }));
  $$('[data-rate]').forEach(b => b.onclick = () => openRatingModal(b.dataset.rate, renderExchanges));
}

// =========================================================
//   الإشعارات
// =========================================================
function renderNotifications() {
  window.refreshPage = renderNotifications;
  const list = notificationsOf(ME.id);
  const actionBtn = n => {
    if (n.action === 'request') return `<a class="btn btn-primary btn-sm" href="exchanges.html">عرض الطلب</a>`;
    if (n.action === 'accepted') return `<a class="btn btn-primary btn-sm" href="${esc(n.link)}">ابدئي المحادثة</a>`;
    if (n.action === 'session') return `<a class="btn btn-primary btn-sm" href="exchanges.html#sessions">عرض الجلسة</a>`;
    if (n.action === 'review') return hasReviewed(n.refId, ME.id) ? '<span class="badge green">تم التقييم</span>' : `<button class="btn btn-primary btn-sm" data-rate="${n.refId}">قيّمي الآن</button>`;
    if (n.kind === 'message') return `<a class="btn btn-primary btn-sm" href="${esc(n.link)}">فتح المحادثة</a>`;
    return n.link ? `<a class="btn btn-outline btn-sm" href="${esc(n.link)}">عرض</a>` : '';
  };
  main(accountLayout('notifications', `<div class="card"><div class="card-head"><h1>الإشعارات</h1>
      ${list.length ? `<button class="btn-link" id="clearN">${icon('trash', 16)} حذف الكل</button>` : ''}</div>
    <div class="notif-grid">${list.length ? list.map(n => `<div class="notif ${n.read ? '' : 'unread'}">
      <span class="ni ${n.kind}">${icon(NOTIF_ICON[n.kind] || 'bell', 22)}</span>
      <div class="nb"><p>${esc(n.text)}</p><small class="muted">${timeAgo(n.createdAt)}</small></div>${actionBtn(n)}</div>`).join('')
      : `<div class="span-all">${emptyBox('bell', 'لا توجد إشعارات بعد')}</div>`}</div></div>`));
  markNotificationsRead(ME.id);
  updateTopbar();
  $$('[data-rate]').forEach(b => b.onclick = () => openRatingModal(b.dataset.rate, renderNotifications));
  if ($('#clearN')) $('#clearN').onclick = () => popup({ text: 'حذف كل الإشعارات؟', ok: 'حذف', danger: true, onOk: () => { deleteNotifications(ME.id); renderNotifications(); } });
}

// =========================================================
//   المحادثات
// =========================================================
function renderChat() {
  const withId = Number(params.get('with'));
  if (withId && withId !== ME.id && getUser(withId)) {
    const ex = findConversation(ME.id, withId);
    if (ex) activeConv = ex.id;
    else if (canMessage(ME.id, withId)) activeConv = getOrCreateConversation(ME.id, withId).id;
    else showToast('هذه المستخدمة تستقبل الرسائل ممن تمت مطابقتهن فقط، أرسلي لها طلب تبادل أولاً');
  }
  const openSched = params.get('schedule');
  history.replaceState(null, '', 'chat.html');
  main(`<div class="wrap page chat-page"><div class="chat-shell">
    <aside class="conv-col">
      <div class="cc-head"><h2>المحادثات</h2><button class="btn btn-primary btn-sm" id="newChat">${icon('plus', 16)} رسالة جديدة</button></div>
      <div class="cc-search">${icon('search', 18)}<input id="convQ" placeholder="ابحثي عن محادثة" value="${esc(convSearch)}"></div>
      <div id="convList" class="conv-list"></div>
    </aside>
    <section class="chat-col" id="chatCol"></section>
  </div></div>`);
  $('#newChat').onclick = openNewChat;
  $('#convQ').addEventListener('input', e => { convSearch = e.target.value; refreshChat(); });
  refreshChat();
  if (openSched && activeConv) openSchedule(activeConv);
}

function refreshChat() {
  const q = norm(convSearch);
  const convs = conversationsOf(ME.id).filter(({ conv }) => { const o = getUser(otherUserId(conv, ME.id)); return o && (!q || norm(o.name).includes(q)); });
  if (!activeConv && convs.length && window.innerWidth > 900) activeConv = convs[0].conv.id;
  $('#convList').innerHTML = convs.length ? convs.map(({ conv, last }) => {
    const o = getUser(otherUserId(conv, ME.id)), un = unreadCount(conv.id, ME.id);
    return `<button class="conv ${conv.id === activeConv ? 'active' : ''}" data-conv="${conv.id}">${avatar(o, 48)}
      <span class="cv-body"><span class="cv-top"><b>${esc(o.name)}</b><small>${last ? timeAgo(last.sentAt) : ''}</small></span>
      <span class="cv-last">${last ? (last.senderId === ME.id ? 'أنتِ: ' : '') + esc(last.text) : 'ابدئي المحادثة'}</span></span>
      ${un ? `<em class="un">${un}</em>` : ''}</button>`;
  }).join('') : emptyBox('chat', conversationsOf(ME.id).length ? 'لا توجد نتائج' : 'لا توجد محادثات بعد');
  $$('#convList [data-conv]').forEach(b => b.onclick = () => { activeConv = Number(b.dataset.conv); refreshChat(); });
  $('.chat-shell').classList.toggle('has-active', !!activeConv);
  drawConversation();
  updateTopbar();
}

function drawConversation() {
  const col = $('#chatCol');
  const conv = db.conversations.find(c => c.id === activeConv);
  if (!conv) { col.innerHTML = emptyBox('chat', 'اختاري محادثة من القائمة أو ابدئي رسالة جديدة'); return; }
  const o = getUser(otherUserId(conv, ME.id));
  const blockedByMe = (ME.blocked || []).includes(o.id), blocked = isBlocked(ME.id, o.id);
  const muted = (conv.muted || []).includes(ME.id);
  const msgs = messagesOf(conv.id, ME.id);
  const sess = sessionsOfConv(conv.id).filter(s => s.status === 'scheduled' || (s.status === 'completed' && !hasReviewed(s.id, ME.id)));
  const keep = $('#msgIn') ? $('#msgIn').value : '';
  const focused = document.activeElement && document.activeElement.id === 'msgIn';
  const st = settingsOf(ME);
  let lastDay = '';
  col.innerHTML = `
    <div class="ch-head">
      <button class="tb-icon back" id="backBtn">${icon('right', 22)}</button>
      <a href="profile.html?id=${o.id}" class="ch-user">${avatar(o, 46)}<span><b>${esc(o.name)}</b>${statusBadge(o)}</span></a>
      ${isMatched(ME.id, o.id) ? `<span class="verified" title="تمت المطابقة">${icon('check', 14)}</span>` : ''}
      <span class="grow"></span>
      ${blocked ? '' : `<button class="btn btn-primary btn-sm" id="schedBtn">${icon('calendar', 16)} جدولة جلسة</button>`}
      <div class="tb-drop"><button class="tb-icon" id="convMenuBtn">${icon('more', 22)}</button>
        <div class="dropdown" id="convMenu">
          <a href="profile.html?id=${o.id}">${icon('user', 18)} عرض الملف الشخصي</a>
          <button data-act="mute">${icon(muted ? 'bell' : 'bellOff', 18)} ${muted ? 'إلغاء كتم الإشعارات' : 'كتم إشعارات المحادثة'}</button>
          <button data-act="clear">${icon('trash', 18)} مسح الرسائل عندي</button>
          <button data-act="block" class="danger">${icon('ban', 18)} ${blockedByMe ? 'إلغاء الحظر' : 'حظر المستخدمة'}</button>
        </div></div>
    </div>
    ${sess.length ? `<div class="sess-bar">${sess.map(s => `<div class="sess">${icon('calendar', 18)}<span><b>${esc(s.topic || 'جلسة تبادل')}</b> — ${fmtSession(s)}</span>
      ${s.status === 'scheduled' ? `<button class="btn btn-primary btn-xs" data-done="${s.id}">تمت الجلسة</button><button class="btn btn-outline btn-xs" data-cancel-s="${s.id}">إلغاء</button>`
        : `<button class="btn btn-primary btn-xs" data-rate="${s.id}">${icon('star', 14)} قيّمي</button>`}</div>`).join('')}</div>` : ''}
    <div class="msgs" id="msgs">${msgs.length ? msgs.map(m => {
      const day = new Date(m.sentAt).toDateString();
      const sep = day !== lastDay ? `<div class="day-sep"><span>${fmtDate(m.sentAt)}</span></div>` : '';
      lastDay = day;
      const mineMsg = m.senderId === ME.id;
      return `${sep}<div class="msg-row ${mineMsg ? 'me' : 'them'}">${mineMsg ? '' : avatar(o, 30)}<div class="bubble">${esc(m.text)}<small>${fmtTime(m.sentAt)}</small></div></div>`;
    }).join('') : `<div class="chat-empty">${avatar(o, 70)}<p>ابدئي المحادثة مع ${esc(o.name)} 👋</p></div>`}</div>
    ${blocked ? `<div class="blocked">${blockedByMe ? 'لقد حظرتِ هذه المستخدمة. ألغي الحظر من القائمة لإرسال الرسائل' : 'لا يمكنكِ مراسلة هذه المستخدمة'}</div>`
      : `<form class="composer" id="composer">
        <div class="emoji-wrap"><button type="button" class="tb-icon" id="emojiBtn">${icon('smile', 22)}</button>
          <div class="emoji-pop" id="emojiPop">${['😊', '😂', '👍', '🙏', '🌸', '❤️', '👏', '🎉', '🤝', '✨', '📚', '💻'].map(e => `<button type="button">${e}</button>`).join('')}</div></div>
        <textarea id="msgIn" rows="1" maxlength="1000" placeholder="اكتبي رسالتك..."></textarea>
        <button class="send">${icon('send', 20)}</button></form>`}`;

  const box = $('#msgs'); box.scrollTop = box.scrollHeight;
  markRead(conv.id, ME.id);
  $('#backBtn').onclick = () => { activeConv = null; refreshChat(); };
  $('#convMenuBtn').onclick = e => { e.stopPropagation(); $('#convMenu').classList.toggle('show'); };
  $$('#convMenu [data-act]').forEach(b => b.onclick = () => {
    $('#convMenu').classList.remove('show');
    if (b.dataset.act === 'mute') { toggleMute(conv.id, ME.id); showToast(muted ? 'تم إلغاء الكتم' : 'تم كتم إشعارات المحادثة'); refreshChat(); }
    if (b.dataset.act === 'clear') popup({ text: 'مسح كل الرسائل من عندك؟ (لن تُمسح عند الطرف الآخر)', ok: 'مسح', danger: true, onOk: () => { clearConversation(conv.id, ME.id); refreshChat(); } });
    if (b.dataset.act === 'block') {
      if (blockedByMe) { toggleBlock(ME.id, o.id); ME = me(); showToast('تم إلغاء الحظر'); refreshChat(); }
      else popup({ text: `حظر ${esc(o.name)}؟ لن تستطيع مراسلتك أو إرسال طلبات لك.`, ok: 'حظر', danger: true, onOk: () => { toggleBlock(ME.id, o.id); ME = me(); refreshChat(); } });
    }
  });
  if ($('#schedBtn')) $('#schedBtn').onclick = () => openSchedule(conv.id);
  $$('[data-done]').forEach(b => b.onclick = () => { setSessionStatus(b.dataset.done, 'completed', ME.id); refreshChat(); openRatingModal(b.dataset.done, refreshChat); });
  $$('[data-cancel-s]').forEach(b => b.onclick = () => popup({ text: 'إلغاء هذه الجلسة؟', ok: 'إلغاء الجلسة', cancel: 'رجوع', danger: true, onOk: () => { setSessionStatus(b.dataset.cancelS, 'cancelled'); refreshChat(); } }));
  $$('[data-rate]').forEach(b => b.onclick = () => openRatingModal(b.dataset.rate, refreshChat));

  const form = $('#composer');
  if (!form) return;
  const input = $('#msgIn');
  input.value = keep;
  if (focused) input.focus();
  const send = () => {
    const t = input.value.trim();
    if (!t) return;
    try { sendMessage(conv.id, ME.id, t); input.value = ''; refreshChat(); $('#msgIn').focus(); } catch (err) { showToast(err.message); }
  };
  form.onsubmit = e => { e.preventDefault(); send(); };
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && st.enterToSend) { e.preventDefault(); send(); } });
  $('#emojiBtn').onclick = e => { e.stopPropagation(); $('#emojiPop').classList.toggle('show'); };
  $$('#emojiPop button').forEach(b => b.onclick = () => { input.value += b.textContent; input.focus(); $('#emojiPop').classList.remove('show'); });
}
document.addEventListener('click', e => { if (!e.target.closest('.emoji-wrap')) { const p = $('#emojiPop'); if (p) p.classList.remove('show'); } });

function openNewChat() {
  const others = db.users.filter(u => u.id !== ME.id && isVisible(u));
  const m = openModal(`<button class="m-x" data-close>${icon('x', 20)}</button><h3>رسالة جديدة</h3>
    <div class="cc-search">${icon('search', 18)}<input id="ncQ" placeholder="ابحثي باسم المستخدمة"></div><div class="nc-list" id="ncList"></div>`);
  const draw = () => {
    const q = norm($('#ncQ').value);
    const list = others.filter(u => !q || norm(u.name).includes(q));
    $('#ncList').innerHTML = list.length ? list.map(u => {
      const ok = canMessage(ME.id, u.id);
      return `<div class="row-item sm">${avatar(u, 42)}<div class="ri-body"><b>${esc(u.name)}</b><small class="muted">${esc(u.major || '')}</small></div>
        ${ok ? `<button class="btn btn-primary btn-sm" data-start="${u.id}">مراسلة</button>` : `<small class="muted">${isBlocked(ME.id, u.id) ? 'محظورة' : 'تستقبل من المطابَقات فقط'}</small>`}</div>`;
    }).join('') : emptyBox('users', others.length ? 'لا توجد نتائج' : 'لا توجد مستخدمات أخريات بعد');
    $$('[data-start]', m).forEach(b => b.onclick = () => { activeConv = getOrCreateConversation(ME.id, Number(b.dataset.start)).id; closeModal(); refreshChat(); });
  };
  $('#ncQ', m).addEventListener('input', draw);
  draw();
}

function openSchedule(convId) {
  const c = db.conversations.find(x => x.id === convId), o = getUser(otherUserId(c, ME.id));
  const today = new Date().toISOString().slice(0, 10);
  const m = openModal(`<button class="m-x" data-close>${icon('x', 20)}</button><h3>جدولة جلسة مع ${esc(o.name)}</h3>
    <form id="schedForm" novalidate>
      <div class="field"><label>موضوع الجلسة</label><input id="scTopic" class="input" maxlength="80" placeholder="مثال: أساسيات Figma"></div>
      <div class="two"><div class="field"><label>التاريخ</label><input type="date" id="scDate" class="input" min="${today}" data-rule="required"><span class="err">اختاري التاريخ</span></div>
        <div class="field"><label>الوقت</label><input type="time" id="scTime" class="input" data-rule="required"><span class="err">اختاري الوقت</span></div></div>
      <button class="btn btn-primary btn-block">متابعة</button>
    </form>`);
  $('#schedForm', m).onsubmit = e => {
    e.preventDefault();
    if (!validateForm(e.target)) return;
    const data = { date: $('#scDate').value, time: $('#scTime').value, topic: $('#scTopic').value };
    popup({ text: `تأكيد جلسة مع ${esc(o.name)} يوم ${fmtSession(data)}؟`, ok: 'تأكيد الجلسة', cancel: 'إلغاء',
      onOk: () => { scheduleSession(convId, ME.id, data); showToast('تمت جدولة الجلسة ✓'); refreshChat(); } });
  };
}

// =========================================================
//   الإعدادات
// =========================================================
function renderSettings() {
  window.refreshPage = renderSettings;
  const st = settingsOf(ME);
  const row = (ic, title, desc, right, attrs = '') => `<div class="set-row" ${attrs}><span class="set-ic">${icon(ic, 20)}</span><div><b>${title}</b>${desc ? `<small>${desc}</small>` : ''}</div>${right}</div>`;
  const sw = (id, on) => `<label class="switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span></span></label>`;
  const go = icon('left', 18, 'go');
  const blocked = (ME.blocked || []).map(getUser).filter(Boolean);
  main(accountLayout('settings', `<div class="settings">
    <h1>الإعدادات</h1>
    <div class="set-group"><h3>معلومات الحساب</h3>
      ${row('user', 'تعديل الاسم', esc(ME.name), go, 'data-open="name"')}
      ${row('mail', 'البريد الإلكتروني وكلمة المرور', esc(ME.email), go, 'data-open="pass"')}</div>
    <div class="set-group"><h3>الإشعارات والتنبيهات</h3>
      ${row('chat', 'إشعارات الرسائل', 'تنبيه عند وصول رسالة جديدة', sw('stMsg', st.notifyMessages))}
      ${row('swap', 'إشعارات الطلبات', 'تنبيه عند وصول طلب تبادل أو الرد عليه', sw('stReq', st.notifyRequests))}</div>
    <div class="set-group"><h3>الخصوصية</h3>
      ${row('eye', 'ظهور الملف الشخصي', 'إظهار ملفك في البحث والمقترحات', sw('stVis', st.profileVisible))}
      ${row('chat', 'من يستطيع مراسلتي', '', `<select id="stAllow" class="input sm"><option value="all" ${st.allowMessages === 'all' ? 'selected' : ''}>الجميع</option><option value="matches" ${st.allowMessages === 'matches' ? 'selected' : ''}>من تمت مطابقتي معهن فقط</option></select>`)}
      ${row('ban', 'المستخدمات المحظورات', blocked.length ? blocked.length + ' محظورة' : 'لا يوجد', go, 'data-open="blocked"')}</div>
    <div class="set-group"><h3>تفضيلات المحادثة</h3>
      ${row('send', 'الإرسال بزر Enter', 'Shift + Enter لسطر جديد', sw('stEnter', st.enterToSend))}</div>
    <div class="set-group"><h3>تفضيلات SkillSwap</h3>
      ${row('cap', 'تحديث مهارات التعليم والتعلم', 'إضافة أو حذف مهاراتك', go, 'data-href="profile-edit.html"')}</div>
    <button class="btn btn-danger-outline btn-block" id="delAcc">${icon('trash', 18)} حذف الحساب</button>
  </div>`));

  const save = () => { ME = updateUser(ME.id, { settings: { allowMessages: $('#stAllow').value, enterToSend: $('#stEnter').checked,
    notifyMessages: $('#stMsg').checked, notifyRequests: $('#stReq').checked, profileVisible: $('#stVis').checked } }); showToast('تم حفظ الإعدادات ✓'); };
  ['stMsg', 'stReq', 'stVis', 'stEnter', 'stAllow'].forEach(id => $('#' + id).addEventListener('change', save));
  $$('[data-href]').forEach(r => r.onclick = () => location.href = r.dataset.href);
  $$('[data-open]').forEach(r => r.onclick = () => {
    const k = r.dataset.open;
    if (k === 'name') {
      const m = openModal(`<h3>تعديل الاسم</h3><form id="nf" novalidate><div class="field"><input id="nName" class="input" data-rule="name" maxlength="60" value="${esc(ME.name)}"><span class="err">الاسم 3 أحرف على الأقل</span></div>
        <button class="btn btn-primary btn-block">حفظ</button><button type="button" class="btn btn-outline btn-block" data-close>إلغاء</button></form>`);
      $('#nf', m).onsubmit = e => { e.preventDefault(); if (!validateForm(e.target)) return; ME = updateUser(ME.id, { name: $('#nName').value.trim() }); closeModal(); location.reload(); };
    }
    if (k === 'pass') {
      const m = openModal(`<h3>البريد الإلكتروني وكلمة المرور</h3><form id="pf" novalidate><div class="alert alert-error"></div>
        <div class="field"><label>البريد الإلكتروني</label><input id="pEmail" type="email" class="input" data-rule="email" value="${esc(ME.email)}"><span class="err">بريد غير صحيح</span></div>
        <div class="field"><label>كلمة المرور الحالية</label><input id="pOld" type="password" class="input" data-rule="required"><span class="err">مطلوبة للتأكيد</span></div>
        <div class="field"><label>كلمة المرور الجديدة (اختياري)</label><input id="pNew" type="password" class="input" placeholder="اتركيها فارغة لعدم التغيير"><span class="err">8 أحرف على الأقل وتحتوي على حروف وأرقام</span></div>
        <button class="btn btn-primary btn-block">حفظ</button></form>`);
      $('#pf', m).onsubmit = async e => {
        e.preventDefault();
        const f = e.target;
        if (!validateForm(f)) return;
        if (await hashPassword($('#pOld').value) !== ME.passHash) return showAlert(f, 'alert-error', 'كلمة المرور الحالية غير صحيحة');
        const nw = $('#pNew').value;
        if (nw && (nw.length < 8 || !/[0-9]/.test(nw))) { $('#pNew').closest('.field').classList.add('invalid'); return; }
        const email = norm($('#pEmail').value), other = findUserByEmail(email);
        if (other && other.id !== ME.id) return showAlert(f, 'alert-error', 'هذا البريد مستخدم في حساب آخر');
        const upd = { email };
        if (nw) upd.passHash = await hashPassword(nw);
        ME = updateUser(ME.id, upd); closeModal(); showToast('تم الحفظ ✓'); renderSettings();
      };
    }
    if (k === 'blocked') {
      const m = openModal(`<button class="m-x" data-close>${icon('x', 20)}</button><h3>المستخدمات المحظورات</h3>${blocked.length ? blocked.map(u => `<div class="row-item sm">${avatar(u, 40)}<div class="ri-body"><b>${esc(u.name)}</b></div><button class="btn btn-outline btn-sm" data-unblock="${u.id}">إلغاء الحظر</button></div>`).join('') : emptyBox('ban', 'لا توجد مستخدمات محظورات')}`, 'nofocus');
      $$('[data-unblock]', m).forEach(b => b.onclick = () => { toggleBlock(ME.id, b.dataset.unblock); ME = me(); closeModal(); showToast('تم إلغاء الحظر'); renderSettings(); });
    }
  });
  $('#delAcc').onclick = () => popup({ text: 'هل أنتِ متأكدة من حذف حسابك نهائياً؟ سيتم حذف مهاراتك ومحادثاتك وتقييماتك ولا يمكن التراجع.', ok: 'حذف الحساب', cancel: 'إلغاء', danger: true,
    onOk: () => { deleteUser(ME.id); logout(); location.href = 'index.html'; } });
}
