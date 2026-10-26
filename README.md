# INCOLBALLET EDUCA

Plataforma de formación artística con tres módulos (Ballet Clásico, Danza Contemporánea y Folclor y Danza Nacional), inicio de sesión con usuario y contraseña, avance por lección, evaluaciones calificadas y un panel de administración con registros y dashboard. El contenido y el sistema de evaluación toman como referente el PEI INCOLBALLET 2025-2026.

## Cómo ejecutarla

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
server.js               Servidor HTTP + API REST (sin dependencias), datos en data/db.json
public/index.html       Aplicación
public/css/styles.css   Estilos (Montserrat para títulos, Lexend para lectura; modo claro y oscuro)
public/js/content.js    Contenido de los módulos, preguntas y reglas de calificación  ← editar aquí
public/js/core.js       Reglas de negocio compartidas entre navegador y servidor
public/js/store.js      Capa de datos: usa el servidor si existe, si no localStorage
public/js/seed.js       Cuentas y datos de ejemplo iniciales
public/js/app.js        Interfaz
public/assets/          Logos y fotografía
tools/build-preview.js  Genera un HTML único autocontenido (modo demostración, sin servidor)
```

## Editar contenido

Todo el contenido está en `public/js/content.js`. Cada lección tiene `title`, `summary`, `sections` (párrafos `p` y listas `list`), `terms` (vocabulario) y `practice`. Cada pregunta tiene `q` (enunciado), `o` (opciones), `a` (índice de la correcta, desde 0) y `e` (explicación).

## Seguridad y despliegue

- Contraseñas cifradas con scrypt y sal aleatoria; sesiones de 12 horas; límite de 10 intentos de ingreso cada 15 minutos por IP.
- La calificación de las evaluaciones se hace en el servidor.
- Para publicarla en internet: un servidor con Node (Render, Railway, Fly.io, un VPS…) detrás de HTTPS, y copias de seguridad de `data/db.json`. Para cientos de estudiantes simultáneos conviene migrar `data/db.json` a una base de datos (PostgreSQL o SQLite); toda la lógica está en `core.js` y no cambia.

## Modo demostración

Si abres `public/index.html` directamente o usas el HTML generado con `npm run preview`, la plataforma funciona sin servidor y guarda los datos solo en ese navegador (localStorage). Sirve para mostrarla, no para operar con estudiantes reales.
