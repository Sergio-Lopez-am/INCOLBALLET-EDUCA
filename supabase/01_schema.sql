-- INCOLBALLET EDUCA · Esquema de base de datos para Supabase
-- Ejecutar completo en: Supabase → SQL Editor → New query → Run.
-- Después ejecutar 02_contenido.sql (llaves de las evaluaciones y lecciones).
--
-- Seguridad:
--  * Row Level Security en todas las tablas: cada estudiante solo ve sus registros;
--    el rol admin ve todo.
--  * Las escrituras pasan por funciones (RPC) que validan permisos y datos.
--  * Las respuestas correctas viven en quiz_keys, que nadie puede leer desde la app:
--    la calificación se hace en la base de datos.
--  * Solo se pueden crear cuentas invitadas por un administrador (tabla invites).

create extension if not exists pgcrypto with schema extensions;

-- ───────────────────────────── Tablas ─────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  name       text not null,
  role       text not null default 'student' check (role in ('student', 'admin')),
  grade      text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.invites (
  username   text primary key,
  name       text not null,
  grade      text not null default '',
  role       text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id      text primary key,
  lessons jsonb not null            -- { "b1": "Historia del ballet", ... }
);

create table if not exists public.quiz_keys (
  module text not null references public.modules(id) on delete cascade,
  idx    int  not null,             -- posición de la pregunta, desde 0
  answer int  not null,             -- índice de la opción correcta, desde 0
  explanation text not null default '',
  primary key (module, idx)
);

create table if not exists public.lesson_progress (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  module       text not null references public.modules(id),
  lesson       text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, module, lesson)
);

create table if not exists public.attempts (
  id      bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  module  text not null references public.modules(id),
  correct int  not null,
  total   int  not null,
  score   numeric(2,1) not null check (score between 1 and 5),
  answers int[] not null,
  at      timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.attempts(user_id);

create table if not exists public.marks (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  module   text not null references public.modules(id),
  personal numeric(2,1) check (personal between 1 and 5),
  social   numeric(2,1) check (social between 1 and 5),
  self     numeric(2,1) check (self between 1 and 5),
  primary key (user_id, module)
);

create table if not exists public.activity (
  id      bigint generated always as identity primary key,
  at      timestamptz not null default now(),
  user_id uuid references public.profiles(id) on delete cascade,
  type    text not null,
  module  text,
  detail  text not null default ''
);
create index if not exists activity_at_idx on public.activity(at desc);

-- ───────────────────────────── Utilidades ─────────────────────────────
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public._require_user() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null or not exists (select 1 from profiles where id = auth.uid()) then
    raise exception 'Tu sesión terminó. Vuelve a ingresar.' using errcode = '28000';
  end if;
  return auth.uid();
end $$;

create or replace function public._require_admin() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'No tienes permiso para esta acción.' using errcode = '42501';
  end if;
  return auth.uid();
end $$;

create or replace function public._check_mark(v numeric) returns numeric
language plpgsql immutable as $$
begin
  if v is null then return null; end if;
  if v < 1 or v > 5 then raise exception 'Las notas van de 1.0 a 5.0'; end if;
  return round(v, 1);
end $$;

-- ───────────────────────────── Alta de usuarios ─────────────────────────────
-- Se ejecuta cuando Supabase Auth crea un usuario. Solo acepta usuarios invitados.
-- El nombre de usuario es la parte del correo antes de la @.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_username text := lower(split_part(new.email, '@', 1));
  inv invites%rowtype;
begin
  select * into inv from invites where username = v_username;
  if not found then
    raise exception 'Registro no autorizado: el usuario % no fue creado por la administración.', v_username;
  end if;
  insert into profiles (id, username, name, role, grade) values (new.id, v_username, inv.name, inv.role, inv.grade);
  delete from invites where username = v_username;
  insert into activity (user_id, type, detail) values (new.id, 'user', 'Alta de ' || inv.name);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────────── Acciones del estudiante ─────────────────────────────
create or replace function public.complete_lesson(p_module text, p_lesson text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._require_user(); v_title text;
begin
  select lessons ->> p_lesson into v_title from modules where id = p_module;
  if v_title is null then raise exception 'Lección no encontrada'; end if;
  insert into lesson_progress (user_id, module, lesson) values (uid, p_module, p_lesson)
    on conflict do nothing;
  if found then
    insert into activity (user_id, type, module, detail) values (uid, 'lesson', p_module, v_title);
  end if;
end $$;

create or replace function public.submit_evaluation(p_module text, p_answers int[]) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._require_user(); v_total int; v_correct int; v_score numeric; v_review json;
begin
  select count(*) into v_total from quiz_keys where module = p_module;
  if v_total = 0 then raise exception 'Módulo no encontrado'; end if;
  if p_answers is null or coalesce(array_length(p_answers, 1), 0) <> v_total then
    raise exception 'Responde todas las preguntas.';
  end if;
  select count(*) filter (where p_answers[idx + 1] = answer),
         json_agg(json_build_object('ok', p_answers[idx + 1] = answer, 'chosen', p_answers[idx + 1], 'answer', answer, 'explain', explanation) order by idx)
    into v_correct, v_review
    from quiz_keys where module = p_module;
  v_score := round(1 + 4 * v_correct::numeric / v_total, 1);
  insert into attempts (user_id, module, correct, total, score, answers) values (uid, p_module, v_correct, v_total, v_score, p_answers);
  insert into activity (user_id, type, module, detail) values (uid, 'eval', p_module, v_correct || '/' || v_total || ' · ' || to_char(v_score, 'FM0.0'));
  return json_build_object('correct', v_correct, 'total', v_total, 'score', v_score, 'review', v_review);
end $$;

create or replace function public.set_self_evaluation(p_module text, p_value numeric) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._require_user(); v numeric := public._check_mark(p_value);
begin
  if not exists (select 1 from modules where id = p_module) then raise exception 'Módulo no encontrado'; end if;
  insert into marks (user_id, module, self) values (uid, p_module, v)
    on conflict (user_id, module) do update set self = excluded.self;
  insert into activity (user_id, type, module, detail)
    values (uid, 'self', p_module, 'Autoevaluación ' || coalesce(to_char(v, 'FM0.0'), '—'));
end $$;

-- ───────────────────────────── Acciones de administración ─────────────────────────────
create or replace function public.admin_invite(p_username text, p_name text, p_grade text) returns void
language plpgsql security definer set search_path = public as $$
declare v_user text := lower(trim(p_username));
begin
  perform public._require_admin();
  if coalesce(trim(p_name), '') = '' then raise exception 'Escribe el nombre completo.'; end if;
  if v_user !~ '^[a-z0-9._-]{3,30}$' then
    raise exception 'El usuario debe tener entre 3 y 30 caracteres: letras, números, punto o guion.';
  end if;
  if exists (select 1 from profiles where username = v_user) then raise exception 'Ese usuario ya existe.'; end if;
  insert into invites (username, name, grade) values (v_user, trim(p_name), coalesce(trim(p_grade), ''))
    on conflict (username) do update set name = excluded.name, grade = excluded.grade, created_at = now();
end $$;

create or replace function public.admin_set_marks(p_user uuid, p_module text, p_personal numeric, p_social numeric) returns void
language plpgsql security definer set search_path = public as $$
declare aid uuid := public._require_admin(); v_name text;
        vp numeric := public._check_mark(p_personal); vs numeric := public._check_mark(p_social);
begin
  select name into v_name from profiles where id = p_user and role = 'student';
  if v_name is null then raise exception 'Estudiante no encontrado'; end if;
  insert into marks (user_id, module, personal, social) values (p_user, p_module, vp, vs)
    on conflict (user_id, module) do update set personal = excluded.personal, social = excluded.social;
  insert into activity (user_id, type, module, detail) values (aid, 'marks', p_module,
    v_name || ': personal ' || coalesce(to_char(vp, 'FM0.0'), '—') || ', social ' || coalesce(to_char(vs, 'FM0.0'), '—'));
end $$;

create or replace function public.admin_reset_password(p_user uuid, p_password text) returns void
language plpgsql security definer set search_path = public, extensions, auth as $$
begin
  perform public._require_admin();
  if length(coalesce(p_password, '')) < 6 then raise exception 'La contraseña debe tener al menos 6 caracteres.'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then raise exception 'Estudiante no encontrado'; end if;
  update auth.users set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')), updated_at = now()
    where id = p_user;
end $$;

create or replace function public.admin_delete_student(p_user uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
declare aid uuid := public._require_admin(); v_name text;
begin
  select name into v_name from public.profiles where id = p_user and role = 'student';
  if v_name is null then raise exception 'Estudiante no encontrado'; end if;
  delete from auth.users where id = p_user;   -- borra en cascada el perfil y sus registros
  insert into public.activity (user_id, type, detail) values (aid, 'user', 'Baja de ' || v_name);
end $$;

-- ───────────────────────────── Permisos ─────────────────────────────
alter table public.profiles        enable row level security;
alter table public.invites         enable row level security;
alter table public.modules         enable row level security;
alter table public.quiz_keys       enable row level security;   -- sin políticas: nadie la lee desde la app
alter table public.lesson_progress enable row level security;
alter table public.attempts        enable row level security;
alter table public.marks           enable row level security;
alter table public.activity        enable row level security;

drop policy if exists "perfil propio o admin" on public.profiles;
create policy "perfil propio o admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "admin ve invitaciones" on public.invites;
create policy "admin ve invitaciones" on public.invites for select to authenticated using (public.is_admin());
drop policy if exists "modulos visibles" on public.modules;
create policy "modulos visibles" on public.modules for select to authenticated using (true);
drop policy if exists "avance propio o admin" on public.lesson_progress;
create policy "avance propio o admin" on public.lesson_progress for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "intentos propios o admin" on public.attempts;
create policy "intentos propios o admin" on public.attempts for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "notas propias o admin" on public.marks;
create policy "notas propias o admin" on public.marks for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "actividad propia o admin" on public.activity;
create policy "actividad propia o admin" on public.activity for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- Las funciones auxiliares no se exponen; las acciones solo para usuarios con sesión.
revoke execute on function public._require_user(), public._require_admin(), public._check_mark(numeric), public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.complete_lesson(text, text), public.submit_evaluation(text, int[]), public.set_self_evaluation(text, numeric),
  public.admin_invite(text, text, text), public.admin_set_marks(uuid, text, numeric, numeric),
  public.admin_reset_password(uuid, text), public.admin_delete_student(uuid) from public, anon;
grant execute on function public.complete_lesson(text, text), public.submit_evaluation(text, int[]), public.set_self_evaluation(text, numeric),
  public.admin_invite(text, text, text), public.admin_set_marks(uuid, text, numeric, numeric),
  public.admin_reset_password(uuid, text), public.admin_delete_student(uuid), public.is_admin() to authenticated;

-- ───────────────────────────── Primera cuenta administradora ─────────────────────────────
-- Después de ejecutar este archivo, crea en Authentication → Users → Add user el usuario
-- admin@<tu dominio de correo configurado en public/js/config.js> con "Auto Confirm User".
insert into public.invites (username, name, role) values ('admin', 'Coordinación Académica', 'admin')
  on conflict (username) do nothing;
