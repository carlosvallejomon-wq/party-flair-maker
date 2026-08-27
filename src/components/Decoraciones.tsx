import { useMemo } from "react";

import type { Decoracion } from "@/lib/invitacion";

const CLASES: Record<Exclude<Decoracion, "ninguna">, string> = {
  petalos: "deco-petalo",
  corazones: "deco-corazon",
  confeti: "deco-confeti",
  estrellas: "deco-estrella",
  burbujas: "deco-burbuja",
  mariposas: "deco-mariposa",
  hojas: "deco-hoja",
  luces: "deco-luz",
  notas: "deco-nota",
  globos: "deco-globo",
  nieve: "deco-nieve",
};

/** Pseudoaleatorio estable para que el render del servidor y del cliente coincidan. */
function pieza(i: number) {
  const r = (n: number) => ((Math.sin((i + 1) * n) + 1) / 2) as number;
  return {
    left: `${Math.round(r(12.9898) * 94)}%`,
    duration: 8 + r(78.233) * 10,
    delay: r(43.123) * 12,
    scale: 0.6 + r(93.77) * 0.9,
  };
}

export function Decoraciones({
  tipo,
  intensidad = 2,
}: {
  tipo: Decoracion;
  intensidad?: number;
}) {
  const total = intensidad >= 3 ? 24 : intensidad <= 1 ? 8 : 15;
  const piezas = useMemo(
    () => Array.from({ length: total }, (_, i) => pieza(i)),
    [total],
  );

  if (tipo === "ninguna") return null;
  const clase = CLASES[tipo];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {piezas.map((p, i) => (
        <span
          key={i}
          className={clase}
          style={{
            left: p.left,
            animationDuration: `${p.duration.toFixed(2)}s`,
            animationDelay: `${p.delay.toFixed(2)}s`,
            scale: p.scale.toFixed(2),
          }}
        />
      ))}
    </div>
  );
}
