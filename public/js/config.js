/*
 * Conexión con Supabase. Con estos datos vacíos la plataforma funciona en modo
 * demostración (o con server.js si está corriendo).
 * Los encuentras en Supabase → Connect. La llave publishable (o anon) es pública
 * por diseño: la seguridad la dan las políticas de supabase/01_schema.sql.
 */
window.SUPABASE_CONFIG = {
  url: 'https://rfwchruroxkxvewkkmyd.supabase.co',
  anonKey: 'sb_publishable_SN1QvJLxHpD6rNS3JfAgCg_3LxrHRdt',
  // Supabase identifica a cada persona por correo. Los estudiantes ingresan solo con su
  // usuario y la plataforma le agrega este dominio (no se envían correos).
  emailDomain: 'estudiantes.incolballet-educa.app'
};
