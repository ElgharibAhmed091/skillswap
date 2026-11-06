/* =========================================================
   SkillSwap - طبقة البيانات
   تحفظ كل البيانات في متصفح المستخدم (localStorage)
   الجداول مطابقة لقاعدة البيانات في التقرير:
   users, user_skills, swap_requests, matches, sessions,
   conversations, messages, reviews, notifications
   ========================================================= */

const DB_KEY = 'skillswap_db';
const UID_KEY = 'skillswap_uid';

// التصنيفات: الاسم العربي، الإنجليزي، الأيقونة، اللون
const CATEGORY_INFO = [
  { ar: 'البرمجة', en: 'Programming', icon: 'code', color: '#7c5cdb', bg: '#efe9ff' },
  { ar: 'تطوير الويب', en: 'Web Development', icon: 'globe', color: '#2f9e6e', bg: '#e3f6ee' },
  { ar: 'التصميم', en: 'Design', icon: 'palette', color: '#f0a020', bg: '#fdf1dc' },
  { ar: 'اللغات', en: 'Languages', icon: 'chat', color: '#5b6ff0', bg: '#e8ebfd' },
  { ar: 'التسويق', en: 'Marketing', icon: 'trend', color: '#e2558f', bg: '#fde7f0' },
  { ar: 'تحليل البيانات', en: 'Data Analysis', icon: 'chart', color: '#4a7be8', bg: '#e6eefc' },
  { ar: 'الأعمال', en: 'Business', icon: 'briefcase', color: '#9a5ce0', bg: '#f1e8fc' },
  { ar: 'صناعة المحتوى', en: 'Content Creation', icon: 'camera', color: '#c75ab8', bg: '#fbe8f7' },
  { ar: 'أخرى', en: 'Others', icon: 'grid', color: '#7c5cdb', bg: '#efe9ff' }
];
const CATEGORIES = CATEGORY_INFO.map(c => c.ar);
function categoryInfo(name) { return CATEGORY_INFO.find(c => c.ar === name) || CATEGORY_INFO[CATEGORY_INFO.length - 1]; }

// مهارات شائعة تظهر كاقتراحات وفي التسجيل
const POPULAR_SKILLS = ['JavaScript', 'CSS', 'HTML', 'Python', 'React', 'UI/UX', 'Figma', 'Excel', 'SQL', 'Java', 'C++', 'Node.js'];
const SKILL_CATEGORY = {
  'javascript': 'تطوير الويب', 'css': 'تطوير الويب', 'html': 'تطوير الويب', 'react': 'تطوير الويب', 'node.js': 'تطوير الويب',
  'php': 'تطوير الويب', 'laravel': 'تطوير الويب', 'bootstrap': 'تطوير الويب', 'wordpress': 'تطوير الويب',
  'python': 'البرمجة', 'java': 'البرمجة', 'c++': 'البرمجة', 'c#': 'البرمجة', 'flutter': 'البرمجة', 'kotlin': 'البرمجة', 'swift': 'البرمجة',
  'ui/ux': 'التصميم', 'figma': 'التصميم', 'design': 'التصميم', 'photoshop': 'التصميم', 'illustrator': 'التصميم', 'graphic design': 'التصميم', 'canva': 'التصميم',
  'excel': 'تحليل البيانات', 'sql': 'تحليل البيانات', 'data analysis': 'تحليل البيانات', 'power bi': 'تحليل البيانات',
  'marketing': 'التسويق', 'seo': 'التسويق', 'english': 'اللغات', 'الإنجليزية': 'اللغات', 'french': 'اللغات',
  'video editing': 'صناعة المحتوى', 'مونتاج': 'صناعة المحتوى', 'business': 'الأعمال', 'ريادة الأعمال': 'الأعمال'
};
function guessCategory(skillName) { return SKILL_CATEGORY[norm(skillName)] || 'أخرى'; }
const STATUS_OPTIONS = { available: 'متاحة الآن', busy: 'مشغولة', away: 'غير متاحة' };
const LEVELS = ['مبتدئ', 'متوسط', 'متقدم'];

function emptyDB() {
  return { seq: 1, users: [], userSkills: [], requests: [], matches: [], conversations: [],
           messages: [], sessions: [], reviews: [], notifications: [] };
}

let memoryDB = null;

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const base = emptyDB();
      Object.keys(base).forEach(k => { if (data[k] === undefined) data[k] = base[k]; });
      return data;
    }
  } catch (e) {}
  return memoryDB || (memoryDB = emptyDB());
}

let db = loadDB();

function commit() {
  memoryDB = db;
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) {}
}

// إعادة تحميل البيانات (لما تتغير من تبويب تاني)
function reloadDB() { db = loadDB(); }

function newId() { return db.seq++; }
function nowISO() { return new Date().toISOString(); }
function norm(s) { return String(s || '').trim().toLowerCase(); }

// ---------- تشفير كلمة المرور ----------
async function hashPassword(pass) {
  try {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('skillswap:' + pass));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}
  // بديل بسيط لو المتصفح لا يدعم crypto.subtle
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  const str = 'skillswap:' + pass;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'f' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ---------- المستخدم الحالي ----------
// كل تبويب يقدر يكون فيه مستخدم مختلف (sessionStorage)، و"تذكرني" يحفظه في localStorage
function currentUserId() {
  let id = null;
  try { id = sessionStorage.getItem(UID_KEY) || localStorage.getItem(UID_KEY); } catch (e) {}
  id = id ? Number(id) : null;
  return id && getUser(id) ? id : null;
}
function setCurrentUser(id, remember) {
  try {
    sessionStorage.setItem(UID_KEY, id);
    if (remember) localStorage.setItem(UID_KEY, id); else localStorage.removeItem(UID_KEY);
  } catch (e) {}
}
function logout() {
  try { sessionStorage.removeItem(UID_KEY); localStorage.removeItem(UID_KEY); } catch (e) {}
}
function me() { return getUser(currentUserId()); }

// ---------- المستخدمون ----------
function getUser(id) { return db.users.find(u => u.id === Number(id)) || null; }
function findUserByEmail(email) { return db.users.find(u => u.email === norm(email)) || null; }

function defaultSettings() {
  return { allowMessages: 'all', enterToSend: true, notifyMessages: true, notifyRequests: true, profileVisible: true };
}
function settingsOf(u) { return Object.assign(defaultSettings(), (u && u.settings) || {}); }
function isVisible(u) { return !!u && settingsOf(u).profileVisible; }

async function createUser({ name, email, password, major, level, teach, learn }) {
  if (findUserByEmail(email)) throw new Error('هذا البريد مسجّل من قبل');
  const user = {
    id: newId(), name: name.trim(), email: norm(email), passHash: await hashPassword(password),
    major: major || '', level: level || 'مبتدئ', language: 'العربية', availability: '', bio: '',
    status: 'available', photo: '', favorites: [], blocked: [], settings: defaultSettings(), createdAt: nowISO()
  };
  db.users.push(user);
  (teach || []).forEach(n => { try { addSkill(user.id, { skillName: n, category: guessCategory(n), type: 'teach', level: 'متوسط' }); } catch (e) {} });
  (learn || []).forEach(n => { try { addSkill(user.id, { skillName: n, category: guessCategory(n), type: 'learn', level: 'مبتدئ' }); } catch (e) {} });
  commit();
  return user;
}

async function checkLogin(email, password) {
  const u = findUserByEmail(email);
  if (!u) throw new Error('لا يوجد حساب بهذا البريد');
  if (u.passHash !== await hashPassword(password)) throw new Error('كلمة المرور غير صحيحة');
  return u;
}

function updateUser(id, data) {
  const u = getUser(id);
  Object.assign(u, data);
  commit();
  return u;
}

function deleteUser(id) {
  id = Number(id);
  const convIds = db.conversations.filter(c => c.users.includes(id)).map(c => c.id);
  db.users = db.users.filter(u => u.id !== id);
  db.userSkills = db.userSkills.filter(s => s.userId !== id);
  db.requests = db.requests.filter(r => r.senderId !== id && r.receiverId !== id);
  db.matches = db.matches.filter(m => m.user1 !== id && m.user2 !== id);
  db.conversations = db.conversations.filter(c => !convIds.includes(c.id));
  db.messages = db.messages.filter(m => !convIds.includes(m.convId));
  db.sessions = db.sessions.filter(s => !convIds.includes(s.convId));
  db.reviews = db.reviews.filter(r => r.reviewerId !== id && r.revieweeId !== id);
  db.notifications = db.notifications.filter(n => n.userId !== id);
  db.users.forEach(u => { u.blocked = (u.blocked || []).filter(b => b !== id); });
  commit();
}

function isBlocked(a, b) {
  const ua = getUser(a), ub = getUser(b);
  return !!((ua && (ua.blocked || []).includes(Number(b))) || (ub && (ub.blocked || []).includes(Number(a))));
}

// ---------- المهارات ----------
function skillsOf(userId, type) {
  return db.userSkills.filter(s => s.userId === Number(userId) && (!type || s.type === type));
}
function getSkill(id) { return db.userSkills.find(s => s.id === Number(id)) || null; }

function addSkill(userId, { skillName, category, type, level }) {
  const exists = db.userSkills.some(s => s.userId === userId && s.type === type && norm(s.skillName) === norm(skillName));
  if (exists) throw new Error('هذه المهارة مضافة من قبل');
  const s = { id: newId(), userId, skillName: skillName.trim(), category, type, level, createdAt: nowISO() };
  db.userSkills.push(s);
  commit();
  return s;
}
function updateSkill(id, data) { Object.assign(getSkill(id), data); commit(); }
function deleteSkill(id) {
  db.userSkills = db.userSkills.filter(s => s.id !== Number(id));
  commit();
}

// ---------- المطابقة الذكية ----------
// الدرجة: مهارات يعلّمها الطرف الآخر وأريد تعلّمها (60) + مهارات أعلّمها ويريد تعلّمها (40)
function matchScore(myId, otherId) {
  const iLearn = skillsOf(myId, 'learn').map(s => norm(s.skillName));
  const iTeach = skillsOf(myId, 'teach').map(s => norm(s.skillName));
  const theyTeach = skillsOf(otherId, 'teach').map(s => norm(s.skillName));
  const theyLearn = skillsOf(otherId, 'learn').map(s => norm(s.skillName));
  const a = theyTeach.filter(s => iLearn.includes(s)).length;
  const b = theyLearn.filter(s => iTeach.includes(s)).length;
  if (!a && !b) return 0;
  return Math.min(100, (a ? 60 : 0) + (b ? 40 : 0) + Math.max(0, a + b - 2) * 5);
}

function suggestionsFor(myId) {
  return db.users
    .filter(u => u.id !== myId && !isBlocked(myId, u.id) && isVisible(u))
    .map(u => ({ user: u, score: matchScore(myId, u.id) }))
    .filter(x => x.score > 0)
    .sort((x, y) => y.score - x.score);
}

// ---------- الإشعارات ----------
function notify(userId, kind, text, link, extra) {
  const u = getUser(userId);
  if (!u) return;
  const st = u.settings || defaultSettings();
  if (kind === 'message' && !st.notifyMessages) return;
  if (kind === 'request' && !st.notifyRequests) return;
  db.notifications.push(Object.assign({ id: newId(), userId: Number(userId), kind, text, link: link || '', read: false, createdAt: nowISO() }, extra || {}));
}
function notificationsOf(userId) {
  return db.notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function deleteNotifications(userId) {
  db.notifications = db.notifications.filter(n => n.userId !== userId);
  commit();
}
function markNotificationsRead(userId) {
  db.notifications.forEach(n => { if (n.userId === userId) n.read = true; });
  commit();
}

// ---------- طلبات التبادل ----------
function sendRequest(senderId, receiverId, offeredSkillId, wantedSkillId, message) {
  if (isBlocked(senderId, receiverId)) throw new Error('لا يمكن إرسال طلب لهذا المستخدم');
  const dup = db.requests.some(r => r.senderId === senderId && r.receiverId === receiverId &&
    r.wantedSkillId === Number(wantedSkillId) && r.status === 'pending');
  if (dup) throw new Error('أرسلتِ طلباً لنفس المهارة وهو قيد الانتظار');
  const r = { id: newId(), senderId, receiverId: Number(receiverId), offeredSkillId: Number(offeredSkillId),
              wantedSkillId: Number(wantedSkillId), message: (message || '').trim(), status: 'pending', createdAt: nowISO() };
  db.requests.push(r);
  notify(receiverId, 'request', `${getUser(senderId).name} أرسلت لكِ طلب تبادل لمهارة ${getSkill(wantedSkillId).skillName}`, 'exchanges.html', { action: 'request', refId: r.id });
  commit();
  return r;
}

function respondRequest(requestId, accept, reason) {
  const r = db.requests.find(x => x.id === Number(requestId));
  if (!r || r.status !== 'pending') return;
  r.status = accept ? 'accepted' : 'rejected';
  r.respondedAt = nowISO();
  const receiver = getUser(r.receiverId);
  if (accept) {
    const m = { id: newId(), requestId: r.id, user1: r.senderId, user2: r.receiverId,
                score: matchScore(r.senderId, r.receiverId), createdAt: nowISO() };
    db.matches.push(m);
    const conv = getOrCreateConversation(r.senderId, r.receiverId);
    conv.matchId = m.id;
    notify(r.senderId, 'request', `${receiver.name} قبلت طلب التبادل لمهارة ${(getSkill(r.wantedSkillId) || {}).skillName || ''}`, 'chat.html?with=' + r.receiverId,
      { action: 'accepted', refId: r.id, popup: true });
  } else {
    r.rejectReason = (reason || '').trim();
    notify(r.senderId, 'request', `${receiver.name} اعتذرت عن طلبك لمهارة ${(getSkill(r.wantedSkillId) || {}).skillName || ''}`, 'exchanges.html',
      { action: 'rejected', refId: r.id, reason: r.rejectReason, popup: true });
  }
  commit();
}

function cancelRequest(requestId) {
  const r = db.requests.find(x => x.id === Number(requestId));
  if (r && r.status === 'pending') { r.status = 'cancelled'; commit(); }
}

function isMatched(a, b) {
  return db.matches.some(m => (m.user1 === a && m.user2 === b) || (m.user1 === b && m.user2 === a));
}

// ---------- المحادثات ----------
function findConversation(a, b) {
  return db.conversations.find(c => c.users.includes(Number(a)) && c.users.includes(Number(b))) || null;
}
function getOrCreateConversation(a, b) {
  let c = findConversation(a, b);
  if (!c) {
    c = { id: newId(), users: [Number(a), Number(b)], matchId: null, muted: [], clearedAt: {}, createdAt: nowISO() };
    db.conversations.push(c);
    commit();
  }
  return c;
}
function canMessage(fromId, toId) {
  if (isBlocked(fromId, toId)) return false;
  const to = getUser(toId);
  if (!to) return false;
  const st = to.settings || defaultSettings();
  return st.allowMessages === 'all' || isMatched(fromId, toId) || !!findConversation(fromId, toId);
}
function conversationsOf(userId) {
  return db.conversations.filter(c => c.users.includes(userId))
    .map(c => ({ conv: c, last: lastMessage(c.id, userId) }))
    .sort((x, y) => ((y.last && y.last.sentAt) || y.conv.createdAt).localeCompare((x.last && x.last.sentAt) || x.conv.createdAt));
}
function otherUserId(conv, myId) { return conv.users.find(u => u !== myId); }

function messagesOf(convId, viewerId) {
  const c = db.conversations.find(x => x.id === convId);
  const cleared = (c && c.clearedAt && c.clearedAt[viewerId]) || '';
  return db.messages.filter(m => m.convId === convId && m.sentAt > cleared).sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}
function lastMessage(convId, viewerId) {
  const list = messagesOf(convId, viewerId);
  return list[list.length - 1] || null;
}
function unreadCount(convId, userId) {
  return messagesOf(convId, userId).filter(m => m.senderId !== userId && !(m.readBy || []).includes(userId)).length;
}
function totalUnread(userId) {
  return db.conversations.filter(c => c.users.includes(userId)).reduce((n, c) => n + unreadCount(c.id, userId), 0);
}
function markRead(convId, userId) {
  let changed = false;
  db.messages.forEach(m => {
    if (m.convId === convId && m.senderId !== userId && !(m.readBy || []).includes(userId)) {
      m.readBy = (m.readBy || []).concat(userId); changed = true;
    }
  });
  if (changed) commit();
}
function sendMessage(convId, senderId, text) {
  const c = db.conversations.find(x => x.id === convId);
  const to = otherUserId(c, senderId);
  if (isBlocked(senderId, to)) throw new Error('لا يمكن الإرسال لهذا المستخدم');
  const m = { id: newId(), convId, senderId, text: text.trim(), sentAt: nowISO(), readBy: [senderId] };
  db.messages.push(m);
  if (!(c.muted || []).includes(to)) notify(to, 'message', `رسالة جديدة من ${getUser(senderId).name}`, 'chat.html?with=' + senderId);
  commit();
  return m;
}
function clearConversation(convId, userId) {
  const c = db.conversations.find(x => x.id === convId);
  c.clearedAt = c.clearedAt || {};
  c.clearedAt[userId] = nowISO();
  commit();
}
function toggleMute(convId, userId) {
  const c = db.conversations.find(x => x.id === convId);
  c.muted = c.muted || [];
  if (c.muted.includes(userId)) c.muted = c.muted.filter(x => x !== userId); else c.muted.push(userId);
  commit();
}
function toggleBlock(userId, otherId) {
  const u = getUser(userId);
  u.blocked = u.blocked || [];
  otherId = Number(otherId);
  if (u.blocked.includes(otherId)) u.blocked = u.blocked.filter(x => x !== otherId); else u.blocked.push(otherId);
  commit();
}

// ---------- الجلسات ----------
function sessionsOfConv(convId) {
  return db.sessions.filter(s => s.convId === convId).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
function sessionsOfUser(userId) {
  const convIds = db.conversations.filter(c => c.users.includes(userId)).map(c => c.id);
  return db.sessions.filter(s => convIds.includes(s.convId));
}
function scheduleSession(convId, userId, { date, time, topic }) {
  const s = { id: newId(), convId, createdBy: userId, date, time, topic: (topic || '').trim(), status: 'scheduled', createdAt: nowISO() };
  db.sessions.push(s);
  const c = db.conversations.find(x => x.id === convId);
  notify(otherUserId(c, userId), 'session', `${getUser(userId).name} حددت جلسة "${s.topic || 'تبادل'}" يوم ${date} الساعة ${time}`, 'chat.html?with=' + userId, { action: 'session', refId: s.id });
  commit();
  return s;
}
function setSessionStatus(sessionId, status, byUserId) {
  const s = db.sessions.find(x => x.id === Number(sessionId));
  s.status = status;
  if (status === 'completed' && byUserId) {
    const c = db.conversations.find(x => x.id === s.convId);
    notify(otherUserId(c, byUserId), 'review', `انتهت جلسة "${s.topic || 'تبادل'}"، قيّمي شريكتك ${getUser(byUserId).name}`, 'exchanges.html', { action: 'review', refId: s.id });
  }
  commit();
}

// ---------- التقييمات ----------
function reviewsOf(userId) {
  return db.reviews.filter(r => r.revieweeId === Number(userId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function avgRating(userId) {
  const list = reviewsOf(userId);
  return list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
}
function hasReviewed(sessionId, reviewerId) {
  return db.reviews.some(r => r.sessionId === Number(sessionId) && r.reviewerId === reviewerId);
}
function pendingReviews(userId) {
  return sessionsOfUser(userId).filter(s => s.status === 'completed' && !hasReviewed(s.id, userId));
}
function addReview(sessionId, reviewerId, rating, comment, tags) {
  const s = db.sessions.find(x => x.id === Number(sessionId));
  const c = db.conversations.find(x => x.id === s.convId);
  const revieweeId = otherUserId(c, reviewerId);
  if (hasReviewed(sessionId, reviewerId)) throw new Error('قيّمتِ هذه الجلسة من قبل');
  db.reviews.push({ id: newId(), sessionId: s.id, reviewerId, revieweeId, rating: Number(rating),
                    comment: (comment || '').trim(), tags: tags || [], createdAt: nowISO() });
  notify(revieweeId, 'review', `${getUser(reviewerId).name} قيّمتكِ بـ ${rating} نجوم`, 'profile.html', { action: 'reviewed' });
  commit();
}

// ---------- المفضلة ----------
function toggleFavorite(userId, otherId) {
  const u = getUser(userId);
  u.favorites = u.favorites || [];
  otherId = Number(otherId);
  if (u.favorites.includes(otherId)) u.favorites = u.favorites.filter(x => x !== otherId); else u.favorites.push(otherId);
  commit();
  return u.favorites.includes(otherId);
}

// ---------- إحصائيات ----------
// التبادلات الحالية: مطابقات لم تكتمل فيها أي جلسة بعد
function activeExchanges(userId) {
  return db.matches.filter(m => {
    if (m.user1 !== userId && m.user2 !== userId) return false;
    const conv = db.conversations.find(c => c.matchId === m.id);
    return !conv || !db.sessions.some(s => s.convId === conv.id && s.status === 'completed');
  }).length;
}
function completedSessionsCount(userId) { return sessionsOfUser(userId).filter(s => s.status === 'completed').length; }
function siteStats() {
  const skills = new Set(db.userSkills.map(s => norm(s.skillName)));
  const cats = new Set(db.userSkills.map(s => s.category));
  return { users: db.users.length, skills: skills.size, exchanges: db.matches.length, categories: cats.size };
}
function categoryCounts() {
  const out = {};
  CATEGORIES.forEach(c => { out[c] = new Set(db.userSkills.filter(s => s.category === c && s.type === 'teach' && isVisible(getUser(s.userId))).map(s => s.userId)).size; });
  return out;
}
function popularSkills(limit) {
  const count = {};
  db.userSkills.forEach(s => { const k = s.skillName.trim(); count[k] = (count[k] || 0) + 1; });
  const fromDb = Object.keys(count).sort((a, b) => count[b] - count[a]);
  const all = fromDb.concat(POPULAR_SKILLS.filter(p => !fromDb.some(x => norm(x) === norm(p))));
  return all.slice(0, limit || 12);
}
