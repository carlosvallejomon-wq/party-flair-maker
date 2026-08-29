import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

import botanical from "@/assets/botanical-hero.jpg";
import pareja1 from "@/assets/pareja-1.jpg";
import pareja2 from "@/assets/pareja-2.jpg";
import { Decoraciones } from "@/components/Decoraciones";
import { QrAlbum } from "@/components/QrAlbum";
import { Reveal } from "@/components/Reveal";
import { Sobre } from "@/components/Sobre";
import {
  TEMAS,
  archivoIcs,
  enlaceCalendario,
  enlaceMapa,
  enlaceWhatsapp,
  fechaLarga,
  mapaEmbebido,
  type Invitacion,
} from "@/lib/invitacion";
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

const GALERIA = [pareja1, pareja2, botanical];

export function InvitacionVista({ inv, embebido = false }: { inv: Invitacion; embebido?: boolean }) {
  const restante = useCuentaRegresiva(inv.fecha);
  const { playing, toggle, start } = useAmbientMusic(inv.melodia, inv.musicaUrl);
  const [enviado, setEnviado] = useState(false);
  const [abierto, setAbierto] = useState(!inv.sobreActivo);
  const [foto, setFoto] = useState<string | null>(null);

  // Si se cambia la opción del sobre en el editor, refleja el cambio al instante.
  useEffect(() => {
    setAbierto(!inv.sobreActivo);
  }, [inv.sobreActivo]);

  const nombres = [inv.nombre1, inv.nombre2].filter((n) => n.trim()).join(" & ");

  const confirmar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEnviado(true);
    if (inv.whatsapp?.trim()) {
      const mensaje = `Hola, soy ${datos.get("nombre") as string}. ${datos.get("asistencia") as string}. Pases: ${datos.get("pases") as string}. (${nombres})`;
      window.open(enlaceWhatsapp(inv.whatsapp, mensaje), "_blank", "noreferrer");
    }
  };

  const compartir = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const texto = `¡Estás invitado! ${inv.frase} · ${nombres}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: texto, url });
        return;
      } catch {
        /* cancelado */
      }
    }
    window.open(enlaceWhatsapp("", `${texto} ${url}`), "_blank", "noreferrer");
  };

  const irA = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const cifras = restante
    ? [
        { valor: restante.d, etiqueta: "Días" },
        { valor: restante.h, etiqueta: "Hrs" },
        { valor: restante.m, etiqueta: "Min" },
        { valor: restante.s, etiqueta: "Seg" },
      ]
    : [];

  const tieneDos = inv.nombre2.trim().length > 0;
  const accesos = [
    { id: "ubicacion", icono: "◈", texto: "Ubicación" },
    { id: "rsvp", icono: "✓", texto: "Confirmar" },
    { id: "itinerario", icono: "◷", texto: "Itinerario" },
    { id: "album", icono: "▣", texto: "Álbum" },
  ];

  return (
    <div
      style={TEMAS[inv.tema].vars as CSSProperties}
      className="bg-background font-sans text-foreground selection:bg-primary/20"
    >
      <main className="relative mx-auto max-w-[430px] overflow-hidden bg-background shadow-2xl">
        <Decoraciones tipo={inv.decoracion} intensidad={inv.intensidadDeco ?? 2} />

        {/* Portada */}
        <section
          className={`relative flex flex-col items-center justify-center border-b border-primary/10 px-8 text-center ${embebido ? "h-[560px]" : "h-[92vh]"}`}
        >
          {!abierto && (
            <Sobre
              titulo={nombres}
              subtitulo={inv.frase}
              onAbrir={() => {
                setAbierto(true);
                start();
              }}
            />
          )}

          <img
            src={botanical}
            alt=""
            aria-hidden
            width={864}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <img
            src={marcoFloral}
            alt=""
            aria-hidden
            width={1024}
            height={1536}
            className="pointer-events-none absolute inset-0 z-[5] h-full w-full object-cover opacity-80"
          />
          <div
            key={`${inv.animacionPortada}-${abierto}`}
            className={`z-10 ${ANIM[inv.animacionPortada]}`}
          >
            <span className="mb-6 block text-[10px] tracking-[0.35em] text-olive uppercase">
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
            <div className="mx-auto my-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-primary">✦</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <p className="font-mono text-sm tracking-tighter">{fechaLarga(inv.fecha)}</p>
            <p className="mt-2 text-xs tracking-widest uppercase opacity-60">
              {inv.lugar}
              {inv.ciudad ? `, ${inv.ciudad}` : ""}
            </p>
          </div>

          <div className="absolute bottom-8 z-10 w-full px-8">
            <p className="mb-3 text-[9px] tracking-[0.3em] text-olive uppercase">
              Falta poco para el gran día
            </p>
            <div className="grid grid-cols-4 gap-2 rounded-2xl border border-primary/20 bg-background/70 p-3 backdrop-blur-sm">
              {cifras.map((c) => (
                <div key={c.etiqueta} className="text-center">
                  <span className="block font-mono text-xl tabular-nums">
                    {String(c.valor).padStart(2, "0")}
                  </span>
                  <span className="text-[8px] tracking-widest uppercase opacity-50">
                    {c.etiqueta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Accesos rápidos + recordatorio */}
        <section className="border-b border-foreground/5 px-6 py-8">
          <div className="grid grid-cols-4 gap-2">
            {accesos.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => irA(a.id)}
                className="flex flex-col items-center gap-2 rounded-xl border border-foreground/10 py-3 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="text-lg text-primary">{a.icono}</span>
                <span className="text-[9px] tracking-widest uppercase opacity-70">{a.texto}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={enlaceCalendario(inv)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl bg-primary/10 py-3 text-center text-[10px] tracking-widest text-primary uppercase hover:bg-primary/20"
            >
              Agendar recordatorio
            </a>
            <a
              href={archivoIcs(inv)}
              download="invitacion.ics"
              className="rounded-xl border border-foreground/10 px-4 py-3 text-[10px] tracking-widest uppercase opacity-70 hover:opacity-100"
            >
              .ics
            </a>
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
                <button type="button" onClick={() => setFoto(pareja1)} className="block w-full">
                  <img
                    src={pareja1}
                    alt={`Foto de ${inv.nombre1}`}
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="aspect-[2/3] w-full rounded-t-full object-cover transition-transform hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
              <Reveal delay={150}>
                <button type="button" onClick={() => setFoto(pareja2)} className="block w-full">
                  <img
                    src={pareja2}
                    alt="Foto del evento"
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="mt-8 aspect-[2/3] w-full rounded-b-full object-cover transition-transform hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            </div>
          </section>
        )}

        {/* Itinerario */}
        {inv.itinerario.length > 0 && (
          <section id="itinerario" className="bg-foreground px-8 py-16 text-background">
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

        {/* Ubicación */}
        <section id="ubicacion" className="px-8 py-16">
          <Reveal>
            <h2 className="text-center font-display text-3xl italic">Cómo llegar</h2>
            <p className="mt-3 text-center text-xs text-foreground/60">
              {inv.lugar}
              {inv.direccion ? ` · ${inv.direccion}` : ""}
              {inv.ciudad ? ` · ${inv.ciudad}` : ""}
            </p>
            <iframe
              title="Mapa de la ubicación del evento"
              src={mapaEmbebido(inv)}
              loading="lazy"
              className="mt-6 h-56 w-full rounded-2xl border border-foreground/10"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={enlaceMapa(inv)}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-foreground py-3 text-center text-[10px] tracking-widest text-background uppercase"
              >
                Google Maps
              </a>
              <a
                href={
                  inv.wazeUrl?.trim() ||
                  `https://waze.com/ul?q=${encodeURIComponent([inv.lugar, inv.ciudad].filter(Boolean).join(" "))}`
                }
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-primary py-3 text-center text-[10px] tracking-widest text-primary uppercase hover:bg-primary/10"
              >
                Waze
              </a>
            </div>
          </Reveal>
        </section>

        {/* Detalles */}
        <section className="space-y-8 px-8 pb-16">
          {inv.dressCode.trim() && (
            <Reveal>
              <div className="border border-foreground/10 p-8 text-center">
                <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                  Código de Vestimenta
                </span>
                <h3 className="font-display text-2xl italic">{inv.dressCode}</h3>
                <p className="mt-4 text-xs text-foreground/60">{inv.dressDetalle}</p>
                <div className="mt-5 flex justify-center gap-2">
                  {TEMAS[inv.tema].swatch.map((c) => (
                    <span
                      key={c}
                      className="size-5 rounded-full border border-foreground/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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

        {/* Galería */}
        <section className="px-8 pb-16">
          <Reveal>
            <h2 className="mb-6 text-center font-display text-3xl italic">Galería</h2>
            <div className="grid grid-cols-3 gap-2">
              {GALERIA.map((src, i) => (
                <button key={i} type="button" onClick={() => setFoto(src)}>
                  <img
                    src={src}
                    alt={`Fotografía ${i + 1} del evento`}
                    loading="lazy"
                    className="aspect-square w-full rounded-lg object-cover transition-transform hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Álbum con QR */}
        {inv.albumUrl?.trim() && (
          <section id="album" className="bg-primary/5 px-8 py-16 text-center">
            <Reveal>
              <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                Comparte tus fotos
              </span>
              <h2 className="mb-6 font-display text-3xl italic">
                {inv.albumTitulo || "Álbum de fotos"}
              </h2>
              <QrAlbum url={inv.albumUrl} />
              <p className="mt-5 text-xs text-foreground/60">
                Escanea el código y sube las fotos que tomes durante el evento.
              </p>
              {inv.hashtag?.trim() && (
                <p className="mt-3 font-mono text-sm text-primary">{inv.hashtag}</p>
              )}
              <a
                href={inv.albumUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block border border-primary px-6 py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
              >
                Abrir álbum
              </a>
            </Reveal>
          </section>
        )}

        {/* RSVP */}
        <section id="rsvp" className="px-8 py-16">
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
                      name="nombre"
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
                        name="asistencia"
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
                        name="pases"
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

              <button
                type="button"
                onClick={compartir}
                className="mt-6 w-full rounded-xl border border-primary py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary/10"
              >
                Compartir invitación
              </button>
            </div>
          </Reveal>
        </section>

        <div className={embebido ? "h-8" : "h-32"} />
      </main>

      {/* Visor de fotos */}
      {foto && (
        <button
          type="button"
          aria-label="Cerrar foto"
          onClick={() => setFoto(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <img src={foto} alt="Foto ampliada" className="max-h-[80vh] rounded-2xl object-contain" />
        </button>
      )}

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
            onClick={() => irA("rsvp")}
            className="mx-2 h-12 flex-1 rounded-xl bg-foreground text-xs font-semibold tracking-widest text-background uppercase transition-colors hover:bg-primary"
          >
            Confirmar Asistencia
          </button>

          <a
            href={enlaceMapa(inv)}
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
