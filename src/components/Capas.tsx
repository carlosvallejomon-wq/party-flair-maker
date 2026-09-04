import { CORONAS, ESQUINAS, MARCOS, TEXTURAS, buscarAdorno } from "@/lib/adornos";
import type { Invitacion } from "@/lib/invitacion";

export const marcoDe = (inv: Invitacion) => buscarAdorno(MARCOS, inv.marco, inv.marcoUrl);
export const coronaDe = (inv: Invitacion) => buscarAdorno(CORONAS, inv.corona, inv.coronaUrl);
export const texturaDe = (inv: Invitacion) => buscarAdorno(TEXTURAS, inv.textura, inv.texturaUrl);
export const esquinasDe = (inv: Invitacion) => buscarAdorno(ESQUINAS, inv.esquinas, inv.esquinasUrl);

/** Esquinas visibles según la disposición elegida. */
const DISPOSICIONES: Record<string, number[]> = {
  cuatro: [0, 1, 2, 3],
  arriba: [0, 1],
  abajo: [2, 3],
  diagonal: [0, 3],
  lados: [0, 2],
};

/**
 * Decoración repetida en las esquinas de la invitación.
 * Cada esquina se ancla con `inset` y se transforma desde su propio vértice,
 * así el tamaño crece hacia adentro y nunca se desplaza al centro.
 */
export function Esquinas({ inv }: { inv: Invitacion }) {
  const src = esquinasDe(inv);
  if (!src) return null;

  const tam = `${inv.esquinasTamano ?? 30}%`;
  const margen = `${inv.esquinasMargen ?? 0}%`;
  const giro = inv.esquinasGiro ?? 0;
  const modo = inv.esquinasModo ?? (inv.esquinasEspejo === false ? "igual" : "espejo");
  const visibles = DISPOSICIONES[inv.esquinasDisposicion ?? "cuatro"] ?? DISPOSICIONES["cuatro"]!;
  const opacidad = (inv.esquinasOpacidad ?? 100) / 100;

  // Cada adorno vive dentro de un contenedor anclado. Así el tamaño cambia
  // hacia el interior sin alterar la posición del vértice.
  const acomodo =
    modo === "espejo"
      ? ["scale(1, 1)", "scale(-1, 1)", "scale(1, -1)", "scale(-1, -1)"]
      : modo === "giro"
        ? ["rotate(0deg)", "rotate(90deg)", "rotate(270deg)", "rotate(180deg)"]
        : ["scale(1, 1)", "scale(1, 1)", "scale(1, 1)", "scale(1, 1)"];

  const posicion = [
    { top: margen, left: margen },
    { top: margen, right: margen },
    { bottom: margen, left: margen },
    { bottom: margen, right: margen },
  ];

  return (
    <>
      {visibles.map((i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute z-[6] block"
          style={{
            ...posicion[i],
            width: tam,
            aspectRatio: "1 / 1",
            opacity: opacidad,
          }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain"
            style={{
              transformOrigin: "center",
              transform: `${acomodo[i]} rotate(${giro}deg)`,
            }}
          />
        </span>
      ))}
    </>
  );
}

/** Textura de papel/mármol con relieve suave sobre el fondo. */
export function Textura({ inv }: { inv: Invitacion }) {
  const src = texturaDe(inv);
  if (!src) return null;
  const esPatron = src.startsWith("data:image/svg");
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: esPatron ? "auto" : "cover",
        backgroundRepeat: esPatron ? "repeat" : "no-repeat",
        backgroundPosition: "center",
        opacity: (inv.texturaOpacidad ?? 50) / 100,
      }}
    />
  );
}

/** Marco elegante que enmarca la portada. */
export function Marco({ inv }: { inv: Invitacion }) {
  const src = marcoDe(inv);
  if (!src) return null;
  const estirar = (inv.marcoAjuste ?? "estirar") === "estirar";
  const margen = `${inv.marcoMargen ?? 3}%`;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      className={`pointer-events-none absolute z-[6] ${estirar ? "object-fill" : "object-contain"}`}
      style={{
        inset: margen,
        width: `calc(100% - 2 * ${margen})`,
        height: `calc(100% - 2 * ${margen})`,
        opacity: (inv.marcoOpacidad ?? 85) / 100,
      }}
    />
  );
}

/** Decoración propia (PNG subido) superpuesta a toda la invitación. */
export function DecoracionPropia({ inv }: { inv: Invitacion }) {
  if (!inv.decoracionUrl?.trim()) return null;
  return (
    <img
      src={inv.decoracionUrl}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[7] h-full w-full object-cover"
      style={{ opacity: (inv.decoracionOpacidad ?? 70) / 100 }}
    />
  );
}
