export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  coverImage: string | null;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "bienvenidos-al-blog-de-zeratype",
    title: "Bienvenidos al blog de Zeratype",
    excerpt:
      "Un nuevo espacio donde compartimos novedades, reflexiones y aprendizajes sobre lo que hacemos y por que lo hacemos.",
    date: "2026-03-27",
    author: "Zeratype",
    tags: ["noticias", "zeratype"],
    coverImage: null,
    content: [
      "Hoy inauguramos el blog de Zeratype. Un espacio que nace con una premisa simple: contar lo que hacemos, como lo hacemos y por que creemos que importa. No desde el comunicado de prensa ni desde la nota de marketing, sino desde la conversacion honesta con quienes nos siguen.",
      "En este blog vamos a compartir novedades sobre nuestros proyectos, reflexiones sobre la industria de los medios digitales, aprendizajes de produccion y estrategia, y todo lo que creamos que pueda ser util para quienes estan construyendo algo propio en el mundo del contenido.",
      "Creemos que el mejor contenido nace cuando alguien tiene algo genuino que decir. Este blog es nuestra forma de aplicar esa misma filosofia a nuestra propia comunicacion. Bienvenidos.",
    ],
  },
  {
    slug: "como-construimos-narrativa",
    title: "Como construimos narrativa desde tematicas y personas",
    excerpt:
      "El proceso detras de cada proyecto de Zeratype: como encontramos la interseccion entre lo que una persona tiene para decir y lo que una audiencia necesita escuchar.",
    date: "2026-03-20",
    author: "Zeratype",
    tags: ["proceso", "creatividad"],
    coverImage: null,
    content: [
      "Todo proyecto de Zeratype empieza con dos preguntas: que tiene esta persona para decir? Y quien necesita escucharlo? La interseccion entre esas dos respuestas es donde nace la narrativa.",
      "No partimos del formato. No empezamos diciendo hagamos un podcast o hagamos una cuenta de Instagram. Empezamos entendiendo a la persona -su historia, su expertise, su forma de comunicar- y a la audiencia potencial -sus necesidades, sus habitos de consumo, sus preguntas sin responder.",
      "Recien cuando tenemos esas dos piezas claras, empezamos a pensar en formatos, plataformas y estrategia. Es un proceso que lleva tiempo pero que genera proyectos con raices, no con tendencias. Y eso se nota en la durabilidad de lo que construimos.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
