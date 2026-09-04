import coronaDorada from "@/assets/corona-dorada.png";
import coronaFlores from "@/assets/corona-flores.png";
import coronaGirasoles from "@/assets/corona-girasoles.png";
import marcoDeco from "@/assets/marco-deco.png";
import marcoDorado from "@/assets/marco-dorado.png";
import marcoFloral from "@/assets/marco-floral.png";
import marcoRosas from "@/assets/marco-rosas.png";
import marcoVerde from "@/assets/marco-verde.png";
import texturaMarmol from "@/assets/textura-marmol.jpg";
import texturaPapel from "@/assets/textura-papel.jpg";
import { ADORNOS_CDN, ESQUINAS_CDN } from "./adornos-cdn";
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
];


/** Marcos retirados del catálogo pero disponibles como coronas decorativas. */
const MARCOS_RETIRADOS: Adorno[] = [
  { id: "m-rosas", nombre: "Rosas blush", src: marcoRosas },
  { id: "m-deco", nombre: "Art déco", src: marcoDeco },
  { id: "m-verde", nombre: "Olivo verde", src: marcoVerde },
];

/** Decoraciones de esquina (se repiten en las 4 esquinas de la invitación). */
export const ESQUINAS: Adorno[] = ESQUINAS_CDN;

/** Coronas (marcos circulares) para la foto o el video de portada. */
export const CORONAS: Adorno[] = [
  { id: "flores", nombre: "Corona de flores", src: coronaFlores },
  { id: "dorada", nombre: "Corona dorada", src: coronaDorada },
  { id: "girasoles", nombre: "Corona de girasoles", src: coronaGirasoles },
  ...MARCOS_RETIRADOS,
  ...ADORNOS_CDN.map((a) => ({ ...a, id: `c-${a.id}`, nombre: `Corona ${a.id.split("-")[1]}` })),
];


/** Texturas de fondo con relieve. */
export const TEXTURAS: Adorno[] = [
  { id: "papel", nombre: "Papel de algodón", src: texturaPapel },
  { id: "marmol", nombre: "Mármol y oro", src: texturaMarmol },
];

export function buscarAdorno(lista: Adorno[], id?: string, propio?: string) {
  if (propio?.trim()) return propio;
  if (!id || id === "ninguno") return "";
  return lista.find((a) => a.id === id)?.src ?? "";
}
