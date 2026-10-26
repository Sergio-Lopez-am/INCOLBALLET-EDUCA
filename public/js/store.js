/*
 * Capa de datos del navegador.
 *  - Modo servidor: si la página la sirve server.js, todo se guarda en el servidor (data/db.json)
 *    y los registros de todos los estudiantes llegan al panel de administración.
 *  - Modo local: sin servidor (vista previa o archivo abierto directamente), los datos viven
 *    en el localStorage de este navegador. Útil para demostraciones.
 */
(function () {
  const C = window.CONTENT, CORE = window.CORE;
  const LS_DB = 'incol-educa-db-v1', LS_SES = 'incol-educa-session';

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* almacenamiento no disponible */ } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { /* idem */ } }

  /* ---------- Cifrado de contraseñas (PBKDF2-SHA256) ---------- */
  const enc = new TextEncoder();
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  async function hashPassword(password, salt) {
    salt = salt || hex(crypto.getRandomValues(new Uint8Array(16)));
    if (crypto.subtle) {
      const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 100000 }, key, 256);
      return { salt, hash: hex(bits), algo: 'pbkdf2' };
    }
    // Contexto sin crypto.subtle (poco habitual): hash simple solo para demostración.
    let h = 2166136261; const s = salt + password;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return { salt, hash: (h >>> 0).toString(16), algo: 'fnv' };
  }

  /* ---------- Modo local ---------- */
  let db = null;
  function save() { lsSet(LS_DB, JSON.stringify(db)); }
  async function loadLocal() {
    const raw = lsGet(LS_DB);
    if (raw) { try { db = JSON.parse(raw); return; } catch (e) { /* datos dañados: se reconstruyen */ } }
    const seed = SEED.build();
    for (const u of seed.users) { Object.assign(u, await hashPassword(u.password)); delete u.password; }
    db = seed; save();
  }
  async function verify(user, password) {
    const h = await hashPassword(password, user.salt);
    return h.hash === user.hash;
  }
  const clone = o => JSON.parse(JSON.stringify(o));
  function current() {
    const id = lsGet(LS_SES);
    return id && db.users.find(u => u.id === id);
  }
  function requireUser(role) {
    const u = current();
    if (!u) CORE.fail('Tu sesión terminó. Vuelve a ingresar.', 401);
    if (role && u.role !== role) CORE.fail('No tienes permiso para esta acción.', 403);
    return u;
  }

  const local = {
    mode: 'local',
    async init() { await loadLocal(); },
    async session() { const u = current(); return u ? CORE.publicUser(u) : null; },
    async login(username, password) {
      const u = db.users.find(x => x.username === String(username).trim().toLowerCase());
      if (!u || !(await verify(u, password))) CORE.fail('Usuario o contraseña incorrectos.', 401);
      lsSet(LS_SES, u.id);
      CORE.record(db, u.id);
      return CORE.publicUser(u);
    },
    async logout() { lsDel(LS_SES); },
    async myRecord() { const u = requireUser(); return clone(CORE.record(db, u.id)); },
    async completeLesson(m, l) { const u = requireUser('student'); const r = CORE.completeLesson(db, u.id, m, l); save(); return clone(r); },
    async submitEval(m, answers) { const u = requireUser('student'); const out = CORE.submitEval(db, u.id, m, answers); save(); return clone(out); },
    async setSelf(m, v) { const u = requireUser('student'); const r = CORE.setSelf(db, u.id, m, v); save(); return clone(r); },
    async changePassword(oldPass, newPass) {
      const u = requireUser();
      if (!(await verify(u, oldPass))) CORE.fail('La contraseña actual no coincide.');
      if (String(newPass).length < 6) CORE.fail('La nueva contraseña debe tener al menos 6 caracteres.');
      Object.assign(u, await hashPassword(newPass)); save();
    },
    async overview() { requireUser('admin'); return clone(CORE.overview(db)); },
    async setMarks(sid, m, marks) { const a = requireUser('admin'); CORE.setMarks(db, a.id, sid, m, marks); save(); },
    async createStudent(data) {
      const a = requireUser('admin');
      const clean = CORE.checkNewUser(db, data);
      const u = CORE.addStudent(db, a.id, clean, await hashPassword(data.password)); save(); return u;
    },
    async resetPassword(sid, pass) {
      requireUser('admin');
      if (String(pass).length < 6) CORE.fail('La contraseña debe tener al menos 6 caracteres.');
      const u = db.users.find(x => x.id === sid) || CORE.fail('Estudiante no encontrado', 404);
      Object.assign(u, await hashPassword(pass)); save();
    },
    async deleteStudent(sid) { const a = requireUser('admin'); CORE.deleteStudent(db, a.id, sid); save(); },
    async removeSamples() { const a = requireUser('admin'); const n = CORE.removeSamples(db, a.id); save(); return n; },
    async resetAll() { lsDel(LS_DB); lsDel(LS_SES); await loadLocal(); }
  };

  /* ---------- Modo servidor ---------- */
  let token = null;
  async function api(method, path, body) {
    const res = await fetch('api/' + path, {
      method, headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(data.error || 'Error de conexión con el servidor.'); e.status = res.status; throw e; }
    return data;
  }
  const remote = {
    mode: 'server',
    async init() { token = lsGet(LS_SES + '-token'); },
    async session() { if (!token) return null; try { return (await api('GET', 'me')).user; } catch (e) { token = null; lsDel(LS_SES + '-token'); return null; } },
    async login(username, password) { const d = await api('POST', 'login', { username, password }); token = d.token; lsSet(LS_SES + '-token', token); return d.user; },
    async logout() { try { await api('POST', 'logout'); } catch (e) { /* sin conexión */ } token = null; lsDel(LS_SES + '-token'); },
    async myRecord() { return (await api('GET', 'me/record')).record; },
    async completeLesson(m, l) { return (await api('POST', 'me/lessons', { module: m, lesson: l })).record; },
    async submitEval(m, answers) { return api('POST', 'me/evaluations', { module: m, answers }); },
    async setSelf(m, v) { return (await api('POST', 'me/self', { module: m, value: v })).record; },
    async changePassword(oldPass, newPass) { await api('POST', 'me/password', { oldPass, newPass }); },
    async overview() { return api('GET', 'admin/overview'); },
    async setMarks(sid, m, marks) { await api('POST', 'admin/students/' + sid + '/marks', Object.assign({ module: m }, marks)); },
    async createStudent(data) { return (await api('POST', 'admin/students', data)).user; },
    async resetPassword(sid, pass) { await api('POST', 'admin/students/' + sid + '/password', { password: pass }); },
    async deleteStudent(sid) { await api('DELETE', 'admin/students/' + sid); },
    async removeSamples() { return (await api('POST', 'admin/remove-samples')).removed; },
    async resetAll() { CORE.fail('En el servidor, para reiniciar borre el archivo data/db.json.'); }
  };

  async function detect() {
    if (window.INCOL_FORCE_LOCAL) return local;
    try {
      const r = await fetch('api/health', { cache: 'no-store' });
      const d = await r.json();
      if (d && d.app === 'incolballet-educa') return remote;
    } catch (e) { /* sin servidor */ }
    return local;
  }

  window.Store = { detect };
})();
