import { CORONAS, ESQUINAS, MARCOS, TEXTURAS, buscarAdorno } from "@/lib/adornos";
import type { Invitacion } from "@/lib/invitacion";
import { useEffect, useState } from "react";

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

type BordesTransparentes = { arriba: number; derecha: number; abajo: number; izquierda: number };

/** Mide el espacio transparente del PNG para anclar la parte visible, no el lienzo vacío. */
function useBordesTransparentes(src: string) {
  const [bordes, setBordes] = useState<BordesTransparentes>({ arriba: 0, derecha: 0, abajo: 0, izquierda: 0 });

  useEffect(() => {
    const imagen = new Image();
    imagen.onload = () => {
      const lado = 220;
      const canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const escala = Math.min(lado / imagen.naturalWidth, lado / imagen.naturalHeight);
      const ancho = imagen.naturalWidth * escala;
      const alto = imagen.naturalHeight * escala;
      const x0 = (lado - ancho) / 2;
      const y0 = (lado - alto) / 2;
      ctx.clearRect(0, 0, lado, lado);
      ctx.drawImage(imagen, x0, y0, ancho, alto);
      try {
        const datos = ctx.getImageData(0, 0, lado, lado).data;
        let minX = lado;
        let minY = lado;
        let maxX = 0;
        let maxY = 0;
        for (let y = 0; y < lado; y += 1) {
          for (let x = 0; x < lado; x += 1) {
            if ((datos[(y * lado + x) * 4 + 3] ?? 0) < 18) continue;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
        if (minX === lado) return;
        setBordes({
          arriba: minY / lado,
          derecha: (lado - 1 - maxX) / lado,
          abajo: (lado - 1 - maxY) / lado,
          izquierda: minX / lado,
        });
      } catch {
        setBordes({ arriba: 0, derecha: 0, abajo: 0, izquierda: 0 });
      }
    };
    imagen.src = src;
    return () => { imagen.onload = null; };
  }, [src]);

  return bordes;
}

/**
 * Decoración repetida en las esquinas de la invitación.
 * Cada esquina se ancla con `inset` y se transforma desde su propio vértice,
 * así el tamaño crece hacia adentro y nunca se desplaza al centro.
 */
export function Esquinas({ inv }: { inv: Invitacion }) {
  const src = esquinasDe(inv);
  const bordes = useBordesTransparentes(src);
  if (!src) return null;

  const tam = `${inv.esquinasTamano ?? 30}%`;
  const margenNumero = inv.esquinasMargen ?? 0;
  const giro = inv.esquinasGiro ?? 0;
  const modo = inv.esquinasModo ?? (inv.esquinasEspejo === false ? "igual" : "espejo");
  const visibles = DISPOSICIONES[inv.esquinasDisposicion ?? "cuatro"] ?? DISPOSICIONES["cuatro"]!;
  const opacidad = (inv.esquinasOpacidad ?? 100) / 100;

  // Cada adorno vive dentro de un contenedor anclado. Así el tamaño cambia
  // hacia el interior sin alterar la posición del vértice.
  const transformaciones = modo === "espejo"
    ? [
        { sx: 1, sy: 1, angulo: giro },
        { sx: -1, sy: 1, angulo: giro },
        { sx: 1, sy: -1, angulo: giro },
        { sx: -1, sy: -1, angulo: giro },
      ]
    : modo === "giro"
      ? [0, 90, 270, 180].map((angulo) => ({ sx: 1, sy: 1, angulo: angulo + giro }))
      : [0, 1, 2, 3].map(() => ({ sx: 1, sy: 1, angulo: giro }));

  // Calcula el rectángulo visible después de girar o reflejar el PNG. De esta
  // forma el borde visible —no el lienzo transparente— permanece en el filo.
  const limitesVisibles = transformaciones.map(({ sx, sy, angulo }) => {
    const radianes = (angulo * Math.PI) / 180;
    const cos = Math.cos(radianes);
    const sin = Math.sin(radianes);
    const puntos = [
      [bordes.izquierda, bordes.arriba],
      [1 - bordes.derecha, bordes.arriba],
      [bordes.izquierda, 1 - bordes.abajo],
      [1 - bordes.derecha, 1 - bordes.abajo],
    ].map(([x = 0, y = 0]) => {
      const cx = x - 0.5;
      const cy = y - 0.5;
      return {
        x: 0.5 + sx * (cos * cx - sin * cy),
        y: 0.5 + sy * (sin * cx + cos * cy),
      };
    });
    return {
      izquierda: Math.min(...puntos.map((p) => p.x)),
      derecha: 1 - Math.max(...puntos.map((p) => p.x)),
      arriba: Math.min(...puntos.map((p) => p.y)),
      abajo: 1 - Math.max(...puntos.map((p) => p.y)),
    };
  });

  const posicion = limitesVisibles.map((_borde, i) => {
    const margen = `${margenNumero}%`;
    if (i === 0) return { top: margen, left: margen };
    if (i === 1) return { top: margen, right: margen };
    if (i === 2) return { bottom: margen, left: margen };
    return { bottom: margen, right: margen };
  });
  const compensacion = limitesVisibles.map((borde, i) => {
    const x = (i === 1 || i === 3 ? borde.derecha : -borde.izquierda) * 100;
    const y = (i >= 2 ? borde.abajo : -borde.arriba) * 100;
    return `translate(${x}%, ${y}%)`;
  });

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
             transform: compensacion[i],
          }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain"
            style={{
              transformOrigin: "center",
               transform: `scale(${transformaciones[i]?.sx ?? 1}, ${transformaciones[i]?.sy ?? 1}) rotate(${transformaciones[i]?.angulo ?? giro}deg)`,
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
  const ajuste = inv.marcoAjuste ?? "estirar";
  const margen = `${inv.marcoMargen ?? 3}%`;
  const opacidad = (inv.marcoOpacidad ?? 85) / 100;
  const esMarcoVerticalNuevo = /^m-n\d+$/.test(inv.marco);

  // "natural": border-image conserva las esquinas del diseño y solo extiende
  // los laterales, así un marco cuadrado no se deforma en una tarjeta alargada.
  if (ajuste === "natural") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute z-[6]"
        style={{
          inset: margen,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "transparent",
          borderImageSource: `url("${src}")`,
          borderImageSlice: "30%",
          borderImageWidth: "12%",
          borderImageRepeat: "stretch",
          opacity: opacidad,
        }}
      />
    );
  }

  // Los marcos nuevos vienen en lienzos cuadrados, pero el dibujo visible ya
  // tiene proporción vertical. `cover` conserva esa proporción y recorta solo
  // el espacio transparente lateral, en vez de ensanchar el dibujo.
  // Los marcos verticales nuevos ya traen su proporción final. Nunca deben
  // heredar el modo de relleno de marcos anteriores: se muestran completos,
  // sin ampliar ni recortar sus lados para forzarlos al alto de la portada.
  const llenarSinDeformar = ajuste === "estirar" && !esMarcoVerticalNuevo;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      className={`pointer-events-none absolute z-[6] ${llenarSinDeformar ? "object-cover" : "object-contain"}`}
      style={{
        inset: margen,
        width: `calc(100% - 2 * ${margen})`,
        height: `calc(100% - 2 * ${margen})`,
        objectPosition: esMarcoVerticalNuevo ? "center top" : "center",
        opacity: opacidad,
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
