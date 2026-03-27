export interface TeamMember {
  image: string;
  alt: string;
  name: string;
  role: string;
  description: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export const team: TeamMember[] = [
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "CEO & Co-Founder",
    description: "Lider de la vision estrategica y el crecimiento de Zeratype.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "COO & Co-Founder",
    description: "Responsable de las operaciones y la gestion de proyectos.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Director Creativo",
    description: "Define la identidad visual y la narrativa de cada proyecto.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Head of Content",
    description: "Lidera la estrategia de contenido de todos los proyectos.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Producer",
    description: "Coordina la produccion de podcasts y contenido audiovisual.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Editor de Video",
    description: "Edita y postproduce el contenido audiovisual del estudio.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Community Manager",
    description: "Gestiona las comunidades digitales de los proyectos.",
    socialLinks: { instagram: "#" },
  },
  {
    image: "/images/team/placeholder.png",
    alt: "Nombre Apellido",
    name: "Nombre Apellido",
    role: "Desarrollador",
    description: "Construye y mantiene las plataformas digitales del estudio.",
    socialLinks: { instagram: "#" },
  },
];
