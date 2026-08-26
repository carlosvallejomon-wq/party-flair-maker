import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import botanical from "@/assets/botanical-hero.jpg";
import pareja1 from "@/assets/pareja-1.jpg";
import pareja2 from "@/assets/pareja-2.jpg";
import { Petals } from "@/components/Petals";
import { Reveal } from "@/components/Reveal";
import { useAmbientMusic } from "@/lib/use-ambient-music";

const TITULO = "Valentina & Mateo — Invitación digital interactiva";
const DESCRIPCION =
  "Invitación digital interactiva con música, cuenta regresiva, itinerario, código de vestimenta y confirmación de asistencia.";

export const Route = createFileRoute("/")({
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
  component: Invitacion,
});

const FECHA_EVENTO = new Date("2026-10-12T17:00:00-06:00");

function useCuentaRegresiva() {
  const [restante, setRestante] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null,
  );

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, FECHA_EVENTO.getTime() - Date.now());
      setRestante({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return restante;
}

const ITINERARIO = [
  { hora: "17:00 HRS", titulo: "Ceremonia Religiosa", lugar: "Capilla de la Hacienda" },
  { hora: "18:30 HRS", titulo: "Cóctel de Bienvenida", lugar: "Jardín de los Olivos" },
  { hora: "20:00 HRS", titulo: "Cena y Recepción", lugar: "Salón Principal" },
];

function Invitacion() {
  const restante = useCuentaRegresiva();
  const { playing, toggle } = useAmbientMusic();
  const [enviado, setEnviado] = useState(false);
  const [rsvpAbierto, setRsvpAbierto] = useState(false);

  const confirmar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(true);
  };

  const cifras = restante
    ? [
        { valor: restante.d, etiqueta: "Días" },
        { valor: restante.h, etiqueta: "Hrs" },
        { valor: restante.m, etiqueta: "Min" },
        { valor: restante.s, etiqueta: "Seg" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-foreground/5 bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-widest text-olive uppercase">
            Invitaciones de
          </span>
          <span className="font-display text-xl font-semibold italic">Votos &amp; Seda</span>
        </div>
        <Link
          to="/plantillas"
          className="rounded-full bg-foreground px-4 py-2 text-xs font-medium tracking-tight text-background transition-opacity hover:opacity-85"
        >
          Crear Invitación
        </Link>
      </header>

      <main className="relative mx-auto min-h-screen max-w-[430px] bg-background shadow-2xl">
        <Petals />

        {/* Portada */}
        <section className="relative flex h-[90vh] flex-col items-center justify-center border-b border-primary/10 px-8 text-center">
          <img
            src={botanical}
            alt=""
            aria-hidden
            width={864}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="fade-in-up z-10">
            <span className="mb-8 block text-xs tracking-[0.3em] text-olive uppercase">
              Nuestra Boda
            </span>
            <h1 className="mb-4 font-display text-6xl leading-none">
              Valentina
              <br />
              <span className="text-primary italic">&amp;</span>
              <br />
              Mateo
            </h1>
            <div className="mx-auto my-8 h-16 w-px bg-primary/40" />
            <p className="font-mono text-sm tracking-tighter">12 . OCTUBRE . 2026</p>
            <p className="mt-2 text-xs tracking-widest uppercase opacity-60">
              Hacienda San José, México
            </p>
          </div>

          <div className="absolute bottom-14 z-10 flex gap-6 font-mono">
            {cifras.map((c) => (
              <div key={c.etiqueta} className="text-center">
                <span className="block text-xl tabular-nums">
                  {String(c.valor).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase opacity-50">{c.etiqueta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Historia */}
        <section className="px-10 py-24 text-center">
          <Reveal>
            <h2 className="mb-8 font-display text-3xl italic">Nuestra Historia</h2>
            <p className="text-sm leading-relaxed text-pretty text-foreground/80">
              Desde aquel primer café en Coyoacán hasta el día que decidimos unir nuestras vidas
              bajo los olivos. Queremos celebrar el amor, la amistad y el futuro con las personas
              que más queremos.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <Reveal>
              <img
                src={pareja1}
                alt="Los novios tomados de la mano en el olivar"
                loading="lazy"
                width={800}
                height={1200}
                className="aspect-[2/3] w-full rounded-t-full object-cover"
              />
            </Reveal>
            <Reveal delay={150}>
              <img
                src={pareja2}
                alt="Los novios riendo en el jardín"
                loading="lazy"
                width={800}
                height={1200}
                className="mt-8 aspect-[2/3] w-full rounded-b-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Itinerario */}
        <section className="bg-foreground px-8 py-20 text-background">
          <h2 className="mb-16 text-center font-display text-4xl">El Gran Día</h2>
          <div className="relative space-y-12">
            <div className="absolute top-0 bottom-0 left-[11px] w-px bg-background/20" />
            {ITINERARIO.map((item, i) => (
              <Reveal key={item.titulo} delay={i * 120}>
                <div className="relative pl-10">
                  <div className="absolute top-1 left-0 flex size-[22px] items-center justify-center rounded-full border border-primary bg-foreground">
                    <div className="size-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="font-mono text-xs text-primary">{item.hora}</span>
                  <h3 className="text-lg font-medium">{item.titulo}</h3>
                  <p className="mt-1 text-xs text-background/60">{item.lugar}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Detalles */}
        <section className="space-y-8 px-8 py-20">
          <Reveal>
            <div className="border border-foreground/10 p-8 text-center">
              <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                Código de Vestimenta
              </span>
              <h3 className="font-display text-2xl italic">Formal / Guayabera</h3>
              <p className="mt-4 text-xs text-foreground/60">
                Hombres: Guayabera manga larga y pantalón de lino.
                <br />
                Mujeres: Vestido largo de noche.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-primary/5 p-8 text-center">
              <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                Mesa de Regalos
              </span>
              <h3 className="font-display text-2xl">Nuestra Nueva Vida</h3>
              <p className="mt-4 mb-6 text-xs text-foreground/60">
                Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo:
              </p>
              <a
                href="https://www.amazon.com.mx/wedding"
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-primary px-6 py-3 text-[10px] tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-background"
              >
                Ver Mesa de Regalos
              </a>
            </div>
          </Reveal>
        </section>

        {/* RSVP */}
        <section id="rsvp" className="px-8 pb-24">
          <Reveal>
            <div className="border border-foreground/10 bg-card p-8">
              <h2 className="text-center font-display text-3xl italic">Confirma tu Asistencia</h2>
              <p className="mt-3 text-center text-xs text-foreground/60">
                Agradecemos tu respuesta antes del 12 de septiembre.
              </p>

              {enviado ? (
                <p className="mt-10 text-center font-display text-xl text-primary italic">
                  ¡Gracias! Hemos recibido tu confirmación.
                </p>
              ) : (
                <form onSubmit={confirmar} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="nombre"
                      className="text-[10px] tracking-widest text-olive uppercase"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      required
                      className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="asistencia"
                        className="text-[10px] tracking-widest text-olive uppercase"
                      >
                        Asistencia
                      </label>
                      <select
                        id="asistencia"
                        className="w-full appearance-none border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                      >
                        <option>Sí, ahí estaré</option>
                        <option>No podré asistir</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="pases"
                        className="text-[10px] tracking-widest text-olive uppercase"
                      >
                        Pases
                      </label>
                      <input
                        id="pases"
                        type="number"
                        min={1}
                        max={4}
                        defaultValue={2}
                        className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="nota"
                      className="text-[10px] tracking-widest text-olive uppercase"
                    >
                      Mensaje para los novios
                    </label>
                    <textarea
                      id="nota"
                      rows={2}
                      className="w-full resize-none border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                      placeholder="Alergias, buenos deseos…"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-foreground py-4 text-[10px] tracking-[0.3em] text-background uppercase transition-colors hover:bg-primary"
                  >
                    Enviar confirmación
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>

        <div className="h-32" />
      </main>

      {/* Barra flotante */}
      <nav className="fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-[380px] -translate-x-1/2">
        <div className="flex items-center justify-between rounded-2xl border border-foreground/5 bg-background/90 p-2 shadow-2xl backdrop-blur-xl">
          <button
            onClick={toggle}
            aria-label={playing ? "Pausar música" : "Reproducir música"}
            aria-pressed={playing}
            className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary/20"
          >
            <div className="flex h-4 items-end gap-[2px]">
              <div
                className={`w-1 bg-current ${playing ? "h-2 animate-[pulse_1s_infinite]" : "h-1.5"}`}
              />
              <div
                className={`w-1 bg-current ${playing ? "h-4 animate-[pulse_1.2s_infinite]" : "h-1.5"}`}
              />
              <div
                className={`w-1 bg-current ${playing ? "h-3 animate-[pulse_0.8s_infinite]" : "h-1.5"}`}
              />
            </div>
          </button>

          <button
            onClick={() => {
              setRsvpAbierto(true);
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-expanded={rsvpAbierto}
            className="mx-2 h-12 flex-1 rounded-xl bg-foreground text-xs font-semibold tracking-widest text-background uppercase transition-colors hover:bg-primary"
          >
            Confirmar Asistencia
          </button>

          <a
            href="https://maps.google.com/?q=Hacienda+San+Jose+Mexico"
            target="_blank"
            rel="noreferrer"
            aria-label="Ver ubicación en el mapa"
            className="flex size-12 items-center justify-center rounded-xl border border-foreground/10 text-foreground"
          >
            <span className="flex size-5 rotate-45 items-center justify-center rounded-sm border-2 border-current">
              <span className="size-1 rounded-full bg-current" />
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}
