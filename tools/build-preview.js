/*
 * Genera un único archivo HTML autocontenido (CSS, JS e imágenes embebidas) que funciona
 * sin servidor, en modo local. Útil para compartir una vista previa.
 *   node tools/build-preview.js [salida.html] [--fragment]
 */
const fs = require('fs');
const path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const args = process.argv.slice(2);
const fragment = args.includes('--fragment'); // sin <html>/<head>, para incrustar en otra página
const out = args.find(a => !a.startsWith('--')) || path.join(__dirname, '..', 'dist', 'incolballet-educa.html');

let css = fs.readFileSync(path.join(PUB, 'css/styles.css'), 'utf8');
const scripts = ['content.js', 'seed.js', 'core.js', 'store.js', 'app.js'].map(f => fs.readFileSync(path.join(PUB, 'js', f), 'utf8'));
let js = 'window.INCOL_FORCE_LOCAL = true;\n' + scripts.join('\n;\n');

// Embebe las imágenes de assets/ como data URIs
for (const f of fs.readdirSync(path.join(PUB, 'assets'))) {
  const uri = 'data:image/png;base64,' + fs.readFileSync(path.join(PUB, 'assets', f)).toString('base64');
  js = js.split('assets/' + f).join(uri);
  css = css.split('assets/' + f).join(uri);
}
const html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
const head = html.match(/<title>[\s\S]*?<link rel="stylesheet" href="https:[^>]+>/)[0];
const body = `${head}
<style>
${css}
</style>
<div id="app"></div>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
`;
const page = fragment ? body : `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${body.replace('<div id="app">', '</head>\n<body>\n<div id="app">')}</body>\n</html>\n`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, page);
console.log('Vista previa generada: ' + out + ' (' + Math.round(page.length / 1024) + ' KB)');
