import type { Decoracion } from "@/lib/invitacion";

const PIEZAS = [
  { left: "6%", duration: 11, delay: 0, scale: 1 },
  { left: "19%", duration: 14, delay: 2, scale: 0.7 },
  { left: "31%", duration: 9, delay: 4, scale: 1.2 },
  { left: "44%", duration: 13, delay: 1, scale: 0.85 },
  { left: "57%", duration: 10, delay: 6, scale: 1.1 },
  { left: "68%", duration: 15, delay: 3, scale: 0.75 },
  { left: "79%", duration: 12, delay: 5, scale: 0.95 },
  { left: "91%", duration: 16, delay: 7, scale: 1.05 },
];

const CLASES: Record<Exclude<Decoracion, "ninguna">, string> = {
  petalos: "deco-petalo",
  corazones: "deco-corazon",
  confeti: "deco-confeti",
  estrellas: "deco-estrella",
  burbujas: "deco-burbuja",
};

export function Decoraciones({ tipo }: { tipo: Decoracion }) {
  if (tipo === "ninguna") return null;
  const clase = CLASES[tipo];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIEZAS.map((p, i) => (
        <span
          key={i}
          className={clase}
          style={{
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            scale: p.scale,
          }}
        />
      ))}
    </div>
  );
}
