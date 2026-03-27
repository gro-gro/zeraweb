export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "freelance" | "pasantia";
  description: string;
  requirements: string[];
  active: boolean;
}

export const careers: Career[] = [
  {
    id: "editor-video",
    title: "Editor de Video",
    department: "Produccion",
    location: "Buenos Aires / Remoto",
    type: "full-time",
    description:
      "Buscamos un editor de video con experiencia en contenido para redes sociales y podcasts. Vas a trabajar con multiples proyectos, adaptando formatos y estilos segun cada marca.",
    requirements: [
      "2+ anos de experiencia en edicion de video",
      "Manejo de Adobe Premiere Pro y/o DaVinci Resolve",
      "Portfolio demostrable con contenido para redes",
      "Conocimiento de formatos para Instagram, TikTok y YouTube",
    ],
    active: true,
  },
  {
    id: "community-manager",
    title: "Community Manager",
    department: "Marketing",
    location: "Buenos Aires / Remoto",
    type: "full-time",
    description:
      "Buscamos un CM que gestione las comunidades de nuestros proyectos. Vas a interactuar con audiencias, analizar metricas y proponer estrategias de crecimiento.",
    requirements: [
      "Experiencia en gestion de comunidades digitales",
      "Redaccion impecable en espanol",
      "Conocimiento de metricas y herramientas de analytics",
      "Creatividad y proactividad para generar engagement",
    ],
    active: true,
  },
  {
    id: "productor-podcast",
    title: "Productor de Podcast",
    department: "Produccion",
    location: "Buenos Aires",
    type: "full-time",
    description:
      "Buscamos un productor que se encargue de la pre y post produccion de nuestros shows. Coordinacion de invitados, guiones, edicion de audio y distribucion.",
    requirements: [
      "Experiencia en produccion de audio y/o podcast",
      "Conocimiento de herramientas de edicion de audio (Audition, Logic, etc.)",
      "Capacidad de coordinacion y gestion de tiempos",
      "Pasion por el contenido y los medios digitales",
    ],
    active: false,
  },
];
