import { useState } from "react";

/**
 * Intro interactiva: un sobre lacrado que el invitado abre con un toque.
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
    window.setTimeout(onAbrir, 1100);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background px-8 text-center transition-opacity duration-700 ${
        abriendo ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="text-[10px] tracking-[0.35em] text-olive uppercase">{subtitulo}</span>

      <button
        type="button"
        onClick={abrir}
        aria-label="Abrir invitación"
        className="group relative h-40 w-64 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-md border border-primary/40 bg-card shadow-xl" />
        <span
          className={`sobre-solapa absolute inset-x-0 top-0 h-1/2 origin-top border-x border-t border-primary/40 bg-primary/10 ${
            abriendo ? "sobre-abierta" : ""
          }`}
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 border-x border-b border-primary/40 bg-card" />
        <span className="absolute top-1/2 left-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary font-display text-lg text-background shadow-lg transition-transform group-hover:scale-110">
          ♥
        </span>
      </button>

      <div>
        <h2 className="font-display text-3xl italic">{titulo}</h2>
        <p className="mt-3 animate-pulse text-[10px] tracking-[0.3em] text-olive uppercase">
          Toca para abrir
        </p>
      </div>
    </div>
  );
}
