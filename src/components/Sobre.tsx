import { useState } from "react";

import sobrePapel from "@/assets/sobre-papel.jpg";

/**
 * Intro interactiva: un sobre lacrado con sello de cera que el invitado abre
 * con un toque. La apertura levanta la solapa en 3D y emite un rayo de luz.
 * Si hay video de bienvenida, se reproduce antes de revelar la portada.
 * El toque también sirve como gesto para iniciar la música.
 */
export function Sobre({
  titulo,
  subtitulo,
  marcoSrc,
  videoUrl,
  onAbrir,
}: {
  titulo: string;
  subtitulo: string;
  marcoSrc?: string;
  videoUrl?: string;
  onAbrir: () => void;
}) {
  const [abriendo, setAbriendo] = useState(false);
  const [video, setVideo] = useState(false);

  const abrir = () => {
    if (abriendo) return;
    setAbriendo(true);
    if (videoUrl?.trim()) {
      window.setTimeout(() => setVideo(true), 1500);
      return;
    }
    window.setTimeout(onAbrir, 1900);
  };

  if (video && videoUrl) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-foreground px-6">
        <video
          src={videoUrl}
          autoPlay
          playsInline
          controls
          onEnded={onAbrir}
          className="max-h-[70%] w-full rounded-2xl object-contain"
        />
        <button
          type="button"
          onClick={onAbrir}
          className="rounded-full border border-background/40 px-6 py-2 text-[10px] tracking-[0.3em] text-background uppercase"
        >
          Ver la invitación
        </button>
      </div>
    );
  }

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
      {marcoSrc && (
        <img
          src={marcoSrc}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}

      <span className="relative text-[10px] tracking-[0.35em] text-olive uppercase">
        {subtitulo}
      </span>

      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir invitación"
        className="sobre-escena group relative h-44 w-72 cursor-pointer"
      >
        <span className={`sobre-luz ${abriendo ? "sobre-luz-on" : ""}`} />

        <span className="absolute inset-0 rounded-lg border border-primary/30 bg-card shadow-[0_25px_60px_-25px_rgba(0,0,0,0.45)]" />

        <span className={`sobre-tarjeta ${abriendo ? "sobre-tarjeta-on" : ""}`}>
          <span className="font-display text-lg italic">{titulo}</span>
        </span>

        <span className="sobre-lateral-izq" />
        <span className="sobre-lateral-der" />
        <span className="sobre-inferior" />

        <span className={`sobre-solapa ${abriendo ? "sobre-abierta" : ""}`} />

        <span
          className={`sobre-sello ${abriendo ? "sobre-sello-off" : "group-hover:scale-110"}`}
          aria-hidden
        >
          <span className="font-display text-base leading-none">♥</span>
        </span>
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
