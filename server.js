/*
 * Servidor de INCOLBALLET EDUCA. Sin dependencias: solo Node.js 18 o superior.
 *   node server.js            -> http://localhost:3000
 *   PORT=8080 node server.js  -> otro puerto
 * Los datos se guardan en data/db.json (se crea en el primer arranque).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = require('./public/js/content.js');
const CORE = require('./public/js/core.js');
const SEED = require('./public/js/seed.js');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SESSION_HOURS = 12;

/* ---------- Contraseñas (scrypt) ---------- */
function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash, algo: 'scrypt' };
}
function verify(user, password) {
  if (user.algo !== 'scrypt') return false;
  const h = Buffer.from(hashPassword(password, user.salt).hash, 'hex');
  const stored = Buffer.from(user.hash, 'hex');
  return h.length === stored.length && crypto.timingSafeEqual(h, stored);
}

/* ---------- Base de datos en archivo JSON ---------- */
let db;
function load() {
  if (fs.existsSync(DB_FILE)) { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); return; }
  db = SEED.build();
  db.users.forEach(u => { Object.assign(u, hashPassword(u.password)); delete u.password; });
  save();
  console.log('Base de datos creada en data/db.json');
}
function save() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 1));
  fs.renameSync(tmp, DB_FILE);
}

/* ---------- Sesiones ---------- */
const sessions = new Map(); // token -> { userId, exp }
function newSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId, exp: Date.now() + SESSION_HOURS * 3600e3 });
  return token;
}
function auth(req, role) {
  const m = /^Bearer (\w+)$/.exec(req.headers.authorization || '');
  const s = m && sessions.get(m[1]);
  if (!s || s.exp < Date.now()) CORE.fail('Tu sesión terminó. Vuelve a ingresar.', 401);
  const user = db.users.find(u => u.id === s.userId) || CORE.fail('Usuario no encontrado', 401);
  if (role && user.role !== role) CORE.fail('No tienes permiso para esta acción.', 403);
  return { user, token: m[1] };
}

/* ---------- Límite simple de intentos de ingreso ---------- */
const attempts = new Map();
function throttle(ip) {
  const now = Date.now(), a = (attempts.get(ip) || []).filter(t => now - t < 15 * 60e3);
  if (a.length >= 10) CORE.fail('Demasiados intentos. Espera 15 minutos.', 429);
  a.push(now); attempts.set(ip, a);
}

/* ---------- Utilidades HTTP ---------- */
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 1e6) { reject(Object.assign(new Error('Solicitud demasiado grande'), { status: 413 })); req.destroy(); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(Object.assign(new Error('JSON inválido'), { status: 400 })); } });
  });
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
function serveStatic(req, res, pathname) {
  const file = path.normalize(path.join(PUBLIC, pathname === '/' ? 'index.html' : decodeURIComponent(pathname)));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}
function csv(rows) { return rows.map(r => r.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n'); }

/* ---------- Rutas de la API ---------- */
async function handleApi(req, res, route) {
  const method = req.method;
  const body = method === 'POST' ? await readBody(req) : {};
  let m;

  if (route === 'health') return send(res, 200, { app: 'incolballet-educa', ok: true });

  if (route === 'login' && method === 'POST') {
    throttle(req.socket.remoteAddress);
    const u = db.users.find(x => x.username === String(body.username || '').trim().toLowerCase());
    if (!u || !verify(u, body.password || '')) CORE.fail('Usuario o contraseña incorrectos.', 401);
    return send(res, 200, { token: newSession(u.id), user: CORE.publicUser(u) });
  }
  if (route === 'logout' && method === 'POST') { const { token } = auth(req); sessions.delete(token); return send(res, 200, { ok: true }); }
  if (route === 'me' && method === 'GET') return send(res, 200, { user: CORE.publicUser(auth(req).user) });
  if (route === 'me/record' && method === 'GET') return send(res, 200, { record: CORE.record(db, auth(req).user.id) });

  if (route === 'me/lessons' && method === 'POST') {
    const { user } = auth(req, 'student');
    const record = CORE.completeLesson(db, user.id, body.module, body.lesson); save();
    return send(res, 200, { record });
  }
  if (route === 'me/evaluations' && method === 'POST') {
    const { user } = auth(req, 'student');
    const out = CORE.submitEval(db, user.id, body.module, body.answers); save();
    return send(res, 200, out);
  }
  if (route === 'me/self' && method === 'POST') {
    const { user } = auth(req, 'student');
    const record = CORE.setSelf(db, user.id, body.module, body.value); save();
    return send(res, 200, { record });
  }
  if (route === 'me/password' && method === 'POST') {
    const { user } = auth(req);
    if (!verify(user, body.oldPass || '')) CORE.fail('La contraseña actual no coincide.');
    if (String(body.newPass || '').length < 6) CORE.fail('La nueva contraseña debe tener al menos 6 caracteres.');
    Object.assign(user, hashPassword(body.newPass)); save();
    return send(res, 200, { ok: true });
  }

  if (route === 'admin/overview' && method === 'GET') { auth(req, 'admin'); return send(res, 200, CORE.overview(db)); }
  if (route === 'admin/students' && method === 'POST') {
    const { user } = auth(req, 'admin');
    const clean = CORE.checkNewUser(db, body);
    const created = CORE.addStudent(db, user.id, clean, hashPassword(body.password)); save();
    return send(res, 201, { user: created });
  }
  if ((m = /^admin\/students\/([\w-]+)\/marks$/.exec(route)) && method === 'POST') {
    const { user } = auth(req, 'admin');
    const marks = {};
    if ('personal' in body) marks.personal = body.personal;
    if ('social' in body) marks.social = body.social;
    CORE.setMarks(db, user.id, m[1], body.module, marks); save();
    return send(res, 200, { ok: true });
  }
  if ((m = /^admin\/students\/([\w-]+)\/password$/.exec(route)) && method === 'POST') {
    auth(req, 'admin');
    if (String(body.password || '').length < 6) CORE.fail('La contraseña debe tener al menos 6 caracteres.');
    const u = db.users.find(x => x.id === m[1]) || CORE.fail('Estudiante no encontrado', 404);
    Object.assign(u, hashPassword(body.password)); save();
    for (const [t, s] of sessions) if (s.userId === u.id) sessions.delete(t);
    return send(res, 200, { ok: true });
  }
  if ((m = /^admin\/students\/([\w-]+)$/.exec(route)) && method === 'DELETE') {
    const { user } = auth(req, 'admin');
    CORE.deleteStudent(db, user.id, m[1]); save();
    return send(res, 200, { ok: true });
  }
  if (route === 'admin/remove-samples' && method === 'POST') {
    const { user } = auth(req, 'admin');
    const removed = CORE.removeSamples(db, user.id); save();
    return send(res, 200, { removed });
  }
  if (route === 'admin/export.csv' && method === 'GET') {
    // Acepta el token por query para poder descargar con un enlace.
    req.headers.authorization = req.headers.authorization || 'Bearer ' + (new URL(req.url, 'http://x').searchParams.get('token') || '');
    auth(req, 'admin');
    const head = ['Estudiante', 'Usuario', 'Grado'];
    C.MODULES.forEach(mod => head.push(mod.short + ' avance %', mod.short + ' cognitivo', mod.short + ' personal', mod.short + ' social', mod.short + ' autoevaluación', mod.short + ' nota final', mod.short + ' desempeño'));
    const rows = [head];
    CORE.overview(db).students.forEach(({ user, record }) => {
      const row = [user.name, user.username, user.grade];
      C.MODULES.forEach(mod => {
        const g = C.moduleGrade(record, mod.id), p = C.moduleProgress(record, mod.id);
        row.push(p.pct, g.parts.cognitive ?? '', g.parts.personal ?? '', g.parts.social ?? '', g.parts.self ?? '', g.final ?? '', g.level ? g.level.label + (g.partial ? ' (parcial)' : '') : '');
      });
      rows.push(row);
    });
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="incolballet-educa-notas.csv"' });
    return res.end('﻿' + csv(rows));
  }
  CORE.fail('Ruta no encontrada', 404);
}

load();
http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname.startsWith('/api/')) {
    try { await handleApi(req, res, pathname.slice(5)); }
    catch (e) { send(res, e.status || 500, { error: e.status ? e.message : 'Error interno del servidor.' }); if (!e.status) console.error(e); }
    return;
  }
  serveStatic(req, res, pathname);
}).listen(PORT, () => console.log('INCOLBALLET EDUCA en http://localhost:' + PORT));
