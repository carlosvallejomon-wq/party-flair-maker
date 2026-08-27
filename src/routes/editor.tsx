import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { InvitacionVista } from "@/components/InvitacionVista";
import {
  ANIMACIONES,
  DECORACIONES,
  MELODIAS,
  PLANTILLAS,
  TEMAS,
  cargarBorrador,
  guardarBorrador,
  plantillaPorSlug,
  type Decoracion,
  type Invitacion,
  type Melodia,
  type Tema,
} from "@/lib/invitacion";

const TITULO = "Editor de invitaciones digitales | Votos & Seda";
const DESCRIPCION =
  "Personaliza tu invitación digital: nombres, fecha, colores, decoración animada, música e itinerario, con vista previa en vivo.";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    p: typeof search.p === "string" ? search.p : undefined,
  }),
  component: Editor,
});

const etiqueta = "mb-1 block text-[10px] tracking-widest text-olive uppercase";
const campo =
  "w-full rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm outline-none focus:border-primary";

function Editor() {
  const { p } = Route.useSearch();
  const [inv, setInv] = useState<Invitacion>(() => plantillaPorSlug(p));
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (p) {
      setInv(plantillaPorSlug(p));
      return;
    }
    const borrador = cargarBorrador();
    if (borrador) setInv(borrador);
  }, [p]);

  const set = <K extends keyof Invitacion>(clave: K, valor: Invitacion[K]) =>
    setInv((prev) => ({ ...prev, [clave]: valor }));

  const setItem = (i: number, clave: "hora" | "titulo" | "lugar", valor: string) =>
    setInv((prev) => ({
      ...prev,
      itinerario: prev.itinerario.map((it, idx) => (idx === i ? { ...it, [clave]: valor } : it)),
    }));

  const guardar = () => {
    guardarBorrador(inv);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div className="min-h-screen bg-secondary/40 font-sans text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-foreground/5 bg-background/85 px-6 py-4 backdrop-blur-md">
        <Link to="/" className="flex flex-col">
          <span className="text-[10px] font-medium tracking-widest text-olive uppercase">
            Editor de
          </span>
          <span className="font-display text-xl font-semibold italic">Votos &amp; Seda</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/plantillas"
            className="text-[10px] tracking-widest text-olive uppercase hover:text-foreground"
          >
            Plantillas
          </Link>
          <button
            type="button"
            onClick={guardar}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-85"
          >
            {guardado ? "¡Guardado!" : "Guardar"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-10">
          <div>
            <h1 className="font-display text-4xl leading-tight">
              Personaliza tu <span className="text-primary italic">invitación</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-foreground/70">
              Cambia textos, colores, decoración animada y música. La vista previa se actualiza al
              instante.
            </p>
          </div>

          {/* Plantilla base */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-4 font-display text-2xl italic">Plantilla base</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLANTILLAS.map((pl) => (
                <button
                  key={pl.slug}
                  type="button"
                  onClick={() => setInv(plantillaPorSlug(pl.slug))}
                  aria-pressed={inv.plantilla === pl.plantilla}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    inv.plantilla === pl.plantilla
                      ? "border-primary bg-primary/5"
                      : "border-foreground/10 hover:border-primary/50"
                  }`}
                >
                  <span className="text-[10px] tracking-widest text-olive uppercase">
                    {pl.evento}
                  </span>
                  <span className="block font-display text-lg italic">{pl.plantilla}</span>
                  <span className="mt-1 block text-xs text-foreground/60">{pl.descripcion}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Estilo */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-4 font-display text-2xl italic">Estilo y decoración</h2>

            <span className={etiqueta}>Paleta de color</span>
            <div className="mb-6 grid grid-cols-3 gap-3">
              {(Object.keys(TEMAS) as Tema[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tema", t)}
                  aria-pressed={inv.tema === t}
                  className={`rounded-xl border p-3 text-left ${
                    inv.tema === t ? "border-primary" : "border-foreground/10"
                  }`}
                >
                  <span className="flex gap-1">
                    {TEMAS[t].swatch.map((c) => (
                      <span
                        key={c}
                        className="size-4 rounded-full border border-foreground/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 block text-xs">{TEMAS[t].nombre}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={etiqueta} htmlFor="deco">
                  Decoración animada
                </label>
                <select
                  id="deco"
                  className={campo}
                  value={inv.decoracion}
                  onChange={(e) => set("decoracion", e.target.value as Decoracion)}
                >
                  {DECORACIONES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="melodia">
                  Música
                </label>
                <select
                  id="melodia"
                  className={campo}
                  value={inv.melodia}
                  onChange={(e) => set("melodia", e.target.value as Melodia)}
                >
                  {MELODIAS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="anim">
                  Animación de portada
                </label>
                <select
                  id="anim"
                  className={campo}
                  value={inv.animacionPortada}
                  onChange={(e) =>
                    set("animacionPortada", e.target.value as Invitacion["animacionPortada"])
                  }
                >
                  {ANIMACIONES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Datos */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-4 font-display text-2xl italic">Datos del evento</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={etiqueta} htmlFor="n1">
                  Nombre principal
                </label>
                <input
                  id="n1"
                  className={campo}
                  value={inv.nombre1}
                  onChange={(e) => set("nombre1", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="n2">
                  Segundo nombre (opcional)
                </label>
                <input
                  id="n2"
                  className={campo}
                  value={inv.nombre2}
                  onChange={(e) => set("nombre2", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="frase">
                  Frase superior
                </label>
                <input
                  id="frase"
                  className={campo}
                  value={inv.frase}
                  onChange={(e) => set("frase", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="fecha">
                  Fecha y hora
                </label>
                <input
                  id="fecha"
                  type="datetime-local"
                  className={campo}
                  value={inv.fecha}
                  onChange={(e) => set("fecha", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="lugar">
                  Lugar
                </label>
                <input
                  id="lugar"
                  className={campo}
                  value={inv.lugar}
                  onChange={(e) => set("lugar", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="ciudad">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  className={campo}
                  value={inv.ciudad}
                  onChange={(e) => set("ciudad", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={etiqueta} htmlFor="historia">
                  Historia o mensaje
                </label>
                <textarea
                  id="historia"
                  rows={4}
                  className={`${campo} resize-none`}
                  value={inv.historia}
                  onChange={(e) => set("historia", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Itinerario */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-4 font-display text-2xl italic">Itinerario</h2>
            <div className="space-y-4">
              {inv.itinerario.map((item, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[110px_1fr_1fr_auto]">
                  <input
                    aria-label={`Hora del momento ${i + 1}`}
                    className={campo}
                    value={item.hora}
                    onChange={(e) => setItem(i, "hora", e.target.value)}
                  />
                  <input
                    aria-label={`Título del momento ${i + 1}`}
                    className={campo}
                    value={item.titulo}
                    onChange={(e) => setItem(i, "titulo", e.target.value)}
                  />
                  <input
                    aria-label={`Lugar del momento ${i + 1}`}
                    className={campo}
                    value={item.lugar}
                    onChange={(e) => setItem(i, "lugar", e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={`Eliminar momento ${i + 1}`}
                    onClick={() =>
                      set(
                        "itinerario",
                        inv.itinerario.filter((_, idx) => idx !== i),
                      )
                    }
                    className="rounded-lg border border-foreground/15 px-3 text-xs text-foreground/60 hover:border-destructive hover:text-destructive"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                set("itinerario", [
                  ...inv.itinerario,
                  { hora: "00:00 HRS", titulo: "Nuevo momento", lugar: "" },
                ])
              }
              className="mt-4 rounded-full border border-primary px-5 py-2 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
            >
              Agregar momento
            </button>
          </section>

          {/* Extras */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-4 font-display text-2xl italic">Detalles y confirmación</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={etiqueta} htmlFor="dress">
                  Código de vestimenta
                </label>
                <input
                  id="dress"
                  className={campo}
                  value={inv.dressCode}
                  onChange={(e) => set("dressCode", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="dressd">
                  Indicaciones de vestimenta
                </label>
                <input
                  id="dressd"
                  className={campo}
                  value={inv.dressDetalle}
                  onChange={(e) => set("dressDetalle", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="regt">
                  Título de mesa de regalos
                </label>
                <input
                  id="regt"
                  className={campo}
                  value={inv.regalosTitulo}
                  onChange={(e) => set("regalosTitulo", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="regu">
                  Enlace de mesa de regalos
                </label>
                <input
                  id="regu"
                  className={campo}
                  value={inv.regalosUrl}
                  onChange={(e) => set("regalosUrl", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="maps">
                  Enlace del mapa
                </label>
                <input
                  id="maps"
                  className={campo}
                  value={inv.mapsUrl}
                  onChange={(e) => set("mapsUrl", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="lim">
                  Confirmar antes del
                </label>
                <input
                  id="lim"
                  className={campo}
                  value={inv.rsvpLimite}
                  onChange={(e) => set("rsvpLimite", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Vista previa */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <span className="mb-3 block text-[10px] tracking-widest text-olive uppercase">
            Vista previa en vivo
          </span>
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-2xl">
            <div className="max-h-[70vh] overflow-y-auto">
              <InvitacionVista inv={inv} embebido />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
