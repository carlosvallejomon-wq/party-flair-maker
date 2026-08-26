import { createFileRoute, Link } from "@tanstack/react-router";

import botanical from "@/assets/botanical-hero.jpg";
import { Reveal } from "@/components/Reveal";

const TITULO = "Plantillas de invitaciones digitales | Votos & Seda";
const DESCRIPCION =
  "Elige una plantilla de invitación digital interactiva para bodas, XV años o bautizos: música, cuenta regresiva y confirmación de asistencia.";

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

const PLANTILLAS = [
  {
    evento: "Boda",
    nombre: "Olivo Botánico",
    detalle: "Verde olivo, oro y papel marfil. Ceremonia, itinerario y mesa de regalos.",
    disponible: true,
  },
  {
    evento: "XV Años",
    nombre: "Rosa Ceremonial",
    detalle: "Portada con vals, galería de la quinceañera y lista de chambelanes.",
    disponible: false,
  },
  {
    evento: "Bautizo",
    nombre: "Lino Sereno",
    detalle: "Diseño sobrio con padrinos, misa y recepción familiar.",
    disponible: false,
  },
];

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
          to="/"
          className="text-[10px] tracking-widest text-olive uppercase hover:text-foreground"
        >
          Ver demo
        </Link>
      </header>

      <main className="mx-auto max-w-[430px] px-8 pt-16 pb-24">
        <h1 className="font-display text-4xl leading-tight">
          Plantillas <span className="text-primary italic">interactivas</span>
        </h1>
        <p className="mt-4 text-sm text-foreground/70">
          Cada plantilla incluye música, cuenta regresiva, itinerario, ubicación y confirmación de
          asistencia.
        </p>

        <div className="mt-12 space-y-6">
          {PLANTILLAS.map((p, i) => (
            <Reveal key={p.nombre} delay={i * 100}>
              <article className="overflow-hidden border border-foreground/10">
                <img
                  src={botanical}
                  alt={`Vista previa de la plantilla ${p.nombre}`}
                  loading="lazy"
                  width={864}
                  height={1600}
                  className="h-40 w-full object-cover opacity-70"
                />
                <div className="p-6">
                  <span className="text-[10px] tracking-widest text-olive uppercase">
                    {p.evento}
                  </span>
                  <h2 className="mt-1 font-display text-2xl italic">{p.nombre}</h2>
                  <p className="mt-3 text-xs text-foreground/60">{p.detalle}</p>
                  {p.disponible ? (
                    <Link
                      to="/"
                      className="mt-6 inline-block border border-primary px-6 py-3 text-[10px] tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-background"
                    >
                      Abrir plantilla
                    </Link>
                  ) : (
                    <span className="mt-6 inline-block border border-foreground/15 px-6 py-3 text-[10px] tracking-widest text-foreground/40 uppercase">
                      Próximamente
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}
