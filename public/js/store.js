/*
 * Capa de datos del navegador.
 *  - Modo servidor: si la página la sirve server.js, todo se guarda en el servidor (data/db.json)
 *    y los registros de todos los estudiantes llegan al panel de administración.
 *  - Modo local: sin servidor (vista previa o archivo abierto directamente), los datos viven
 *    en el localStorage de este navegador. Útil para demostraciones.
 *  - Modo Supabase: si public/js/config.js tiene la URL y la llave del proyecto, los datos y
 *    las cuentas viven en Supabase (ver supabase/ y la guía en README.md).
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

  /* ---------- Modo Supabase ---------- */
  let sb = null, sbUser = null;
  const CFG = window.SUPABASE_CONFIG || {};
  const emailOf = u => String(u || '').trim().toLowerCase() + '@' + CFG.emailDomain;
  const ms = t => new Date(t).getTime();
  function sbFail(error) {
    let msg = error && error.message || 'Error de conexión con la base de datos.';
    if (/Invalid login credentials/i.test(msg)) msg = 'Usuario o contraseña incorrectos.';
    else if (/JWT|session/i.test(msg)) { const e = new Error('Tu sesión terminó. Vuelve a ingresar.'); e.status = 401; throw e; }
    else if (/rate limit/i.test(msg)) msg = 'Demasiados intentos. Espera unos minutos.';
    else if (/already registered/i.test(msg)) msg = 'Ese usuario ya existe.';
    else if (/Database error saving new user/i.test(msg)) msg = 'No se pudo crear la cuenta. Revisa que el usuario no exista y vuelve a intentarlo.';
    else if (/Email not confirmed/i.test(msg)) msg = 'La cuenta no está activa: en Supabase desactiva "Confirm email" (ver README).';
    const e = new Error(msg); e.status = error && error.status; throw e;
  }
  async function rpc(fn, args) { const { data, error } = await sb.rpc(fn, args); if (error) sbFail(error); return data; }
  // PostgREST devuelve máximo 1000 filas por consulta: se pide por páginas.
  async function all(table, columns, opts) {
    const rows = [];
    for (let from = 0; ; from += 1000) {
      let qy = sb.from(table).select(columns).range(from, from + 999);
      if (opts && opts.order) qy = qy.order(opts.order, { ascending: false });
      if (opts && opts.eq) qy = qy.eq(opts.eq[0], opts.eq[1]);
      const { data, error } = await qy;
      if (error) sbFail(error);
      rows.push(...data);
      if (data.length < 1000 || (opts && opts.limit && rows.length >= opts.limit)) return rows;
    }
  }
  const pub = p => ({ id: p.id, username: p.username, name: p.name, role: p.role, grade: p.grade || '', sample: false, createdAt: ms(p.created_at) });
  function buildRecords(ids, progress, attempts, marks) {
    const rec = {};
    ids.forEach(id => { rec[id] = { lessons: {}, attempts: [], marks: {} }; });
    progress.forEach(p => { const r = rec[p.user_id]; if (r) (r.lessons[p.module] = r.lessons[p.module] || []).push(p.lesson); });
    attempts.forEach(a => { const r = rec[a.user_id]; if (r) r.attempts.push({ module: a.module, correct: a.correct, total: a.total, score: Number(a.score), at: ms(a.at) }); });
    marks.forEach(m => { const r = rec[m.user_id]; if (r) r.marks[m.module] = { personal: m.personal == null ? null : Number(m.personal), social: m.social == null ? null : Number(m.social), self: m.self == null ? null : Number(m.self) }; });
    return rec;
  }
  async function profileOf(id) {
    const { data, error } = await sb.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) sbFail(error);
    return data;
  }
  const supa = {
    mode: 'supabase',
    async init() {
      sb = window.supabase.createClient(CFG.url, CFG.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
    },
    async session() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const p = await profileOf(data.session.user.id);
      sbUser = p ? pub(p) : null;
      return sbUser;
    },
    async login(username, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email: emailOf(username), password });
      if (error) sbFail(error);
      const p = await profileOf(data.user.id);
      if (!p) { await sb.auth.signOut(); CORE.fail('Tu cuenta no tiene perfil en la plataforma. Contacta a la coordinación.', 403); }
      return (sbUser = pub(p));
    },
    async logout() { await sb.auth.signOut(); sbUser = null; },
    async myRecord() {
      const id = sbUser.id;
      const [progress, attempts, marks] = await Promise.all([
        all('lesson_progress', 'user_id,module,lesson', { eq: ['user_id', id] }),
        all('attempts', 'user_id,module,correct,total,score,at', { eq: ['user_id', id] }),
        all('marks', 'user_id,module,personal,social,self', { eq: ['user_id', id] })
      ]);
      return buildRecords([id], progress, attempts, marks)[id];
    },
    async completeLesson(m, l) { await rpc('complete_lesson', { p_module: m, p_lesson: l }); return supa.myRecord(); },
    async submitEval(m, answers) {
      const result = await rpc('submit_evaluation', { p_module: m, p_answers: answers });
      result.score = Number(result.score);
      return { result, record: await supa.myRecord() };
    },
    async setSelf(m, v) { await rpc('set_self_evaluation', { p_module: m, p_value: v === '' ? null : Number(v) }); return supa.myRecord(); },
    async changePassword(oldPass, newPass) {
      if (String(newPass).length < 6) CORE.fail('La nueva contraseña debe tener al menos 6 caracteres.');
      const check = await sb.auth.signInWithPassword({ email: emailOf(sbUser.username), password: oldPass });
      if (check.error) CORE.fail('La contraseña actual no coincide.');
      const { error } = await sb.auth.updateUser({ password: newPass });
      if (error) sbFail(error);
    },
    async overview() {
      const [profiles, progress, attempts, marks, activity] = await Promise.all([
        all('profiles', '*'),
        all('lesson_progress', 'user_id,module,lesson'),
        all('attempts', 'user_id,module,correct,total,score,at'),
        all('marks', 'user_id,module,personal,social,self'),
        all('activity', 'at,user_id,type,module,detail', { order: 'at', limit: 300 })
      ]);
      const students = profiles.filter(p => p.role === 'student');
      const rec = buildRecords(students.map(p => p.id), progress, attempts, marks);
      const names = Object.fromEntries(profiles.map(p => [p.id, p.name]));
      return {
        students: students.map(p => ({ user: pub(p), record: rec[p.id] })),
        activity: activity.slice(0, 300).map(a => ({ at: ms(a.at), userId: a.user_id, type: a.type, module: a.module, detail: a.detail, name: names[a.user_id] || 'Usuario eliminado' }))
      };
    },
    async setMarks(sid, m, marks) {
      const num = v => v === '' || v == null ? null : Number(v);
      await rpc('admin_set_marks', { p_user: sid, p_module: m, p_personal: num(marks.personal), p_social: num(marks.social) });
    },
    async createStudent(data) {
      if (String(data.password || '').length < 6) CORE.fail('La contraseña debe tener al menos 6 caracteres.');
      await rpc('admin_invite', { p_username: data.username, p_name: data.name, p_grade: data.grade });
      // Cliente aparte sin sesión persistente, para no cerrar la sesión del administrador.
      const tmp = window.supabase.createClient(CFG.url, CFG.anonKey, { auth: { persistSession: false, autoRefreshToken: false, storageKey: 'incol-alta' } });
      const { error } = await tmp.auth.signUp({ email: emailOf(data.username), password: data.password });
      if (error) sbFail(error);
      return { username: String(data.username).trim().toLowerCase(), name: data.name };
    },
    async resetPassword(sid, pass) { await rpc('admin_reset_password', { p_user: sid, p_password: pass }); },
    async deleteStudent(sid) { await rpc('admin_delete_student', { p_user: sid }); },
    async removeSamples() { return 0; },
    async resetAll() { CORE.fail('Esta acción solo existe en el modo demostración.'); }
  };

  async function detect() {
    if (window.INCOL_FORCE_LOCAL) return local;
    if (CFG.url && CFG.anonKey && window.supabase) return supa;
    try {
      const r = await fetch('api/health', { cache: 'no-store' });
      const d = await r.json();
      if (d && d.app === 'incolballet-educa') return remote;
    } catch (e) { /* sin servidor */ }
    return local;
  }

  window.Store = { detect };
})();
