/* INCOLBALLET EDUCA · interfaz (vanilla JS, sin dependencias) */
(function () {
  const C = window.CONTENT;
  const $app = document.getElementById('app');
  const S = { store: null, user: null, record: null, view: 'home', params: {}, overview: null, flash: null };

  /* ---------- Utilidades ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mod = id => C.MODULES.find(m => m.id === id);
  const mc = id => `--mc: var(--m-${id})`;
  const fmt = n => n == null || isNaN(n) ? '—' : Number(n).toFixed(1);
  const initials = name => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const dateFmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const when = t => dateFmt.format(new Date(t));
  function pill(g) {
    if (!g || g.final == null) return '<span class="pill none">Sin nota</span>';
    return `<span class="pill ${g.level.key}">${g.level.label}${g.partial ? ' · parcial' : ''}</span>`;
  }
  function cover(m) {
    return m.logo
      ? `<img src="${m.logo}" alt="${esc(m.name)}">`
      : `<div class="weave" aria-hidden="true"></div><span class="weave-title">FOLCLOR</span>`;
  }
  function go(view, params) {
    S.view = view; S.params = params || {}; S.flash = null;
    render(); window.scrollTo({ top: 0 });
  }
  async function act(fn, okMsg) {
    try { await fn(); if (okMsg) S.flash = { ok: okMsg }; }
    catch (e) {
      if (e.status === 401) { S.user = null; S.flash = { err: e.message }; }
      else S.flash = { err: e.message || 'Algo salió mal. Inténtalo de nuevo.' };
    }
    render();
  }
  const flash = () => S.flash ? `<div class="${S.flash.err ? 'error' : 'ok-msg'}" role="status">${esc(S.flash.err || S.flash.ok)}</div>` : '';

  /* ---------- Arranque ---------- */
  async function boot() {
    S.store = await Store.detect();
    await S.store.init();
    S.user = await S.store.session();
    if (S.user) await loadData();
    S.view = S.user && S.user.role === 'admin' ? 'dashboard' : 'home';
    render();
  }
  async function loadData() {
    if (S.user.role === 'admin') S.overview = await S.store.overview();
    else S.record = await S.store.myRecord();
  }

  /* ---------- Render principal ---------- */
  function render() {
    if (!S.user) { $app.innerHTML = loginView(); bindLogin(); return; }
    const views = S.user.role === 'admin'
      ? { dashboard: dashboardView, students: studentsView, student: studentDetailView, activity: activityView, account: accountView }
      : { home: homeView, module: moduleView, lesson: lessonView, quiz: quizView, grades: gradesView, account: accountView };
    const body = (views[S.view] || Object.values(views)[0])();
    $app.innerHTML = topbar() + body + footer();
    bindCommon();
  }

  /* ---------- Login ---------- */
  function loginView() {
    const local = S.store.mode === 'local';
    return `
    <div class="login">
      <section class="login-stage">
        <img class="brand-logo" src="assets/logo-incolballet.png" alt="INCOLBALLET, Instituto Colombiano de Ballet Clásico">
        <div style="display:grid;gap:1rem;position:relative;z-index:1">
          <p class="eyebrow" style="color:var(--on-ink-muted)">Plataforma de formación artística</p>
          <h1>INCOLBALLET<span>EDUCA</span></h1>
          <p class="lead">Ballet clásico, danza contemporánea y folclor: historia, técnica, música y carrera profesional en un solo lugar.</p>
        </div>
        <img class="dancer" src="assets/bailarina.png" alt="" aria-hidden="true">
        <img class="allies" src="assets/logos-aliados.png" alt="Gobernación del Valle del Cauca e INCOLBALLET">
      </section>
      <section class="login-form">
        <form class="login-card" id="loginForm" novalidate>
          <div style="display:grid;gap:.4rem">
            <h2>Ingresa a tu aula</h2>
            <p class="muted">Usa el usuario y la contraseña que te entregó la coordinación académica.</p>
          </div>
          ${flash()}
          <div class="field"><label for="lg-user">Usuario</label><input class="input" id="lg-user" name="username" autocomplete="username" required></div>
          <div class="field"><label for="lg-pass">Contraseña</label><input class="input" id="lg-pass" name="password" type="password" autocomplete="current-password" required></div>
          <button class="btn" type="submit" id="lg-submit">Ingresar</button>
          ${local ? `
          <div class="demo-accounts">
            <p class="muted">Cuentas de demostración. Toca una para llenar el formulario:</p>
            <button type="button" data-fill="estudiante|danza2026"><span>Estudiante</span><code>estudiante · danza2026</code></button>
            <button type="button" data-fill="admin|Incolballet2026"><span>Administración</span><code>admin · Incolballet2026</code></button>
          </div>` : ''}
        </form>
      </section>
    </div>`;
  }
  function bindLogin() {
    const f = document.getElementById('loginForm');
    f.querySelectorAll('[data-fill]').forEach(b => b.onclick = () => {
      const [u, p] = b.dataset.fill.split('|'); f.username.value = u; f.password.value = p; f.password.focus();
    });
    f.onsubmit = async e => {
      e.preventDefault();
      if (!f.username.value.trim() || !f.password.value) { S.flash = { err: 'Escribe tu usuario y tu contraseña.' }; return render(); }
      document.getElementById('lg-submit').disabled = true;
      try {
        S.user = await S.store.login(f.username.value, f.password.value);
        await loadData();
        S.flash = null;
        S.view = S.user.role === 'admin' ? 'dashboard' : 'home';
      } catch (err) { S.flash = { err: err.message }; }
      render();
    };
  }

  /* ---------- Marco ---------- */
  function topbar() {
    const items = S.user.role === 'admin'
      ? [['dashboard', 'Dashboard'], ['students', 'Estudiantes'], ['activity', 'Registros']]
      : [['home', 'Inicio'], ...C.MODULES.map(m => ['module:' + m.id, m.short]), ['grades', 'Mis notas']];
    const cur = S.view === 'module' || S.view === 'lesson' || S.view === 'quiz' ? 'module:' + S.params.module : (S.view === 'student' ? 'students' : S.view);
    return `
    <header class="topbar"><div class="wrap">
      <button class="brand" data-go="${S.user.role === 'admin' ? 'dashboard' : 'home'}" aria-label="Inicio">
        <img src="assets/logo-incolballet.png" alt="INCOLBALLET"><b>EDUCA</b>
      </button>
      <nav class="nav" aria-label="Secciones">
        ${items.map(([k, l]) => `<button data-go="${k}" ${k === cur ? 'aria-current="page"' : ''}>${l}</button>`).join('')}
      </nav>
      <div class="usermenu">
        <button id="userBtn" aria-haspopup="true" aria-expanded="false"><span class="who">${esc(S.user.name)}</span><span class="avatar">${esc(initials(S.user.name))}</span></button>
        <div class="menu" id="userMenu" hidden>
          <div class="meta">${S.user.role === 'admin' ? 'Administración' : 'Estudiante' + (S.user.grade ? ' · Grado ' + esc(S.user.grade) : '')}<br>@${esc(S.user.username)}</div>
          <button data-go="account">Cambiar contraseña</button>
          ${S.store.mode === 'local' && S.user.role === 'admin' ? '<button id="resetDemo">Reiniciar datos de demostración</button>' : ''}
          <button id="logoutBtn">Cerrar sesión</button>
        </div>
      </div>
    </div></header>`;
  }
  function footer() {
    return `<footer class="footer"><div class="wrap"><img src="assets/logos-aliados.png" alt="Gobernación del Valle del Cauca e INCOLBALLET"></div></footer>`;
  }
  function bindCommon() {
    $app.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
      const [v, p] = b.dataset.go.split(':');
      if (v === 'module') go('module', { module: p });
      else if (v === 'lesson') { const [m, l] = p.split('/'); go('lesson', { module: m, lesson: l }); }
      else if (v === 'quiz') go('quiz', { module: p });
      else if (v === 'student') go('student', { id: p });
      else go(v);
    }));
    const btn = document.getElementById('userBtn'), menu = document.getElementById('userMenu');
    if (btn) {
      btn.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); };
      document.addEventListener('click', () => { menu.hidden = true; }, { once: true });
      document.getElementById('logoutBtn').onclick = async () => { await S.store.logout(); S.user = null; S.record = S.overview = null; S.flash = null; render(); };
      const rd = document.getElementById('resetDemo');
      if (rd) rd.onclick = async () => { await S.store.resetAll(); S.user = null; S.flash = { ok: 'Datos de demostración restablecidos.' }; render(); };
    }
    const binder = BINDERS[S.view]; if (binder) binder();
    bindTips();
  }

  /* ---------- Estudiante: inicio ---------- */
  function nextStep() {
    for (const m of C.MODULES) {
      const done = (S.record.lessons[m.id] || []);
      const l = m.lessons.find(x => !done.includes(x.id));
      if (l) return { m, l };
      if (!S.record.attempts.some(a => a.module === m.id)) return { m, quiz: true };
    }
    return null;
  }
  function homeView() {
    const progress = C.MODULES.map(m => C.moduleProgress(S.record, m.id));
    const total = Math.round(progress.reduce((s, p) => s + p.pct, 0) / progress.length);
    const nx = nextStep();
    const first = S.user.name.split(' ')[0];
    return `
    <section class="hero"><div class="wrap">
      <div class="stack">
        <p class="eyebrow">Tu formación artística</p>
        <h1>Hola, ${esc(first)}.</h1>
        <p class="lead">Llevas un <b class="num">${total}%</b> del recorrido por los tres módulos.</p>
        <div class="meter" role="progressbar" aria-valuenow="${total}" aria-valuemin="0" aria-valuemax="100" aria-label="Avance total"><i style="width:${total}%"></i></div>
        ${nx ? `<div><button class="btn" data-go="${nx.quiz ? 'quiz:' + nx.m.id : 'lesson:' + nx.m.id + '/' + nx.l.id}">
          ${nx.quiz ? 'Presentar evaluación de ' + esc(nx.m.short) : 'Continuar: ' + esc(nx.l.title)}</button></div>` : '<p class="lead">Completaste todos los módulos. ¡Bravo!</p>'}
      </div>
      <img class="hero-img" src="assets/bailarina.png" alt="" aria-hidden="true">
    </div></section>
    <main class="wrap">
      <div class="section-head"><h2>Módulos</h2><p class="muted">Cada módulo tiene 6 lecciones y una evaluación final.</p></div>
      <div class="modules">
        ${C.MODULES.map((m, i) => {
          const p = progress[i], g = C.moduleGrade(S.record, m.id);
          return `<button class="mcard" style="${mc(m.id)}" data-go="module:${m.id}">
            <div class="cover">${cover(m)}</div>
            <div class="body">
              <div class="row"><h3>${esc(m.name)}</h3><div class="ring" style="--p:${p.pct}"><span>${p.pct}%</span></div></div>
              <p class="tag">${esc(m.tagline)}</p>
              <div class="row"><span class="muted num" style="font-size:.9rem">${p.done}/${p.total} lecciones · ${p.evalDone ? 'evaluación presentada' : 'evaluación pendiente'}</span>${pill(g)}</div>
            </div>
          </button>`;
        }).join('')}
      </div>
    </main>`;
  }

  /* ---------- Estudiante: módulo ---------- */
  function gradeBlock(m, editableSelf) {
    const g = C.moduleGrade(S.record, m.id);
    const rows = [
      ['Evaluación del módulo (cognitivo)', 'cognitive', '50 %'],
      ['Desempeño personal (docente)', 'personal', '30 %'],
      ['Desempeño social (docente)', 'social', '15 %'],
      ['Autoevaluación', 'self', '5 %']
    ];
    return `
      <div class="grade-big"><span class="val">${fmt(g.final)}</span><span class="muted">/ 5.0</span>${pill(g)}</div>
      <div class="parts">
        ${rows.map(([l, k, w]) => {
          const v = g.parts[k];
          return `<div class="part"><span>${l} <span class="muted">· ${w}</span></span><b class="num">${fmt(v)}</b>
            <div class="meter"><i style="width:${v == null ? 0 : (v / 5) * 100}%"></i></div></div>`;
        }).join('')}
      </div>
      ${editableSelf ? `
      <form id="selfForm" class="field" style="gap:.5rem">
        <label for="self-val">Tu autoevaluación (1.0 a 5.0)</label>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <input class="input num" id="self-val" type="number" min="1" max="5" step="0.1" value="${g.parts.self ?? ''}" style="max-width:120px">
          <button class="btn small ghost" type="submit">Guardar</button>
        </div>
        <p class="muted" style="font-size:.88rem">Piensa en tu disciplina, puntualidad, autocuidado y trabajo con tus compañeros.</p>
      </form>` : ''}
      <p class="muted" style="font-size:.85rem">Escala del PEI: Superior 4.7–5.0 · Alto 4.0–4.6 · Básico 3.0–3.9 · Bajo 1.0–2.9. ${g.partial && g.final != null ? 'La nota es parcial hasta tener todos los componentes.' : ''}</p>`;
  }
  function moduleView() {
    const m = mod(S.params.module); if (!m) return homeView();
    const p = C.moduleProgress(S.record, m.id);
    const done = S.record.lessons[m.id] || [];
    const attempts = S.record.attempts.filter(a => a.module === m.id);
    const allDone = p.done === p.total;
    return `
    <section class="hero" style="${mc(m.id)}"><div class="wrap">
      <div class="stack">
        <p class="eyebrow">Módulo</p>
        <h1>${esc(m.name)}</h1>
        <p class="lead">${esc(m.intro)}</p>
        <div class="meter"><i style="width:${p.pct}%;background:var(--mc)"></i></div>
        <p class="num" style="color:var(--on-ink-muted);font-size:.9rem">${p.pct}% completado</p>
      </div>
      ${m.logo ? `<img class="hero-logo" src="${m.logo}" alt="">` : ''}
    </div></section>
    <main class="wrap" style="${mc(m.id)}">
      ${flash()}
      <div class="cols">
        <div style="display:grid;gap:1rem;min-width:0">
          <h2>Lecciones</h2>
          <ol class="steps">
            ${m.lessons.map((l, i) => `<li class="${done.includes(l.id) ? 'done' : ''}"><button data-go="lesson:${m.id}/${l.id}">
              <span class="n">${done.includes(l.id) ? '✓' : i + 1}</span>
              <span><span class="t">${esc(l.title)}</span><br><span class="s">${esc(l.summary)}</span></span>
              <span class="min">${l.minutes} min</span></button></li>`).join('')}
            <li class="${attempts.length ? 'done' : ''}"><button data-go="quiz:${m.id}">
              <span class="n">${attempts.length ? '✓' : '★'}</span>
              <span><span class="t">Evaluación del módulo</span><br><span class="s">${m.quiz.length} preguntas · ${attempts.length ? attempts.length + ' intento(s), mejor nota ' + fmt(Math.max(...attempts.map(a => a.score))) : (allDone ? 'Lista para presentar' : 'Recomendada al terminar las lecciones')}</span></span>
              <span class="min">${attempts.length ? 'Repetir' : 'Presentar'}</span></button></li>
          </ol>
        </div>
        <aside class="panel">
          <p class="eyebrow">Mi nota del módulo</p>
          ${gradeBlock(m, true)}
        </aside>
      </div>
    </main>`;
  }

  /* ---------- Estudiante: lección ---------- */
  function lessonView() {
    const m = mod(S.params.module); const idx = m.lessons.findIndex(l => l.id === S.params.lesson);
    const l = m.lessons[idx]; if (!l) return moduleView();
    const done = (S.record.lessons[m.id] || []).includes(l.id);
    const prev = m.lessons[idx - 1], next = m.lessons[idx + 1];
    return `
    <section class="hero" style="${mc(m.id)}"><div class="wrap"><div class="stack">
      <nav class="crumbs" aria-label="Ruta"><button data-go="module:${m.id}">${esc(m.name)}</button><span>/</span><span>Lección ${idx + 1} de ${m.lessons.length}</span></nav>
      <h1>${esc(l.title)}</h1>
      <p class="lead">${esc(l.summary)} · ${l.minutes} min de lectura</p>
    </div></div></section>
    <main class="wrap" style="${mc(m.id)}">
      <article class="reading">
        ${l.sections.map(s => `<section><h2>${esc(s.h)}</h2>
          ${(s.p || []).map(t => `<p>${esc(t)}</p>`).join('')}
          ${s.list ? `<ul>${s.list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</section>`).join('')}
        <section><h2>Vocabulario clave</h2>
          <dl class="glossary">${l.terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        </section>
        <div class="practice"><p class="eyebrow">Práctica sugerida</p><p>${esc(l.practice)}</p></div>
        <div class="lesson-foot">
          ${prev ? `<button class="btn ghost" data-go="lesson:${m.id}/${prev.id}">← ${esc(prev.title)}</button>` : `<button class="btn ghost" data-go="module:${m.id}">← Volver al módulo</button>`}
          <button class="btn" id="completeBtn" data-next="${next ? 'lesson:' + m.id + '/' + next.id : 'quiz:' + m.id}">
            ${done ? (next ? 'Siguiente lección →' : 'Ir a la evaluación →') : (next ? 'Marcar como completada y seguir →' : 'Completar e ir a la evaluación →')}
          </button>
        </div>
      </article>
    </main>`;
  }

  /* ---------- Estudiante: evaluación ---------- */
  function quizView() {
    const m = mod(S.params.module); if (!m) return homeView();
    const res = S.params.result;
    const review = res ? res.review : null;
    return `
    <section class="hero" style="${mc(m.id)}"><div class="wrap"><div class="stack">
      <nav class="crumbs"><button data-go="module:${m.id}">${esc(m.name)}</button><span>/</span><span>Evaluación</span></nav>
      <h1>Evaluación: ${esc(m.short)}</h1>
      <p class="lead">${m.quiz.length} preguntas. Tu mejor intento cuenta como el 50 % (desempeño cognitivo) de la nota del módulo, según el sistema de evaluación del PEI.</p>
    </div></div></section>
    <main class="wrap" style="${mc(m.id)}">
      ${res ? `<div class="panel" style="max-width:760px">
        <p class="eyebrow">Resultado</p>
        <div class="grade-big"><span class="val">${fmt(res.score)}</span><span class="muted">/ 5.0 · ${res.correct} de ${res.total} correctas</span>
          <span class="pill ${C.level(res.score).key}">${C.level(res.score).label}</span></div>
        <p>${res.score >= C.PASS ? 'Aprobaste la evaluación. Revisa abajo las explicaciones para afianzar lo aprendido.' : 'Todavía no alcanzas la nota mínima de 3.0. Repasa las lecciones y vuelve a intentarlo.'}</p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn" data-go="module:${m.id}">Volver al módulo</button><button class="btn ghost" data-go="quiz:${m.id}">Intentar de nuevo</button></div>
      </div>` : ''}
      <form class="quiz" id="quizForm">
        ${m.quiz.map((q, i) => `<div class="q"><fieldset ${res ? 'disabled' : ''}>
          <legend>${i + 1}. ${esc(q.q)}</legend>
          ${q.o.map((o, j) => {
            let cls = '';
            if (review) { if (j === review[i].answer) cls = 'correct'; else if (review[i].chosen === j) cls = 'wrong'; }
            return `<label class="opt ${cls}"><input type="radio" name="q${i}" value="${j}" ${review && review[i].chosen === j ? 'checked' : ''}><span>${esc(o)}</span></label>`;
          }).join('')}
          ${review ? `<p class="explain">${review[i].ok ? '✓ Correcta.' : '✗ Incorrecta.'} ${esc(review[i].explain)}</p>` : ''}
        </fieldset></div>`).join('')}
        ${res ? '' : `<div class="sticky-submit"><span class="muted num" id="answered">0 de ${m.quiz.length} respondidas</span><button class="btn" type="submit" id="quizSubmit" disabled>Enviar evaluación</button></div>`}
      </form>
    </main>`;
  }

  /* ---------- Estudiante: notas ---------- */
  function gradesView() {
    const attempts = S.record.attempts.slice().sort((a, b) => b.at - a.at);
    return `
    <section class="hero"><div class="wrap"><div class="stack">
      <p class="eyebrow">Registro académico</p><h1>Mis notas</h1>
      <p class="lead">La nota de cada módulo combina, como indica el PEI, el desempeño cognitivo (50 %), personal (30 %), social (15 %) y tu autoevaluación (5 %).</p>
    </div></div></section>
    <main class="wrap">
      <div class="table-wrap"><table>
        <thead><tr><th>Módulo</th><th class="num">Avance</th><th class="num">Cognitivo</th><th class="num">Personal</th><th class="num">Social</th><th class="num">Autoeval.</th><th class="num">Nota</th><th>Desempeño</th></tr></thead>
        <tbody>${C.MODULES.map(m => {
          const g = C.moduleGrade(S.record, m.id), p = C.moduleProgress(S.record, m.id);
          return `<tr class="clickable" data-go="module:${m.id}" style="${mc(m.id)}"><td><span class="cell-mod"><span class="dot"></span><b>${esc(m.name)}</b></span></td>
            <td class="num">${p.pct}%</td><td class="num">${fmt(g.parts.cognitive)}</td><td class="num">${fmt(g.parts.personal)}</td><td class="num">${fmt(g.parts.social)}</td><td class="num">${fmt(g.parts.self)}</td>
            <td class="num"><b>${fmt(g.final)}</b></td><td>${pill(g)}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
      <h2>Historial de evaluaciones</h2>
      ${attempts.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Fecha</th><th>Módulo</th><th class="num">Aciertos</th><th class="num">Nota</th><th>Desempeño</th></tr></thead>
        <tbody>${attempts.map(a => `<tr style="${mc(a.module)}"><td class="num" style="text-align:left;white-space:nowrap">${when(a.at)}</td><td><span class="cell-mod"><span class="dot"></span>${esc(mod(a.module).name)}</span></td>
          <td class="num">${a.correct}/${a.total}</td><td class="num"><b>${fmt(a.score)}</b></td><td><span class="pill ${C.level(a.score).key}">${C.level(a.score).label}</span></td></tr>`).join('')}</tbody>
      </table></div>` : '<div class="panel empty">Aún no has presentado evaluaciones. Termina las lecciones de un módulo y presenta su evaluación.</div>'}
    </main>`;
  }

  /* ---------- Cuenta ---------- */
  function accountView() {
    return `
    <section class="hero"><div class="wrap"><div class="stack"><p class="eyebrow">Cuenta</p><h1>Cambiar contraseña</h1></div></div></section>
    <main class="wrap"><form class="panel" id="pwForm" style="max-width:460px">
      ${flash()}
      <div class="field"><label for="pw-old">Contraseña actual</label><input class="input" id="pw-old" type="password" autocomplete="current-password"></div>
      <div class="field"><label for="pw-new">Nueva contraseña (mínimo 6 caracteres)</label><input class="input" id="pw-new" type="password" autocomplete="new-password"></div>
      <button class="btn" type="submit">Guardar contraseña</button>
    </form></main>`;
  }

  /* ---------- Admin: cálculos ---------- */
  function stats() {
    const st = S.overview.students;
    const perModule = C.MODULES.map(m => {
      const grades = st.map(s => C.moduleGrade(s.record, m.id));
      const prog = st.map(s => C.moduleProgress(s.record, m.id).pct);
      const graded = grades.filter(g => g.final != null);
      const dist = { superior: 0, alto: 0, basico: 0, bajo: 0, none: st.length - graded.length };
      graded.forEach(g => dist[g.level.key]++);
      return {
        m, avgProg: prog.length ? Math.round(prog.reduce((a, b) => a + b, 0) / prog.length) : 0,
        avgGrade: graded.length ? C.round1(graded.reduce((a, g) => a + g.final, 0) / graded.length) : null,
        graded: graded.length, dist
      };
    });
    const allGrades = st.flatMap(s => C.MODULES.map(m => C.moduleGrade(s.record, m.id)).filter(g => g.final != null));
    const avg = allGrades.length ? C.round1(allGrades.reduce((a, g) => a + g.final, 0) / allGrades.length) : null;
    const passRate = allGrades.length ? Math.round(100 * allGrades.filter(g => g.final >= C.PASS).length / allGrades.length) : null;
    const avgProg = perModule.length ? Math.round(perModule.reduce((a, p) => a + p.avgProg, 0) / perModule.length) : 0;
    const support = st.map(s => {
      const gs = C.MODULES.map(m => ({ m, g: C.moduleGrade(s.record, m.id) })).filter(x => x.g.final != null && x.g.final < C.PASS);
      return { s, gs };
    }).filter(x => x.gs.length);
    return { perModule, avg, passRate, avgProg, support, count: st.length, gradedCount: allGrades.length };
  }

  /* ---------- Admin: dashboard ---------- */
  const LEVELS = [['superior', 'Superior', 'var(--seq-4)'], ['alto', 'Alto', 'var(--seq-3)'], ['basico', 'Básico', 'var(--seq-2)'], ['bajo', 'Bajo', 'var(--seq-1)'], ['none', 'Sin nota', 'var(--surface-2)']];
  function dashboardView() {
    const s = stats();
    const hasSamples = S.overview.students.some(x => x.user.sample);
    return `
    <section class="hero"><div class="wrap"><div class="stack">
      <p class="eyebrow">Administración</p><h1>Dashboard de resultados</h1>
      <p class="lead">Avance y desempeño de los estudiantes en los tres módulos, con la escala de valoración del PEI (1.0 a 5.0, mínima aprobatoria 3.0).</p>
    </div></div></section>
    <main class="wrap">
      ${flash()}
      ${hasSamples ? `<div class="notice">Incluye estudiantes de ejemplo para que veas el tablero con datos. Puedes eliminarlos desde <button class="link" data-go="students">Estudiantes</button>.</div>` : ''}
      <div class="kpis">
        <div class="kpi"><span class="eyebrow">Estudiantes</span><span class="v">${s.count}</span><span class="d">con cuenta activa</span></div>
        <div class="kpi"><span class="eyebrow">Nota promedio</span><span class="v">${fmt(s.avg)}</span><span class="d">${s.avg != null ? 'Desempeño ' + C.level(s.avg).label.toLowerCase() : 'sin notas aún'}</span></div>
        <div class="kpi"><span class="eyebrow">Aprobación</span><span class="v">${s.passRate == null ? '—' : s.passRate + '%'}</span><span class="d">de ${s.gradedCount} notas de módulo ≥ 3.0</span></div>
        <div class="kpi"><span class="eyebrow">Avance promedio</span><span class="v">${s.avgProg}%</span><span class="d">lecciones y evaluaciones</span></div>
      </div>
      <div class="cols even">
        <section class="panel"><div><h3>Avance promedio por módulo</h3><p class="muted" style="font-size:.88rem">Porcentaje de lecciones y evaluación completadas</p></div>
          <div class="bars">${s.perModule.map(p => `<div class="bar-row" style="${mc(p.m.id)}"><span class="lbl">${esc(p.m.short)}</span>
            <div class="bar-track" data-tip="${esc(p.m.name)}: ${p.avgProg}% de avance promedio"><i style="width:${p.avgProg}%"></i></div><span class="val">${p.avgProg}%</span></div>`).join('')}</div>
          <div class="axis"><span></span><span class="scale"><span>0%</span><span>50%</span><span>100%</span></span><span></span></div>
        </section>
        <section class="panel"><div><h3>Nota promedio por módulo</h3><p class="muted" style="font-size:.88rem">Escala 1.0 a 5.0 · la marca indica la mínima aprobatoria (3.0)</p></div>
          <div class="bars">${s.perModule.map(p => `<div class="bar-row" style="${mc(p.m.id)}"><span class="lbl">${esc(p.m.short)}</span>
            <div class="bar-track" data-tip="${esc(p.m.name)}: ${fmt(p.avgGrade)} promedio de ${p.graded} estudiante(s)"><i style="width:${p.avgGrade == null ? 0 : ((p.avgGrade - 1) / 4) * 100}%"></i><span class="tick" style="left:50%"></span></div><span class="val">${fmt(p.avgGrade)}</span></div>`).join('')}</div>
          <div class="axis"><span></span><span class="scale"><span>1.0</span><span>3.0</span><span>5.0</span></span><span></span></div>
        </section>
      </div>
      <section class="panel"><div><h3>Distribución por desempeño</h3><p class="muted" style="font-size:.88rem">Número de estudiantes en cada nivel del PEI, por módulo</p></div>
        <div class="legend">${LEVELS.map(([, l, c]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}</div>
        <div class="bars">${s.perModule.map(p => `<div class="bar-row" style="${mc(p.m.id)}"><span class="lbl">${esc(p.m.short)}</span>
          <div class="stackbar">${LEVELS.filter(([k]) => p.dist[k]).map(([k, l, c]) => `<i style="flex:${p.dist[k]};background:${c}" data-tip="${esc(p.m.short)} · ${l}: ${p.dist[k]} estudiante(s)"></i>`).join('') || '<i style="flex:1;background:var(--surface-2)"></i>'}</div>
          <span class="val">${s.count}</span></div>`).join('')}</div>
        <div class="table-wrap"><table><thead><tr><th>Módulo</th>${LEVELS.map(([, l]) => `<th class="num">${l}</th>`).join('')}</tr></thead>
          <tbody>${s.perModule.map(p => `<tr><td>${esc(p.m.name)}</td>${LEVELS.map(([k]) => `<td class="num">${p.dist[k]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      </section>
      <div class="cols">
        <section class="panel"><h3>Estudiantes que requieren apoyo</h3>
          ${s.support.length ? `<div class="table-wrap"><table><thead><tr><th>Estudiante</th><th>Grado</th><th>Módulos por debajo de 3.0</th></tr></thead><tbody>
            ${s.support.map(x => `<tr class="clickable" data-go="student:${x.s.user.id}"><td><b>${esc(x.s.user.name)}</b></td><td>${esc(x.s.user.grade)}</td>
              <td>${x.gs.map(g => `<span class="pill bajo" style="margin-right:.3rem">${esc(g.m.short)} ${fmt(g.g.final)}</span>`).join('')}</td></tr>`).join('')}
          </tbody></table></div>` : '<p class="muted">Ningún estudiante tiene notas por debajo de 3.0.</p>'}
        </section>
        <section class="panel"><div class="section-head"><h3>Actividad reciente</h3><button class="link" data-go="activity">Ver todo</button></div>
          ${feed(S.overview.activity.slice(0, 7))}
        </section>
      </div>
    </main>`;
  }
  const TYPE_LABEL = { lesson: 'Completó lección', eval: 'Presentó evaluación', self: 'Autoevaluación', marks: 'Registró notas', user: 'Usuarios' };
  function feed(list) {
    if (!list.length) return '<p class="muted">Todavía no hay actividad.</p>';
    return `<ul class="feed">${list.map(a => `<li style="${a.module ? mc(a.module) : ''}"><span class="dot"></span>
      <span><b>${esc(a.name)}</b> · ${TYPE_LABEL[a.type] || a.type}${a.module ? ' de ' + esc(mod(a.module).short) : ''}<br><span class="muted">${esc(a.detail)}</span></span>
      <span class="muted num when">${when(a.at)}</span></li>`).join('')}</ul>`;
  }

  /* ---------- Admin: estudiantes ---------- */
  function studentsView() {
    const q = (S.params.q || '').toLowerCase(), grade = S.params.grade || '';
    const all = S.overview.students;
    const grades = [...new Set(all.map(s => s.user.grade).filter(Boolean))].sort();
    const list = all.filter(s => (!q || (s.user.name + ' ' + s.user.username).toLowerCase().includes(q)) && (!grade || s.user.grade === grade))
      .sort((a, b) => a.user.name.localeCompare(b.user.name, 'es'));
    const samples = all.filter(s => s.user.sample).length;
    return `
    <section class="hero"><div class="wrap"><div class="stack">
      <p class="eyebrow">Administración</p><h1>Estudiantes</h1>
      <p class="lead">Registros, puntajes y avance de cada estudiante. Toca una fila para ver el detalle y registrar las notas del docente.</p>
    </div></div></section>
    <main class="wrap">
      ${flash()}
      <form class="panel" id="newStudent">
        <h3>Crear cuenta de estudiante</h3>
        <div class="form-grid">
          <div class="field"><label for="ns-name">Nombre completo</label><input class="input" id="ns-name" name="name" placeholder="Ej. Laura Gómez"></div>
          <div class="field"><label for="ns-user">Usuario</label><input class="input" id="ns-user" name="username" placeholder="lgomez" autocomplete="off"></div>
          <div class="field"><label for="ns-pass">Contraseña inicial</label><input class="input" id="ns-pass" name="password" placeholder="mínimo 6 caracteres" autocomplete="new-password"></div>
          <div class="field"><label for="ns-grade">Grado (año de danza)</label><select class="input" id="ns-grade" name="grade">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(g => `<option>${g}</option>`).join('')}</select></div>
          <button class="btn" type="submit">Crear</button>
        </div>
      </form>
      <div class="toolbar">
        <input class="input" id="st-q" type="search" placeholder="Buscar por nombre o usuario" value="${esc(S.params.q || '')}" aria-label="Buscar estudiante">
        <select class="input" id="st-grade" style="flex:0 1 160px" aria-label="Filtrar por grado"><option value="">Todos los grados</option>${grades.map(g => `<option ${g === grade ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
        <button class="btn ghost small" id="exportBtn" type="button">${S.store.mode === 'local' ? 'Copiar CSV' : 'Descargar CSV'}</button>
        ${samples ? (S.params.confirmSamples
          ? `<span class="inline-confirm">¿Eliminar ${samples} estudiantes de ejemplo? <button class="btn danger small" id="samplesYes" type="button">Eliminar</button><button class="btn ghost small" data-go="students" type="button">Cancelar</button></span>`
          : `<button class="btn ghost small" id="samplesBtn" type="button">Quitar estudiantes de ejemplo (${samples})</button>`) : ''}
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Estudiante</th><th>Grado</th>${C.MODULES.map(m => `<th>${esc(m.short)}</th>`).join('')}<th class="num">Promedio</th></tr></thead>
        <tbody>${list.map(({ user, record }) => {
          const gs = C.MODULES.map(m => C.moduleGrade(record, m.id)).filter(g => g.final != null);
          const avg = gs.length ? C.round1(gs.reduce((a, g) => a + g.final, 0) / gs.length) : null;
          return `<tr class="clickable" data-go="student:${user.id}"><td><b>${esc(user.name)}</b> ${user.sample ? '<span class="pill sample">ejemplo</span>' : ''}<br><span class="muted" style="font-size:.85rem">@${esc(user.username)}</span></td>
            <td>${esc(user.grade)}</td>
            ${C.MODULES.map(m => { const p = C.moduleProgress(record, m.id), g = C.moduleGrade(record, m.id);
              return `<td style="${mc(m.id)}"><span class="cell-mod"><span class="mini"><i style="width:${p.pct}%"></i></span><span class="num" style="font-size:.85rem">${p.pct}%</span>${g.final != null ? `<b class="num">${fmt(g.final)}</b>` : ''}</span></td>`; }).join('')}
            <td class="num"><b>${fmt(avg)}</b></td></tr>`;
        }).join('') || `<tr><td colspan="${3 + C.MODULES.length}" class="empty">No hay estudiantes con ese filtro.</td></tr>`}</tbody>
      </table></div>
      <textarea id="csvOut" class="input" rows="4" hidden readonly aria-label="CSV"></textarea>
    </main>`;
  }
  function buildCsv() {
    const head = ['Estudiante', 'Usuario', 'Grado'];
    C.MODULES.forEach(m => head.push(m.short + ' avance %', m.short + ' cognitivo', m.short + ' personal', m.short + ' social', m.short + ' autoevaluación', m.short + ' nota', m.short + ' desempeño'));
    const rows = [head].concat(S.overview.students.map(({ user, record }) => {
      const r = [user.name, user.username, user.grade];
      C.MODULES.forEach(m => { const g = C.moduleGrade(record, m.id), p = C.moduleProgress(record, m.id);
        r.push(p.pct, g.parts.cognitive ?? '', g.parts.personal ?? '', g.parts.social ?? '', g.parts.self ?? '', g.final ?? '', g.level ? g.level.label : ''); });
      return r;
    }));
    return rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  }

  /* ---------- Admin: detalle ---------- */
  function studentDetailView() {
    const s = S.overview.students.find(x => x.user.id === S.params.id);
    if (!s) { S.view = 'students'; return studentsView(); }
    const { user, record } = s;
    const attempts = record.attempts.slice().sort((a, b) => b.at - a.at);
    const acts = S.overview.activity.filter(a => a.userId === user.id).slice(0, 10);
    return `
    <section class="hero"><div class="wrap"><div class="stack">
      <nav class="crumbs"><button data-go="students">Estudiantes</button><span>/</span><span>${esc(user.name)}</span></nav>
      <h1>${esc(user.name)}</h1>
      <p class="lead">@${esc(user.username)} · Grado ${esc(user.grade || '—')} · Cuenta creada el ${when(user.createdAt)}</p>
    </div></div></section>
    <main class="wrap">
      ${flash()}
      <div class="marks-grid">
        ${C.MODULES.map(m => {
          const g = C.moduleGrade(record, m.id), p = C.moduleProgress(record, m.id);
          return `<form class="panel marks-form" data-module="${m.id}" style="${mc(m.id)}">
            <div class="section-head"><h3>${esc(m.name)}</h3>${pill(g)}</div>
            <div class="grade-big"><span class="val" style="font-size:2.2rem">${fmt(g.final)}</span><span class="muted num">· avance ${p.pct}%</span></div>
            <div class="parts">
              <div class="part"><span>Lecciones</span><b class="num">${p.done}/${p.total}</b></div>
              <div class="part"><span>Cognitivo (mejor intento) · 50 %</span><b class="num">${fmt(g.parts.cognitive)}</b></div>
              <div class="part"><span>Autoevaluación · 5 %</span><b class="num">${fmt(g.parts.self)}</b></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem">
              <div class="field"><label for="mk-p-${m.id}">Personal · 30 %</label><input class="input num" id="mk-p-${m.id}" name="personal" type="number" min="1" max="5" step="0.1" value="${g.parts.personal ?? ''}"></div>
              <div class="field"><label for="mk-s-${m.id}">Social · 15 %</label><input class="input num" id="mk-s-${m.id}" name="social" type="number" min="1" max="5" step="0.1" value="${g.parts.social ?? ''}"></div>
            </div>
            <button class="btn small" type="submit">Guardar notas del docente</button>
          </form>`;
        }).join('')}
      </div>
      <div class="cols">
        <section class="panel"><h3>Intentos de evaluación</h3>
          ${attempts.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Módulo</th><th class="num">Aciertos</th><th class="num">Nota</th></tr></thead><tbody>
            ${attempts.map(a => `<tr style="${mc(a.module)}"><td class="num" style="text-align:left;white-space:nowrap">${when(a.at)}</td><td><span class="cell-mod"><span class="dot"></span>${esc(mod(a.module).short)}</span></td><td class="num">${a.correct}/${a.total}</td><td class="num"><b>${fmt(a.score)}</b></td></tr>`).join('')}
          </tbody></table></div>` : '<p class="muted">Sin evaluaciones presentadas.</p>'}
          <h3>Actividad</h3>${feed(acts)}
        </section>
        <aside class="panel">
          <h3>Cuenta</h3>
          <form id="resetPw" class="field"><label for="rp-pass">Nueva contraseña</label>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap"><input class="input" id="rp-pass" autocomplete="new-password" style="flex:1 1 140px"><button class="btn small ghost" type="submit">Restablecer</button></div></form>
          ${S.params.confirmDelete
            ? `<div class="inline-confirm">Se borrarán la cuenta y todos sus registros. <button class="btn danger small" id="delYes" type="button">Eliminar</button><button class="btn ghost small" data-go="student:${user.id}" type="button">Cancelar</button></div>`
            : `<button class="btn ghost small" id="delBtn" type="button" style="justify-self:start">Eliminar estudiante</button>`}
        </aside>
      </div>
    </main>`;
  }

  /* ---------- Admin: registros ---------- */
  function activityView() {
    const t = S.params.type || '', m = S.params.module || '';
    const list = S.overview.activity.filter(a => (!t || a.type === t) && (!m || a.module === m));
    return `
    <section class="hero"><div class="wrap"><div class="stack">
      <p class="eyebrow">Administración</p><h1>Registros</h1>
      <p class="lead">Cada lección completada, evaluación presentada y nota registrada, en orden cronológico.</p>
    </div></div></section>
    <main class="wrap">
      <div class="toolbar">
        <select class="input" id="ac-type" style="flex:0 1 220px" aria-label="Tipo"><option value="">Todos los tipos</option>${Object.entries(TYPE_LABEL).map(([k, l]) => `<option value="${k}" ${k === t ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <select class="input" id="ac-mod" style="flex:0 1 220px" aria-label="Módulo"><option value="">Todos los módulos</option>${C.MODULES.map(x => `<option value="${x.id}" ${x.id === m ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
        <span class="muted num">${list.length} registros</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Módulo</th><th>Detalle</th></tr></thead>
        <tbody>${list.slice(0, 200).map(a => `<tr style="${a.module ? mc(a.module) : ''}"><td class="num" style="white-space:nowrap">${when(a.at)}</td><td><b>${esc(a.name)}</b></td><td>${TYPE_LABEL[a.type] || a.type}</td>
          <td>${a.module ? `<span class="cell-mod"><span class="dot"></span>${esc(mod(a.module).short)}</span>` : '—'}</td><td>${esc(a.detail)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">Sin registros.</td></tr>'}</tbody>
      </table></div>
    </main>`;
  }

  /* ---------- Eventos por vista ---------- */
  const BINDERS = {
    module() {
      const f = document.getElementById('selfForm');
      if (f) f.onsubmit = e => { e.preventDefault(); act(async () => { S.record = await S.store.setSelf(S.params.module, f.querySelector('input').value); }, 'Autoevaluación guardada.'); };
    },
    lesson() {
      const b = document.getElementById('completeBtn');
      b.onclick = async () => {
        b.disabled = true;
        try { S.record = await S.store.completeLesson(S.params.module, S.params.lesson); }
        catch (e) { S.flash = { err: e.message }; return render(); }
        const [v, p] = b.dataset.next.split(':');
        if (v === 'quiz') go('quiz', { module: p }); else { const [m, l] = p.split('/'); go('lesson', { module: m, lesson: l }); }
      };
    },
    quiz() {
      const f = document.getElementById('quizForm'); if (!f || S.params.result) return;
      const m = mod(S.params.module);
      const count = () => m.quiz.filter((_, i) => f.querySelector(`input[name="q${i}"]:checked`)).length;
      f.onchange = () => { const n = count(); document.getElementById('answered').textContent = `${n} de ${m.quiz.length} respondidas`; document.getElementById('quizSubmit').disabled = n < m.quiz.length; };
      f.onsubmit = async e => {
        e.preventDefault();
        const answers = m.quiz.map((_, i) => { const c = f.querySelector(`input[name="q${i}"]:checked`); return c ? Number(c.value) : null; });
        try { const out = await S.store.submitEval(m.id, answers); S.record = out.record; S.params.result = out.result; }
        catch (err) { S.flash = { err: err.message }; }
        render(); window.scrollTo({ top: 0 });
      };
    },
    account() {
      const f = document.getElementById('pwForm');
      f.onsubmit = e => { e.preventDefault(); act(() => S.store.changePassword(f.querySelector('#pw-old').value, f.querySelector('#pw-new').value), 'Contraseña actualizada.'); };
    },
    students() {
      const f = document.getElementById('newStudent');
      f.onsubmit = e => {
        e.preventDefault();
        const data = { name: f.name.value, username: f.username.value, password: f.password.value, grade: f.grade.value };
        act(async () => { const u = await S.store.createStudent(data); S.overview = await S.store.overview(); S.flash = null; return u; }, 'Cuenta creada para ' + data.name.trim() + '. Comparte el usuario y la contraseña inicial con el estudiante.');
      };
      const q = document.getElementById('st-q');
      q.oninput = () => { S.params.q = q.value; const pos = q.selectionStart; render(); const n = document.getElementById('st-q'); n.focus(); n.setSelectionRange(pos, pos); };
      document.getElementById('st-grade').onchange = e => { S.params.grade = e.target.value; render(); };
      document.getElementById('exportBtn').onclick = async () => {
        if (S.store.mode === 'server') { window.location.href = 'api/admin/export.csv?token=' + encodeURIComponent(localStorage.getItem('incol-educa-session-token') || ''); return; }
        const csv = buildCsv(), out = document.getElementById('csvOut');
        if (S.store.mode === 'supabase') {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
          a.download = 'incolballet-educa-notas.csv'; document.body.appendChild(a); a.click(); a.remove();
          return;
        }
        try { await navigator.clipboard.writeText(csv); S.flash = { ok: 'CSV copiado. Pégalo en Excel o Google Sheets.' }; render(); }
        catch (e) { out.hidden = false; out.value = csv; out.select(); }
      };
      const sb = document.getElementById('samplesBtn'); if (sb) sb.onclick = () => { S.params.confirmSamples = true; render(); };
      const sy = document.getElementById('samplesYes');
      if (sy) sy.onclick = () => act(async () => { const n = await S.store.removeSamples(); S.overview = await S.store.overview(); S.params.confirmSamples = false; S.flash = { ok: n + ' estudiantes de ejemplo eliminados.' }; });
    },
    student() {
      document.querySelectorAll('.marks-form').forEach(f => f.onsubmit = e => {
        e.preventDefault();
        act(async () => { await S.store.setMarks(S.params.id, f.dataset.module, { personal: f.personal.value, social: f.social.value }); S.overview = await S.store.overview(); }, 'Notas guardadas para ' + mod(f.dataset.module).name + '.');
      });
      const rp = document.getElementById('resetPw');
      rp.onsubmit = e => { e.preventDefault(); act(() => S.store.resetPassword(S.params.id, rp.querySelector('input').value), 'Contraseña restablecida.'); };
      const db = document.getElementById('delBtn'); if (db) db.onclick = () => { S.params.confirmDelete = true; render(); };
      const dy = document.getElementById('delYes');
      if (dy) dy.onclick = () => act(async () => { await S.store.deleteStudent(S.params.id); S.overview = await S.store.overview(); S.view = 'students'; S.params = {}; }, 'Estudiante eliminado.');
    },
    activity() {
      document.getElementById('ac-type').onchange = e => { S.params.type = e.target.value; render(); };
      document.getElementById('ac-mod').onchange = e => { S.params.module = e.target.value; render(); };
    },
    async dashboard() { /* datos cargados en overview */ }
  };

  /* ---------- Tooltips de las gráficas ---------- */
  let tipEl;
  function bindTips() {
    $app.querySelectorAll('[data-tip]').forEach(el => {
      el.addEventListener('mousemove', e => {
        if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tip'; document.body.appendChild(tipEl); }
        tipEl.textContent = el.dataset.tip; tipEl.hidden = false;
        tipEl.style.left = Math.min(e.clientX + 12, window.innerWidth - 250) + 'px'; tipEl.style.top = (e.clientY + 14) + 'px';
      });
      el.addEventListener('mouseleave', () => { if (tipEl) tipEl.hidden = true; });
    });
  }

  // Refresca los datos del panel al volver al dashboard
  const _go = go;
  go = function (view, params) {
    if (S.user && S.user.role === 'admin' && ['dashboard', 'students', 'activity'].includes(view)) {
      S.store.overview().then(o => { S.overview = o; _go(view, params); }).catch(() => _go(view, params));
    } else _go(view, params);
  };

  boot().catch(e => { $app.innerHTML = `<div class="wrap" style="padding:3rem 0"><div class="error">No se pudo iniciar la plataforma: ${esc(e.message)}</div></div>`; });
})();
