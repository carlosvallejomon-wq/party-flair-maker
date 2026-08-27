import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

import botanical from "@/assets/botanical-hero.jpg";
import pareja1 from "@/assets/pareja-1.jpg";
import pareja2 from "@/assets/pareja-2.jpg";
import { Decoraciones } from "@/components/Decoraciones";
import { Reveal } from "@/components/Reveal";
import { TEMAS, fechaLarga, type Invitacion } from "@/lib/invitacion";
import { useAmbientMusic } from "@/lib/use-ambient-music";

function useCuentaRegresiva(iso: string) {
  const [restante, setRestante] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null,
  );

  useEffect(() => {
    const objetivo = new Date(iso).getTime();
    const tick = () => {
      const diff = Math.max(0, objetivo - Date.now());
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
  }, [iso]);

  return restante;
}

const ANIM = {
  fade: "portada-fade",
  zoom: "portada-zoom",
  cortina: "portada-cortina",
} as const;

export function InvitacionVista({ inv, embebido = false }: { inv: Invitacion; embebido?: boolean }) {
  const restante = useCuentaRegresiva(inv.fecha);
  const { playing, toggle } = useAmbientMusic(inv.melodia);
  const [enviado, setEnviado] = useState(false);

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

  const tieneDos = inv.nombre2.trim().length > 0;

  return (
    <div
      style={TEMAS[inv.tema].vars as CSSProperties}
      className="bg-background font-sans text-foreground selection:bg-primary/20"
    >
      <main className="relative mx-auto max-w-[430px] bg-background shadow-2xl">
        <Decoraciones tipo={inv.decoracion} />

        {/* Portada */}
        <section
          className={`relative flex flex-col items-center justify-center border-b border-primary/10 px-8 text-center ${embebido ? "h-[560px]" : "h-[90vh]"}`}
        >
          <img
            src={botanical}
            alt=""
            aria-hidden
            width={864}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className={`z-10 ${ANIM[inv.animacionPortada]}`}>
            <span className="mb-8 block text-xs tracking-[0.3em] text-olive uppercase">
              {inv.frase}
            </span>
            <h1 className="mb-4 font-display text-5xl leading-none sm:text-6xl">
              {inv.nombre1}
              {tieneDos && (
                <>
                  <br />
                  <span className="text-primary italic">&amp;</span>
                  <br />
                  {inv.nombre2}
                </>
              )}
            </h1>
            <div className="mx-auto my-8 h-14 w-px bg-primary/40" />
            <p className="font-mono text-sm tracking-tighter">{fechaLarga(inv.fecha)}</p>
            <p className="mt-2 text-xs tracking-widest uppercase opacity-60">
              {inv.lugar}
              {inv.ciudad ? `, ${inv.ciudad}` : ""}
            </p>
          </div>

          <div className="absolute bottom-10 z-10 flex gap-6 font-mono">
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
        {inv.historia.trim() && (
          <section className="px-10 py-20 text-center">
            <Reveal>
              <h2 className="mb-8 font-display text-3xl italic">Nuestra Historia</h2>
              <p className="text-sm leading-relaxed text-pretty text-foreground/80">
                {inv.historia}
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4">
              <Reveal>
                <img
                  src={pareja1}
                  alt={`Foto de ${inv.nombre1}`}
                  loading="lazy"
                  width={800}
                  height={1200}
                  className="aspect-[2/3] w-full rounded-t-full object-cover"
                />
              </Reveal>
              <Reveal delay={150}>
                <img
                  src={pareja2}
                  alt="Foto del evento"
                  loading="lazy"
                  width={800}
                  height={1200}
                  className="mt-8 aspect-[2/3] w-full rounded-b-full object-cover"
                />
              </Reveal>
            </div>
          </section>
        )}

        {/* Itinerario */}
        {inv.itinerario.length > 0 && (
          <section className="bg-foreground px-8 py-16 text-background">
            <h2 className="mb-14 text-center font-display text-4xl">El Gran Día</h2>
            <div className="relative space-y-12">
              <div className="absolute top-0 bottom-0 left-[11px] w-px bg-background/20" />
              {inv.itinerario.map((item, i) => (
                <Reveal key={`${item.titulo}-${i}`} delay={i * 120}>
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
        )}

        {/* Detalles */}
        <section className="space-y-8 px-8 py-16">
          {inv.dressCode.trim() && (
            <Reveal>
              <div className="border border-foreground/10 p-8 text-center">
                <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                  Código de Vestimenta
                </span>
                <h3 className="font-display text-2xl italic">{inv.dressCode}</h3>
                <p className="mt-4 text-xs text-foreground/60">{inv.dressDetalle}</p>
              </div>
            </Reveal>
          )}

          {inv.regalosTitulo.trim() && (
            <Reveal delay={120}>
              <div className="bg-primary/5 p-8 text-center">
                <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                  Mesa de Regalos
                </span>
                <h3 className="font-display text-2xl">{inv.regalosTitulo}</h3>
                <p className="mt-4 mb-6 text-xs text-foreground/60">
                  Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo:
                </p>
                {inv.regalosUrl.trim() && (
                  <a
                    href={inv.regalosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block border border-primary px-6 py-3 text-[10px] tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-background"
                  >
                    Ver Mesa de Regalos
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </section>

        {/* RSVP */}
        <section id="rsvp" className="px-8 pb-20">
          <Reveal>
            <div className="border border-foreground/10 bg-card p-8">
              <h2 className="text-center font-display text-3xl italic">Confirma tu Asistencia</h2>
              <p className="mt-3 text-center text-xs text-foreground/60">
                Agradecemos tu respuesta antes del {inv.rsvpLimite}.
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
                        max={6}
                        defaultValue={2}
                        className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
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

        <div className={embebido ? "h-8" : "h-32"} />
      </main>

      {/* Barra flotante */}
      <nav
        className={
          embebido
            ? "sticky bottom-2 z-40 mx-auto w-[92%] max-w-[380px]"
            : "fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-[380px] -translate-x-1/2"
        }
      >
        <div className="flex items-center justify-between rounded-2xl border border-foreground/5 bg-background/90 p-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
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
            type="button"
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            className="mx-2 h-12 flex-1 rounded-xl bg-foreground text-xs font-semibold tracking-widest text-background uppercase transition-colors hover:bg-primary"
          >
            Confirmar Asistencia
          </button>

          <a
            href={inv.mapsUrl || "https://maps.google.com"}
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
