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

export function iconoPorId(id?: string) {
  return (ICONOS.find((i) => i.id === id) ?? ICONOS[0]!).Icono;
}
