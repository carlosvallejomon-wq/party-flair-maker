import coronaDorada from "@/assets/corona-dorada.png";
import coronaFlores from "@/assets/corona-flores.png";
import coronaGirasoles from "@/assets/corona-girasoles.png";
import marcoDorado from "@/assets/marco-dorado.png";
import marcoFloral from "@/assets/marco-floral.png";
import texturaMarmol from "@/assets/textura-marmol.jpg";
import texturaPapel from "@/assets/textura-papel.jpg";
import { ADORNOS_CDN, CORONAS_NUEVAS_CDN, ESQUINAS_CDN } from "./adornos-cdn";
import { MARCOS_CDN, TEXTURAS_CDN } from "./adornos-mtn";
import { MARCOS_SVG, TEXTURAS_SVG } from "./adornos-svg";

export type Adorno = { id: string; nombre: string; src: string };

/**
 * Marcos que enmarcan la portada sin taparla.
 * Los vectoriales se distribuyen siempre bien; los de acuarela quedan al final.
 */
export const MARCOS: Adorno[] = [
  ...MARCOS_SVG,
  { id: "floral", nombre: "Acuarela natural", src: marcoFloral },
  { id: "dorado", nombre: "Filigrana dorada", src: marcoDorado },
  ...MARCOS_CDN,
];


/** Decoraciones de esquina (se repiten en las 4 esquinas de la invitación). */
export const ESQUINAS: Adorno[] = ESQUINAS_CDN;

/** Archivos sin hueco central: sirven como fondos, no como marcos para foto. */
const CORONAS_SIN_HUECO = new Set([
  "adorno-116",
  "adorno-121",
  "adorno-146",
  "adorno-231",
  "adorno-379",
  "adorno-402",
  "adorno-418",
  "adorno-426",
  "adorno-480",
  "adorno-50",
  "adorno-52",
  "adorno-53",
  "adorno-Home",
]);

/** Coronas retiradas hasta que Sandra entregue sus reemplazos corregidos. */
const CORONAS_RETIRADAS = new Set([
  "adorno-11",
  "adorno-227",
  "adorno-51",
  "adorno-88",
  "adorno-13",

  "adorno-27",
  "adorno-29",
  "adorno-32",
  "adorno-44",
  "adorno-46",
  "adorno-84",
  "adorno-85",
  "adorno-118",
  "adorno-119",
  "adorno-120",
  "adorno-124",
  "adorno-126",
  "adorno-127",
  "adorno-132",
  "adorno-144",
  "adorno-147",
  "adorno-175",
  "adorno-177",
  "adorno-180",
  "adorno-182",
  "adorno-183",
  "adorno-184",
  "adorno-191",
  "adorno-196",
  "adorno-197",
  "adorno-199",
  "adorno-206",
  "adorno-211",
  "adorno-214",
  "adorno-215",
  "adorno-229",
  "adorno-230",
  "adorno-245",
  "adorno-253",
  "adorno-315",
  "adorno-320",
  "adorno-343",
  "adorno-365",
  "adorno-371",
  "adorno-407",
  "adorno-408",
  "adorno-414",
  "adorno-419",
  "adorno-432",
  "adorno-466",
  "adorno-486",
]);

/** Coronas nuevas retiradas porque el hueco no encuadra la foto. */
const CORONAS_NUEVAS_RETIRADAS = new Set([
  "corona-n5",
  "corona-n11",
  "corona-n19",
  "corona-n24",
  "corona-n26",
  "corona-n27",
  "corona-n28",
  "corona-n31",
  "corona-n32",
  "corona-n46",
]);

/** Coronas (marcos circulares) para la foto o el video de portada. */
export const CORONAS: Adorno[] = [
  { id: "flores", nombre: "Corona de flores", src: coronaFlores },
  { id: "dorada", nombre: "Corona dorada", src: coronaDorada },
  { id: "girasoles", nombre: "Corona de girasoles", src: coronaGirasoles },
  ...ADORNOS_CDN.filter(
    (a) => !CORONAS_SIN_HUECO.has(a.id) && !CORONAS_RETIRADAS.has(a.id),
  ).map((a) => ({
      ...a,
      id: `c-${a.id}`,
      nombre: `Corona ${a.id.split("-")[1]}`,
    })),
  ...CORONAS_NUEVAS_CDN.filter((a) => !CORONAS_NUEVAS_RETIRADAS.has(a.id)),

];


/** Texturas de fondo con relieve. */
export const TEXTURAS: Adorno[] = [
  { id: "papel", nombre: "Papel de algodón", src: texturaPapel },
  { id: "marmol", nombre: "Mármol y oro", src: texturaMarmol },
  ...TEXTURAS_SVG,
  ...TEXTURAS_CDN,
];


export function buscarAdorno(lista: Adorno[], id?: string, propio?: string) {
  if (propio?.trim()) return propio;
  if (!id || id === "ninguno") return "";
  return lista.find((a) => a.id === id)?.src ?? "";
}
