/*
 * Reglas de negocio compartidas por el modo local (navegador) y el servidor Node.
 * Operan sobre un objeto db = { users, records, activity }.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('./content.js'));
  else root.CORE = factory(root.CONTENT);
})(typeof self !== 'undefined' ? self : this, function (C) {

  const MAX_ACTIVITY = 1000;

  function fail(msg, status) { const e = new Error(msg); e.status = status || 400; throw e; }

  function publicUser(u) {
    return { id: u.id, username: u.username, name: u.name, role: u.role, grade: u.grade || '', sample: !!u.sample, createdAt: u.createdAt };
  }

  function record(db, uid) {
    if (!db.records[uid]) db.records[uid] = { lessons: {}, attempts: [], marks: {} };
    return db.records[uid];
  }

  function log(db, userId, type, module, detail) {
    db.activity.unshift({ at: Date.now(), userId, type, module, detail });
    if (db.activity.length > MAX_ACTIVITY) db.activity.length = MAX_ACTIVITY;
  }

  function findModule(id) { return C.MODULES.find(m => m.id === id) || fail('Módulo no encontrado', 404); }

  function completeLesson(db, uid, moduleId, lessonId) {
    const mod = findModule(moduleId);
    const lesson = mod.lessons.find(l => l.id === lessonId) || fail('Lección no encontrada', 404);
    const rec = record(db, uid);
    const list = rec.lessons[moduleId] || (rec.lessons[moduleId] = []);
    if (!list.includes(lessonId)) { list.push(lessonId); log(db, uid, 'lesson', moduleId, lesson.title); }
    return rec;
  }

  function submitEval(db, uid, moduleId, answers) {
    findModule(moduleId);
    if (!Array.isArray(answers)) fail('Respuestas inválidas');
    const result = C.gradeQuiz(moduleId, answers);
    const rec = record(db, uid);
    const attempt = { module: moduleId, correct: result.correct, total: result.total, score: result.score, at: Date.now(), answers: answers.map(a => a == null ? null : Number(a)) };
    rec.attempts.push(attempt);
    log(db, uid, 'eval', moduleId, result.correct + '/' + result.total + ' · ' + result.score.toFixed(1));
    return { result, record: rec };
  }

  function validMark(v) {
    if (v === null || v === '' || v === undefined) return null;
    const n = Number(v);
    if (isNaN(n) || n < 1 || n > 5) fail('Las notas van de 1.0 a 5.0');
    return C.round1(n);
  }

  function setSelf(db, uid, moduleId, value) {
    findModule(moduleId);
    const rec = record(db, uid);
    const m = rec.marks[moduleId] || (rec.marks[moduleId] = {});
    m.self = validMark(value);
    log(db, uid, 'self', moduleId, 'Autoevaluación ' + (m.self == null ? '—' : m.self.toFixed(1)));
    return rec;
  }

  function setMarks(db, adminId, studentId, moduleId, marks) {
    findModule(moduleId);
    const u = db.users.find(x => x.id === studentId && x.role === 'student') || fail('Estudiante no encontrado', 404);
    const rec = record(db, studentId);
    const m = rec.marks[moduleId] || (rec.marks[moduleId] = {});
    if ('personal' in marks) m.personal = validMark(marks.personal);
    if ('social' in marks) m.social = validMark(marks.social);
    log(db, adminId, 'marks', moduleId, u.name + ': personal ' + (m.personal ?? '—') + ', social ' + (m.social ?? '—'));
    return rec;
  }

  function checkNewUser(db, data) {
    const username = String(data.username || '').trim().toLowerCase();
    const name = String(data.name || '').trim();
    if (!name) fail('Escribe el nombre completo.');
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) fail('El usuario debe tener entre 3 y 30 caracteres: letras, números, punto o guion.');
    if (String(data.password || '').length < 6) fail('La contraseña debe tener al menos 6 caracteres.');
    if (db.users.some(u => u.username === username)) fail('Ese usuario ya existe.');
    return { username, name, grade: String(data.grade || '').trim() };
  }

  function addStudent(db, adminId, clean, secret) {
    const id = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const user = Object.assign({ id, role: 'student', createdAt: Date.now() }, clean, secret);
    db.users.push(user);
    record(db, id);
    log(db, adminId, 'user', null, 'Alta de ' + clean.name);
    return publicUser(user);
  }

  function deleteStudent(db, adminId, studentId) {
    const u = db.users.find(x => x.id === studentId && x.role === 'student') || fail('Estudiante no encontrado', 404);
    db.users = db.users.filter(x => x.id !== studentId);
    delete db.records[studentId];
    db.activity = db.activity.filter(a => a.userId !== studentId);
    log(db, adminId, 'user', null, 'Baja de ' + u.name);
  }

  function removeSamples(db, adminId) {
    const ids = db.users.filter(u => u.sample).map(u => u.id);
    db.users = db.users.filter(u => !u.sample);
    ids.forEach(id => delete db.records[id]);
    db.activity = db.activity.filter(a => !ids.includes(a.userId));
    log(db, adminId, 'user', null, 'Se eliminaron ' + ids.length + ' estudiantes de ejemplo');
    return ids.length;
  }

  function overview(db) {
    const students = db.users.filter(u => u.role === 'student').map(u => ({ user: publicUser(u), record: record(db, u.id) }));
    const names = Object.fromEntries(db.users.map(u => [u.id, u.name]));
    const activity = db.activity.slice(0, 300).map(a => Object.assign({ name: names[a.userId] || 'Usuario eliminado' }, a));
    return { students, activity };
  }

  return { publicUser, record, completeLesson, submitEval, setSelf, setMarks, checkNewUser, addStudent, deleteStudent, removeSamples, overview, fail };
});
