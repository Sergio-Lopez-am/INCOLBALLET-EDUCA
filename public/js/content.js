/*
 * Contenido académico de INCOLBALLET EDUCA.
 * Referente: PEI INCOLBALLET 2025-2026 (especialidades de Ballet Clásico,
 * Danza Contemporánea y Danza Nacional / Folclor; sistema de evaluación 1.0 - 5.0).
 * Archivo compartido entre el navegador y el servidor (UMD).
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.CONTENT = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const MODULES = [
    /* ───────────────────────── BALLET CLÁSICO ───────────────────────── */
    {
      id: 'ballet',
      name: 'Ballet Clásico',
      short: 'Ballet',
      logo: 'assets/logo-ccb.png',
      tagline: 'La disciplina universal de base de todo bailarín profesional.',
      intro: 'El PEI de INCOLBALLET define el ballet clásico como danza académica: surge en el siglo XVII y es la danza escénica más antigua de Occidente, donde se unen danza, música y diseño plástico para narrar historias o expresar ideas y sentimientos. Como cualquier lenguaje, se aprende de manera gradual y progresiva. Este módulo recorre su historia, su vocabulario, su relación con la música y lo que significa construir una carrera en una compañía profesional como la Compañía Colombiana de Ballet.',
      lessons: [
        {
          id: 'b1', title: 'Historia del ballet', minutes: 15,
          summary: 'De las cortes del Renacimiento a las grandes compañías del siglo XX.',
          sections: [
            { h: 'Origen cortesano', p: [
              'El ballet nace en las cortes italianas del Renacimiento, a partir de las danzas populares y cortesanas. Con Catalina de Médici viaja a Francia, donde en 1581 se presenta el Ballet Comique de la Reine, considerado uno de los primeros ballets de corte que unía danza, poesía, música y escenografía.',
              'Luis XIV, gran bailarín, funda en 1661 la Académie Royale de Danse. Su maestro, Pierre Beauchamp, codifica las cinco posiciones de los pies que todavía usamos. Por eso el vocabulario del ballet está en francés en todo el mundo.'
            ]},
            { h: 'Del ballet de acción al Romanticismo', p: [
              'En 1760 Jean-Georges Noverre publica sus Cartas sobre la danza y defiende el ballet d\'action: la danza debe contar una historia y expresar emociones, no solo exhibir pasos.',
              'El Romanticismo (década de 1830) trae seres sobrenaturales, faldas de tul y el trabajo en puntas. Marie Taglioni en La Sílfide (1832) y Giselle (1841) son los grandes referentes de esta época.'
            ]},
            { h: 'La época imperial rusa y el siglo XX', p: [
              'En San Petersburgo, Marius Petipa crea los grandes ballets clásicos con música de Tchaikovsky: La bella durmiente (1890), El cascanueces (1892) y El lago de los cisnes (versión de Petipa e Ivanov, 1895).',
              'En 1909 los Ballets Rusos de Serguéi Diaghilev revolucionan París uniendo coreógrafos como Fokine y Nijinsky con compositores como Stravinsky y pintores de vanguardia. Después George Balanchine desarrolla en Estados Unidos el ballet neoclásico.'
            ]},
            { h: 'Escuelas y métodos', p: [
              'Hoy conviven varios métodos de enseñanza: Vaganova (Rusia), Cecchetti (Italia), la Escuela Francesa, Bournonville (Dinamarca), la Royal Academy of Dance (Reino Unido) y la Escuela Cubana impulsada por Alicia Alonso. Cada una tiene matices de estilo, pero comparten los mismos principios técnicos.'
            ]}
          ],
          terms: [
            ['Ballet de corte', 'Espectáculo de danza de los siglos XVI y XVII bailado por la nobleza.'],
            ['Ballet d\'action', 'Ballet narrativo propuesto por Noverre, donde la danza cuenta una historia.'],
            ['Ballet romántico', 'Estilo del siglo XIX con temas sobrenaturales, tul blanco y puntas.'],
            ['Neoclásico', 'Ballet del siglo XX, abstracto y veloz, asociado a Balanchine.']
          ],
          practice: 'Elige un ballet de repertorio (Giselle, El lago de los cisnes o El cascanueces). Mira una versión completa e identifica: época, coreógrafo, compositor y el momento de la historia que más te conmueve.'
        },
        {
          id: 'b2', title: 'Posiciones y direcciones del cuerpo', minutes: 20,
          summary: 'Las cinco posiciones de pies y brazos, el en dehors y las orientaciones en el espacio.',
          sections: [
            { h: 'El en dehors (rotación externa)', p: [
              'Toda la técnica clásica se construye sobre la rotación hacia afuera de las piernas desde la articulación de la cadera. La rotación nunca se fuerza desde las rodillas ni los pies: se trabaja progresivamente según las condiciones de cada cuerpo, como recuerda el PEI al hablar de la preparación física escalonada.'
            ]},
            { h: 'Las cinco posiciones de los pies', list: [
              'Primera: talones juntos, pies rotados hacia afuera formando una línea.',
              'Segunda: pies en la misma línea con una separación de aproximadamente un pie y medio.',
              'Tercera: el talón de un pie se apoya en el medio del otro pie.',
              'Cuarta: un pie delante del otro, separados por la distancia de un pie, en cuarta cruzada o abierta.',
              'Quinta: los pies se cruzan completamente; el talón de uno toca la punta del otro.'
            ]},
            { h: 'Posiciones de los brazos', p: [
              'Los brazos se mantienen redondeados, con el codo sostenido y los dedos suaves. La nomenclatura cambia según la escuela; en el método Vaganova se habla de posición preparatoria (bras bas), primera (frente al diafragma), segunda (abiertos al lado) y tercera (sobre la cabeza). La Escuela Francesa y Cecchetti numeran distinto, por eso siempre se aprende la nomenclatura de la escuela en la que se estudia.'
            ]},
            { h: 'Direcciones del cuerpo y poses', list: [
              'En face: el cuerpo de frente al público.',
              'Croisé: el cuerpo en diagonal con las piernas cruzadas desde la vista del público.',
              'Effacé: en diagonal con las piernas abiertas, una línea más amplia y luminosa.',
              'Écarté: en diagonal con la pierna de trabajo a la segunda.',
              'Arabesque: apoyo en una pierna con la otra extendida atrás, formando la línea más larga posible.',
              'Attitude: la pierna de trabajo elevada y flexionada, delante o detrás.'
            ]}
          ],
          terms: [
            ['En dehors', 'Rotación externa de las piernas; también giro hacia afuera.'],
            ['En dedans', 'Hacia adentro; giro hacia la pierna de apoyo.'],
            ['Épaulement', 'Uso de hombros, cabeza y torso que da tridimensionalidad.'],
            ['Port de bras', 'Movimiento de los brazos de una posición a otra.']
          ],
          practice: 'Frente a un espejo, recorre las cinco posiciones de pies y brazos durante ocho tiempos cada una. Fíjate en que la rotación nace de la cadera y que las rodillas quedan alineadas sobre los dedos.'
        },
        {
          id: 'b3', title: 'Vocabulario de la barra y el centro', minutes: 20,
          summary: 'Los pasos de la clase de ballet en el orden en que se trabajan.',
          sections: [
            { h: 'La barra', p: [
              'La clase empieza en la barra para calentar y alinear el cuerpo. El orden tradicional va de lo más lento y profundo a lo más rápido y amplio.'
            ], list: [
              'Plié: flexión de rodillas, demi-plié (sin levantar talones) y grand plié.',
              'Battement tendu: el pie se desliza estirado por el piso hasta la punta.',
              'Battement jeté o dégagé: como el tendu, pero el pie se despega del piso.',
              'Rond de jambe à terre: la pierna dibuja un semicírculo en el piso.',
              'Battement fondu: flexión y extensión simultánea de ambas piernas, de forma fundida.',
              'Battement frappé: golpe rápido y preciso del pie hacia afuera.',
              'Adagio y développé: la pierna se despliega lentamente hasta la extensión.',
              'Grand battement: lanzamiento amplio de la pierna estirada.'
            ]},
            { h: 'El centro y el allegro', list: [
              'Pirouette: giro sobre una pierna; se usa el spotting (fijar la mirada) para no marearse.',
              'Sauté y changement: saltos verticales; en el changement se cambia la quinta en el aire.',
              'Échappé: los pies "escapan" de quinta a segunda o cuarta.',
              'Glissade y assemblé: deslizamiento y salto donde las piernas se reúnen en el aire.',
              'Grand jeté: gran salto de una pierna a la otra en desplazamiento.',
              'Chaînés y fouettés: giros en cadena y el giro con látigo de la pierna.'
            ]}
          ],
          terms: [
            ['Relevé', 'Elevarse sobre media punta o punta.'],
            ['Allegro', 'Parte de la clase dedicada a los saltos rápidos.'],
            ['Spotting', 'Técnica de fijar la mirada en un punto durante los giros.'],
            ['Variación', 'Solo de repertorio que muestra la técnica de un bailarín.']
          ],
          practice: 'Escribe la secuencia de tu última clase en orden y al lado el nombre correcto de cada paso. Luego compárala con la lista de esta lección.'
        },
        {
          id: 'b4', title: 'Música y musicalidad', minutes: 15,
          summary: 'El pianista acompañante, los compases y los grandes compositores del ballet.',
          sections: [
            { h: 'Bailar con la música', p: [
              'El PEI insiste en que la clase técnica requiere pianistas con conocimiento y experiencia: la música no es fondo, es el pulso que organiza cada ejercicio. Un bailarín musical escucha la frase, respira con ella y sabe dónde están los acentos.'
            ]},
            { h: 'Compases frecuentes en la clase', list: [
              '2/4 y 4/4: marchas y ejercicios rápidos como tendus y petit allegro.',
              '3/4: valses para rond de jambe, port de bras y grand allegro con vuelo.',
              '6/8: ritmos ondulantes para fondus y algunos saltos.',
              'Adagio: tempo lento y sostenido para el control y las extensiones.'
            ]},
            { h: 'Contar la música', p: [
              'En ballet se cuenta en frases de 8 tiempos. Muchos movimientos empiezan en el "y" anterior al tiempo (and-one, y-uno), lo que da impulso y anticipación. Aprender a escuchar el contratiempo distingue a un bailarín técnico de uno musical.'
            ]},
            { h: 'Compositores esenciales', list: [
              'Adolphe Adam: Giselle.',
              'Piotr Ilich Tchaikovsky: El lago de los cisnes, La bella durmiente, El cascanueces.',
              'Léo Delibes: Coppélia.',
              'Ludwig Minkus: Don Quijote, La Bayadera.',
              'Serguéi Prokófiev: Romeo y Julieta.',
              'Ígor Stravinsky: El pájaro de fuego, Petrushka, La consagración de la primavera.'
            ]}
          ],
          terms: [
            ['Tempo', 'Velocidad de la música.'],
            ['Frase musical', 'Unidad de sentido musical, en ballet suele ser de 8 tiempos.'],
            ['Acento', 'Tiempo que se destaca con más fuerza.'],
            ['Musicalidad', 'Capacidad de interpretar el movimiento en diálogo con la música.']
          ],
          practice: 'Escucha el vals de las flores de El cascanueces y marca con palmas el primer tiempo de cada compás. Después cuenta frases de 8 y nota dónde cambia la melodía.'
        },
        {
          id: 'b5', title: 'Expresión, repertorio y trabajo en equipo', minutes: 15,
          summary: 'Del cuerpo de baile al solista: interpretar, escuchar y bailar con otros.',
          sections: [
            { h: 'La expresión en la técnica', p: [
              'La meta del bailarín, dice el PEI, es la excelencia técnica, física e interpretativa. La técnica es el medio y la interpretación el fin: cada paso tiene una intención, una mirada y una energía. El ballet también tiene un lenguaje de mimo con gestos codificados para decir "amor", "baila", "muerte" o "juramento".'
            ]},
            { h: 'Roles en una compañía', list: [
              'Cuerpo de baile: el grupo que baila en perfecta unidad; exige escucha y precisión colectiva.',
              'Corifeo y solista: bailarines con partes destacadas o pequeños solos.',
              'Primer bailarín o primera bailarina: los roles protagónicos del repertorio.',
              'Maestro de ensayo y coreógrafo: guían, corrigen y construyen la obra.'
            ]},
            { h: 'Trabajo en equipo en escena', p: [
              'En el cuerpo de baile el éxito es colectivo: líneas rectas, mismas alturas de pierna, respiración común y la mirada periférica para mantener las distancias. En el pas de deux la confianza entre los dos bailarines es la base del partnering: el apoyo, los portés y los giros asistidos. En INCOLBALLET el repertorio se estudia desde los primeros niveles y se proyecta en funciones ante el público.'
            ]}
          ],
          terms: [
            ['Pas de deux', 'Danza para dos bailarines, generalmente con adagio, variaciones y coda.'],
            ['Porté', 'Elevación de un bailarín por su pareja.'],
            ['Repertorio', 'Conjunto de obras del ballet que se transmiten y se reponen.'],
            ['Cuerpo de baile', 'Conjunto de bailarines que forma el grupo en escena.']
          ],
          practice: 'En grupos de cuatro, monten una diagonal de 16 tiempos (por ejemplo, glissade, assemblé y sauté) y grábenla. Revisen juntos si las líneas, la música y las alturas están unificadas.'
        },
        {
          id: 'b6', title: 'Carrera profesional y marca personal', minutes: 15,
          summary: 'Audiciones, portafolio y cómo un bailarín clásico construye su identidad artística.',
          sections: [
            { h: 'El camino hacia una compañía', p: [
              'Según el PEI, la formación busca que al finalizar el nivel medio el estudiante pueda integrarse a una compañía de ballet nacional o internacional, como la Compañía Colombiana de Ballet (CCB) de INCOLBALLET. El ejercicio profesional suele iniciar hacia los 16 o 17 años.'
            ]},
            { h: 'Tu portafolio de audición', list: [
              'Hoja de vida artística de una página: formación, maestros, repertorio bailado y funciones.',
              'Fotografías profesionales: primer plano, arabesque y una pose en puntas o en salto.',
              'Video de audición de 3 a 5 minutos: barra breve, centro, allegro y una variación de repertorio.',
              'Cartas de recomendación de maestros.'
            ]},
            { h: 'Identidad y marca personal', p: [
              'Tu marca personal es la forma coherente en que te presentas: cómo bailas, cómo te comunicas y qué valores muestras. Define en una frase qué te hace único como intérprete, usa una misma foto y un mismo nombre artístico en tus redes y portafolio, y comparte tu proceso (clases, ensayos, funciones) con respeto por la institución y tus compañeros. La puntualidad, la disciplina y el autocuidado que el PEI evalúa en los desempeños personales también son parte de tu reputación profesional.'
            ]}
          ],
          terms: [
            ['Audición', 'Prueba para ingresar a una compañía o programa.'],
            ['Reel', 'Video corto que resume tu trabajo como intérprete.'],
            ['Statement', 'Texto breve que expresa quién eres como artista.'],
            ['Networking', 'Red de contactos profesionales que se construye con respeto y constancia.']
          ],
          practice: 'Redacta tu biografía artística en máximo 80 palabras, en tercera persona, y elige la foto que mejor te represente. Compártela con un maestro para recibir retroalimentación.'
        }
      ],
      quiz: [
        { q: '¿En qué siglo surge el ballet clásico como danza académica, según el PEI?', o: ['Siglo XV', 'Siglo XVII', 'Siglo XIX', 'Siglo XX'], a: 1, e: 'El PEI señala que surge en el siglo XVII y que es la danza escénica más antigua de Occidente.' },
        { q: '¿Quién fundó la Académie Royale de Danse en 1661?', o: ['Catalina de Médici', 'Marius Petipa', 'Luis XIV', 'Jean-Georges Noverre'], a: 2, e: 'Luis XIV fundó la academia; su maestro Pierre Beauchamp codificó las cinco posiciones.' },
        { q: '¿Qué significa "en dehors"?', o: ['Rotación hacia afuera de las piernas desde la cadera', 'Salto con cambio de pies', 'Brazos sobre la cabeza', 'Giro hacia la pierna de apoyo'], a: 0, e: 'El en dehors es la rotación externa que nace en la articulación de la cadera.' },
        { q: 'En la quinta posición de los pies…', o: ['Los talones se tocan y los pies forman una línea', 'Los pies se cruzan completamente, talón con punta', 'Los pies están separados un pie y medio', 'Un talón se apoya en el medio del otro pie'], a: 1, e: 'En quinta los pies se cruzan por completo; la tercera es la del talón en el medio del pie.' },
        { q: '¿Qué ballet romántico protagonizó Marie Taglioni en 1832?', o: ['Giselle', 'Coppélia', 'La Sílfide', 'El lago de los cisnes'], a: 2, e: 'La Sílfide (1832) consagró a Taglioni y el uso expresivo de las puntas.' },
        { q: '¿Qué compositor escribió la música de El cascanueces?', o: ['Adolphe Adam', 'Tchaikovsky', 'Minkus', 'Stravinsky'], a: 1, e: 'Tchaikovsky compuso El cascanueces (1892), coreografiado en la tradición de Petipa e Ivanov.' },
        { q: '¿Cuál es el compás típico de un vals?', o: ['2/4', '4/4', '3/4', '5/8'], a: 2, e: 'El vals está en 3/4, muy usado para rond de jambe y port de bras.' },
        { q: '¿Para qué sirve el spotting?', o: ['Para saltar más alto', 'Para fijar la mirada y no perder el equilibrio en los giros', 'Para medir la música', 'Para calentar los pies'], a: 1, e: 'Fijar la mirada en un punto permite girar con control y sin mareo.' },
        { q: 'El cuerpo de baile se caracteriza por…', o: ['Bailar solos de virtuosismo', 'Bailar en unidad, con líneas y música compartidas', 'Dirigir los ensayos', 'Componer la música'], a: 1, e: 'El cuerpo de baile es un trabajo colectivo de precisión y escucha.' },
        { q: '¿Qué elemento NO suele ir en un portafolio de audición?', o: ['Video con barra, centro y una variación', 'Hoja de vida artística', 'Fotografías profesionales', 'Calificaciones de matemáticas'], a: 3, e: 'El portafolio de audición se centra en la formación y el trabajo artístico.' }
      ]
    },

    /* ───────────────────────── DANZA CONTEMPORÁNEA ───────────────────────── */
    {
      id: 'contemporanea',
      name: 'Danza Contemporánea',
      short: 'Contemporánea',
      logo: 'assets/logo-ccdc.png',
      tagline: 'Otros lenguajes, otras energías, otros impulsos.',
      intro: 'En el ciclo medio de INCOLBALLET el estudiante puede optar por el énfasis en danza contemporánea, que permite explorar lenguajes corporales diferentes a la danza clásica. Como cita el PEI: "El objetivo del trabajo de la danza contemporánea es justamente experimentar el manejo de otras energías, otros impulsos; darse permiso para liberar su propia energía, permitir el fluido del movimiento" (G. Castro, 2006). Este módulo conecta esa búsqueda con la Compañía Colombiana de Danza Contemporánea.',
      lessons: [
        {
          id: 'c1', title: 'Historia de la danza moderna y contemporánea', minutes: 15,
          summary: 'De los pies descalzos de Isadora Duncan a la danza posmoderna y el teatro-danza.',
          sections: [
            { h: 'Las pioneras', p: [
              'A comienzos del siglo XX varias artistas rompen con las zapatillas y el corsé del ballet. Isadora Duncan baila descalza, inspirada en la naturaleza y la Grecia antigua. Loie Fuller explora la luz y el movimiento de la tela.'
            ]},
            { h: 'La danza moderna', p: [
              'En Estados Unidos, Martha Graham crea una técnica basada en la contracción y la liberación (release) del torso, ligada a la respiración y la emoción. Doris Humphrey trabaja la caída y la recuperación (fall and recovery), y José Limón continúa ese camino. En Alemania, Mary Wigman desarrolla la danza expresionista y Rudolf Laban crea un sistema para analizar y escribir el movimiento.'
            ]},
            { h: 'Posmodernidad y teatro-danza', p: [
              'Merce Cunningham, junto al compositor John Cage, separa la danza de la música y usa el azar para componer. En 1962 el Judson Dance Theater en Nueva York incorpora movimientos cotidianos. Steve Paxton desarrolla en 1972 el contact improvisation, y en Alemania Pina Bausch crea el Tanztheater (teatro-danza), donde la emoción y la vida cotidiana se vuelven escena.'
            ]},
            { h: 'En Colombia', p: [
              'La danza contemporánea colombiana dialoga con las raíces del país y con la técnica académica. INCOLBALLET forma intérpretes versátiles y proyecta su trabajo a través de la Compañía Colombiana de Danza Contemporánea (CCDC), que según la misión institucional promueve la identidad y el enriquecimiento cultural de la comunidad.'
            ]}
          ],
          terms: [
            ['Danza moderna', 'Corriente de la primera mitad del siglo XX que rompe con el ballet.'],
            ['Posmoderna', 'Corriente desde los años 60 que cuestiona qué puede ser danza.'],
            ['Tanztheater', 'Teatro-danza alemán, asociado a Pina Bausch.'],
            ['Contact improvisation', 'Danza improvisada a partir del contacto y el peso compartido.']
          ],
          practice: 'Busca un fragmento de Martha Graham y otro de Pina Bausch. Escribe tres diferencias en cómo usan el torso, el piso y la emoción.'
        },
        {
          id: 'c2', title: 'Principios y posturas del cuerpo contemporáneo', minutes: 20,
          summary: 'Paralelo, centro, piso, columna y respiración: la base técnica.',
          sections: [
            { h: 'Principios fundamentales', list: [
              'Peso y gravedad: el cuerpo cede y se apoya en el piso en vez de negarlo.',
              'Centro: el movimiento nace del centro del cuerpo y viaja a las extremidades.',
              'Respiración: impulsa, sostiene y da fraseo al movimiento.',
              'Paralelo: los pies y las piernas pueden trabajar hacia el frente, no solo rotadas.',
              'Suspensión y caída: el juego entre sostener el equilibrio y entregarse a la gravedad.'
            ]},
            { h: 'Posturas y acciones de la columna', list: [
              'Contracción: el torso se curva desde la pelvis con la exhalación (técnica Graham).',
              'Release: la columna se libera y se alarga con la inhalación.',
              'Curve (curva): enrollar la columna vértebra por vértebra.',
              'Flat back: espalda plana inclinada hacia adelante, típica de la técnica Horton.',
              'Tilt: inclinación lateral del torso con la pierna en extensión opuesta.',
              'Espiral: rotación de la columna alrededor de su eje.'
            ]},
            { h: 'El piso como compañero', p: [
              'El floor work enseña a bajar y subir del piso con fluidez: rodar, deslizar, apoyarse en manos y hombros. Se trabaja la seguridad articular y el uso del impulso para que las transiciones sean suaves y sin golpes.'
            ]}
          ],
          terms: [
            ['Floor work', 'Trabajo de piso: rodadas, deslizamientos y transiciones.'],
            ['Release', 'Liberación de tensión y alargamiento de la columna.'],
            ['Paralelo', 'Posición de las piernas sin rotación externa.'],
            ['Fall and recovery', 'Principio de caída y recuperación de Doris Humphrey.']
          ],
          practice: 'Desde de pie, enrolla la columna hasta el piso en 8 tiempos, rueda una vez y vuelve a subir en 8 tiempos sin usar las manos de forma brusca. Repite tres veces respirando en cada fase.'
        },
        {
          id: 'c3', title: 'Análisis del movimiento: Laban', minutes: 20,
          summary: 'Esfuerzo, espacio, niveles y las ocho acciones básicas.',
          sections: [
            { h: 'Los cuatro factores del esfuerzo', list: [
              'Peso: fuerte o ligero.',
              'Tiempo: súbito o sostenido.',
              'Espacio: directo o indirecto (flexible).',
              'Flujo: controlado (contenido) o libre.'
            ]},
            { h: 'Las ocho acciones básicas de esfuerzo', p: [
              'Combinando peso, tiempo y espacio, Laban identificó ocho acciones que sirven para crear e interpretar:'
            ], list: [
              'Golpear (fuerte, súbito, directo).',
              'Azotar (fuerte, súbito, indirecto).',
              'Presionar (fuerte, sostenido, directo).',
              'Retorcer (fuerte, sostenido, indirecto).',
              'Palpar o toque ligero (ligero, súbito, directo).',
              'Sacudir (ligero, súbito, indirecto).',
              'Deslizar (ligero, sostenido, directo).',
              'Flotar (ligero, sostenido, indirecto).'
            ]},
            { h: 'El espacio', p: [
              'La kinesfera es la esfera de espacio que alcanzas sin desplazarte. En ella trabajas tres niveles (bajo, medio y alto), direcciones y trayectorias. En el espacio general dibujas recorridos en el piso y en el aire.'
            ]}
          ],
          terms: [
            ['Kinesfera', 'Espacio personal que rodea al cuerpo.'],
            ['Niveles', 'Alturas del movimiento: bajo, medio y alto.'],
            ['Esfuerzo', 'Calidad dinámica con la que se hace un movimiento.'],
            ['Trayectoria', 'Camino que traza el cuerpo en el espacio.']
          ],
          practice: 'Elige una frase corta de 8 tiempos y báilala tres veces: primero flotando, luego presionando y luego azotando. Observa cómo cambia el sentido de la frase.'
        },
        {
          id: 'c4', title: 'Música, sonido y silencio', minutes: 15,
          summary: 'Nuevas relaciones entre movimiento y sonido.',
          sections: [
            { h: 'Una relación abierta', p: [
              'En la danza contemporánea la música puede acompañar, contrastar o incluso estar ausente. Cunningham y Cage demostraron que danza y música pueden crearse de forma independiente y encontrarse en escena.'
            ]},
            { h: 'Recursos sonoros', list: [
              'Silencio: el bailarín escucha la respiración y el ritmo del grupo.',
              'Paisaje sonoro: sonidos de la ciudad, la naturaleza o la voz.',
              'Minimalismo: compositores como Steve Reich, Philip Glass o Arvo Pärt, con patrones repetitivos.',
              'Música electrónica y electroacústica.',
              'Músicas tradicionales reinterpretadas, como las del Pacífico colombiano.'
            ]},
            { h: 'Contar sin contar', p: [
              'Además de contar tiempos, el intérprete contemporáneo aprende a moverse por señales (cues), por respiración compartida y por duración. Escuchar al grupo es tan importante como escuchar la música.'
            ]}
          ],
          terms: [
            ['Cue', 'Señal que indica un cambio en la obra.'],
            ['Paisaje sonoro', 'Composición a partir de sonidos del entorno.'],
            ['Minimalismo', 'Estilo musical de patrones breves y repetitivos.'],
            ['Respiración compartida', 'Sincronía del grupo a partir de la respiración, sin conteo.']
          ],
          practice: 'Crea una frase de 30 segundos en silencio con dos compañeros. Sin contar, intenten empezar y terminar juntos solo escuchando la respiración.'
        },
        {
          id: 'c5', title: 'Improvisación, composición y creación colectiva', minutes: 20,
          summary: 'Herramientas para crear en grupo y escuchar al otro.',
          sections: [
            { h: 'Expresión corporal e improvisación', p: [
              'El PEI propone que el estudiante desarrolle la capacidad de trasladar al movimiento un sentimiento, una imagen o una idea, y que use su cuerpo como medio de creación. La improvisación entrena esa escucha: a uno mismo, al espacio y a los demás.'
            ]},
            { h: 'Herramientas de composición', list: [
              'Repetición: volver a un material para darle peso.',
              'Unísono: todos hacen lo mismo al mismo tiempo.',
              'Canon: el mismo material empieza en tiempos distintos.',
              'Acumulación: se suma un movimiento nuevo en cada repetición.',
              'Retrógrado: la frase se baila al revés.',
              'Cambio de nivel, dirección o calidad (aplicando Laban).'
            ]},
            { h: 'Trabajar en equipo', p: [
              'La creación colectiva necesita acuerdos: escuchar todas las propuestas, decidir juntos y respetar los tiempos de cada persona. En el contact improvisation el peso compartido exige confianza y cuidado mutuo. El PEI valora estas habilidades en los desempeños sociales: trabajo cooperativo, respeto, liderazgo y comunicación asertiva.'
            ]}
          ],
          terms: [
            ['Canon', 'Repetición escalonada de una frase entre varios intérpretes.'],
            ['Unísono', 'Movimiento simultáneo e idéntico del grupo.'],
            ['Acumulación', 'Construcción progresiva de una frase.'],
            ['Creación colectiva', 'Obra construida a partir de las propuestas del grupo.']
          ],
          practice: 'En grupos, cada persona crea 4 movimientos. Únanlos en una frase común y preséntenla en unísono y luego en canon.'
        },
        {
          id: 'c6', title: 'El intérprete-creador y su marca', minutes: 15,
          summary: 'Convocatorias, residencias y cómo comunicar tu voz artística.',
          sections: [
            { h: 'Intérprete y creador', p: [
              'El bailarín contemporáneo suele ser intérprete y creador al mismo tiempo. Además de bailar en compañías como la CCDC, puede crear sus propias piezas, participar en residencias y colaborar con artistas de otras disciplinas.'
            ]},
            { h: 'Herramientas profesionales', list: [
              'Dossier artístico: biografía, statement, obras, fotos y prensa.',
              'Video reel: 1 a 3 minutos con tus mejores momentos como intérprete o creador.',
              'Convocatorias públicas: en Colombia, el Programa Nacional de Estímulos y el Programa Nacional de Concertación del Ministerio de las Culturas, además de las convocatorias de cada departamento y ciudad.',
              'Festivales, laboratorios y residencias artísticas.'
            ]},
            { h: 'Tu voz como marca', p: [
              'Tu identidad artística es lo que hace reconocible tu trabajo: los temas que te mueven, tu calidad de movimiento y tu forma de crear. Escribe un statement artístico en el que expliques qué investigas y por qué. Usa tus redes como un cuaderno de proceso y cita siempre a tus maestros, colaboradores y a la institución.'
            ]}
          ],
          terms: [
            ['Dossier', 'Documento que presenta tu trayectoria y tus obras.'],
            ['Residencia', 'Periodo de creación con espacio y apoyo de una organización.'],
            ['Convocatoria', 'Llamado público para financiar o programar proyectos.'],
            ['Statement artístico', 'Texto sobre lo que investigas y cómo creas.']
          ],
          practice: 'Escribe tu statement artístico en tres frases: qué te interesa, cómo lo exploras con el cuerpo y qué quieres que sienta el público.'
        }
      ],
      quiz: [
        { q: '¿Qué técnica se basa en la contracción y el release del torso?', o: ['Cunningham', 'Graham', 'Vaganova', 'Bournonville'], a: 1, e: 'Martha Graham basó su técnica en la contracción y liberación ligadas a la respiración.' },
        { q: '¿Quién desarrolló el principio de caída y recuperación?', o: ['Doris Humphrey', 'Isadora Duncan', 'Pina Bausch', 'Mary Wigman'], a: 0, e: 'Doris Humphrey trabajó el fall and recovery, continuado por José Limón.' },
        { q: '¿Con qué compositor trabajó Merce Cunningham separando danza y música?', o: ['Philip Glass', 'Stravinsky', 'John Cage', 'Arvo Pärt'], a: 2, e: 'Cunningham y Cage crearon danza y música de forma independiente, usando el azar.' },
        { q: 'Según el PEI, el énfasis en danza contemporánea busca…', o: ['Repetir el ballet con otra música', 'Experimentar otras energías y otros impulsos', 'Estudiar solo historia del arte', 'Preparar exclusivamente para el folclor'], a: 1, e: 'El PEI cita: experimentar el manejo de otras energías, otros impulsos y permitir el fluido del movimiento.' },
        { q: 'La kinesfera es…', o: ['Un tipo de salto', 'El espacio personal que alcanzas sin desplazarte', 'Una técnica de respiración', 'Un estilo de música'], a: 1, e: 'Es la esfera de espacio que rodea al cuerpo, según Laban.' },
        { q: 'La acción "flotar" en Laban es…', o: ['Fuerte, súbita y directa', 'Ligera, sostenida e indirecta', 'Fuerte, sostenida y directa', 'Ligera, súbita y directa'], a: 1, e: 'Flotar combina peso ligero, tiempo sostenido y espacio indirecto.' },
        { q: 'En composición, el canon consiste en…', o: ['Bailar todos al mismo tiempo', 'El mismo material que empieza en tiempos distintos', 'Bailar la frase al revés', 'Bailar en silencio'], a: 1, e: 'El canon escalona una misma frase entre intérpretes.' },
        { q: '¿Quién desarrolló el contact improvisation en 1972?', o: ['Steve Paxton', 'Rudolf Laban', 'José Limón', 'George Balanchine'], a: 0, e: 'Steve Paxton desarrolló el contact improvisation a partir del peso compartido.' },
        { q: 'Una posición en paralelo significa…', o: ['Piernas sin rotación externa, hacia el frente', 'Brazos en quinta', 'Torso inclinado a un lado', 'Talones juntos rotados'], a: 0, e: 'En paralelo los pies y rodillas miran al frente, sin en dehors.' },
        { q: '¿Qué documento presenta tu trayectoria y tus obras ante una convocatoria?', o: ['El dossier artístico', 'El pensum', 'El manual de convivencia', 'La partitura'], a: 0, e: 'El dossier reúne biografía, statement, obras e imágenes.' }
      ]
    },

    /* ───────────────────────── FOLCLOR ───────────────────────── */
    {
      id: 'folclor',
      name: 'Folclor y Danza Nacional',
      short: 'Folclor',
      logo: null,
      tagline: 'La identidad de una nación contada con el cuerpo.',
      intro: 'El programa de Danza Nacional del PEI busca formar bailarines capaces de renovar el folclor para crear una nueva estética, entendiendo el folclor nacional como el estudio de las danzas y los comportamientos de hombres y mujeres en las culturas que conforman la sociedad colombiana. Siguiendo al maestro Octavio Marulanda, el folclor y el conocimiento de las tradiciones son el mejor camino para reconocer los valores que conforman nuestra fisonomía como nación.',
      lessons: [
        {
          id: 'f1', title: 'Historia y sentido del folclor', minutes: 15,
          summary: 'Qué es el folclor, de dónde vienen nuestras danzas y quién las ha estudiado.',
          sections: [
            { h: 'Qué es el folclor', p: [
              'La palabra folk-lore (saber del pueblo) fue propuesta en 1846 por el inglés William Thoms. Designa los conocimientos, costumbres, músicas y danzas que una comunidad transmite de generación en generación, muchas veces de forma oral.'
            ]},
            { h: 'Tres raíces', p: [
              'Las danzas colombianas nacen del encuentro de tres raíces: la indígena, la africana y la europea. De ese mestizaje surgen ritmos como la cumbia, en la que se reconocen los tambores africanos, las gaitas indígenas y elementos del vestuario europeo.'
            ]},
            { h: 'Investigadores y maestros', p: [
              'Octavio Marulanda, citado en el PEI, defendió la enseñanza del folclor como parte natural de la educación. Delia Zapata Olivella llevó las danzas afrocolombianas a escenarios de todo el mundo. Hoy festivales como el Petronio Álvarez en Cali, el Carnaval de Barranquilla o el Festival del Bambuco en Neiva mantienen vivas estas tradiciones.'
            ]},
            { h: 'De la tradición a la danza nacional', p: [
              'El PEI distingue entre conservar la tradición y crear con ella: la danza nacional usa los elementos del folclor para crear nuevas formas, con un estilo innovador y en concordancia con la época. Por eso el programa incluye técnica clásica, danza contemporánea y acrobacia como herramientas de creación.'
            ]}
          ],
          terms: [
            ['Folclor', 'Saber tradicional de un pueblo transmitido entre generaciones.'],
            ['Mestizaje', 'Mezcla de culturas que da origen a nuevas expresiones.'],
            ['Proyección folclórica', 'Llevar la danza tradicional al escenario con criterios artísticos.'],
            ['Danza nacional', 'Creación escénica nueva a partir de los elementos del folclor.']
          ],
          practice: 'Pregunta a un adulto mayor de tu familia qué música o danza tradicional recuerda de su infancia. Escribe la historia en un párrafo y descubre a qué región pertenece.'
        },
        {
          id: 'f2', title: 'El mapa de las danzas colombianas', minutes: 20,
          summary: 'Regiones, ritmos y danzas representativas.',
          sections: [
            { h: 'Región Andina', list: [
              'Bambuco: danza de pareja con figuras como los ochos, el codillo y el pañuelo.',
              'Sanjuanero huilense: variante festiva del bambuco del Huila y el Tolima.',
              'Pasillo, torbellino y guabina.'
            ]},
            { h: 'Región Caribe (Atlántica)', list: [
              'Cumbia: danza de cortejo en la que la mujer lleva velas y el hombre la sigue.',
              'Mapalé: danza de origen africano, rápida y enérgica, asociada a los pescadores.',
              'Bullerengue, puya, porro y fandango.'
            ]},
            { h: 'Región Pacífica', list: [
              'Currulao: danza de cortejo con pañuelo, al son de la marimba de chonta.',
              'Abozao, jota chocoana y contradanza.'
            ]},
            { h: 'Orinoquia (Llanos) e Insular', list: [
              'Joropo: danza de pareja con zapateo, escobillao y valseao.',
              'San Andrés y Providencia: calypso, schottische, polka y mazurca, con influencia antillana y europea.'
            ]},
            { h: 'Amazonia', p: [
              'Las danzas de los pueblos indígenas amazónicos están ligadas a rituales, a la naturaleza y a ciclos de la vida. Se estudian con respeto por su sentido sagrado y por las comunidades que las mantienen.'
            ]}
          ],
          terms: [
            ['Danza de cortejo', 'Danza que representa el enamoramiento de una pareja.'],
            ['Zapateo', 'Golpes rítmicos de los pies contra el piso.'],
            ['Escobillao', 'Paso del joropo que barre el piso con los pies.'],
            ['Figura', 'Secuencia coreográfica con nombre propio dentro de una danza.']
          ],
          practice: 'Dibuja un mapa de Colombia y ubica en él diez danzas de esta lección. Marca con un color las que has bailado.'
        },
        {
          id: 'f3', title: 'Posturas, pasos y figuras', minutes: 20,
          summary: 'Cómo se para y se mueve el cuerpo en cada danza.',
          sections: [
            { h: 'Postura base', p: [
              'El PEI recuerda que el estudio del ballet ayuda al bailarín de danza nacional a comprender la correcta posición del cuerpo y a ganar conciencia corporal. En el folclor esa base se adapta: rodillas más flexionadas, peso hacia el piso y el torso en diálogo con el ritmo.'
            ]},
            { h: 'Pasos característicos', list: [
              'Cumbia: la mujer avanza con paso arrastrado, pies pegados al piso y torso erguido; el hombre la corteja con el sombrero en la mano.',
              'Mapalé: movimientos rápidos de cadera y torso, con flexión de rodillas y gran energía.',
              'Currulao: desplazamientos suaves, juego de pañuelo y coqueteo entre la pareja.',
              'Bambuco: figuras como el ocho, el codillo, los coqueteos y la arrodillada.',
              'Joropo: zapateo y escobillao de los pies con la pareja tomada.'
            ]},
            { h: 'Elementos de la puesta en escena', p: [
              'El vestuario forma parte del movimiento: la pollera se maneja con las manos para dibujar figuras, el pañuelo comunica y el sombrero acompaña el cortejo. También se estudian el sombrero vueltiao, el liqui liqui llanero, las alpargatas y los trajes del Pacífico.'
            ]}
          ],
          terms: [
            ['Pollera', 'Falda amplia que la bailarina mueve en las danzas tradicionales.'],
            ['Paso arrastrado', 'Paso de la cumbia en el que los pies no se despegan del piso.'],
            ['Codillo', 'Figura del bambuco en la que la pareja se encuentra por los codos.'],
            ['Sombrero vueltiao', 'Sombrero tradicional del Caribe colombiano, símbolo nacional.']
          ],
          practice: 'Practica el paso arrastrado de la cumbia durante 2 minutos con el torso erguido. Luego intenta 8 tiempos de zapateo de joropo y nota el cambio de energía.'
        },
        {
          id: 'f4', title: 'Música e instrumentos tradicionales', minutes: 15,
          summary: 'Gaitas, tambores, marimba, tiple y arpa: el sonido de cada región.',
          sections: [
            { h: 'Caribe', p: [
              'El conjunto de gaitas y tambores incluye la gaita hembra y la gaita macho (de origen indígena), el tambor alegre, el llamador, la tambora y el maracón. El llamador marca el pulso y el alegre improvisa.'
            ]},
            { h: 'Pacífico', p: [
              'La marimba de chonta, el cununo, el bombo y el guasá acompañan a las cantadoras. Las músicas de marimba y cantos tradicionales del Pacífico Sur colombiano fueron reconocidas como Patrimonio Cultural Inmaterial por la UNESCO. El PEI incluye la práctica instrumental de la región Pacífica en la especialidad.'
            ]},
            { h: 'Andina y Llanos', p: [
              'El trío andino reúne tiple, bandola y guitarra para bambucos y pasillos. En los Llanos el arpa, el cuatro y las maracas sostienen el joropo.'
            ]},
            { h: 'Ritmo y métrica', list: [
              'Bambuco: métrica ternaria, escrita en 3/4 o 6/8, con una acentuación que juega entre ambas.',
              'Cumbia: compás binario, con el llamador marcando el contratiempo.',
              'Joropo: ritmo ternario rápido con sesquiáltera (alternancia de 3/4 y 6/8).',
              'Currulao: ritmo en 6/8 con polirritmia entre marimba, cununos y bombos.'
            ]}
          ],
          terms: [
            ['Llamador', 'Tambor que marca el pulso en la música de gaitas.'],
            ['Marimba de chonta', 'Marimba del Pacífico hecha con palma de chonta.'],
            ['Sesquiáltera', 'Alternancia o superposición de 3/4 y 6/8.'],
            ['Cantadora', 'Mujer que guarda y canta la tradición oral del Pacífico.']
          ],
          practice: 'Escucha un currulao y un bambuco. Marca con palmas el pulso de cada uno y describe en qué se parecen y en qué se diferencian.'
        },
        {
          id: 'f5', title: 'Expresión, comunidad y trabajo en equipo', minutes: 15,
          summary: 'La danza tradicional como encuentro colectivo.',
          sections: [
            { h: 'Expresión con sentido', p: [
              'El PEI define la danza popular como un medio de expresión que se fundamenta en el conocimiento del propio cuerpo, el reconocimiento de los sentimientos y la comunicación espontánea. Bailar folclor es contar una historia de la comunidad: el trabajo, el cortejo, la fiesta o el duelo.'
            ]},
            { h: 'De la ronda al montaje', p: [
              'El programa comienza con los juegos y las rondas infantiles de las regiones. En el nivel de exploración el maestro guía sin imponer, enriqueciendo las ideas de la clase; en el nivel de afirmación aporta la técnica, y en el ciclo de creación e investigación los estudiantes construyen montajes propios.'
            ]},
            { h: 'Trabajo en equipo', list: [
              'Parejas: escucha, cortesía y confianza.',
              'Grupos y comparsas: formaciones en filas, círculos y diagonales que exigen sincronía.',
              'Músicos y bailarines: la danza tradicional es un diálogo vivo con quien toca.',
              'Comunidad: se baila con y para las personas que mantienen la tradición.'
            ]}
          ],
          terms: [
            ['Comparsa', 'Grupo de bailarines que se presenta en desfile o carnaval.'],
            ['Ronda', 'Juego cantado y bailado en círculo.'],
            ['Montaje', 'Obra coreográfica preparada para escena.'],
            ['Portador de tradición', 'Persona de la comunidad que conserva y enseña una práctica cultural.']
          ],
          practice: 'Con tu grupo, monten una ronda infantil de una región que no conozcan. Investiguen su letra y su origen antes de bailarla.'
        },
        {
          id: 'f6', title: 'Gestión cultural y marca personal', minutes: 15,
          summary: 'Del bailarín al promotor cultural: proyectos, redes y circulación.',
          sections: [
            { h: 'El promotor cultural', p: [
              'El PEI describe al promotor cultural como un joven que reconoce y valora el patrimonio danzario y musical del país, con mentalidad emprendedora, capaz de organizar funciones, festivales, eventos y talleres, y de liderar acciones que empoderen a la comunidad.'
            ]},
            { h: 'Herramientas de gestión', list: [
              'Formulación de proyectos: problema, objetivos, actividades, presupuesto y cronograma.',
              'Marketing: conocer al público y comunicar el valor de tu propuesta.',
              'Networking: construir una red de contactos con artistas, organizaciones y empresas.',
              'Políticas culturales: la Ley General de Cultura (Ley 397 de 1997) y las convocatorias públicas de estímulos.',
              'Producción escénica: luces, sonido, vestuario y logística.'
            ]},
            { h: 'Tu identidad como marca', p: [
              'Un artista de danza nacional comunica raíz y creación. Define qué región o tradición te inspira, cómo la reinterpretas y qué propones al público. Mantén coherencia en tu nombre, imagen y mensaje, y da siempre crédito a las comunidades y portadores de tradición.'
            ]}
          ],
          terms: [
            ['Gestión cultural', 'Organización de recursos para hacer posible un proyecto artístico.'],
            ['Circulación', 'Presentación de una obra en distintos escenarios y públicos.'],
            ['Presupuesto', 'Cálculo de lo que cuesta realizar un proyecto.'],
            ['Ley 397 de 1997', 'Ley General de Cultura de Colombia.']
          ],
          practice: 'Escribe en una página la idea de un festival escolar de danzas: nombre, objetivo, público, tres actividades y cómo lo darías a conocer.'
        }
      ],
      quiz: [
        { q: '¿Cuáles son las tres raíces culturales de las danzas colombianas?', o: ['Indígena, africana y europea', 'Asiática, europea e indígena', 'Africana, árabe y europea', 'Solo indígena'], a: 0, e: 'Nuestras danzas nacen del encuentro indígena, africano y europeo.' },
        { q: 'Según el PEI, la danza nacional…', o: ['Copia las danzas sin cambios', 'Usa los elementos del folclor para crear nuevas formas', 'Rechaza el ballet', 'Solo se baila en festivales'], a: 1, e: 'El PEI la define como creación de nuevas formas a partir del folclor, en concordancia con la época.' },
        { q: '¿A qué región pertenece el currulao?', o: ['Andina', 'Llanos', 'Pacífica', 'Insular'], a: 2, e: 'El currulao es del Pacífico y se acompaña con marimba de chonta.' },
        { q: '¿Qué instrumento marca el pulso en el conjunto de gaitas?', o: ['El tiple', 'El llamador', 'El arpa', 'La bandola'], a: 1, e: 'El llamador marca el pulso; el tambor alegre improvisa.' },
        { q: 'El joropo es característico de…', o: ['Los Llanos Orientales', 'San Andrés', 'El Huila', 'El Chocó'], a: 0, e: 'El joropo es la danza de los Llanos, con arpa, cuatro y maracas.' },
        { q: 'En la cumbia, la mujer avanza con…', o: ['Saltos amplios', 'Paso arrastrado y torso erguido', 'Zapateo fuerte', 'Giros en puntas'], a: 1, e: 'El paso arrastrado de la cumbia mantiene los pies pegados al piso.' },
        { q: '¿Qué maestro citado en el PEI defendió el folclor en la educación?', o: ['Octavio Marulanda', 'Marius Petipa', 'Rudolf Laban', 'Merce Cunningham'], a: 0, e: 'El PEI recoge los lineamientos de Octavio Marulanda (1980).' },
        { q: 'El codillo y los ochos son figuras de…', o: ['El mapalé', 'El bambuco', 'El calypso', 'El joropo'], a: 1, e: 'Son figuras tradicionales del bambuco.' },
        { q: '¿Qué es la sesquiáltera?', o: ['Un tipo de vestuario', 'La alternancia de 3/4 y 6/8', 'Un instrumento llanero', 'Una figura de la cumbia'], a: 1, e: 'Es la alternancia o superposición de métricas ternaria y binaria compuesta.' },
        { q: '¿Qué ley es la Ley General de Cultura de Colombia?', o: ['Ley 115 de 1994', 'Ley 397 de 1997', 'Ley 1290 de 2009', 'Ley 30 de 1992'], a: 1, e: 'La Ley 397 de 1997 es la Ley General de Cultura.' }
      ]
    }
  ];

  /* Sistema institucional de evaluación (PEI, Capítulo II, Escala de valoración) */
  const SCALE = [
    { key: 'superior', label: 'Superior', min: 4.7 },
    { key: 'alto', label: 'Alto', min: 4.0 },
    { key: 'basico', label: 'Básico', min: 3.0 },
    { key: 'bajo', label: 'Bajo', min: 1.0 }
  ];
  // Parágrafo 1: cognitivo 50 %, personal 30 %, social 15 %, autoevaluación 5 %.
  const WEIGHTS = { cognitive: 0.5, personal: 0.3, social: 0.15, self: 0.05 };
  const PASS = 3.0;

  function level(score) {
    if (score == null || isNaN(score)) return null;
    return SCALE.find(s => score >= s.min - 1e-9) || SCALE[SCALE.length - 1];
  }

  function round1(n) { return Math.round(n * 10) / 10; }

  // Nota cognitiva de un intento: 1.0 a 5.0 proporcional a los aciertos.
  function quizScore(correct, total) { return round1(1 + 4 * (correct / total)); }

  function gradeQuiz(moduleId, answers) {
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod) throw new Error('Módulo no encontrado');
    let correct = 0;
    const review = mod.quiz.map((item, i) => {
      const ok = Number(answers[i]) === item.a;
      if (ok) correct++;
      return { ok, chosen: answers[i] == null ? null : Number(answers[i]), answer: item.a, explain: item.e };
    });
    return { correct, total: mod.quiz.length, score: quizScore(correct, mod.quiz.length), review };
  }

  // Nota del módulo. Si faltan componentes, se reescala sobre los disponibles y se marca como parcial.
  function moduleGrade(record, moduleId) {
    const attempts = (record.attempts || []).filter(a => a.module === moduleId);
    const best = attempts.length ? Math.max(...attempts.map(a => a.score)) : null;
    const marks = (record.marks || {})[moduleId] || {};
    const parts = { cognitive: best, personal: marks.personal, social: marks.social, self: marks.self };
    let sum = 0, w = 0;
    for (const k in WEIGHTS) if (parts[k] != null && parts[k] !== '') { sum += Number(parts[k]) * WEIGHTS[k]; w += WEIGHTS[k]; }
    if (!w) return { parts, final: null, partial: true, attempts: attempts.length };
    const final = round1(sum / w);
    return { parts, final, partial: w < 0.999, attempts: attempts.length, level: level(final) };
  }

  function moduleProgress(record, moduleId) {
    const mod = MODULES.find(m => m.id === moduleId);
    const done = ((record.lessons || {})[moduleId] || []).filter(id => mod.lessons.some(l => l.id === id));
    const evalDone = (record.attempts || []).some(a => a.module === moduleId);
    const steps = mod.lessons.length + 1;
    return { done: done.length, total: mod.lessons.length, evalDone, pct: Math.round(((done.length + (evalDone ? 1 : 0)) / steps) * 100) };
  }

  return { MODULES, SCALE, WEIGHTS, PASS, level, gradeQuiz, moduleGrade, moduleProgress, round1 };
});
