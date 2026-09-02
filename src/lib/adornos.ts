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

export type Adorno = { id: string; nombre: string; src: string };

/** Marcos elegantes que enmarcan toda la invitación. */
export const MARCOS: Adorno[] = [
  { id: "dorado", nombre: "Filigrana dorada", src: marcoDorado },
  { id: "floral", nombre: "Acuarela floral", src: marcoFloral },
  { id: "rosas", nombre: "Rosas blush", src: marcoRosas },
  { id: "deco", nombre: "Art déco", src: marcoDeco },
  { id: "verde", nombre: "Olivo verde", src: marcoVerde },
  ...ADORNOS_CDN.map((a) => ({ ...a, id: `m-${a.id}`, nombre: `Marco ${a.id.split("-")[1]}` })),
];

/** Decoraciones de esquina (se repiten en las 4 esquinas de la invitación). */
export const ESQUINAS: Adorno[] = ESQUINAS_CDN;

/** Coronas (marcos circulares) para la foto o el video de portada. */
export const CORONAS: Adorno[] = [
  { id: "flores", nombre: "Corona de flores", src: coronaFlores },
  { id: "dorada", nombre: "Corona dorada", src: coronaDorada },
  { id: "girasoles", nombre: "Corona de girasoles", src: coronaGirasoles },
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
