/*
 * Genera supabase/02_contenido.sql a partir de public/js/content.js:
 * lecciones de cada módulo y respuestas correctas de las evaluaciones.
 * Vuelve a ejecutarlo (y a correr el SQL en Supabase) cada vez que cambies preguntas o lecciones.
 *   node tools/build-supabase-content.js
 */
const fs = require('fs');
const path = require('path');
const C = require('../public/js/content.js');

const q = s => "'" + String(s).replace(/'/g, "''") + "'";
let sql = '-- Generado por tools/build-supabase-content.js. No editar a mano.\n-- Ejecutar en Supabase → SQL Editor después de 01_schema.sql.\n\nbegin;\n';
for (const m of C.MODULES) {
  const lessons = Object.fromEntries(m.lessons.map(l => [l.id, l.title]));
  sql += `\ninsert into public.modules (id, lessons) values (${q(m.id)}, ${q(JSON.stringify(lessons))}::jsonb)\n  on conflict (id) do update set lessons = excluded.lessons;\n`;
  sql += `delete from public.quiz_keys where module = ${q(m.id)};\n`;
  sql += `insert into public.quiz_keys (module, idx, answer, explanation) values\n` +
    m.quiz.map((it, i) => `  (${q(m.id)}, ${i}, ${it.a}, ${q(it.e)})`).join(',\n') + ';\n';
}
sql += '\ncommit;\n';
const out = path.join(__dirname, '..', 'supabase', '02_contenido.sql');
fs.writeFileSync(out, sql);
console.log('Generado ' + out);
