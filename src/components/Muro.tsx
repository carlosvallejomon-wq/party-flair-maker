import {
  Crown,
  Feather,
  Gem,
  Heart,
  PartyPopper,
  Send,
  Sparkles,
  Wine,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Mensaje = { nombre: string; texto: string; fecha: number; emblema: string };

/** Emblemas que el invitado elige para firmar su dedicatoria. */
export const EMBLEMAS = [
  { id: "brindis", nombre: "Brindis de Honor", pie: "¡Salud por este día!", Icono: Wine },
  { id: "amor", nombre: "Amor Eterno", pie: "Alianzas & unión", Icono: Gem },
  { id: "bendicion", nombre: "Amor & Bendición", pie: "De todo corazón", Icono: Heart },
  { id: "fiesta", nombre: "Gran Celebración", pie: "¡A festejar por todo lo alto!", Icono: PartyPopper },
  { id: "dedicatoria", nombre: "Dedicatoria Sincera", pie: "Palabras sinceras", Icono: Feather },
  { id: "magia", nombre: "Magia & Estrellas", pie: "Los mejores augurios", Icono: Sparkles },
  { id: "realeza", nombre: "Realeza & Corona", pie: "Noche inolvidable", Icono: Crown },
];

const emblemaPorId = (id: string) => EMBLEMAS.find((e) => e.id === id) ?? EMBLEMAS[0]!;

/**
 * Muro de felicitaciones: los invitados eligen un emblema y dejan una
 * dedicatoria que se guarda en el propio navegador (sin servidor).
 */
export function Muro({ clave, relieve = true }: { clave: string; relieve?: boolean }) {
  const almacen = `muro-${clave}`;
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [emblema, setEmblema] = useState(EMBLEMAS[0]!.id);

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
    const form = e.currentTarget;
    const datos = new FormData(form);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const texto = String(datos.get("texto") ?? "").trim();
    if (!nombre || !texto) return;
    const siguiente = [{ nombre, texto, emblema, fecha: Date.now() }, ...mensajes].slice(0, 50);
    setMensajes(siguiente);
    try {
      window.localStorage.setItem(almacen, JSON.stringify(siguiente));
    } catch {
      /* almacenamiento lleno */
    }
    form.reset();
  };

  return (
    <div className="text-left">
      <form
        onSubmit={enviar}
        className={`space-y-5 rounded-3xl border border-primary/20 p-5 ${relieve ? "capsula-vidrio" : "bg-card"}`}
      >
        <div>
          <label
            htmlFor="muro-nombre"
            className="mb-2 block text-[11px] font-medium tracking-wide text-foreground/70"
          >
            Tu nombre o familia:
          </label>
          <input
            id="muro-nombre"
            name="nombre"
            placeholder="Ej: Familia Morales o Carlos y Andrea"
            className="w-full rounded-xl border border-foreground/15 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <span className="mb-2 block text-[11px] font-medium tracking-wide text-foreground/70">
            Elige un emblema para tu mensaje:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {EMBLEMAS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEmblema(e.id)}
                aria-pressed={emblema === e.id}
                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-colors ${
                  emblema === e.id
                    ? "border-primary bg-primary/12"
                    : "border-foreground/12 bg-background/40 hover:border-primary/40"
                }`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-primary ${
                    emblema === e.id ? "bg-primary/20" : "bg-foreground/5"
                  }`}
                >
                  <e.Icono size={15} strokeWidth={1.4} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-medium">{e.nombre}</span>
                  <span className="block truncate text-[9px] text-foreground/50">{e.pie}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="muro-texto"
            className="mb-2 block text-[11px] font-medium tracking-wide text-foreground/70"
          >
            Tu dedicatoria:
          </label>
          <div className="flex gap-2">
            <input
              id="muro-texto"
              name="texto"
              placeholder="Escribe tus palabras de bendición y cariño…"
              className="min-w-0 flex-1 rounded-xl border border-foreground/15 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              <Send size={13} /> Publicar
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {mensajes.map((m) => {
          const e = emblemaPorId(m.emblema);
          return (
            <div
              key={m.fecha}
              className={`flex items-start gap-3 rounded-2xl border border-primary/15 p-4 ${relieve ? "tarjeta-relieve" : "bg-card"}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <e.Icono size={17} strokeWidth={1.4} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{m.nombre}</p>
                  <span className="shrink-0 font-mono text-[10px] text-foreground/45">
                    {new Date(m.fecha).toISOString().slice(0, 10)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-foreground/70 italic">
                  “{m.texto}”
                </p>
                <p className="mt-1 text-[9px] tracking-widest text-primary/70 uppercase">
                  {e.nombre}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
