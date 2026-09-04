import { CORONAS, ESQUINAS, MARCOS, TEXTURAS, buscarAdorno } from "@/lib/adornos";
import type { Invitacion } from "@/lib/invitacion";

export const marcoDe = (inv: Invitacion) => buscarAdorno(MARCOS, inv.marco, inv.marcoUrl);
export const coronaDe = (inv: Invitacion) => buscarAdorno(CORONAS, inv.corona, inv.coronaUrl);
export const texturaDe = (inv: Invitacion) => buscarAdorno(TEXTURAS, inv.textura, inv.texturaUrl);
export const esquinasDe = (inv: Invitacion) => buscarAdorno(ESQUINAS, inv.esquinas, inv.esquinasUrl);

/** Decoración repetida en las cuatro esquinas de la invitación. */
export function Esquinas({ inv }: { inv: Invitacion }) {
  const src = esquinasDe(inv);
  if (!src) return null;
  const w = `${inv.esquinasTamano ?? 32}%`;
  const giro = inv.esquinasGiro ?? 0;
  const modo = inv.esquinasModo ?? (inv.esquinasEspejo === false ? "igual" : "espejo");

  // El orden importa: primero se gira el adorno y después se voltea/rota
  // para acomodarlo a su esquina, así nunca queda torcido.
  const acomodo =
    modo === "espejo"
      ? ["none", "scaleX(-1)", "scaleY(-1)", "scale(-1,-1)"]
      : modo === "giro"
        ? ["none", "rotate(90deg)", "rotate(-90deg)", "rotate(180deg)"]
        : ["none", "none", "none", "none"];

  const pos = [
    "top-0 left-0",
    "top-0 right-0",
    "bottom-0 left-0",
    "right-0 bottom-0",
  ];

  return (
    <>
      {pos.map((className, i) => (
        <img
          key={className}
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          className={`pointer-events-none absolute z-[6] object-contain ${className}`}
          style={{ width: w, transform: `${acomodo[i]} rotate(${giro}deg)` }}
        />
      ))}
    </>
  );
}



/** Textura de papel/mármol con relieve suave sobre el fondo. */
export function Textura({ inv }: { inv: Invitacion }) {
  const src = texturaDe(inv);
  if (!src) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50 mix-blend-multiply"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

/** Marco elegante que enmarca la portada. */
export function Marco({ inv }: { inv: Invitacion }) {
  const src = marcoDe(inv);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full object-contain opacity-80 mix-blend-multiply"
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
