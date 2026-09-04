import {
  Cake,
  Camera,
  Car,
  Church,
  Clock3,
  Disc3,
  Flower2,
  Gem,
  Gift,
  GlassWater,
  Heart,
  Martini,
  Music4,
  PartyPopper,
  Sparkles,
  Star,
  Sun,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import type { ComponentType } from "react";

/** Iconos disponibles para cada momento del itinerario. */
export const ICONOS: { id: string; nombre: string; Icono: ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { id: "reloj", nombre: "Reloj", Icono: Clock3 },
  { id: "iglesia", nombre: "Ceremonia", Icono: Church },
  { id: "anillos", nombre: "Anillos", Icono: Gem },
  { id: "coctel", nombre: "Cóctel", Icono: Martini },
  { id: "brindis", nombre: "Brindis", Icono: Wine },
  { id: "cena", nombre: "Cena", Icono: UtensilsCrossed },
  { id: "baile", nombre: "Baile", Icono: Disc3 },
  { id: "musica", nombre: "Música", Icono: Music4 },
  { id: "fiesta", nombre: "Fiesta", Icono: PartyPopper },
  { id: "pastel", nombre: "Pastel", Icono: Cake },
  { id: "foto", nombre: "Fotos", Icono: Camera },
  { id: "corazon", nombre: "Corazón", Icono: Heart },
  { id: "flor", nombre: "Flores", Icono: Flower2 },
  { id: "estrella", nombre: "Estrella", Icono: Star },
  { id: "brillos", nombre: "Brillos", Icono: Sparkles },
  { id: "regalo", nombre: "Regalo", Icono: Gift },
  { id: "bebida", nombre: "Bebidas", Icono: GlassWater },
  { id: "transporte", nombre: "Transporte", Icono: Car },
  { id: "amanecer", nombre: "Tornaboda", Icono: Sun },
];

/** Palabras clave que permiten adivinar el icono cuando no se eligió uno. */
const PISTAS: [RegExp, string][] = [
  [/misa|ceremon|iglesia|templo|parroquia|bautiz|comuni/i, "iglesia"],
  [/anillo|civil|boda|enlace/i, "anillos"],
  [/c[oó]ctel|coctel|aperitiv|bienvenid/i, "coctel"],
  [/brindis|champ|copa/i, "brindis"],
  [/cena|comida|banquete|buffet|almuerz/i, "cena"],
  [/vals|baile|pista|danza/i, "baile"],
  [/m[uú]sica|dj|mariachi|show/i, "musica"],
  [/fiesta|verbena|hora loca|cierre/i, "fiesta"],
  [/pastel|tarta|torta|postre/i, "pastel"],
  [/foto|sesi[oó]n|retrato/i, "foto"],
  [/regalo|mesa de regalos|sobre/i, "regalo"],
  [/bebida|barra|open bar/i, "bebida"],
  [/transporte|traslado|autob[uú]s|shuttle/i, "transporte"],
  [/tornaboda|amanecer|after|desayuno/i, "amanecer"],
  [/flor|ramo|jard[ií]n/i, "flor"],
];

/** Devuelve el id de icono sugerido a partir del texto del momento. */
export function iconoSugerido(texto: string) {
  return PISTAS.find(([re]) => re.test(texto))?.[1] ?? "reloj";
}

export function iconoPorId(id?: string, texto?: string) {
  const buscado = id && id !== "auto" ? id : texto ? iconoSugerido(texto) : undefined;
  return (ICONOS.find((i) => i.id === buscado) ?? ICONOS[0]!).Icono;
}
