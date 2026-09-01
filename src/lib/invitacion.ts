export type ItemItinerario = { hora: string; titulo: string; lugar: string };

export type Tema =
  | "olivo"
  | "rosa"
  | "azul"
  | "noche"
  | "durazno"
  | "esmeralda"
  | "lavanda"
  | "vino"
  | "arena"
  | "coral"
  | "cielo"
  | "carbon";
export type Melodia = "romantica" | "vals" | "alegre" | "serena";

export type Invitacion = {
  plantilla: string;
  evento: string;
  nombre1: string;
  nombre2: string;
  fecha: string; // ISO local: 2026-10-12T17:00
  lugar: string;
  ciudad: string;
  frase: string;
  historia: string;
  itinerario: ItemItinerario[];
  dressCode: string;
  dressDetalle: string;
  regalosTitulo: string;
  regalosUrl: string;
  mapsUrl: string;
  rsvpLimite: string;
  tema: Tema;
  melodia: Melodia;
  animacionPortada: "fade" | "zoom" | "cortina";

  // Adornos: marcos, coronas y texturas (galería + subida propia)
  marco?: string; // id de MARCOS o "ninguno"
  marcoUrl?: string; // PNG propio subido
  corona?: string; // id de CORONAS o "ninguno"
  coronaUrl?: string;
  textura?: string; // id de TEXTURAS o "ninguno"
  texturaUrl?: string;
  decoracionUrl?: string; // PNG propio que se superpone a toda la invitación
  decoracionOpacidad?: number; // 0 a 100
  relieve?: boolean; // sombras y relieve en textos y tarjetas

  // Multimedia
  fotoPortadaUrl?: string;
  videoSobreUrl?: string; // se reproduce al abrir el sobre
  videoPortadaUrl?: string; // video dentro de la corona de portada
  videoGaleriaUrl?: string; // video en la sección de historia/galería

  // Fondo de la portada (hero)
  fondoUrl?: string; // imagen de fondo propia
  videoFondoUrl?: string; // video de fondo (tiene prioridad sobre la imagen)
  fondoOpacidad?: number; // 0 a 100
  fondoAjuste?: "cubrir" | "contener"; // object-fit
  fondoPosX?: number; // 0 a 100 (encuadre horizontal)
  fondoPosY?: number; // 0 a 100 (encuadre vertical)


  // Extras
  musicaUrl?: string;
  sobreActivo?: boolean;
  direccion?: string;
  wazeUrl?: string;
  albumTitulo?: string;
  albumUrl?: string;
  hashtag?: string;
  instagramUrl?: string;
  whatsapp?: string;
  coloresSugeridos?: string[];
};

export const TEMAS: Record<Tema, { nombre: string; swatch: string[]; vars: Record<string, string> }> =
  {
    olivo: {
      nombre: "Olivo botánico",
      swatch: ["#f7f6ef", "#c9a86a", "#8a9a5b", "#3b4232"],
      vars: {
        "--background": "oklch(0.977 0.009 100)",
        "--foreground": "oklch(0.34 0.033 122)",
        "--card": "oklch(0.99 0.006 100)",
        "--primary": "oklch(0.71 0.09 84)",
        "--olive": "oklch(0.63 0.075 118)",
      },
    },
    rosa: {
      nombre: "Rosa ceremonial",
      swatch: ["#fdf5f6", "#d98ca6", "#b06880", "#4a2c36"],
      vars: {
        "--background": "oklch(0.981 0.008 15)",
        "--foreground": "oklch(0.33 0.05 12)",
        "--card": "oklch(0.99 0.005 15)",
        "--primary": "oklch(0.7 0.12 5)",
        "--olive": "oklch(0.62 0.09 8)",
      },
    },
    azul: {
      nombre: "Azul sereno",
      swatch: ["#f3f7fb", "#6f9fc8", "#3f6f9c", "#1f2f42"],
      vars: {
        "--background": "oklch(0.975 0.008 240)",
        "--foreground": "oklch(0.32 0.04 250)",
        "--card": "oklch(0.99 0.005 240)",
        "--primary": "oklch(0.66 0.09 245)",
        "--olive": "oklch(0.58 0.07 240)",
      },
    },
    noche: {
      nombre: "Noche dorada",
      swatch: ["#14151a", "#d9b45b", "#8d7433", "#f3efe3"],
      vars: {
        "--background": "oklch(0.19 0.012 270)",
        "--foreground": "oklch(0.95 0.012 90)",
        "--card": "oklch(0.24 0.014 270)",
        "--primary": "oklch(0.8 0.11 88)",
        "--olive": "oklch(0.75 0.09 88)",
      },
    },
    durazno: {
      nombre: "Durazno cálido",
      swatch: ["#fdf6f0", "#e59b6b", "#c2734a", "#4a3226"],
      vars: {
        "--background": "oklch(0.98 0.012 60)",
        "--foreground": "oklch(0.34 0.04 50)",
        "--card": "oklch(0.99 0.008 60)",
        "--primary": "oklch(0.74 0.12 55)",
        "--olive": "oklch(0.64 0.1 50)",
      },
    },
    esmeralda: {
      nombre: "Esmeralda",
      swatch: ["#f1f8f4", "#4fa07a", "#2f6b52", "#17281f"],
      vars: {
        "--background": "oklch(0.975 0.012 160)",
        "--foreground": "oklch(0.3 0.04 160)",
        "--card": "oklch(0.99 0.008 160)",
        "--primary": "oklch(0.65 0.1 160)",
        "--olive": "oklch(0.56 0.08 160)",
      },
    },
    lavanda: {
      nombre: "Lavanda suave",
      swatch: ["#f7f4fb", "#a98bd0", "#7a5ca8", "#2f2540"],
      vars: {
        "--background": "oklch(0.975 0.012 300)",
        "--foreground": "oklch(0.32 0.05 300)",
        "--card": "oklch(0.99 0.008 300)",
        "--primary": "oklch(0.68 0.11 300)",
        "--olive": "oklch(0.6 0.09 300)",
      },
    },
    vino: {
      nombre: "Vino borgoña",
      swatch: ["#fbf3f3", "#a83a4a", "#7a2532", "#30161b"],
      vars: {
        "--background": "oklch(0.972 0.01 20)",
        "--foreground": "oklch(0.3 0.06 20)",
        "--card": "oklch(0.99 0.006 20)",
        "--primary": "oklch(0.55 0.15 20)",
        "--olive": "oklch(0.5 0.12 20)",
      },
    },
    arena: {
      nombre: "Arena y lino",
      swatch: ["#faf7f1", "#cbb89a", "#9d8a6c", "#3b352b"],
      vars: {
        "--background": "oklch(0.978 0.01 85)",
        "--foreground": "oklch(0.35 0.02 85)",
        "--card": "oklch(0.99 0.006 85)",
        "--primary": "oklch(0.75 0.05 85)",
        "--olive": "oklch(0.65 0.045 85)",
      },
    },
    coral: {
      nombre: "Coral tropical",
      swatch: ["#fff5f2", "#f0836b", "#cf5a44", "#40211a"],
      vars: {
        "--background": "oklch(0.982 0.012 35)",
        "--foreground": "oklch(0.34 0.05 30)",
        "--card": "oklch(0.99 0.008 35)",
        "--primary": "oklch(0.7 0.15 35)",
        "--olive": "oklch(0.62 0.13 32)",
      },
    },
    cielo: {
      nombre: "Cielo bebé",
      swatch: ["#f5fbff", "#9ecfe8", "#5fa6c9", "#25404f"],
      vars: {
        "--background": "oklch(0.985 0.01 225)",
        "--foreground": "oklch(0.34 0.04 230)",
        "--card": "oklch(0.995 0.006 225)",
        "--primary": "oklch(0.75 0.08 225)",
        "--olive": "oklch(0.66 0.07 225)",
      },
    },
    carbon: {
      nombre: "Carbón y plata",
      swatch: ["#17181b", "#c9ccd1", "#8c9095", "#f2f3f5"],
      vars: {
        "--background": "oklch(0.2 0.004 260)",
        "--foreground": "oklch(0.95 0.003 260)",
        "--card": "oklch(0.25 0.005 260)",
        "--primary": "oklch(0.85 0.005 260)",
        "--olive": "oklch(0.75 0.005 260)",
      },
    },
  };

export const MELODIAS: { id: Melodia; nombre: string }[] = [
  { id: "romantica", nombre: "Romántica" },
  { id: "vals", nombre: "Vals" },
  { id: "alegre", nombre: "Alegre" },
  { id: "serena", nombre: "Serena" },
];

export const ANIMACIONES: { id: Invitacion["animacionPortada"]; nombre: string }[] = [
  { id: "fade", nombre: "Aparecer" },
  { id: "zoom", nombre: "Acercamiento" },
  { id: "cortina", nombre: "Cortina" },
];

export const PLANTILLAS: (Invitacion & { slug: string; descripcion: string })[] = [
  {
    slug: "olivo-botanico",
    descripcion: "Verde olivo, oro y papel marfil. Ceremonia, itinerario y mesa de regalos.",
    plantilla: "Olivo Botánico",
    evento: "Boda",
    nombre1: "Valentina",
    nombre2: "Mateo",
    fecha: "2026-10-12T17:00",
    lugar: "Hacienda San José",
    ciudad: "México",
    frase: "Nuestra Boda",
    historia:
      "Desde aquel primer café en Coyoacán hasta el día que decidimos unir nuestras vidas bajo los olivos. Queremos celebrar el amor, la amistad y el futuro con las personas que más queremos.",
    itinerario: [
      { hora: "17:00 HRS", titulo: "Ceremonia Religiosa", lugar: "Capilla de la Hacienda" },
      { hora: "18:30 HRS", titulo: "Cóctel de Bienvenida", lugar: "Jardín de los Olivos" },
      { hora: "20:00 HRS", titulo: "Cena y Recepción", lugar: "Salón Principal" },
    ],
    dressCode: "Formal / Guayabera",
    dressDetalle:
      "Hombres: Guayabera manga larga y pantalón de lino. Mujeres: Vestido largo de noche.",
    regalosTitulo: "Nuestra Nueva Vida",
    regalosUrl: "https://www.amazon.com.mx/wedding",
    mapsUrl: "https://maps.google.com/?q=Hacienda+San+Jose+Mexico",
    rsvpLimite: "12 de septiembre",
    tema: "olivo",
    melodia: "romantica",
    animacionPortada: "fade",
    marco: "verde",
    corona: "flores",
    textura: "papel",
  },
  {
    slug: "rosa-ceremonial",
    descripcion: "Portada con vals, corona de flores y lista de chambelanes.",
    plantilla: "Rosa Ceremonial",
    evento: "XV Años",
    nombre1: "Camila",
    nombre2: "",
    fecha: "2026-06-20T19:00",
    lugar: "Salón Versalles",
    ciudad: "Guadalajara",
    frase: "Mis XV Años",
    historia:
      "Hoy dejo atrás la niñez y doy un paso hacia una nueva etapa. Quiero compartir esta noche mágica con las personas que han estado conmigo desde el principio.",
    itinerario: [
      { hora: "19:00 HRS", titulo: "Misa de Acción de Gracias", lugar: "Parroquia del Carmen" },
      { hora: "20:30 HRS", titulo: "Vals y Chambelanes", lugar: "Salón Versalles" },
      { hora: "21:30 HRS", titulo: "Cena y Baile", lugar: "Salón Versalles" },
    ],
    dressCode: "Etiqueta rigurosa",
    dressDetalle: "Damas: Vestido largo. Caballeros: Traje oscuro. Color reservado: rosa.",
    regalosTitulo: "Lluvia de Sobres",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Guadalajara",
    rsvpLimite: "1 de junio",
    tema: "rosa",
    melodia: "vals",
    animacionPortada: "zoom",
    marco: "rosas",
    corona: "flores",
    textura: "papel",
  },
  {
    slug: "lino-sereno",
    descripcion: "Diseño sobrio para bautizos: padrinos, misa y recepción familiar.",
    plantilla: "Lino Sereno",
    evento: "Bautizo",
    nombre1: "Emiliano",
    nombre2: "",
    fecha: "2026-04-11T11:00",
    lugar: "Parroquia de la Luz",
    ciudad: "Puebla",
    frase: "Mi Bautizo",
    historia:
      "Con la bendición de Dios y el cariño de nuestra familia, celebramos el día en que Emiliano recibe el sacramento del bautismo.",
    itinerario: [
      { hora: "11:00 HRS", titulo: "Ceremonia Religiosa", lugar: "Parroquia de la Luz" },
      { hora: "13:00 HRS", titulo: "Comida Familiar", lugar: "Jardín Los Fresnos" },
    ],
    dressCode: "Casual elegante",
    dressDetalle: "Tonos claros y frescos. Se agradece evitar el blanco total.",
    regalosTitulo: "Detalles para Emiliano",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Puebla",
    rsvpLimite: "1 de abril",
    tema: "cielo",
    melodia: "serena",
    animacionPortada: "fade",
    marco: "floral",
    corona: "flores",
    textura: "papel",
  },
  {
    slug: "noche-dorada",
    descripcion: "Fondo oscuro con filigrana dorada para bodas y fiestas de noche.",
    plantilla: "Noche Dorada",
    evento: "Boda",
    nombre1: "Renata",
    nombre2: "Diego",
    fecha: "2026-12-05T20:00",
    lugar: "Terraza Miravalle",
    ciudad: "Monterrey",
    frase: "Nos Casamos",
    historia:
      "Bajo las estrellas de diciembre queremos decir sí para siempre, rodeados de la gente que ilumina nuestra vida.",
    itinerario: [
      { hora: "20:00 HRS", titulo: "Ceremonia Civil", lugar: "Terraza Miravalle" },
      { hora: "21:00 HRS", titulo: "Brindis", lugar: "Lounge" },
      { hora: "22:00 HRS", titulo: "Fiesta", lugar: "Salón Estelar" },
    ],
    dressCode: "Black Tie",
    dressDetalle: "Caballeros: Smoking. Damas: Vestido largo.",
    regalosTitulo: "Mesa de Regalos",
    regalosUrl: "https://www.liverpool.com.mx",
    mapsUrl: "https://maps.google.com/?q=Monterrey",
    rsvpLimite: "15 de noviembre",
    tema: "noche",
    melodia: "romantica",
    animacionPortada: "cortina",
    marco: "deco",
    corona: "dorada",
    textura: "ninguno",
  },
  {
    slug: "durazno-fiesta",
    descripcion: "Color cálido y girasoles para cumpleaños y fiestas familiares.",
    plantilla: "Durazno Fiesta",
    evento: "Cumpleaños",
    nombre1: "Sofía",
    nombre2: "",
    fecha: "2026-05-09T16:00",
    lugar: "Jardín Las Palmas",
    ciudad: "Mérida",
    frase: "¡Cumplo Años!",
    historia: "Habrá pastel, juegos y mucha música. ¡Te espero para celebrar juntos este día!",
    itinerario: [
      { hora: "16:00 HRS", titulo: "Bienvenida y juegos", lugar: "Jardín Las Palmas" },
      { hora: "17:30 HRS", titulo: "Pastel y piñata", lugar: "Área central" },
    ],
    dressCode: "Casual y cómodo",
    dressDetalle: "Ven listo para jugar. Habrá área de albercas.",
    regalosTitulo: "Ideas de Regalo",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Merida",
    rsvpLimite: "1 de mayo",
    tema: "durazno",
    melodia: "alegre",
    animacionPortada: "zoom",
    marco: "dorado",
    corona: "girasoles",
    textura: "papel",
  },
  {
    slug: "esmeralda-jardin",
    descripcion: "Verde jardín y tipografía clásica para eventos al aire libre.",
    plantilla: "Esmeralda Jardín",
    evento: "Aniversario",
    nombre1: "Elena",
    nombre2: "Rafael",
    fecha: "2026-08-22T18:00",
    lugar: "Quinta El Molino",
    ciudad: "Querétaro",
    frase: "25 Años Juntos",
    historia:
      "Veinticinco años después seguimos eligiéndonos cada día. Gracias por acompañarnos en este camino.",
    itinerario: [
      { hora: "18:00 HRS", titulo: "Renovación de votos", lugar: "Jardín principal" },
      { hora: "19:30 HRS", titulo: "Cena", lugar: "Terraza" },
    ],
    dressCode: "Formal jardín",
    dressDetalle: "Tonos verdes y neutros. Evitar tacón de aguja (pasto).",
    regalosTitulo: "Tu Presencia",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Queretaro",
    rsvpLimite: "1 de agosto",
    tema: "esmeralda",
    melodia: "serena",
    animacionPortada: "fade",
    marco: "verde",
    corona: "flores",
    textura: "marmol",
  },
];

export const CLAVE_STORAGE = "invitacion-borrador";

/** Valores por omisión que reciben TODAS las plantillas. */
const EXTRAS: Partial<Invitacion> = {
  musicaUrl: "",
  sobreActivo: true,
  relieve: true,
  decoracionOpacidad: 70,
  direccion: "",
  wazeUrl: "",
  albumTitulo: "Álbum de fotos",
  albumUrl: "https://photos.app.goo.gl/",
  hashtag: "",
  instagramUrl: "",
  whatsapp: "",
  marco: "dorado",
  corona: "flores",
  textura: "papel",
  marcoUrl: "",
  coronaUrl: "",
  texturaUrl: "",
  decoracionUrl: "",
  fotoPortadaUrl: "",
  videoSobreUrl: "",
  videoPortadaUrl: "",
  videoGaleriaUrl: "",
};

export function plantillaPorSlug(slug?: string | null): Invitacion {
  const base = PLANTILLAS.find((p) => p.slug === slug) ?? PLANTILLAS[0]!;
  const { slug: _s, descripcion: _d, ...resto } = base;
  return structuredClone({ ...EXTRAS, ...resto } as Invitacion);
}

export function cargarBorrador(): Invitacion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CLAVE_STORAGE);
    if (!raw) return null;
    return { ...plantillaPorSlug(), ...(JSON.parse(raw) as Invitacion) };
  } catch {
    return null;
  }
}

export function guardarBorrador(inv: Invitacion) {
  if (typeof window === "undefined") return true;
  try {
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(inv));
    return true;
  } catch {
    // Las imágenes o videos subidos pueden superar el espacio del navegador.
    return false;
  }
}

export function fechaLarga(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase()
    .replace(/ DE /g, " . ");
}

export function fechaHoraCorta(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function utc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Enlace a Google Calendar con el evento precargado. */
export function enlaceCalendario(inv: Invitacion) {
  const inicio = new Date(inv.fecha);
  if (Number.isNaN(inicio.getTime())) return "";
  const fin = new Date(inicio.getTime() + 5 * 3600000);
  const titulo = [inv.frase, [inv.nombre1, inv.nombre2].filter(Boolean).join(" & ")]
    .filter(Boolean)
    .join(" · ");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: titulo,
    dates: `${utc(inicio)}/${utc(fin)}`,
    details: inv.historia.slice(0, 300),
    location: [inv.lugar, inv.direccion, inv.ciudad].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Archivo .ics descargable para Apple/Outlook. */
export function archivoIcs(inv: Invitacion) {
  const inicio = new Date(inv.fecha);
  if (Number.isNaN(inicio.getTime())) return "";
  const fin = new Date(inicio.getTime() + 5 * 3600000);
  const titulo = [inv.frase, [inv.nombre1, inv.nombre2].filter(Boolean).join(" & ")]
    .filter(Boolean)
    .join(" - ");
  const cuerpo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fin)}`,
    `SUMMARY:${titulo}`,
    `LOCATION:${[inv.lugar, inv.ciudad].filter(Boolean).join(", ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(cuerpo)}`;
}

export function enlaceWhatsapp(numero: string | undefined, mensaje: string) {
  const limpio = (numero ?? "").replace(/\D/g, "");
  const texto = encodeURIComponent(mensaje);
  return limpio ? `https://wa.me/${limpio}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

export function enlaceMapa(inv: Invitacion) {
  if (inv.mapsUrl.trim()) return inv.mapsUrl;
  const q = encodeURIComponent([inv.lugar, inv.direccion, inv.ciudad].filter(Boolean).join(", "));
  return `https://maps.google.com/?q=${q}`;
}

export function mapaEmbebido(inv: Invitacion) {
  const q = encodeURIComponent([inv.lugar, inv.direccion, inv.ciudad].filter(Boolean).join(", "));
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}
