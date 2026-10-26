/*
 * Conexión con Supabase. Con estos datos vacíos la plataforma funciona en modo
 * demostración (o con server.js si está corriendo).
 * Los encuentras en Supabase → Project Settings → API. La "anon public key" es pública
 * por diseño: la seguridad la dan las políticas de supabase/01_schema.sql.
 */
window.SUPABASE_CONFIG = {
  url: '',          // ej. 'https://abcdefghijkl.supabase.co'
  anonKey: '',      // ej. 'eyJhbGciOi...'
  // Supabase identifica a cada persona por correo. Los estudiantes ingresan solo con su
  // usuario y la plataforma le agrega este dominio (no se envían correos).
  emailDomain: 'estudiantes.incolballet-educa.app'
};
