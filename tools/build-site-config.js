/*
 * Escribe la configuración de Supabase a partir de variables de entorno
 * (SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL_DOMAIN). Si no hay variables, no cambia nada.
 *   node tools/build-site-config.js <ruta/a/config.js>
 */
const fs = require('fs');
const file = process.argv[2];
const { SUPABASE_URL: url, SUPABASE_ANON_KEY: key, EMAIL_DOMAIN: domain } = process.env;
if (!url || !key) { console.log('Sin variables de Supabase: se conserva ' + file); process.exit(0); }
if (!/^https:\/\/[\w.-]+$/.test(url)) { console.error('SUPABASE_URL no es válida: ' + url); process.exit(1); }
const cfg = { url, anonKey: key, emailDomain: domain || 'estudiantes.incolballet-educa.app' };
fs.writeFileSync(file, 'window.SUPABASE_CONFIG = ' + JSON.stringify(cfg, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'") + ';\n');
console.log('Configuración de Supabase escrita en ' + file);
