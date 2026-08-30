import { CORONAS, MARCOS, TEXTURAS, buscarAdorno } from "@/lib/adornos";
import type { Invitacion } from "@/lib/invitacion";

export const marcoDe = (inv: Invitacion) => buscarAdorno(MARCOS, inv.marco, inv.marcoUrl);
export const coronaDe = (inv: Invitacion) => buscarAdorno(CORONAS, inv.corona, inv.coronaUrl);
export const texturaDe = (inv: Invitacion) => buscarAdorno(TEXTURAS, inv.textura, inv.texturaUrl);

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
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full object-cover opacity-90"
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
