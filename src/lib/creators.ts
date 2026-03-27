// ---------------------------------------------------------------------------
// Creators, Organizations & Entities
// Componentized so they can be referenced across projects without duplication.
// ---------------------------------------------------------------------------

export interface Participant {
  id: string;
  name: string;
  type: "creator" | "organization" | "entity";
  photo?: string;
  instagram?: string;     // handle without @
  instagramUrl?: string;  // full URL
}

// ---- Creators ----

export const participants: Participant[] = [
  {
    id: "sebastian-saravia",
    name: "Sebastian Saravia",
    type: "creator",
    instagram: "psicoalpie",
    instagramUrl: "https://instagram.com/psicoalpie",
  },
  {
    id: "javi-ponzo",
    name: "Javier Ponzo",
    type: "creator",
    instagram: "javiponzo",
    instagramUrl: "https://instagram.com/javiponzo",
  },
  {
    id: "almendra-veiga",
    name: "Almendra Veiga",
    type: "creator",
    instagram: "almendraveiga",
    instagramUrl: "https://instagram.com/almendraveiga",
  },
  {
    id: "celeste-giardinelli",
    name: "Celeste Giardinelli",
    type: "creator",
    instagram: "giardinelliceleste",
    instagramUrl: "https://instagram.com/giardinelliceleste",
  },
  {
    id: "yuliana-bustamante",
    name: "Yuliana Bustamante",
    type: "creator",
    instagram: "yulianabustamanteok",
    instagramUrl: "https://instagram.com/yulianabustamanteok",
  },
  {
    id: "lucas-ortega",
    name: "Lucas Ortega",
    type: "creator",
    instagram: "lucasgortega",
    instagramUrl: "https://instagram.com/lucasgortega",
  },
  {
    id: "diego-fernandez-sasso",
    name: "Dr. Diego Fernandez Sasso",
    type: "creator",
    instagram: "doctorsasso",
    instagramUrl: "https://instagram.com/doctorsasso",
  },
  {
    id: "sra-bimbo",
    name: "Senora Bimbo",
    type: "creator",
    instagram: "srtabimbo",
    instagramUrl: "https://instagram.com/srtabimbo",
  },
  {
    id: "mar-benassai",
    name: "Mar Benassai",
    type: "creator",
    instagram: "marbenassai",
    instagramUrl: "https://instagram.com/marbenassai",
  },
  {
    id: "agus-battioni",
    name: "Agus Battioni",
    type: "creator",
    instagram: "agusbattioni",
    instagramUrl: "https://instagram.com/agusbattioni",
  },
  {
    id: "mila-fermani",
    name: "Mila Fermani",
    type: "creator",
    instagram: "milafermani",
    instagramUrl: "https://instagram.com/milafermani",
  },
  {
    id: "santi-talledo",
    name: "Santi Talledo",
    type: "creator",
    instagram: "santitalledo",
    instagramUrl: "https://instagram.com/santitalledo",
  },
  {
    id: "candela-di-risio",
    name: "Candela Di Risio",
    type: "creator",
    instagram: "candeldirisio",
    instagramUrl: "https://instagram.com/candeldirisio",
  },
  {
    id: "fede-villar-bruno",
    name: "Fede Villar Bruno",
    type: "creator",
    instagram: "fedevillarbruno",
    instagramUrl: "https://instagram.com/fedevillarbruno",
  },
  {
    id: "fede-bareiro",
    name: "Fede Bareiro",
    type: "creator",
    instagram: "fedebareiro",
    instagramUrl: "https://instagram.com/fedebareiro",
  },
  {
    id: "german-beder",
    name: "German Beder",
    type: "creator",
    instagram: "gbeder",
    instagramUrl: "https://instagram.com/gbeder",
  },
  {
    id: "el-malbeki",
    name: "El Malbeki",
    type: "creator",
    instagram: "elmalbeki",
    instagramUrl: "https://instagram.com/elmalbeki",
  },
  {
    id: "guido-iannaccone",
    name: "Guido Iannaccone",
    type: "creator",
    instagram: "guidoiannaccone",
    instagramUrl: "https://instagram.com/guidoiannaccone",
  },
  {
    id: "sin1billete",
    name: "Sin1Billete",
    type: "creator",
    instagram: "sin1billete",
    instagramUrl: "https://instagram.com/sin1billete",
  },
  {
    id: "ema-rufian-hahn",
    name: "Ema Rufian Hahn",
    type: "creator",
    instagram: "soyelrufian",
    instagramUrl: "https://instagram.com/soyelrufian",
  },
  {
    id: "valen",
    name: "Valen",
    type: "creator",
    instagram: "valentinagod",
    instagramUrl: "https://instagram.com/valentinagod",
  },
  {
    id: "sofi",
    name: "Sofi",
    type: "creator",
    instagram: "sofielliot",
    instagramUrl: "https://instagram.com/sofielliot",
  },

  // ---- Organizations ----

  {
    id: "zurich-argentina",
    name: "Zurich Argentina",
    type: "organization",
    instagram: "zurich.ar",
    instagramUrl: "https://instagram.com/zurich.ar",
  },

  // ---- Entities ----

  {
    id: "zeratype",
    name: "Zeratype",
    type: "entity",
    instagram: "zeratype",
    instagramUrl: "https://instagram.com/zeratype",
  },
];

// ---- Helpers ----

export function getParticipantById(id: string): Participant | undefined {
  return participants.find((p) => p.id === id);
}

export function getParticipantsByIds(ids: string[]): Participant[] {
  return ids
    .map((id) => getParticipantById(id))
    .filter((p): p is Participant => p !== undefined);
}
