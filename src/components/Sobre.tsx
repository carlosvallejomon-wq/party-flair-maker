import { useState } from "react";

import marcoFloral from "@/assets/marco-floral.png";
import sobrePapel from "@/assets/sobre-papel.jpg";

/**
 * Intro interactiva: un sobre lacrado con sello de cera que el invitado abre
 * con un toque. La apertura levanta la solapa en 3D, emite un rayo de luz y
 * suelta mariposas antes de revelar la portada.
 * El toque también sirve como gesto para iniciar la música.
 */
export function Sobre({
  titulo,
  subtitulo,
  onAbrir,
}: {
  titulo: string;
  subtitulo: string;
  onAbrir: () => void;
}) {
  const [abriendo, setAbriendo] = useState(false);

  const abrir = () => {
    if (abriendo) return;
    setAbriendo(true);
    window.setTimeout(onAbrir, 1900);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-hidden bg-secondary px-8 text-center transition-opacity duration-700 ${
        abriendo ? "pointer-events-none opacity-0 delay-[1200ms]" : "opacity-100"
      }`}
    >
      <img
        src={sobrePapel}
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <img
        src={marcoFloral}
        alt=""
        aria-hidden
        width={1024}
        height={1536}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
      />

      <span className="relative text-[10px] tracking-[0.35em] text-olive uppercase">
        {subtitulo}
      </span>

      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir invitación"
        className="sobre-escena group relative h-44 w-72 cursor-pointer"
      >
        {/* rayo de luz al abrir */}
        <span className={`sobre-luz ${abriendo ? "sobre-luz-on" : ""}`} />

        {/* cuerpo del sobre */}
        <span className="absolute inset-0 rounded-lg border border-primary/30 bg-card shadow-[0_25px_60px_-25px_rgba(0,0,0,0.45)]" />

        {/* tarjeta que sale */}
        <span className={`sobre-tarjeta ${abriendo ? "sobre-tarjeta-on" : ""}`}>
          <span className="font-display text-lg italic">{titulo}</span>
        </span>

        {/* solapas laterales e inferior */}
        <span className="sobre-lateral-izq" />
        <span className="sobre-lateral-der" />
        <span className="sobre-inferior" />

        {/* solapa superior */}
        <span className={`sobre-solapa ${abriendo ? "sobre-abierta" : ""}`} />

        {/* sello de cera */}
        <span
          className={`sobre-sello ${abriendo ? "sobre-sello-off" : "group-hover:scale-110"}`}
          aria-hidden
        >
          <span className="font-display text-base leading-none">♥</span>
        </span>

        {/* mariposas que escapan */}
        {abriendo &&
          [0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`sobre-mariposa sobre-mariposa-${i}`} aria-hidden />
          ))}
      </button>

      <div className="relative">
        <h2 className="font-display text-3xl italic">{titulo}</h2>
        <p className="mt-3 animate-pulse text-[10px] tracking-[0.3em] text-olive uppercase">
          Toca el sello para abrir
        </p>
      </div>
    </div>
  );
}
