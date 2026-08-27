import { createFileRoute, Link } from "@tanstack/react-router";

import botanical from "@/assets/botanical-hero.jpg";
import { Reveal } from "@/components/Reveal";
import { PLANTILLAS, TEMAS } from "@/lib/invitacion";

const TITULO = "Plantillas de invitaciones digitales | Votos & Seda";
const DESCRIPCION =
  "Seis plantillas de invitación digital interactiva para bodas, XV años, bautizos, cumpleaños y aniversarios, todas editables con música y decoración animada.";

export const Route = createFileRoute("/plantillas")({
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
  component: Plantillas,
});

function Plantillas() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-foreground/5 bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link to="/" className="flex flex-col">
          <span className="text-[10px] font-medium tracking-widest text-olive uppercase">
            Invitaciones de
          </span>
          <span className="font-display text-xl font-semibold italic">Votos &amp; Seda</span>
        </Link>
        <Link
          to="/editor"
          className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-85"
        >
          Crear Invitación
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        <h1 className="font-display text-4xl leading-tight">
          Plantillas <span className="text-primary italic">interactivas</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-foreground/70">
          Elige un punto de partida y edítalo por completo: colores, decoración animada, música,
          itinerario y confirmación de asistencia.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANTILLAS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10">
                <div className="relative">
                  <img
                    src={botanical}
                    alt={`Vista previa de la plantilla ${p.plantilla}`}
                    loading="lazy"
                    width={864}
                    height={1600}
                    className="h-36 w-full object-cover opacity-70"
                  />
                  <span className="absolute right-3 bottom-3 flex gap-1">
                    {TEMAS[p.tema].swatch.map((c) => (
                      <span
                        key={c}
                        className="size-4 rounded-full border border-background/60"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[10px] tracking-widest text-olive uppercase">
                    {p.evento}
                  </span>
                  <h2 className="mt-1 font-display text-2xl italic">{p.plantilla}</h2>
                  <p className="mt-3 flex-1 text-xs text-foreground/60">{p.descripcion}</p>
                  <Link
                    to="/editor"
                    search={{ p: p.slug }}
                    className="mt-6 inline-block border border-primary px-6 py-3 text-center text-[10px] tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-background"
                  >
                    Editar esta plantilla
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}
