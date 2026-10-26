-- Generado por tools/build-supabase-content.js. No editar a mano.
-- Ejecutar en Supabase → SQL Editor después de 01_schema.sql.

begin;

insert into public.modules (id, lessons) values ('ballet', '{"b1":"Historia del ballet","b2":"Posiciones y direcciones del cuerpo","b3":"Vocabulario de la barra y el centro","b4":"Música y musicalidad","b5":"Expresión, repertorio y trabajo en equipo","b6":"Carrera profesional y marca personal"}'::jsonb)
  on conflict (id) do update set lessons = excluded.lessons;
delete from public.quiz_keys where module = 'ballet';
insert into public.quiz_keys (module, idx, answer, explanation) values
  ('ballet', 0, 1, 'El PEI señala que surge en el siglo XVII y que es la danza escénica más antigua de Occidente.'),
  ('ballet', 1, 2, 'Luis XIV fundó la academia; su maestro Pierre Beauchamp codificó las cinco posiciones.'),
  ('ballet', 2, 0, 'El en dehors es la rotación externa que nace en la articulación de la cadera.'),
  ('ballet', 3, 1, 'En quinta los pies se cruzan por completo; la tercera es la del talón en el medio del pie.'),
  ('ballet', 4, 2, 'La Sílfide (1832) consagró a Taglioni y el uso expresivo de las puntas.'),
  ('ballet', 5, 1, 'Tchaikovsky compuso El cascanueces (1892), coreografiado en la tradición de Petipa e Ivanov.'),
  ('ballet', 6, 2, 'El vals está en 3/4, muy usado para rond de jambe y port de bras.'),
  ('ballet', 7, 1, 'Fijar la mirada en un punto permite girar con control y sin mareo.'),
  ('ballet', 8, 1, 'El cuerpo de baile es un trabajo colectivo de precisión y escucha.'),
  ('ballet', 9, 3, 'El portafolio de audición se centra en la formación y el trabajo artístico.');

insert into public.modules (id, lessons) values ('contemporanea', '{"c1":"Historia de la danza moderna y contemporánea","c2":"Principios y posturas del cuerpo contemporáneo","c3":"Análisis del movimiento: Laban","c4":"Música, sonido y silencio","c5":"Improvisación, composición y creación colectiva","c6":"El intérprete-creador y su marca"}'::jsonb)
  on conflict (id) do update set lessons = excluded.lessons;
delete from public.quiz_keys where module = 'contemporanea';
insert into public.quiz_keys (module, idx, answer, explanation) values
  ('contemporanea', 0, 1, 'Martha Graham basó su técnica en la contracción y liberación ligadas a la respiración.'),
  ('contemporanea', 1, 0, 'Doris Humphrey trabajó el fall and recovery, continuado por José Limón.'),
  ('contemporanea', 2, 2, 'Cunningham y Cage crearon danza y música de forma independiente, usando el azar.'),
  ('contemporanea', 3, 1, 'El PEI cita: experimentar el manejo de otras energías, otros impulsos y permitir el fluido del movimiento.'),
  ('contemporanea', 4, 1, 'Es la esfera de espacio que rodea al cuerpo, según Laban.'),
  ('contemporanea', 5, 1, 'Flotar combina peso ligero, tiempo sostenido y espacio indirecto.'),
  ('contemporanea', 6, 1, 'El canon escalona una misma frase entre intérpretes.'),
  ('contemporanea', 7, 0, 'Steve Paxton desarrolló el contact improvisation a partir del peso compartido.'),
  ('contemporanea', 8, 0, 'En paralelo los pies y rodillas miran al frente, sin en dehors.'),
  ('contemporanea', 9, 0, 'El dossier reúne biografía, statement, obras e imágenes.');

insert into public.modules (id, lessons) values ('folclor', '{"f1":"Historia y sentido del folclor","f2":"El mapa de las danzas colombianas","f3":"Posturas, pasos y figuras","f4":"Música e instrumentos tradicionales","f5":"Expresión, comunidad y trabajo en equipo","f6":"Gestión cultural y marca personal"}'::jsonb)
  on conflict (id) do update set lessons = excluded.lessons;
delete from public.quiz_keys where module = 'folclor';
insert into public.quiz_keys (module, idx, answer, explanation) values
  ('folclor', 0, 0, 'Nuestras danzas nacen del encuentro indígena, africano y europeo.'),
  ('folclor', 1, 1, 'El PEI la define como creación de nuevas formas a partir del folclor, en concordancia con la época.'),
  ('folclor', 2, 2, 'El currulao es del Pacífico y se acompaña con marimba de chonta.'),
  ('folclor', 3, 1, 'El llamador marca el pulso; el tambor alegre improvisa.'),
  ('folclor', 4, 0, 'El joropo es la danza de los Llanos, con arpa, cuatro y maracas.'),
  ('folclor', 5, 1, 'El paso arrastrado de la cumbia mantiene los pies pegados al piso.'),
  ('folclor', 6, 0, 'El PEI recoge los lineamientos de Octavio Marulanda (1980).'),
  ('folclor', 7, 1, 'Son figuras tradicionales del bambuco.'),
  ('folclor', 8, 1, 'Es la alternancia o superposición de métricas ternaria y binaria compuesta.'),
  ('folclor', 9, 1, 'La Ley 397 de 1997 es la Ley General de Cultura.');

commit;
