import { Heart, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Mensaje = { nombre: string; texto: string; fecha: number };

/**
 * Muro de felicitaciones: los invitados dejan un mensaje que se guarda en el
 * propio navegador (sin servidor) y se muestra como tarjetas.
 */
export function Muro({ clave, relieve = true }: { clave: string; relieve?: boolean }) {
  const almacen = `muro-${clave}`;
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(almacen);
      if (raw) setMensajes(JSON.parse(raw) as Mensaje[]);
    } catch {
      /* sin mensajes guardados */
    }
  }, [almacen]);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const texto = String(datos.get("texto") ?? "").trim();
    if (!nombre || !texto) return;
    const siguiente = [{ nombre, texto, fecha: Date.now() }, ...mensajes].slice(0, 50);
    setMensajes(siguiente);
    try {
      window.localStorage.setItem(almacen, JSON.stringify(siguiente));
    } catch {
      /* almacenamiento lleno */
    }
    e.currentTarget.reset();
  };

  return (
    <div>
      <form onSubmit={enviar} className="space-y-3">
        <input
          name="nombre"
          placeholder="Tu nombre"
          aria-label="Tu nombre"
          className="w-full rounded-xl border border-foreground/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <textarea
          name="texto"
          rows={3}
          placeholder="Escribe tus buenos deseos…"
          aria-label="Tu mensaje"
          className="w-full rounded-xl border border-foreground/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-[10px] tracking-widest text-background uppercase transition-opacity hover:opacity-85"
        >
          <Send size={13} /> Dejar mi mensaje
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {mensajes.map((m) => (
          <div
            key={m.fecha}
            className={`rounded-xl border border-foreground/10 bg-card p-4 text-left ${relieve ? "tarjeta-relieve" : ""}`}
          >
            <p className="flex items-center gap-2 font-display text-lg italic">
              <Heart size={13} className="text-primary" /> {m.nombre}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/70">{m.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
