/*
 * Quita las respuestas correctas (a) y las explicaciones (e) de content.js en la copia
 * que se publica en internet con Supabase. La calificación y la retroalimentación las
 * entrega la base de datos (función submit_evaluation), así nadie puede ver las respuestas
 * en el código de la página.
 *   node tools/strip-answers.js <ruta/a/content.js>
 */
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Uso: node tools/strip-answers.js <content.js>'); process.exit(1); }
let src = fs.readFileSync(file, 'utf8');
const before = (src.match(/, a: \d+, e: '/g) || []).length;
src = src.replace(/, a: \d+, e: '(?:[^'\\]|\\.)*'/g, '');
const left = (src.match(/, a: \d+/g) || []).length;
if (!before || left) { console.error('No se pudieron quitar todas las respuestas (' + before + ' encontradas, ' + left + ' restantes).'); process.exit(1); }
fs.writeFileSync(file, src);
console.log('Respuestas retiradas de ' + before + ' preguntas.');
