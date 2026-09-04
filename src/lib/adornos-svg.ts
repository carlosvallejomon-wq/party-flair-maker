/**
 * Marcos y texturas generados como SVG en línea.
 * Al ser vectoriales se distribuyen siempre bien en cualquier pantalla
 * (no se deforman ni se salen de la portada como los PNG fotográficos).
 */

const svg = (contenido: string, w = 400, h = 700) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${contenido}</svg>`,
  )}`;

const oro = "%23c9a227";
const trazo = (d: string, ancho = 1.5, color = "#c9a227", extra = "") =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" ${extra}/>`;

/** Marco de doble filete clásico. */
const filete = svg(
  `${trazo("M18 18 H382 V682 H18 Z", 2)}${trazo("M28 28 H372 V672 H28 Z", 0.8)}`,
);

/** Marco de filete fino con esquinas recortadas. */
const recortado = svg(
  `${trazo("M40 16 H360 L384 40 V660 L360 684 H40 L16 660 V40 Z", 1.6)}` +
    `${trazo("M46 26 H354 L374 46 V654 L354 674 H46 L26 654 V46 Z", 0.7)}`,
);

/** Marco art déco de líneas verticales. */
const deco = svg(
  `${trazo("M20 20 H380 V680 H20 Z", 2)}` +
    `${trazo("M20 44 H380", 0.7)}${trazo("M20 656 H380", 0.7)}` +
    `${trazo("M44 20 V680", 0.7)}${trazo("M356 20 V680", 0.7)}`,
);

/** Marco con arco superior tipo capilla. */
const arco = svg(
  `${trazo("M22 300 C22 130 110 26 200 26 C290 26 378 130 378 300 V678 H22 Z", 2)}` +
    `${trazo("M34 300 C34 142 118 40 200 40 C282 40 366 142 366 300 V666 H34 Z", 0.7)}`,
);

/** Marco de esquinas con vértices marcados. */
const vertices = svg(
  `${trazo("M16 60 V16 H60", 2.4)}${trazo("M340 16 H384 V60", 2.4)}` +
    `${trazo("M16 640 V684 H60", 2.4)}${trazo("M340 684 H384 V640", 2.4)}` +
    `${trazo("M16 200 V500", 0.7)}${trazo("M384 200 V500", 0.7)}` +
    `${trazo("M140 16 H260", 0.7)}${trazo("M140 684 H260", 0.7)}`,
);

/** Marco de festón redondeado. */
const feston = svg(
  `${trazo("M20 60 Q20 20 60 20 H340 Q380 20 380 60 V640 Q380 680 340 680 H60 Q20 680 20 640 Z", 2)}` +
    `${trazo("M32 62 Q32 32 62 32 H338 Q368 32 368 62 V638 Q368 668 338 668 H62 Q32 668 32 638 Z", 0.7)}`,
);

export const MARCOS_SVG = [
  { id: "svg-filete", nombre: "Doble filete", src: filete },
  { id: "svg-recortado", nombre: "Esquinas recortadas", src: recortado },
  { id: "svg-deco", nombre: "Líneas déco", src: deco },
  { id: "svg-arco", nombre: "Arco capilla", src: arco },
  { id: "svg-vertices", nombre: "Vértices finos", src: vertices },
  { id: "svg-feston", nombre: "Festón suave", src: feston },
];

/* ---------- Texturas vectoriales (patrones que se repiten) ---------- */

const patron = (contenido: string, size = 40) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${contenido}</svg>`,
  )}`;

export const TEXTURAS_SVG = [
  {
    id: "t-lino",
    nombre: "Lino tejido",
    src: patron(
      `<rect width="40" height="40" fill="#f6f3ec"/><path d="M0 10H40M0 30H40" stroke="#e2dccd" stroke-width="3"/><path d="M10 0V40M30 0V40" stroke="#eae5d8" stroke-width="3"/>`,
    ),
  },
  {
    id: "t-puntos",
    nombre: "Puntos finos",
    src: patron(
      `<rect width="40" height="40" fill="#faf8f3"/><circle cx="10" cy="10" r="1.6" fill="#d9cfb4"/><circle cx="30" cy="30" r="1.6" fill="#d9cfb4"/>`,
    ),
  },
  {
    id: "t-rombos",
    nombre: "Rombos suaves",
    src: patron(
      `<rect width="40" height="40" fill="#f8f6f1"/><path d="M20 4 32 20 20 36 8 20Z" fill="none" stroke="#e3d9c2" stroke-width="1"/>`,
    ),
  },
  {
    id: "t-ondas",
    nombre: "Ondas de seda",
    src: patron(
      `<rect width="60" height="60" fill="#f7f5f0"/><path d="M0 30 Q15 12 30 30 T60 30" fill="none" stroke="#e6dcc7" stroke-width="1.4"/><path d="M0 50 Q15 32 30 50 T60 50" fill="none" stroke="#efe8d9" stroke-width="1.4"/>`,
      60,
    ),
  },
  {
    id: "t-hojas",
    nombre: "Hojas botánicas",
    src: patron(
      `<rect width="60" height="60" fill="#f7f8f2"/><path d="M14 40 Q30 10 46 22 Q34 46 14 40Z" fill="none" stroke="#d6ddc4" stroke-width="1.2"/><path d="M14 40 Q32 30 46 22" fill="none" stroke="#d6ddc4" stroke-width="0.8"/>`,
      60,
    ),
  },
  {
    id: "t-celosia",
    nombre: "Celosía",
    src: patron(
      `<rect width="40" height="40" fill="#f9f7f2"/><path d="M0 0 40 40M40 0 0 40" stroke="#e7dfcc" stroke-width="1"/>`,
    ),
  },
  {
    id: "t-kraft",
    nombre: "Papel kraft",
    src: patron(
      `<rect width="40" height="40" fill="#f2ead9"/><path d="M0 6H40M0 18H40M0 27H40M0 36H40" stroke="#e6dbc3" stroke-width="0.8"/>`,
    ),
  },
  {
    id: "t-terrazo",
    nombre: "Terrazo",
    src: patron(
      `<rect width="60" height="60" fill="#f8f6f2"/><circle cx="12" cy="16" r="3" fill="#e6dfd0"/><circle cx="44" cy="10" r="2" fill="#ded6c3"/><circle cx="30" cy="38" r="3.5" fill="#e9e2d3"/><circle cx="52" cy="46" r="2.4" fill="#ded6c3"/><circle cx="8" cy="48" r="2" fill="#e6dfd0"/>`,
      60,
    ),
  },
  {
    id: "t-estrellas",
    nombre: "Cielo de estrellas",
    src: patron(
      `<rect width="60" height="60" fill="#f8f7f4"/><path d="M14 8l1.4 4 4 1.4-4 1.4L14 19l-1.4-4.2-4-1.4 4-1.4z" fill="#e2d6b8"/><path d="M42 34l1.2 3.4 3.4 1.2-3.4 1.2L42 43l-1.2-3.2-3.4-1.2 3.4-1.2z" fill="#e9e0c9"/>`,
      60,
    ),
  },
  {
    id: "t-arabesco",
    nombre: "Arabesco",
    src: patron(
      `<rect width="60" height="60" fill="#f9f7f3"/><path d="M30 6 Q48 22 30 30 Q12 38 30 54" fill="none" stroke="#e5dcc7" stroke-width="1.2"/><path d="M6 30 Q22 12 30 30 Q38 48 54 30" fill="none" stroke="#ece5d6" stroke-width="1.2"/>`,
      60,
    ),
  },
];

export { oro };
