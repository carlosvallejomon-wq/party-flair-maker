import type { Invitacion } from "@/lib/invitacion";

export const SEPARADORES: { id: string; nombre: string }[] = [
  { id: "asterisco", nombre: "Asterisco floral" },
  { id: "rombo", nombre: "Rombo" },
  { id: "hojas", nombre: "Hojas" },
  { id: "puntos", nombre: "Puntos" },
  { id: "linea", nombre: "Línea fina" },
  { id: "ninguno", nombre: "Sin separador" },
];

const glifo: Record<string, string> = {
  asterisco: "✻",
  rombo: "◆",
  hojas: "❦",
  puntos: "•",
  linea: "",
};

/** Separador ornamental entre secciones, con estilo configurable. */
export function Divisor({ inv, className = "" }: { inv: Invitacion; className?: string }) {
  const estilo = inv.separador ?? "asterisco";
  if (estilo === "ninguno") return null;
  const g = glifo[estilo] ?? "✻";

  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 px-10 py-8 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
      {g && (
        <span className="flex items-center gap-2 text-primary">
          <span className="text-[8px] opacity-60">•</span>
          <span className="text-lg leading-none">{g}</span>
          <span className="text-[8px] opacity-60">•</span>
        </span>
      )}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
    </div>
  );
}
