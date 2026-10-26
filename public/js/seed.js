/*
 * Datos iniciales: una cuenta administradora, una cuenta de estudiante de prueba
 * y estudiantes de ejemplo (marcados con sample: true) para ver el dashboard con datos.
 * Las contraseñas se cifran al crear la base de datos; aquí solo viven en texto plano
 * para el primer arranque. Cámbielas desde el panel antes de usar la plataforma en producción.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('./content.js'));
  else root.SEED = factory(root.CONTENT);
})(typeof self !== 'undefined' ? self : this, function (C) {

  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  const SAMPLE = [
    ['Valentina Ríos', 'vrios', 'VII'], ['Samuel Caicedo', 'scaicedo', 'VII'],
    ['Isabella Mosquera', 'imosquera', 'VIII'], ['Juan José Ortiz', 'jjortiz', 'VI'],
    ['Mariana Valencia', 'mvalencia', 'VIII'], ['Sofía Angulo', 'sangulo', 'V'],
    ['Tomás Grueso', 'tgrueso', 'VI'], ['Antonia Hurtado', 'ahurtado', 'VII'],
    ['Daniel Rentería', 'drenteria', 'V']
  ];

  function build(now) {
    now = now || Date.now();
    const day = 86400000;
    const users = [
      { id: 'u-admin', username: 'admin', name: 'Coordinación Académica', role: 'admin', password: 'Incolballet2026', createdAt: now - 60 * day },
      { id: 'u-demo', username: 'estudiante', name: 'Estudiante de prueba', role: 'student', grade: 'VII', password: 'danza2026', createdAt: now - 30 * day }
    ];
    const records = { 'u-demo': { lessons: { ballet: ['b1', 'b2'] }, attempts: [], marks: {} } };
    const activity = [];

    SAMPLE.forEach(([name, username, grade], i) => {
      const id = 'u-s' + (i + 1);
      const r = rng(i * 97 + 13);
      const created = now - (40 - i) * day;
      users.push({ id, username, name, role: 'student', grade, password: 'ejemplo2026', sample: true, createdAt: created });
      const rec = { lessons: {}, attempts: [], marks: {} };
      C.MODULES.forEach((m, mi) => {
        const reach = r();
        const n = Math.min(m.lessons.length, Math.floor((0.3 + 0.7 * reach) * (m.lessons.length + 3)));
        rec.lessons[m.id] = m.lessons.slice(0, n).map(l => l.id);
        n && activity.push({ at: created + (mi + 1) * 2 * day, userId: id, type: 'lesson', module: m.id, detail: m.lessons[n - 1].title });
        if (n === m.lessons.length) {
          const tries = 1 + Math.floor(r() * 2);
          for (let t = 0; t < tries; t++) {
            const correct = Math.min(10, Math.max(2, Math.round(4 + r() * 6 + t)));
            const at = created + (mi + 2) * 3 * day + t * day;
            rec.attempts.push({ module: m.id, correct, total: 10, score: C.round1(1 + 4 * correct / 10), at });
            activity.push({ at, userId: id, type: 'eval', module: m.id, detail: correct + '/10' });
          }
          rec.marks[m.id] = {
            personal: C.round1(3 + r() * 2), social: C.round1(3.2 + r() * 1.8), self: C.round1(3.5 + r() * 1.5)
          };
        }
      });
      records[id] = rec;
    });
    activity.sort((a, b) => b.at - a.at);
    return { users, records, activity };
  }

  return { build };
});
