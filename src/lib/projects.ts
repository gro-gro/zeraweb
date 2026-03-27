export interface Socials {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

export interface Project {
  slug: string;
  name: string;
  logo?: string;
  bgImage: string;
  bgColor?: string;
  tags: string[];
  category: "creadores" | "organizaciones" | "experimentales";
  description: string;
  longDescription: string[];
  participantIds: string[];
  socials: Socials;
  status: "active" | "inactive";
}

export const projects: Project[] = [
  // ── IMPULSO ──────────────────────────────────────────────────────────
  {
    slug: "impulso",
    name: "Impulso",
    bgImage: "/images/project-impulso.jpg",
    bgColor: "#2D1B69",
    tags: ["psicologia", "true-crime", "comportamiento-humano"],
    category: "creadores",
    participantIds: ["sebastian-saravia"],
    socials: { instagram: "impulso.ok", youtube: "impulso" },
    status: "active",
    description:
      "Un podcast que mezcla psicologia aplicada y true crime para responder una sola pregunta: por que hacemos lo que hacemos?",
    longDescription: [
      "Impulso es un podcast conducido por Sebastian Saravia, psicologo y divulgador, que propone una mirada diferente sobre la mente humana, la emocion y el comportamiento. Cada episodio parte de un caso real -un crimen, un fenomeno social, una historia que impacto a la opinion publica- para hacerse una sola pregunta: por que hacemos lo que hacemos? El resultado es un formato que mezcla true crime con psicologia aplicada, sin sensacionalismo y con muchisima profundidad.",
      "Lo que diferencia a Impulso del ruido del genero es la voz de Saravia: un profesional que no habla desde el pedestal del experto, sino desde la curiosidad genuina de alguien que lleva anos estudiando la complejidad del ser humano. Esa combinacion -rigor clinico con narracion accesible- hace que el oyente aprenda sin darse cuenta, envuelto en una historia que no puede parar de escuchar.",
      "El proyecto tiene presencia en Instagram y YouTube, donde el contenido de archivo y los clips de episodios construyen una comunidad que vuelve semana a semana. Impulso no es solo un podcast: es una invitacion a entenderse un poco mejor a uno mismo, a traves de los errores, las decisiones y las contradicciones de otros.",
    ],
  },

  // ── DARIN COCINA ─────────────────────────────────────────────────────
  {
    slug: "darin-cocina",
    name: "Darin Cocina",
    bgImage: "/images/project-darin-cocina.jpg",
    bgColor: "#C13B2A",
    tags: ["parodia", "humor", "inteligencia-artificial"],
    category: "experimentales",
    participantIds: ["zeratype"],
    socials: { instagram: "darincocina" },
    status: "active",
    description:
      "Una parodia generada con IA donde Ricardo Darin se convierte en chef. Humor absurdo argentino potenciado por inteligencia artificial.",
    longDescription: [
      "Darin Cocina es la parodia de IA mas argentina que existe. En este proyecto, Ricardo Darin -el actor mas querido del cine nacional- se convierte, a traves de la magia de la inteligencia artificial, en un chef apasionado que comparte sus mejores recetas con la misma seriedad y carisma con la que protagonizo El secreto de sus ojos. Claro que todo es ficticio, absurdo y deliberadamente ridiculo. Y eso es exactamente lo que lo hace funcionar.",
      "El proyecto nacio como una exploracion experimental de Zeratype sobre los limites del contenido generado con IA: que pasa cuando pones una figura cultural iconica en un contexto completamente ajeno a su mundo? La respuesta fue una cuenta que mezcla el humor con la cultura pop argentina de una forma que inmediatamente se siente familiar. El Darin cocinero tiene algo de inevitable: por supuesto que asi seria si cocinara.",
      "Mas alla del chiste, Darin Cocina funciona como laboratorio. Es un espacio donde Zeratype prueba formatos, tecnologias y posibilidades narrativas de la IA aplicada al entretenimiento. Un proyecto pequeno, autocontenido y con una premisa imposible de ignorar cuando la ves en el feed.",
    ],
  },

  // ── DIETA ────────────────────────────────────────────────────────────
  {
    slug: "dieta",
    name: "Dieta",
    bgImage: "/images/project-dieta.jpg",
    bgColor: "#4A5D23",
    tags: ["cultura", "arte", "revista-digital"],
    category: "experimentales",
    participantIds: ["zeratype"],
    socials: { instagram: "dieta" },
    status: "active",
    description:
      "Una revista digital de cultura que alimenta. Curaduria de arte, cine, musica y filosofia en un ecosistema creativo.",
    longDescription: [
      "Dieta es una revista digital de cultura que, como su nombre lo dice, propone una forma de alimentarse con lo que uno consume. No todo es basura en internet -Dieta busca lo que vale la pena, lo que nutre, lo que deja algo despues de haberlo visto, leido o escuchado. Es un proyecto editorial que funciona como curaduria y como punto de encuentro para una escena creativa que no siempre tiene un hogar claro en las redes.",
      "El universo de Dieta orbita alrededor de proyectos afines: archivo909, una publicacion dedicada al cine, la musica, la fotografia y la filosofia; y magnolia*, un espacio que moldea arte y cultura desde una estetica singular. Los tres funcionan de manera complementaria, construyendo un ecosistema de contenido cultural que no busca el algoritmo sino la coherencia.",
      "Como proyecto experimental de Zeratype, Dieta es tambien una apuesta por formas distintas de hacer contenido: mas lento, mas reflexivo, mas interesado en lo que dura que en lo que viraliza. En un ecosistema digital donde todo pasa rapido, Dieta propone quedarse un rato mas.",
    ],
  },

  // ── SERIES EN SERIO ──────────────────────────────────────────────────
  {
    slug: "series-en-serio",
    name: "Series en Serio",
    bgImage: "/images/project-series-en-serio.jpg",
    bgColor: "#1A2744",
    tags: ["series", "entretenimiento", "problematicas-sociales"],
    category: "creadores",
    participantIds: ["javi-ponzo"],
    socials: { instagram: "seriesenserio", youtube: "seriesenserio" },
    status: "active",
    description:
      "El podcast que usa las ficciones mas populares como excusa para hablar de lo que realmente importa.",
    longDescription: [
      "Series en Serio es el podcast que toma las ficciones mas populares del momento y las usa como puerta de entrada a conversaciones que realmente importan. Conducido por Javier Ponzo, cada episodio toma una serie -Breaking Bad, 13 Reasons Why, El juego del calamar, lo que sea que todos esten viendo- y la analiza junto a un especialista en la tematica que esa ficcion aborda. El resultado es algo raro y efectivo: educacion que parece entretenimiento.",
      "El formato funciona porque parte de algo que la audiencia ya conoce y le gusta. No hace falta convencer a nadie de que la serie es buena -todos ya la vieron. Lo que hace Series en Serio es abrir el segundo nivel: el bullying detras de Stranger Things, la adiccion detras de Euphoria, el sindrome del impostor detras de Succession. Especialistas en salud mental, sociologia, medicina y mas se sientan con Ponzo a hablar de lo que la pantalla pone en escena.",
      "El proyecto tiene presencia en Instagram y YouTube, donde el contenido visual acompana y amplia lo que se discute en cada episodio. Series en Serio convirtio el habito de ver series -algo que todos hacemos, a veces con algo de culpa- en una excusa legitima para aprender y reflexionar. Porque es hora de ver las series, en serio.",
    ],
  },

  // ── EN TEORIA ────────────────────────────────────────────────────────
  {
    slug: "en-teoria",
    name: "En Teoria",
    bgImage: "/images/project-en-teoria.jpg",
    bgColor: "#1A6B5C",
    tags: ["ciencia", "divulgacion"],
    category: "creadores",
    participantIds: ["almendra-veiga", "celeste-giardinelli"],
    socials: { instagram: "enteoria", tiktok: "enteoria", youtube: "enteoria" },
    status: "active",
    description:
      "Un podcast de ciencia para mentes curiosas conducido por dos periodistas que hacen que la ciencia sea fascinante.",
    longDescription: [
      "En Teoria es un podcast de ciencia para mentes curiosas que no estudiaron ciencia. Conducido por Almendra Veiga y Celeste Giardinelli -dos periodistas y divulgadoras que se conocen desde hace anos y que tienen una quimica tan natural como los elementos de la tabla periodica- el proyecto explora biologia, fisica, neurociencia, astronomia y todo lo que esta en el medio con un entusiasmo genuino que resulta completamente contagioso.",
      "Lo que hace especial a En Teoria no es solo la calidad del contenido sino la relacion entre sus conductoras. Almendra y Celeste se preguntan cosas, se interrumpen, se rien, se corrigen y se sorprenden juntas. Ese dinamismo convierte cada episodio en algo que se siente menos como una clase y mas como escuchar a dos amigas muy inteligentes hablando de algo que las fascina. La ciencia, en su boca, nunca parece lejana ni aburrida.",
      "El proyecto tiene una presencia multiplataforma solida, con contenido adaptado para Instagram, TikTok y YouTube, donde los clips y los resumenes visuales llevan la ciencia a audiencias que quizas nunca entrarian a un podcast de divulgacion por iniciativa propia. En Teoria demuestra que cuando el contenido es honesto y las personas detras son autenticas, la ciencia puede ser tan adictiva como cualquier otra cosa.",
    ],
  },

  // ── MINDSET EMPRENDEDOR ──────────────────────────────────────────────
  {
    slug: "mindset-emprendedor",
    name: "Mindset Emprendedor",
    bgImage: "/images/project-mindset-emprendedor.jpg",
    bgColor: "#8B6914",
    tags: ["emprendimiento", "negocios", "mentalidad"],
    category: "creadores",
    participantIds: ["yuliana-bustamante"],
    socials: { instagram: "mindsetemprendedor" },
    status: "active",
    description:
      "El espacio para los que construyen contra todo pronostico. Historias, herramientas y perspectivas para emprendedores.",
    longDescription: [
      "Mindset Emprendedor es el espacio para los que construyen contra todo pronostico. Un podcast dedicado a emprendedores que no se rinden, con historias, herramientas y perspectivas para crecer en cualquier contexto -especialmente en los mas adversos. El proyecto entiende que emprender no es solo tener un negocio: es una forma de pararse frente al mundo, de tomar decisiones, de tolerar la incertidumbre y de seguir adelante cuando todo indica que no tiene sentido.",
      "Conducido por Yuliana Bustamante, el podcast combina entrevistas con emprendedores reales, reflexiones sobre mentalidad y estrategia, y contenido accionable para quienes estan en el proceso de construir algo propio. No es un podcast de motivacion vacia: es un espacio para pensar en serio sobre lo que implica emprender, con todas las contradicciones y complejidades que eso conlleva.",
      "El proyecto se apoya en referentes internacionales como The Diary of a CEO como inspiracion de formato, apostando a conversaciones largas, profundas y sin apuro que permitan explorar la mentalidad emprendedora con la seriedad que se merece. Mindset Emprendedor es para los que ya empezaron, para los que estan a punto de hacerlo y para los que necesitan recordar por que empezaron.",
    ],
  },

  // ── PAUSA ACTIVA ─────────────────────────────────────────────────────
  {
    slug: "pausa-activa",
    name: "Pausa Activa",
    bgImage: "/images/project-pausa-activa.jpg",
    bgColor: "#2D5A3D",
    tags: ["bienestar", "salud", "wellness"],
    category: "creadores",
    participantIds: ["lucas-ortega"],
    socials: { instagram: "pausaactiva", tiktok: "pausaactiva", youtube: "pausaactiva" },
    status: "active",
    description:
      "Un espacio para explorar el bienestar de forma integral. Salud fisica, mental y habitos para el dia a dia.",
    longDescription: [
      "Pausa Activa es una invitacion a frenar. En un mundo que premia la aceleracion constante, el proyecto propone otra forma de entender el bienestar: no como una meta que se alcanza sino como una practica que se construye en lo cotidiano. Conducido por Lucas Ortega, el podcast y sus redes abordan temas de salud fisica, salud mental, habitos y calidad de vida desde un lugar accesible y sin exigencias.",
      "El nombre lo dice todo. Una pausa activa no es una pausa pasiva -no es tirar todo y descansar sin pensar. Es un momento consciente de reconectar con el cuerpo, con la mente y con lo que uno realmente necesita. Ese concepto atraviesa todo el contenido del proyecto: episodios que invitan a reflexionar, a moverse diferente, a comer mejor, a dormir mas, a decir que no cuando hace falta.",
      "Con presencia en Instagram, TikTok y YouTube, Pausa Activa construye una comunidad que vuelve porque encuentra algo que pocas cuentas de bienestar ofrecen: honestidad. No promesas imposibles ni rutinas perfectas. Solo contenido que acompana a las personas en el proceso real de cuidarse mejor, con todo lo que eso implica.",
    ],
  },

  // ── DR. DIEGO FERNANDEZ SASSO ────────────────────────────────────────
  {
    slug: "diego-fernandez-sasso",
    name: "Dr. Diego Fernandez Sasso",
    bgImage: "/images/project-diego-sasso.jpg",
    bgColor: "#2A6496",
    tags: ["pediatria", "crianza", "salud-infantil"],
    category: "creadores",
    participantIds: ["diego-fernandez-sasso"],
    socials: { instagram: "doctorsasso", tiktok: "doctorsasso" },
    status: "active",
    description:
      "Pediatria accesible y humana. Un medico que habla el idioma de los padres y no da miedo.",
    longDescription: [
      "El Dr. Diego Fernandez Sasso es jefe del servicio de pediatria y director de Criocenter, con una trayectoria clinica solida que no impide -sino que potencia- su vocacion por la comunicacion. En sus redes, el medico lleva la pediatria al terreno de lo cotidiano: habla de fiebre, de sueno, de alimentacion, de vacunas y de todo lo que angustia a los padres a las dos de la manana, con una claridad que descomprime y una empatia que genera confianza.",
      "Lo que distingue al Dr. Sasso en el ecosistema de divulgacion medica es su tono. No da miedo, no exagera, no hace sentir culpa. Entiende que los padres no son medicos y que el acceso a informacion confiable no deberia estar reservado para los que tienen una consulta paga. Su presencia en redes es, en ese sentido, un acto de servicio: hacer que la pediatria sea accesible, comprensible y humana.",
      "El proyecto tiene presencia en Instagram, donde el contenido de posts y reels cumple una funcion educativa, y en TikTok, donde el formato breve permite llegar a audiencias mas jovenes -madres y padres primerizos que hoy buscan respuestas en el scroll antes que en el buscador. Un proyecto de representacion que Zeratype acompana para ayudar al Dr. Sasso a escalar su mensaje sin perder su esencia.",
    ],
  },

  // ── SEGURAMENTE ──────────────────────────────────────────────────────
  {
    slug: "seguramente",
    name: "SeguraMente",
    bgImage: "/images/project-seguramente.jpg",
    bgColor: "#1B3A5C",
    tags: ["bienestar", "finanzas", "salud-mental"],
    category: "organizaciones",
    participantIds: ["zurich-argentina"],
    socials: { instagram: "seguramente", tiktok: "seguramente", youtube: "seguramente" },
    status: "active",
    description:
      "El podcast de Zurich Argentina con conversaciones que protegen el bienestar. Finanzas, salud mental y vida cotidiana.",
    longDescription: [
      "SeguraMente es el podcast presentado por Zurich Argentina que propone algo inusual para una marca de seguros: conversaciones reales sobre lo que mas les preocupa a las personas. Finanzas personales, salud mental, decisiones de vida, vinculos y bienestar integral son los ejes de un proyecto que entiende que protegerse no es solo tener una poliza, sino estar bien en el dia a dia.",
      "El proyecto funciona gracias a una apuesta editorial clara: en lugar de hablar de seguros, SeguraMente habla de vida. Y para hacerlo convoca a creadores de contenido que ya tienen vinculo genuino con esas tematicas. Camila Ibarbalz habla de finanzas, Mica Tissieres de seguros accesibles, Sebastian Saravia de psicologia, Emiliano Pinson de economia cotidiana, Gisele Sousa Dias de bienestar, Lara Lopez Calvo y Patricia Jebsen de estilo de vida, y Florencia Marzol de maternidad y fitness. Cada voz es autentica en su area, y eso se nota.",
      "El resultado es un contenido de marca que no parece publicidad -porque, en el fondo, no lo es. Es divulgacion real sobre temas que importan, con el respaldo de una compania que apuesta por el bienestar de las personas mas alla del producto que vende. Un modelo de branded content que demuestra que cuando las marcas escuchan en lugar de solo hablar, la audiencia responde.",
    ],
  },

  // ── EL SUENO DE LA VIDA PROPIA ───────────────────────────────────────
  {
    slug: "el-sueno-de-la-vida-propia",
    name: "El Sueno de la Vida Propia",
    bgImage: "/images/project-el-sueno.jpg",
    bgColor: "#8B3A5C",
    tags: ["desarrollo-personal", "independencia"],
    category: "creadores",
    participantIds: ["sra-bimbo", "mar-benassai"],
    socials: {
      instagram: "elsuenodelavidapropia",
      tiktok: "elsuenodelavidapropia",
      youtube: "elsuenodelavidapropia",
    },
    status: "active",
    description:
      "Un podcast para pensarse y acompanarse en el sueno lucido de crearse la vida. Conducido por Bimbo y Mar.",
    longDescription: [
      "El Sueno de la Vida Propia es un podcast sobre eso que todos dicen que quieren pero pocos saben como construir: una vida que sea genuinamente propia. Conducido por Bimbo y Mar, el proyecto nacio de una pregunta simple y devastadora: que significa armar tu propia vida? No la que esperan tus viejos, ni la que se ve bien en Instagram, sino la que uno elige con todo lo que implica elegir -los miedos, las dudas, el caos y los momentos en que algo finalmente hace clic.",
      "Lo que hace especial al proyecto es la honestidad de sus conductoras. Bimbo y Mar no hablan desde un lugar de certeza ni desde la logica del coach que ya lo resolvio todo. Hablan desde adentro del proceso, con sus propias contradicciones a la vista. Eso genera una identificacion inmediata: la audiencia no escucha a alguien que llego sino a alguien que tambien esta en camino.",
      "El proyecto tiene una presencia solida en Instagram, TikTok y YouTube, donde el contenido de episodios, reflexiones y momentos del detras de escena construyen una comunidad que se siente parte de algo. El Sueno de la Vida Propia no promete formulas. Ofrece compania en el viaje, que a veces es lo unico que hace falta.",
    ],
  },

  // ── CRIEMOS LIBRES ───────────────────────────────────────────────────
  {
    slug: "criemos-libres",
    name: "Criemos Libres",
    bgImage: "/images/project-criemos-libres.jpg",
    bgColor: "#B85C2A",
    tags: ["crianza", "maternidad", "familia"],
    category: "creadores",
    participantIds: ["agus-battioni", "mila-fermani"],
    socials: { instagram: "criemoslibres", tiktok: "criemoslibres", youtube: "criemoslibres" },
    status: "active",
    description:
      "Una comunidad que reflexiona y acompana la crianza sin juzgar. Conducido por Agus Battioni y Mila Fermani.",
    longDescription: [
      "Criemos Libres es una comunidad para madres y padres que quieren criar bien pero no saben exactamente que significa eso -y que se sienten solos haciendolo. Conducido por Agus Battioni y Mila Fermani, el proyecto funciona como punto de encuentro entre la experiencia cotidiana de criar y el conocimiento de los profesionales que acompanan ese proceso: pediatras, psicologos, nutricionistas, neonatologos y mas.",
      "La propuesta es simple y poderosa: hablar de crianza sin juzgar. En un contexto donde las redes sociales suelen funcionar como escaparate de la maternidad y paternidad perfecta, Criemos Libres apuesta por lo contrario -la honestidad, la duda, el error y la pregunta que da verguenza hacer. Por eso tiene especialistas de primer nivel como el Dr. Fernando Burgos, el Dr. Federico Diaz, los Doctores Lamas y el Dr. Montes de Oca, entre otros, que no solo informan sino que acompanan.",
      "Con presencia en Instagram, TikTok y YouTube, el proyecto construyo una comunidad grande y activa que vuelve semana a semana porque encuentra algo escaso: informacion confiable entregada sin condescendencia. Criemos Libres entiende que criar es uno de los trabajos mas dificiles que existen, y que nadie deberia tener que hacerlo solo.",
    ],
  },

  // ── CERO MILIGRAMOS ──────────────────────────────────────────────────
  {
    slug: "cero-miligramos",
    name: "Cero Miligramos",
    bgImage: "/images/project-cero-miligramos.jpg",
    bgColor: "#1A4A4A",
    tags: ["salud-mental", "divulgacion"],
    category: "creadores",
    participantIds: ["santi-talledo", "candela-di-risio"],
    socials: { instagram: "ceromiligramos", tiktok: "ceromiligramos", youtube: "ceromiligramos" },
    status: "active",
    description:
      "Un podcast que habla de salud mental sin filtros y sin vueltas. Nacido del diario intimo de Santi Talledo.",
    longDescription: [
      "Cero Miligramos nacio de un diario. Las paginas que Santi Talledo escribio durante los momentos mas dificiles de su adolescencia, cuando ya convivia con trastornos de salud mental, se convirtieron en la materia prima de un proyecto que hoy llega a cientos de miles de personas. El nombre hace referencia a un estado ideal que rara vez se alcanza: cero miligramos de medicacion, cero sintomas, cero problema. Pero tambien a algo mas honesto: hablar de salud mental desde adentro, con todo lo que eso implica.",
      "El proyecto va mas alla de la experiencia personal de Santi. Junto a Candela Di Risio, psicologa y divulgadora, Cero Miligramos aborda los trastornos de salud mental mas frecuentes -ansiedad, depresion, TOC, trastornos alimentarios, entre otros- con rigor clinico y sin los eufemismos que suelen rodear estas conversaciones. La combinacion de la voz del paciente y la voz de la profesional crea un formato unico que contiene y educa al mismo tiempo.",
      "Con presencia en Instagram, TikTok y YouTube, Cero Miligramos construyo una de las comunidades de salud mental mas comprometidas de las redes en Argentina. La audiencia no solo consume: comenta, comparte y se identifica de formas que pocas cuentas logran. Porque cuando alguien habla de salud mental con esta honestidad, el que escucha entiende que no esta solo -y eso, a veces, es el primer paso hacia algo mejor.",
    ],
  },

  // ── EL PRESENTADOR ───────────────────────────────────────────────────
  {
    slug: "el-presentador",
    name: "El Presentador",
    bgImage: "/images/project-el-presentador.jpg",
    bgColor: "#2A3F8B",
    tags: ["entretenimiento", "memes", "humor"],
    category: "experimentales",
    participantIds: ["fede-villar-bruno", "zeratype"],
    socials: { instagram: "elpresentador" },
    status: "active",
    description:
      "Un proyecto experimental donde se reacciona y comenta los mejores memes virales del momento.",
    longDescription: [
      "El Presentador es un proyecto experimental de entretenimiento donde la cultura del meme se encuentra con el formato del conductor. Fede Villar Bruno reacciona, comenta y presenta los memes y videos virales del momento con la energia de un animador de television que llego tarde al streaming pero se adapto perfectamente. El resultado es un formato agil, liviano y completamente adictivo para quien ya tiene esos memes en el feed y quiere verlos con ojos frescos.",
      "El concepto parte de una observacion simple: los memes existen, circulan y generan comunidad, pero rara vez alguien les da voz. El Presentador hace exactamente eso -toma lo que ya todos estan viendo y lo convierte en contenido con un punto de vista, un timing comico y una energia que le da una segunda vida a los formatos mas rapidos de internet.",
      "Como proyecto experimental de Zeratype, El Presentador funciona tambien como laboratorio de formato: cuanto puede durar un video de reaccion? Que hace que un conductor virtual genere fidelidad? Se puede construir una comunidad alrededor del humor viral sin que el proyecto quede viejo al dia siguiente? Esas son las preguntas que el proyecto intenta responder, episodio a episodio.",
    ],
  },

  // ── ZIP ──────────────────────────────────────────────────────────────
  {
    slug: "zip",
    name: "ZIP",
    bgImage: "/images/project-zip.jpg",
    bgColor: "#2A2A2A",
    tags: ["noticias", "periodismo", "actualidad"],
    category: "creadores",
    participantIds: ["fede-bareiro"],
    socials: { instagram: "somoszip", x: "somoszip" },
    status: "active",
    description:
      "ZIP comprime las noticias. Periodismo directo, claro y sin relleno para estar informados sin perderse en el ruido.",
    longDescription: [
      "ZIP comprime las noticias. En un ecosistema de informacion donde todo es urgente, todo es ruido y todo compite por la misma atencion, ZIP elige lo contrario: la sintesis, la claridad y el respeto por el tiempo de quien lee. Conducido por Fede Bareiro, el proyecto apuesta por un periodismo directo que no da vueltas, que no especula y que confia en que la audiencia puede procesar informacion compleja si alguien se la presenta bien.",
      "El formato de ZIP no es nuevo -el boletin de noticias existe desde que existe el periodismo. Pero lo que hace el proyecto es adaptarlo a los habitos de una generacion que consume noticias entre stories y que necesita entender que paso en el mundo sin dedicarle una hora a hacerlo. ZIP entra, dice lo que hay, y sale. Sin relleno, sin clickbait, sin drama innecesario.",
      "Con presencia en Instagram y en X -la plataforma natural del periodismo en tiempo real- ZIP se posiciona como una alternativa creible para quienes quieren estar informados sin perderse en el laberinto de los medios tradicionales. Un proyecto que apuesta a que el buen periodismo no necesita ser largo para ser bueno.",
    ],
  },

  // ── UNBOX ────────────────────────────────────────────────────────────
  {
    slug: "unbox",
    name: "UNBOX",
    bgImage: "/images/project-unbox.jpg",
    bgColor: "#6B2A5C",
    tags: ["entrevistas", "cultura", "entretenimiento"],
    category: "creadores",
    participantIds: ["german-beder"],
    socials: { instagram: "unbox", tiktok: "unbox" },
    status: "active",
    description:
      "Un show de entrevistas conducido por German Beder. Disponible gratis por Mercado Play.",
    longDescription: [
      "UNBOX es un show de entrevistas conducido por German Beder, disponible de forma gratuita por Mercado Play. La premisa es tan simple como poderosa: abrir la caja -unbox- y ver que hay adentro. No la imagen publica, no el personaje de Instagram, sino la persona real detras de la figura. Beder es un entrevistador con el talento de hacer sentir como si la conversacion tuviera lugar en un living privado, aunque la esten viendo miles.",
      "El proyecto convoca a figuras del entretenimiento, los deportes, el periodismo y la cultura argentina: Sofi Martinez, Diego Poggi, Joan Cwaik, Johanna Francella, Agustin Belachur, Guillermina Cardoso, Lara Lopez Calvo y mas. Cada entrevista es un ejercicio de apertura -un espacio donde el entrevistado puede mostrarse de una forma que sus propias redes no suelen permitir. Y eso, en el ecosistema del contenido actual, es un diferencial enorme.",
      "Con presencia en Instagram y TikTok -donde los clips y los mejores momentos de cada episodio funcionan como motor de descubrimiento- UNBOX construyo una audiencia que no va por el tema sino por el conductor. Porque cuando el entrevistador es bueno, cualquier persona se vuelve interesante. Y Beder lo es.",
    ],
  },

  // ── SALDO A FAVOR ────────────────────────────────────────────────────
  {
    slug: "saldo-a-favor",
    name: "Saldo a Favor",
    bgImage: "/images/project-saldo-a-favor.jpg",
    bgColor: "#2A6B3A",
    tags: ["finanzas", "economia"],
    category: "creadores",
    participantIds: ["el-malbeki", "guido-iannaccone", "sin1billete"],
    socials: { instagram: "saldoafavor", tiktok: "saldoafavor" },
    status: "active",
    description:
      "Finanzas personales sin rodeos. Tres creadores del nicho financiero haciendo accesible la educacion financiera.",
    longDescription: [
      "Saldo a Favor nacio de una conviccion: hablar de plata no tiene que ser aburrido, lejano ni exclusivo. El proyecto reune a tres creadores que ya tenian comunidad en el nicho de las finanzas personales -El Malbeki, Guido Iannaccone y Sin1Billete- y los junta en un formato que combina educacion financiera con entretenimiento, desde una perspectiva local y sin rodeos.",
      "Lo que diferencia a Saldo a Favor de otros proyectos del nicho es que no pretende ensenar desde arriba. Sus conductores hablan desde la misma realidad que su audiencia: una Argentina impredecible, con inflacion, con opciones de inversion confusas y con una relacion historicamente complicada con el dinero. Esa identificacion es lo que genera comunidad -no solo oyentes sino personas que vuelven porque sienten que alguien los entiende.",
      "Con presencia en Instagram y TikTok, el proyecto funciona tanto en formato corto -datos rapidos, tips accionables, contexto sobre la economia del dia- como en episodios mas extensos donde los tres conductores se sientan a analizar temas con mas profundidad. Saldo a Favor es la prueba de que cuando la educacion financiera deja de ser para pocos, todos terminan con mas herramientas para manejarse mejor.",
    ],
  },

  // ── EL RUFIAN ────────────────────────────────────────────────────────
  {
    slug: "el-rufian",
    name: "El Rufian",
    bgImage: "/images/project-el-rufian.jpg",
    bgColor: "#111111",
    tags: ["fitness", "entrenamiento", "motivacion"],
    category: "creadores",
    participantIds: ["ema-rufian-hahn"],
    socials: { instagram: "soyelrufian", tiktok: "elrufian" },
    status: "active",
    description:
      "Fitness con autenticidad. Ema Rufian Hahn convierte el entrenamiento en identidad.",
    longDescription: [
      "El Rufian hace que entrenar tenga sentido, incluso para los que siempre dijeron que no podian. Ema Rufian Hahn construyo una comunidad fitness basada en algo que escasea en el genero: autenticidad. Sin poses de gimnasio, sin cuerpos perfectamente iluminados y sin la presion de la productividad a toda costa, El Rufian propone una relacion con el movimiento que sea sostenible, honesta y hasta divertida.",
      "El proyecto mezcla contenido de entrenamiento -rutinas, consejos, motivacion- con una personalidad que no cabe en el molde clasico del influencer de fitness. Ema tiene humor, tiene criterio y tiene la capacidad de hacer que la audiencia se sienta acompanada en lugar de juzgada. Eso genera un tipo de fidelidad que no es facil de replicar: el seguidor de El Rufian no solo mira el contenido, lo practica.",
      "El proyecto tiene respaldo de marcas como Adidas, lo que habla del nivel de influencia real que construyo Ema en su nicho. Con presencia en Instagram y TikTok, El Rufian sigue creciendo sobre una base solida: la confianza de una comunidad que encontro en este proyecto no solo inspiracion para moverse, sino una identidad con la que identificarse.",
    ],
  },

  // ── A1000 ────────────────────────────────────────────────────────────
  {
    slug: "a1000",
    name: "A1000",
    bgImage: "/images/project-a1000.jpg",
    bgColor: "#3A3A4A",
    tags: ["ciudad", "urbanismo", "comunidad"],
    category: "organizaciones",
    participantIds: [],
    socials: { instagram: "a1000" },
    status: "inactive",
    description:
      "Una comunidad de personas que aman, piensan y hacen la Ciudad de Buenos Aires.",
    longDescription: [
      "A1000 es una comunidad para los que aman Buenos Aires -no de forma nostalgica o turistica, sino de la manera activa y comprometida de quien vive en ella y quiere entenderla. El proyecto nuclea a urbanistas, vecinos, emprendedores y entusiastas de la ciudad que creen que Buenos Aires se construye y se discute entre todos, y que el espacio publico es de quienes lo habitan.",
      "Con newsletters y contenido en redes sociales, A1000 propone una mirada critica y afectuosa sobre la ciudad: sus barrios, sus politicas de movilidad, su arquitectura, sus problematicas de vivienda y los proyectos que intentan mejorarla. No es un medio de noticias municipales sino un espacio de pensamiento y comunidad para los que quieren mas de la ciudad en la que viven.",
      "El proyecto estuvo activo en un momento donde la conversacion sobre el espacio urbano en Argentina gano relevancia, y dejo una audiencia que valoro tener un punto de encuentro para esa discusion. Actualmente se encuentra inactivo, aunque la comunidad que construyo y el contenido que genero siguen siendo referencia para quienes piensan la ciudad.",
    ],
  },

  // ── ESPACIO SEGURO ───────────────────────────────────────────────────
  {
    slug: "espacio-seguro",
    name: "Espacio Seguro",
    bgImage: "/images/project-espacio-seguro.jpg",
    bgColor: "#5C2A6B",
    tags: ["familia", "diversidad", "lgbtq"],
    category: "creadores",
    participantIds: ["valen", "sofi"],
    socials: { instagram: "espacioseguro", youtube: "espacioseguro" },
    status: "inactive",
    description:
      "Un podcast sobre familia y diversidad. Todas las formas de familia son validas.",
    longDescription: [
      "Espacio Seguro fue un podcast sobre familia con una premisa sencilla y revolucionaria: todas las formas de familia son validas. Conducido por Valen y Sofi, el proyecto nacio para visibilizar y celebrar la diversidad de vinculos, estructuras y formas de convivencia que existen -y que rara vez tienen representacion en los medios tradicionales. Familias homoparentales, monoparentales, ensambladas, sin hijos por eleccion: todas tenian lugar en Espacio Seguro.",
      "Lo que hizo especial al proyecto fue su capacidad de hablar de diversidad sin que pareciera una agenda. Valen y Sofi construyeron un espacio de conversacion genuina donde las personas podian reconocerse, sentirse acompanadas y encontrar vocabulario para nombrarse mejor. Los episodios combinaban testimonios, reflexiones y charlas con especialistas en familias, genero y diversidad.",
      "El proyecto conto con presencia en Instagram y YouTube, y genero una comunidad que valoro enormemente tener un lugar donde la diversidad no era tema de debate sino punto de partida. Actualmente inactivo, Espacio Seguro dejo una huella en la conversacion publica sobre familia y diversidad en Argentina, y sigue siendo referencia para proyectos similares que buscan representar lo que la mayoria de los medios todavia ignora.",
    ],
  },

  // ── FINANZAS TRAP ────────────────────────────────────────────────────
  {
    slug: "finanzas-trap",
    name: "Finanzas Trap",
    bgImage: "/images/project-finanzas-trap.jpg",
    bgColor: "#1A4A2A",
    tags: ["finanzas", "economia"],
    category: "creadores",
    participantIds: [],
    socials: { instagram: "finanzastrap" },
    status: "inactive",
    description:
      "Educacion financiera traducida al idioma de la cultura trap. Para una audiencia joven que quiere entender de plata.",
    longDescription: [
      "Finanzas Trap fue una apuesta arriesgada y original: traducir el mundo de las finanzas personales al idioma de la cultura trap. El proyecto partio de una observacion sobre la audiencia joven -una generacion que consume musica urbana, que habla en memes y que tiene una relacion compleja y muchas veces ansiosa con el dinero- y decidio encontrarse con esa audiencia en su propio terreno, en lugar de pedirle que se acercara al lenguaje formal de la economia.",
      "El resultado fue contenido que mezclaba educacion financiera con estetica, referencias culturales y un tono que se sentia autentico para quienes crecieron con Bizarrap y Peso Pluma en los oidos. Inversiones, ahorro, inflacion, criptomonedas: todos los temas de siempre, pero con un empaque completamente distinto.",
      "Actualmente inactivo, Finanzas Trap fue un experimento que adelanto una tendencia que hoy es evidente: la educacion financiera para jovenes funciona cuando se comunica en los formatos y con la estetica que esos jovenes ya consumen. El proyecto dejo una pregunta abierta y valida sobre como hacer que el dinero sea un tema accesible para todos, independientemente del nivel educativo o del contexto social.",
    ],
  },

  // ── NO TENGO IDEA ────────────────────────────────────────────────────
  {
    slug: "no-tengo-idea",
    name: "No Tengo Idea",
    bgImage: "/images/project-no-tengo-idea.jpg",
    bgColor: "#C45B2A",
    tags: ["negocios", "economia", "empresas"],
    category: "organizaciones",
    participantIds: [],
    socials: { instagram: "notengoideaar", tiktok: "notengoideaar" },
    status: "active",
    description:
      "Datos duros de negocios y economia transformados en contenido claro y sin vueltas.",
    longDescription: [
      "No Tengo Idea es el proyecto para los que no tienen idea -hasta que terminan de leerlo o de verlo. El nombre es un gesto de honestidad: el punto de partida del proyecto es reconocer que el mundo de los negocios y la economia esta lleno de terminos, dinamicas y logicas que la mayoria de las personas no entiende, no porque sean tontas sino porque nadie se los explico bien. NTI se propone cambiar eso.",
      "El proyecto transforma datos duros, analisis empresariales y noticias economicas en contenido claro, directo y sin tecnicismos innecesarios. Como funciona una fusion empresarial? Por que quiebra una empresa grande? Que es realmente el capital de riesgo? Esas son las preguntas que NTI responde con el tono de alguien que sabe, pero que tampoco olvida como era no saber.",
      "Con presencia en Instagram y TikTok, el proyecto construyo una audiencia joven e interesada en entender como funciona el mundo de los negocios, muchas veces por primera vez. NTI demuestra que el periodismo economico no tiene que ser arido ni exclusivo -puede ser entretenido, accesible y completamente necesario para una generacion que cada vez mas necesita entender las reglas del juego.",
    ],
  },
];

export const filters = ["Creadores", "Organizaciones", "Experimentales"] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count: number): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const scored = projects
    .filter((p) => p.slug !== slug)
    .map((p) => {
      // Tags are the primary signal for relatedness
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      let score = sharedTags * 5;
      // Light boost for same category
      if (p.category === current.category) score += 1;
      return { project: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.project);
}
