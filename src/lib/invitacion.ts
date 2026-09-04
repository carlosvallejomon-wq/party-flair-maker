export type ItemItinerario = { hora: string; titulo: string; lugar: string; icono?: string };
export type Hito = { anio: string; titulo: string; texto: string; foto?: string };
export type Sede = {
  etiqueta: string;
  nombre: string;
  hora: string;
  direccion: string;
  mapsUrl: string;
  wazeUrl?: string;
  uberUrl?: string;
};
export type Nota = { titulo: string; texto: string };
export type Regalo = { titulo: string; detalle: string; url?: string; icono?: string };



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
  | "carbon"
  | "orquidea"
  | "neon"
  | "menta"
  | "ambar"
  | "terracota"
  | "marfil";
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
  esquinas?: string; // id de ESQUINAS o "ninguno"
  esquinasUrl?: string; // PNG propio para las esquinas
  esquinasTamano?: number; // % del ancho que ocupa cada esquina (15 a 60)
  esquinasEspejo?: boolean; // repetir espejada (si no, todas iguales)
  esquinasGiro?: number; // giro base en grados (0, 90, 180, 270)
  esquinasModo?: "espejo" | "giro" | "igual"; // cómo se acomoda en cada esquina

  // Contenido extendido (secciones tipo invitación premium)
  familia?: string; // línea superior: "Con la bendición de nuestros padres"
  hitos?: Hito[]; // Nuestra historia por años
  sedes?: Sede[]; // Lugares de la celebración
  notas?: Nota[]; // A tomar en cuenta
  muroActivo?: boolean; // muro de felicitaciones
  separador?: string; // estilo del separador ornamental entre secciones
  itinerarioTitulo?: string; // título de la sección de itinerario


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
    orquidea: {
      nombre: "Orquídea neón",
      swatch: ["#1b1024", "#b57bff", "#7a3ff2", "#f5eaff"],
      vars: {
        "--background": "oklch(0.19 0.04 300)",
        "--foreground": "oklch(0.95 0.02 300)",
        "--card": "oklch(0.24 0.05 300)",
        "--primary": "oklch(0.72 0.18 305)",
        "--olive": "oklch(0.8 0.12 160)",
      },
    },
    neon: {
      nombre: "Medianoche neón",
      swatch: ["#0d0f18", "#5ce1e6", "#a259ff", "#eef4ff"],
      vars: {
        "--background": "oklch(0.16 0.02 265)",
        "--foreground": "oklch(0.95 0.01 265)",
        "--card": "oklch(0.22 0.03 265)",
        "--primary": "oklch(0.82 0.13 195)",
        "--olive": "oklch(0.7 0.16 300)",
      },
    },
    menta: {
      nombre: "Menta fresca",
      swatch: ["#f2fbf7", "#7fd6b5", "#3f9d7c", "#1d3b31"],
      vars: {
        "--background": "oklch(0.98 0.015 165)",
        "--foreground": "oklch(0.32 0.04 165)",
        "--card": "oklch(0.99 0.01 165)",
        "--primary": "oklch(0.75 0.1 165)",
        "--olive": "oklch(0.63 0.09 165)",
      },
    },
    ambar: {
      nombre: "Ámbar dorado",
      swatch: ["#fdf8ec", "#e0ad4b", "#b0801f", "#3d3116"],
      vars: {
        "--background": "oklch(0.98 0.018 90)",
        "--foreground": "oklch(0.33 0.04 85)",
        "--card": "oklch(0.99 0.012 90)",
        "--primary": "oklch(0.78 0.12 85)",
        "--olive": "oklch(0.67 0.11 85)",
      },
    },
    terracota: {
      nombre: "Terracota",
      swatch: ["#fbf2ec", "#c9714b", "#9c4f2f", "#3a1e14"],
      vars: {
        "--background": "oklch(0.97 0.014 45)",
        "--foreground": "oklch(0.32 0.05 40)",
        "--card": "oklch(0.99 0.01 45)",
        "--primary": "oklch(0.63 0.12 45)",
        "--olive": "oklch(0.56 0.1 42)",
      },
    },
    marfil: {
      nombre: "Marfil minimal",
      swatch: ["#fbfaf7", "#d8d3c8", "#8d8779", "#2c2a25"],
      vars: {
        "--background": "oklch(0.985 0.005 90)",
        "--foreground": "oklch(0.28 0.008 90)",
        "--card": "oklch(0.995 0.003 90)",
        "--primary": "oklch(0.7 0.02 90)",
        "--olive": "oklch(0.6 0.02 90)",
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
  {
    slug: "orquidea-neon",
    descripcion: "Fondo oscuro con violeta neón, itinerario animado y muro de mensajes.",
    plantilla: "Orquídea Neón",
    evento: "XV Años",
    nombre1: "Ximena",
    nombre2: "",
    fecha: "2026-10-24T16:30",
    lugar: "Hacienda Los Encinos",
    ciudad: "Valle Real",
    frase: "Mis XV Años",
    historia:
      "Una noche de luces, música y baile para celebrar la etapa más brillante de mi vida junto a las personas que quiero.",
    itinerario: [
      { hora: "16:30 HRS", titulo: "Ceremonia religiosa", lugar: "Capilla Los Ángeles", icono: "iglesia" },
      { hora: "18:00 HRS", titulo: "Cóctel de bienvenida", lugar: "Jardín de las Fuentes", icono: "coctel" },
      { hora: "19:30 HRS", titulo: "Cena y vals", lugar: "Salón principal", icono: "cena" },
      { hora: "21:00 HRS", titulo: "Primer baile y fiesta", lugar: "DJ y barra libre", icono: "baile" },
      { hora: "01:00 HRS", titulo: "Tornaboda", lugar: "Para recargar energías", icono: "amanecer" },
    ],
    dressCode: "Formal riguroso / Black Tie",
    dressDetalle: "Hombres: traje oscuro o esmoquin. Mujeres: vestido largo de noche.",
    regalosTitulo: "Lluvia de sobres",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Valle+Real",
    rsvpLimite: "1 de octubre",
    tema: "orquidea",
    melodia: "alegre",
    animacionPortada: "zoom",
    marco: "ninguno",
    corona: "flores",
    textura: "ninguno",
    separador: "asterisco",
  },
  {
    slug: "medianoche-neon",
    descripcion: "Turquesa y violeta sobre negro para fiestas nocturnas y cumpleaños.",
    plantilla: "Medianoche Neón",
    evento: "Cumpleaños",
    nombre1: "Andrés",
    nombre2: "",
    fecha: "2026-11-14T21:00",
    lugar: "Rooftop Skyline",
    ciudad: "CDMX",
    frase: "Fiesta de Cumpleaños",
    historia: "Música, luces y buena compañía. Nos vemos arriba, la ciudad se ve mejor de noche.",
    itinerario: [
      { hora: "21:00 HRS", titulo: "Bienvenida", lugar: "Terraza", icono: "bebida" },
      { hora: "22:00 HRS", titulo: "Brindis", lugar: "Barra central", icono: "brindis" },
      { hora: "23:00 HRS", titulo: "DJ set", lugar: "Pista", icono: "musica" },
    ],
    dressCode: "Cocktail nocturno",
    dressDetalle: "Tonos oscuros con un detalle neón.",
    regalosTitulo: "Sorpresas bienvenidas",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=CDMX",
    rsvpLimite: "1 de noviembre",
    tema: "neon",
    melodia: "alegre",
    animacionPortada: "cortina",
    marco: "ninguno",
    corona: "ninguno",
    textura: "ninguno",
    separador: "rombo",
  },
  {
    slug: "terracota-campestre",
    descripcion: "Tonos tierra y tipografía cálida para bodas campestres.",
    plantilla: "Terracota Campestre",
    evento: "Boda",
    nombre1: "Lucía",
    nombre2: "Andrés",
    fecha: "2026-09-19T17:30",
    lugar: "Rancho El Encino",
    ciudad: "San Miguel de Allende",
    frase: "Nos Casamos",
    historia: "Entre viñedos y atardeceres de barro, queremos empezar nuestra historia juntos.",
    itinerario: [
      { hora: "17:30 HRS", titulo: "Ceremonia al atardecer", lugar: "Explanada", icono: "anillos" },
      { hora: "19:00 HRS", titulo: "Cena de campo", lugar: "Terraza", icono: "cena" },
      { hora: "21:00 HRS", titulo: "Baile", lugar: "Patio central", icono: "baile" },
    ],
    dressCode: "Campestre elegante",
    dressDetalle: "Tonos tierra. Calzado cómodo para terreno de piedra.",
    regalosTitulo: "Mesa de regalos",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=San+Miguel+de+Allende",
    rsvpLimite: "1 de septiembre",
    tema: "terracota",
    melodia: "romantica",
    animacionPortada: "fade",
    marco: "dorado",
    corona: "flores",
    textura: "papel",
    separador: "hojas",
  },
  {
    slug: "marfil-minimal",
    descripcion: "Minimalismo marfil, mucho aire y tipografía editorial.",
    plantilla: "Marfil Minimal",
    evento: "Boda Civil",
    nombre1: "Ana",
    nombre2: "Luis",
    fecha: "2026-07-04T12:00",
    lugar: "Casa Blanca",
    ciudad: "Oaxaca",
    frase: "Boda Civil",
    historia: "Algo sencillo, íntimo y muy nuestro.",
    itinerario: [
      { hora: "12:00 HRS", titulo: "Ceremonia civil", lugar: "Patio de la casa", icono: "anillos" },
      { hora: "13:30 HRS", titulo: "Comida", lugar: "Comedor", icono: "cena" },
    ],
    dressCode: "Casual elegante",
    dressDetalle: "Tonos neutros, lino y algodón.",
    regalosTitulo: "Tu presencia",
    regalosUrl: "",
    mapsUrl: "https://maps.google.com/?q=Oaxaca",
    rsvpLimite: "15 de junio",
    tema: "marfil",
    melodia: "serena",
    animacionPortada: "fade",
    marco: "ninguno",
    corona: "ninguno",
    textura: "papel",
    separador: "puntos",
  },
  ...plantillasPorEvento(),
];

/** Datos mínimos para armar una plantilla adicional del catálogo. */
type Semilla = {
  slug: string;
  descripcion: string;
  plantilla: string;
  evento: string;
  nombre1: string;
  nombre2?: string;
  frase: string;
  fecha: string;
  lugar: string;
  ciudad: string;
  historia: string;
  itinerario: ItemItinerario[];
  dressCode: string;
  dressDetalle: string;
  regalosTitulo: string;
  tema: Tema;
  melodia: Melodia;
  corona?: string;
  marco?: string;
  separador?: string;
  coloresSugeridos?: string[];
};

/**
 * Catálogo ampliado: bodas, XV años, cumpleaños infantiles, baby showers,
 * bautizos, primeras comuniones, graduaciones y aniversarios.
 */
function plantillasPorEvento(): (Invitacion & { slug: string; descripcion: string })[] {
  const semillas: Semilla[] = [
    // ---------- Bodas ----------
    {
      slug: "blanco-catedral",
      descripcion: "Boda clásica de catedral con acuarela natural y filigrana dorada.",
      plantilla: "Blanco Catedral",
      evento: "Boda",
      nombre1: "Sofía",
      nombre2: "Andrés",
      frase: "Nuestra Boda",
      fecha: "2026-11-21T18:00",
      lugar: "Catedral Metropolitana",
      ciudad: "Querétaro",
      historia: "Diez años después de aquella carta, decidimos escribir el capítulo definitivo.",
      itinerario: [
        { hora: "18:00 HRS", titulo: "Ceremonia religiosa", lugar: "Catedral", icono: "iglesia" },
        { hora: "19:30 HRS", titulo: "Cóctel", lugar: "Terraza", icono: "coctel" },
        { hora: "21:00 HRS", titulo: "Cena y baile", lugar: "Salón imperial", icono: "baile" },
      ],
      dressCode: "Etiqueta",
      dressDetalle: "Damas: vestido largo. Caballeros: esmoquin.",
      regalosTitulo: "Nuestro nuevo hogar",
      tema: "marfil",
      melodia: "romantica",
      corona: "flores",
      marco: "dorado",
    },
    // ---------- XV Años ----------
    {
      slug: "quince-lavanda",
      descripcion: "XV años en lavanda con vals, chambelanes y muro de felicitaciones.",
      plantilla: "Quince Lavanda",
      evento: "XV Años",
      nombre1: "Renata",
      frase: "Mis XV Años",
      fecha: "2026-08-15T19:00",
      lugar: "Jardín Lavanda",
      ciudad: "Puebla",
      historia: "Quince primaveras para celebrar con quienes me han visto crecer.",
      itinerario: [
        { hora: "19:00 HRS", titulo: "Misa de acción de gracias", lugar: "Parroquia", icono: "iglesia" },
        { hora: "20:30 HRS", titulo: "Vals", lugar: "Jardín Lavanda", icono: "baile" },
        { hora: "22:00 HRS", titulo: "Hora loca", lugar: "Pista", icono: "fiesta" },
      ],
      dressCode: "Formal",
      dressDetalle: "Color reservado: lavanda.",
      regalosTitulo: "Lluvia de sobres",
      tema: "lavanda",
      melodia: "vals",
      corona: "flores",
    },
    {
      slug: "quince-coral",
      descripcion: "XV años tropicales en coral, con sesión de fotos y hora loca.",
      plantilla: "Quince Coral",
      evento: "XV Años",
      nombre1: "Isabella",
      frase: "Mis XV Años",
      fecha: "2026-05-09T18:30",
      lugar: "Club Marino",
      ciudad: "Cancún",
      historia: "Una noche frente al mar para celebrar el inicio de mi nueva etapa.",
      itinerario: [
        { hora: "18:30 HRS", titulo: "Recepción", lugar: "Club Marino", icono: "coctel" },
        { hora: "19:30 HRS", titulo: "Vals", lugar: "Terraza", icono: "baile" },
        { hora: "21:00 HRS", titulo: "Cena", lugar: "Salón", icono: "cena" },
      ],
      dressCode: "Cóctel",
      dressDetalle: "Tonos coral y arena.",
      regalosTitulo: "Mesa de regalos",
      tema: "coral",
      melodia: "alegre",
      corona: "flores",
      separador: "hojas",
    },
    {
      slug: "quince-carbon-glam",
      descripcion: "XV años glam en negro y oro, ideal para salón de noche.",
      plantilla: "Quince Glam",
      evento: "XV Años",
      nombre1: "Ximena",
      frase: "Mis XV Años",
      fecha: "2026-12-05T20:00",
      lugar: "Salón Aurum",
      ciudad: "Monterrey",
      historia: "Luces, música y las personas que amo: así quiero recordar esta noche.",
      itinerario: [
        { hora: "20:00 HRS", titulo: "Entrada", lugar: "Salón Aurum", icono: "brillos" },
        { hora: "21:00 HRS", titulo: "Vals", lugar: "Pista", icono: "baile" },
        { hora: "23:00 HRS", titulo: "Pastel", lugar: "Salón", icono: "pastel" },
      ],
      dressCode: "Black tie",
      dressDetalle: "Negro, dorado y plata.",
      regalosTitulo: "Lluvia de sobres",
      tema: "carbon",
      melodia: "alegre",
      corona: "dorada",
    },
    // ---------- Cumpleaños infantil ----------
    {
      slug: "cumple-nino-aventura",
      descripcion: "Cumpleaños infantil (niño) con globos, pastel y juegos.",
      plantilla: "Pequeño Aventurero",
      evento: "Cumpleaños infantil",
      nombre1: "Santiago",
      frase: "Mis 5 Años",
      fecha: "2026-03-14T16:00",
      lugar: "Salón Aventura",
      ciudad: "Mérida",
      historia: "¡Santiago cumple 5 años y quiere celebrarlo contigo!",
      itinerario: [
        { hora: "16:00 HRS", titulo: "Bienvenida y juegos", lugar: "Área de juegos", icono: "fiesta" },
        { hora: "17:00 HRS", titulo: "Merienda", lugar: "Mesa principal", icono: "cena" },
        { hora: "18:00 HRS", titulo: "Pastel y piñata", lugar: "Salón", icono: "pastel" },
      ],
      dressCode: "Casual y cómodo",
      dressDetalle: "Ropa cómoda para jugar.",
      regalosTitulo: "Regalos para Santi",
      tema: "cielo",
      melodia: "alegre",
      corona: "ninguno",
      marco: "ninguno",
      coloresSugeridos: ["#eaf4fb", "#7fb7e3", "#f5c65b", "#2f4a63"],
    },
    {
      slug: "cumple-nina-jardin",
      descripcion: "Cumpleaños infantil (niña) en tonos durazno con piñata y pastel.",
      plantilla: "Pequeña Princesa",
      evento: "Cumpleaños infantil",
      nombre1: "Valeria",
      frase: "Mis 6 Años",
      fecha: "2026-04-25T16:00",
      lugar: "Jardín Encantado",
      ciudad: "Toluca",
      historia: "¡Valeria cumple 6 años y te espera para celebrar!",
      itinerario: [
        { hora: "16:00 HRS", titulo: "Bienvenida", lugar: "Jardín", icono: "flor" },
        { hora: "17:00 HRS", titulo: "Show infantil", lugar: "Escenario", icono: "musica" },
        { hora: "18:00 HRS", titulo: "Pastel", lugar: "Mesa dulce", icono: "pastel" },
      ],
      dressCode: "Casual",
      dressDetalle: "Tonos pastel.",
      regalosTitulo: "Regalos para Vale",
      tema: "durazno",
      melodia: "alegre",
      corona: "flores",
      coloresSugeridos: ["#fdeee6", "#f2b8a2", "#e58fa5", "#6b4a4a"],
    },
    // ---------- Baby shower ----------
    {
      slug: "baby-shower-nino",
      descripcion: "Baby shower (niño) en azul cielo con juegos y mesa de dulces.",
      plantilla: "Baby Azul",
      evento: "Baby Shower",
      nombre1: "Bebé Emiliano",
      frase: "Baby Shower",
      fecha: "2026-02-22T12:00",
      lugar: "Terraza Nube",
      ciudad: "León",
      historia: "Estamos contando los días para conocerlo. Acompáñanos a celebrarlo.",
      itinerario: [
        { hora: "12:00 HRS", titulo: "Recepción", lugar: "Terraza", icono: "flor" },
        { hora: "13:00 HRS", titulo: "Juegos", lugar: "Jardín", icono: "fiesta" },
        { hora: "14:00 HRS", titulo: "Comida", lugar: "Salón", icono: "cena" },
      ],
      dressCode: "Casual elegante",
      dressDetalle: "Un toque azul cielo.",
      regalosTitulo: "Pañalera de Emiliano",
      tema: "cielo",
      melodia: "serena",
      corona: "flores",
      coloresSugeridos: ["#eef6fc", "#a8cbe7", "#d8e6ef", "#3c5a72"],
    },
    {
      slug: "baby-shower-nina",
      descripcion: "Baby shower (niña) en rosa suave con mesa dulce y juegos.",
      plantilla: "Baby Rosa",
      evento: "Baby Shower",
      nombre1: "Bebé Julieta",
      frase: "Baby Shower",
      fecha: "2026-06-13T12:00",
      lugar: "Casa Jardín",
      ciudad: "Guadalajara",
      historia: "Muy pronto llegará Julieta y queremos celebrarla contigo.",
      itinerario: [
        { hora: "12:00 HRS", titulo: "Recepción", lugar: "Jardín", icono: "flor" },
        { hora: "13:00 HRS", titulo: "Juegos", lugar: "Terraza", icono: "fiesta" },
        { hora: "14:30 HRS", titulo: "Mesa dulce", lugar: "Salón", icono: "pastel" },
      ],
      dressCode: "Casual elegante",
      dressDetalle: "Un toque rosa.",
      regalosTitulo: "Pañalera de Julieta",
      tema: "rosa",
      melodia: "serena",
      corona: "flores",
      coloresSugeridos: ["#fdf0f3", "#f3c3ce", "#e8a0b3", "#6d4550"],
    },
    // ---------- Bautizos ----------
    {
      slug: "bautizo-marfil",
      descripcion: "Bautizo en marfil con misa, padrinos y comida familiar.",
      plantilla: "Bautizo Marfil",
      evento: "Bautizo",
      nombre1: "Regina",
      frase: "Mi Bautizo",
      fecha: "2026-09-19T11:00",
      lugar: "Parroquia del Sagrario",
      ciudad: "Morelia",
      historia: "Con la bendición de Dios recibimos a Regina en la fe.",
      itinerario: [
        { hora: "11:00 HRS", titulo: "Misa de bautizo", lugar: "Parroquia", icono: "iglesia" },
        { hora: "13:00 HRS", titulo: "Comida", lugar: "Casa de los abuelos", icono: "cena" },
      ],
      dressCode: "Formal claro",
      dressDetalle: "Tonos claros; se agradece evitar el blanco total.",
      regalosTitulo: "Detalles para Regina",
      tema: "marfil",
      melodia: "serena",
      corona: "flores",
      separador: "linea",
    },
    {
      slug: "bautizo-olivo",
      descripcion: "Bautizo campestre en verde olivo con recepción al aire libre.",
      plantilla: "Bautizo Olivo",
      evento: "Bautizo",
      nombre1: "Tomás",
      frase: "Mi Bautizo",
      fecha: "2026-05-30T10:30",
      lugar: "Capilla del Olivar",
      ciudad: "San Miguel de Allende",
      historia: "Un día de fe y familia para dar gracias por Tomás.",
      itinerario: [
        { hora: "10:30 HRS", titulo: "Ceremonia", lugar: "Capilla", icono: "iglesia" },
        { hora: "12:30 HRS", titulo: "Brindis", lugar: "Jardín", icono: "brindis" },
      ],
      dressCode: "Casual elegante",
      dressDetalle: "Tonos verdes y neutros.",
      regalosTitulo: "Detalles para Tomás",
      tema: "olivo",
      melodia: "serena",
      corona: "flores",
    },
    // ---------- Primera comunión ----------
    {
      slug: "comunion-arena",
      descripcion: "Primera comunión en tonos arena con misa y comida.",
      plantilla: "Comunión Arena",
      evento: "Primera Comunión",
      nombre1: "Mariana",
      frase: "Mi Primera Comunión",
      fecha: "2026-05-16T10:00",
      lugar: "Parroquia de San Juan",
      ciudad: "Aguascalientes",
      historia: "Hoy recibo a Jesús por primera vez y quiero compartirlo contigo.",
      itinerario: [
        { hora: "10:00 HRS", titulo: "Misa", lugar: "Parroquia", icono: "iglesia" },
        { hora: "12:00 HRS", titulo: "Comida", lugar: "Salón parroquial", icono: "cena" },
      ],
      dressCode: "Formal claro",
      dressDetalle: "Tonos beige, blanco y dorado suave.",
      regalosTitulo: "Detalles para Mariana",
      tema: "arena",
      melodia: "serena",
      corona: "flores",
    },
    {
      slug: "comunion-cielo",
      descripcion: "Primera comunión en azul cielo con misa y desayuno.",
      plantilla: "Comunión Cielo",
      evento: "Primera Comunión",
      nombre1: "Diego",
      frase: "Mi Primera Comunión",
      fecha: "2026-06-06T09:00",
      lugar: "Templo del Espíritu Santo",
      ciudad: "Saltillo",
      historia: "Un día especial para agradecer y celebrar en familia.",
      itinerario: [
        { hora: "09:00 HRS", titulo: "Misa", lugar: "Templo", icono: "iglesia" },
        { hora: "11:00 HRS", titulo: "Desayuno", lugar: "Jardín", icono: "cena" },
      ],
      dressCode: "Formal",
      dressDetalle: "Tonos azules y blancos.",
      regalosTitulo: "Detalles para Diego",
      tema: "cielo",
      melodia: "serena",
      corona: "ninguno",
    },
    // ---------- Graduaciones ----------
    {
      slug: "graduacion-carbon",
      descripcion: "Graduación universitaria en negro y oro con cena de gala.",
      plantilla: "Graduación Gala",
      evento: "Graduación",
      nombre1: "Fernanda",
      frase: "Mi Graduación",
      fecha: "2026-07-18T19:00",
      lugar: "Centro de Convenciones",
      ciudad: "Ciudad de México",
      historia: "Cinco años de esfuerzo que hoy se celebran contigo.",
      itinerario: [
        { hora: "19:00 HRS", titulo: "Ceremonia de entrega", lugar: "Auditorio", icono: "estrella" },
        { hora: "21:00 HRS", titulo: "Cena de gala", lugar: "Salón", icono: "cena" },
        { hora: "23:00 HRS", titulo: "Baile", lugar: "Pista", icono: "baile" },
      ],
      dressCode: "Etiqueta",
      dressDetalle: "Vestido largo y traje oscuro.",
      regalosTitulo: "Mesa de regalos",
      tema: "carbon",
      melodia: "alegre",
      corona: "dorada",
    },
    {
      slug: "graduacion-esmeralda",
      descripcion: "Graduación de preparatoria en verde esmeralda, moderna y fresca.",
      plantilla: "Graduación Esmeralda",
      evento: "Graduación",
      nombre1: "Rodrigo",
      frase: "Mi Graduación",
      fecha: "2026-07-04T18:00",
      lugar: "Colegio Cumbres",
      ciudad: "Puebla",
      historia: "Se cierra una etapa increíble y empieza otra mejor.",
      itinerario: [
        { hora: "18:00 HRS", titulo: "Ceremonia", lugar: "Auditorio", icono: "estrella" },
        { hora: "20:00 HRS", titulo: "Brindis", lugar: "Terraza", icono: "brindis" },
      ],
      dressCode: "Formal",
      dressDetalle: "Traje o vestido en tonos sobrios.",
      regalosTitulo: "Detalles",
      tema: "esmeralda",
      melodia: "alegre",
      corona: "ninguno",
    },
    {
      slug: "graduacion-marfil",
      descripcion: "Graduación minimalista en marfil con brunch de celebración.",
      plantilla: "Graduación Marfil",
      evento: "Graduación",
      nombre1: "Paulina",
      frase: "Mi Graduación",
      fecha: "2026-08-08T12:00",
      lugar: "Casa Marfil",
      ciudad: "Querétaro",
      historia: "Gracias por acompañarme en cada paso hasta aquí.",
      itinerario: [
        { hora: "12:00 HRS", titulo: "Brunch", lugar: "Terraza", icono: "cena" },
        { hora: "14:00 HRS", titulo: "Fotos", lugar: "Jardín", icono: "foto" },
      ],
      dressCode: "Casual elegante",
      dressDetalle: "Tonos neutros.",
      regalosTitulo: "Tu presencia",
      tema: "marfil",
      melodia: "serena",
      corona: "ninguno",
      separador: "puntos",
    },
    // ---------- Aniversario ----------
    {
      slug: "aniversario-vino",
      descripcion: "Aniversario de bodas en tonos vino con cena y brindis.",
      plantilla: "Aniversario Vino",
      evento: "Aniversario",
      nombre1: "Elena",
      nombre2: "Ricardo",
      frase: "25 Años Juntos",
      fecha: "2026-10-03T19:30",
      lugar: "Viñedo Santa Elena",
      ciudad: "Ensenada",
      historia: "Veinticinco años después, seguimos eligiéndonos todos los días.",
      itinerario: [
        { hora: "19:30 HRS", titulo: "Renovación de votos", lugar: "Viñedo", icono: "anillos" },
        { hora: "20:30 HRS", titulo: "Brindis", lugar: "Barrica", icono: "brindis" },
        { hora: "21:30 HRS", titulo: "Cena", lugar: "Salón", icono: "cena" },
      ],
      dressCode: "Formal",
      dressDetalle: "Tonos vino y borgoña.",
      regalosTitulo: "Tu presencia",
      tema: "vino",
      melodia: "romantica",
      corona: "flores",
    },
  ];

  return semillas.map((s) => ({
    slug: s.slug,
    descripcion: s.descripcion,
    plantilla: s.plantilla,
    evento: s.evento,
    nombre1: s.nombre1,
    nombre2: s.nombre2 ?? "",
    fecha: s.fecha,
    lugar: s.lugar,
    ciudad: s.ciudad,
    frase: s.frase,
    historia: s.historia,
    itinerario: s.itinerario,
    dressCode: s.dressCode,
    dressDetalle: s.dressDetalle,
    regalosTitulo: s.regalosTitulo,
    regalosUrl: "",
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${s.lugar} ${s.ciudad}`)}`,
    rsvpLimite: "Dos semanas antes",
    tema: s.tema,
    melodia: s.melodia,
    animacionPortada: "fade" as const,
    marco: s.marco ?? "floral",
    corona: s.corona ?? "flores",
    textura: "papel",
    separador: s.separador ?? "asterisco",
    ...(s.coloresSugeridos ? { coloresSugeridos: s.coloresSugeridos } : {}),
  }));
}

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
  esquinas: "ninguno",
  esquinasUrl: "",
  esquinasTamano: 32,
  esquinasEspejo: true,
  esquinasGiro: 0,
  esquinasModo: "espejo",

  familia: "Con la bendición de Dios y de nuestros padres",
  muroActivo: true,
  separador: "asterisco",
  itinerarioTitulo: "the Itinerary",
  coloresSugeridos: ["#f7f6ef", "#c9a86a", "#8a9a5b", "#3b4232"],
  hitos: [
    { anio: "2019", titulo: "Nos conocimos", texto: "Una tarde cualquiera que lo cambió todo." },
    { anio: "2022", titulo: "El primer viaje", texto: "Descubrimos que juntos todo es más bonito." },
    { anio: "2025", titulo: "La propuesta", texto: "Y dijimos que sí, para toda la vida." },
  ],
  sedes: [
    {
      etiqueta: "Ceremonia",
      nombre: "",
      hora: "",
      direccion: "",
      mapsUrl: "",
    },
    {
      etiqueta: "Recepción",
      nombre: "",
      hora: "",
      direccion: "",
      mapsUrl: "",
    },
  ],
  notas: [
    { titulo: "Puntualidad", texto: "Te esperamos 15 minutos antes de la hora indicada." },
    { titulo: "Solo adultos", texto: "Con mucho cariño, hemos reservado esta celebración para adultos." },
    { titulo: "Fotografías", texto: "Durante la ceremonia te pedimos disfrutar sin celulares." },
  ],



  marcoUrl: "",
  coronaUrl: "",
  texturaUrl: "",
  decoracionUrl: "",
  fotoPortadaUrl: "",
  videoSobreUrl: "",
  videoPortadaUrl: "",
  videoGaleriaUrl: "",
  fondoUrl: "",
  videoFondoUrl: "",
  fondoOpacidad: 25,
  fondoAjuste: "cubrir",
  fondoPosX: 50,
  fondoPosY: 50,
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
