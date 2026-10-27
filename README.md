# INCOLBALLET EDUCA

Plataforma de formación artística con tres módulos (Ballet Clásico, Danza Contemporánea y Folclor y Danza Nacional), inicio de sesión con usuario y contraseña, avance por lección, evaluaciones calificadas y un panel de administración con registros y dashboard. El contenido y el sistema de evaluación toman como referente el PEI INCOLBALLET 2025-2026.

## Publicar en internet (GitHub Pages + Supabase) · recomendado

La página se publica gratis en GitHub Pages y los datos, las cuentas y la calificación viven en Supabase. No hay servidor que mantener.

**1. Base de datos (Supabase → SQL Editor)**
1. Abre *New query*, pega todo `supabase/01_schema.sql` y pulsa *Run*.
2. Haz lo mismo con `supabase/02_contenido.sql` (lecciones y respuestas de las evaluaciones).

**2. Autenticación (Supabase → Authentication)**
1. *Sign In / Providers → Email*: desactiva **Confirm email** y guarda. Los estudiantes no usan un correo real; la plataforma convierte su usuario en `usuario@estudiantes.incolballet-educa.app`.
2. *Users → Add user → Create new user*: correo `admin@estudiantes.incolballet-educa.app`, una contraseña segura y marca **Auto Confirm User**. Esa es la cuenta administradora (en la plataforma se ingresa con el usuario `admin`).

**3. Conectar el sitio (GitHub → Settings del repositorio)**
1. *Secrets and variables → Actions → Variables → New repository variable*:
   - `SUPABASE_URL`: la *Project URL* (Supabase → Project Settings → API).
   - `SUPABASE_ANON_KEY`: la llave *anon public* de la misma página. Es pública por diseño; la seguridad la dan las políticas de la base de datos.
2. *Pages → Build and deployment → Source*: **GitHub Actions**.
3. Ve a *Actions → Publicar en GitHub Pages → Run workflow* (o haz cualquier cambio en `main`). La dirección queda en `https://<usuario>.github.io/<repositorio>/`.

**4. Primer uso**
Ingresa como `admin`, cambia la contraseña si quieres y crea los estudiantes desde *Estudiantes*. Cada cuenta nueva recibe el usuario y la contraseña inicial que escribas.

**Cómo queda protegida**
- Cada estudiante solo puede leer su propio avance y sus notas; la administración ve todo (Row Level Security).
- Solo la administración puede crear cuentas: un registro que no fue invitado desde el panel se rechaza.
- Las evaluaciones se califican en la base de datos y las respuestas correctas no se publican en el código de la página.
- Las notas del docente, el borrado de estudiantes y el cambio de contraseñas solo funcionan con una sesión de administración.

Si cambias preguntas o lecciones en `public/js/content.js`, ejecuta `node tools/build-supabase-content.js` y vuelve a correr `supabase/02_contenido.sql` en Supabase.

## Ejecutarla en un computador (sin Supabase)

Requisito: Node.js 18 o superior. No hay dependencias que instalar.

```bash
npm start            # o: node server.js
# abre http://localhost:3000
```

En el primer arranque se crea `data/db.json` con estas cuentas:

| Rol | Usuario | Contraseña |
|---|---|---|
| Administración | `admin` | `Incolballet2026` |
| Estudiante de prueba | `estudiante` | `danza2026` |
| Estudiantes de ejemplo (9) | `vrios`, `scaicedo`, … | `ejemplo2026` |

**Antes de usarla con estudiantes reales:** cambia la contraseña de `admin` (menú de usuario → Cambiar contraseña) y elimina los estudiantes de ejemplo desde *Estudiantes → Quitar estudiantes de ejemplo*.

## Qué incluye

**Estudiante**
- Inicio con avance total y botón para continuar donde quedó.
- 3 módulos × 6 lecciones: historia, posiciones y nombres de los pasos, técnica y vocabulario, música, expresión corporal y trabajo en equipo, carrera profesional y marca personal. Cada lección trae vocabulario clave y una práctica sugerida.
- Evaluación de 10 preguntas por módulo, con retroalimentación por pregunta e intentos ilimitados (cuenta el mejor).
- Autoevaluación y página *Mis notas* con el historial.

**Administración**
- Dashboard: estudiantes, nota promedio, % de aprobación, avance promedio, avance y nota por módulo, distribución por desempeño, estudiantes que requieren apoyo y actividad reciente.
- Estudiantes: crear cuentas, buscar y filtrar por grado, ver detalle, registrar notas de desempeño personal y social, restablecer contraseña, eliminar.
- Registros: todo lo que ocurre en la plataforma (lecciones, evaluaciones, notas, altas y bajas).
- Exportación a CSV (Excel / Google Sheets).

## Sistema de evaluación (PEI, Capítulo II)

- Escala de 1.0 a 5.0; nota mínima aprobatoria 3.0.
- Desempeños: Superior 4.7–5.0 · Alto 4.0–4.6 · Básico 3.0–3.9 · Bajo 1.0–2.9.
- Nota del módulo = cognitivo 50 % (mejor intento de la evaluación) + personal 30 % + social 15 % + autoevaluación 5 %. Personal y social los registra el docente desde el panel. Mientras falte algún componente, la nota se muestra como *parcial* (promedio ponderado de lo disponible).
- La nota de un intento es `1 + 4 × (aciertos / total)`.

## Estructura

```
supabase/01_schema.sql  Tablas, seguridad y funciones para Supabase
supabase/02_contenido.sql  Lecciones y respuestas (generado desde content.js)
.github/workflows/pages.yml  Publicación automática en GitHub Pages
server.js               Servidor HTTP + API REST alternativo (sin dependencias), datos en data/db.json
public/index.html       Aplicación
public/css/styles.css   Estilos (Montserrat para títulos, Lexend para lectura; modo claro y oscuro)
public/js/content.js    Contenido de los módulos, preguntas y reglas de calificación  ← editar aquí
public/js/core.js       Reglas de negocio compartidas entre navegador y servidor
public/js/config.js     Conexión con Supabase (URL, llave pública, dominio de correo)
public/js/store.js      Capa de datos: Supabase, server.js o localStorage, en ese orden
public/vendor/          supabase-js 2.76.1
public/js/seed.js       Cuentas y datos de ejemplo iniciales
public/js/app.js        Interfaz
public/assets/          Logos y fotografía
tools/build-preview.js  Genera un HTML único autocontenido (modo demostración, sin servidor)
tools/build-supabase-content.js  Genera supabase/02_contenido.sql
tools/strip-answers.js  Quita las respuestas del contenido publicado (lo usa el workflow)
```

## Editar contenido

Todo el contenido está en `public/js/content.js`. Cada lección tiene `title`, `summary`, `sections` (párrafos `p` y listas `list`), `terms` (vocabulario) y `practice`. Cada pregunta tiene `q` (enunciado), `o` (opciones), `a` (índice de la correcta, desde 0) y `e` (explicación).

## Seguridad y despliegue

- Contraseñas cifradas con scrypt y sal aleatoria; sesiones de 12 horas; límite de 10 intentos de ingreso cada 15 minutos por IP.
- La calificación de las evaluaciones se hace en el servidor.
- Para publicarla en internet: un servidor con Node (Render, Railway, Fly.io, un VPS…) detrás de HTTPS, y copias de seguridad de `data/db.json`. Para cientos de estudiantes simultáneos conviene migrar `data/db.json` a una base de datos (PostgreSQL o SQLite); toda la lógica está en `core.js` y no cambia.

## Modo demostración

Si abres `public/index.html` directamente o usas el HTML generado con `npm run preview`, la plataforma funciona sin servidor y guarda los datos solo en ese navegador (localStorage). Sirve para mostrarla, no para operar con estudiantes reales.
