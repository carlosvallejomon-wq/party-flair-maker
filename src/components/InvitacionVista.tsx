import {
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gift,
  Images,
  Instagram,
  MapPin,
  Music2,
  Navigation,
  Pause,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

import botanical from "@/assets/botanical-hero.jpg";
import pareja1 from "@/assets/pareja-1.jpg";
import pareja2 from "@/assets/pareja-2.jpg";
import { DecoracionPropia, Esquinas, Marco, Textura, coronaDe, marcoDe } from "@/components/Capas";
import { Muro } from "@/components/Muro";
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

export function InvitacionVista({ inv, embebido = false }: { inv: Invitacion; embebido?: boolean }) {
  const restante = useCuentaRegresiva(inv.fecha);
  const { playing, toggle, start } = useAmbientMusic(inv.melodia, inv.musicaUrl);
  const [enviado, setEnviado] = useState(false);
  const [abierto, setAbierto] = useState(!inv.sobreActivo);
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    setAbierto(!inv.sobreActivo);
  }, [inv.sobreActivo]);

  const nombres = [inv.nombre1, inv.nombre2].filter((n) => n.trim()).join(" & ");
  const corona = coronaDe(inv);
  const fondoPortada = inv.fondoUrl?.trim() || inv.fotoPortadaUrl?.trim() || botanical;
  const ajusteFondo = inv.fondoAjuste === "contener" ? "object-contain" : "object-cover";
  const posicionFondo = `${inv.fondoPosX ?? 50}% ${inv.fondoPosY ?? 50}%`;
  const opacidadFondo = (inv.fondoOpacidad ?? 25) / 100;

  const galeria = [inv.fotoPortadaUrl?.trim() || pareja1, pareja2, botanical];
  const relieve = inv.relieve !== false;

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
    { id: "ubicacion", Icono: MapPin, texto: "Cómo llegar" },
    { id: "rsvp", Icono: CheckCircle2, texto: "Confirmar" },
    { id: "itinerario", Icono: Clock3, texto: "Itinerario" },
    { id: "album", Icono: Images, texto: "Álbum" },
    { id: "regalos", Icono: Gift, texto: "Regalos" },
  ];

  return (
    <div
      style={TEMAS[inv.tema].vars as CSSProperties}
      className="bg-background font-sans text-foreground selection:bg-primary/20"
    >
      <main className="relative mx-auto max-w-[430px] overflow-hidden bg-background shadow-2xl">
        <Textura inv={inv} />
        <DecoracionPropia inv={inv} />

        {/* Portada */}
        <section
          className={`relative flex flex-col items-center justify-center overflow-hidden border-b border-primary/10 px-8 text-center ${embebido ? "h-[620px]" : "h-[100svh] min-h-[560px]"}`}
        >
          {!abierto && (
            <Sobre
              titulo={nombres}
              subtitulo={inv.frase}
              marcoSrc={marcoDe(inv)}
              videoUrl={inv.videoSobreUrl}
              onAbrir={() => {
                setAbierto(true);
                start();
              }}
            />
          )}

          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
            {inv.videoFondoUrl?.trim() ? (
              <video
                src={inv.videoFondoUrl}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 h-full w-full ${ajusteFondo}`}
                style={{ objectPosition: posicionFondo, opacity: opacidadFondo }}
              />
            ) : (
              <img
                src={fondoPortada}
                alt=""
                aria-hidden
                className={`absolute inset-0 h-full w-full ${ajusteFondo}`}
                style={{ objectPosition: posicionFondo, opacity: opacidadFondo }}
              />
            )}
          </div>

          <Textura inv={inv} />
          <Marco inv={inv} />
          <Esquinas inv={inv} />

          <div
            key={`${inv.animacionPortada}-${abierto}`}
            className={`z-10 ${ANIM[inv.animacionPortada]}`}
          >
            {/* Corona con foto o video */}
            {(corona || inv.videoPortadaUrl?.trim()) && (
              <div className="relative mx-auto mb-6 size-44">
                <div className="absolute inset-[14%] overflow-hidden rounded-full border border-primary/20 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]">
                  {inv.videoPortadaUrl?.trim() ? (
                    <video
                      src={inv.videoPortadaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={inv.fotoPortadaUrl?.trim() || pareja1}
                      alt={`Foto de ${nombres}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                {corona && (
                  <img
                    src={corona}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                )}
              </div>
            )}

            {inv.familia?.trim() && (
              <p className="mb-3 text-[9px] leading-relaxed tracking-[0.25em] uppercase opacity-55">
                {inv.familia}
              </p>
            )}
            <span className="mb-4 block text-[10px] tracking-[0.35em] text-olive uppercase">
              {inv.frase}
            </span>
            <h1
              className={`mb-4 font-display text-5xl leading-none sm:text-6xl ${relieve ? "texto-relieve" : ""}`}
            >
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

            {/* Fecha en formato editorial: MES · DÍA · AÑO */}
            <div className="mx-auto mt-6 flex w-fit items-stretch gap-4 border-y border-primary/30 px-5 py-2">
              <div className="self-center text-center text-[9px] leading-tight tracking-[0.25em] uppercase opacity-70">
                {partes.diaSemana}
                <br />
                {partes.mes}
              </div>
              <span className="w-px bg-primary/25" />
              <div className="self-center font-display text-4xl leading-none">{partes.dia}</div>
              <span className="w-px bg-primary/25" />
              <div className="self-center text-center text-[9px] leading-tight tracking-[0.25em] uppercase opacity-70">
                {partes.anio}
                <br />
                {partes.hora}
              </div>
            </div>

            <p className="mt-4 text-xs tracking-widest uppercase opacity-60">
              {inv.lugar}
              {inv.ciudad ? `, ${inv.ciudad}` : ""}
            </p>
          </div>

          <div className="absolute bottom-6 z-10 w-full px-10">
            <p className="mb-3 text-[9px] tracking-[0.3em] text-olive uppercase">
              Falta poco para el gran día
            </p>
            <div
              className={`grid grid-cols-4 gap-2 rounded-2xl border border-primary/20 bg-background/70 p-3 backdrop-blur-sm ${relieve ? "tarjeta-relieve" : ""}`}
            >
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
            <button
              type="button"
              onClick={() => irA("interactuar")}
              className="mx-auto mt-4 flex flex-col items-center gap-1 text-olive"
            >
              <span className="font-display text-lg italic">Desliza para descubrir</span>
              <ChevronDown size={16} className="animate-bounce" />
            </button>
          </div>

        </section>

        {/* Accesos rápidos con iconos */}
        <section className="relative border-b border-foreground/5 px-6 py-10 text-center">
          <p className="mb-6 font-display text-2xl italic">Haz clic para interactuar</p>
          <div className="flex flex-wrap justify-center gap-4">
            {accesos.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => irA(a.id)}
                className="group flex w-16 flex-col items-center gap-2"
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-full border border-primary/30 bg-card text-primary transition-transform group-hover:scale-105 ${relieve ? "icono-relieve" : ""}`}
                >
                  <a.Icono size={22} strokeWidth={1.4} />
                </span>
                <span className="text-[8px] leading-tight tracking-widest uppercase opacity-70">
                  {a.texto}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <a
              href={enlaceCalendario(inv)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary/20"
            >
              <CalendarPlus size={14} /> Agendar recordatorio
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
          <section className="relative px-10 py-20 text-center">
            <Reveal>
              <h2 className="mb-8 font-display text-3xl italic">Nuestra Historia</h2>
              <p className="text-sm leading-relaxed text-pretty text-foreground/80">
                {inv.historia}
              </p>
            </Reveal>

            {inv.videoGaleriaUrl?.trim() && (
              <Reveal delay={120}>
                <video
                  src={inv.videoGaleriaUrl}
                  controls
                  playsInline
                  className={`mt-10 w-full rounded-2xl border border-primary/20 ${relieve ? "tarjeta-relieve" : ""}`}
                />
              </Reveal>
            )}

            <div className="mt-12 grid grid-cols-2 gap-4">
              <Reveal>
                <button
                  type="button"
                  onClick={() => setFoto(galeria[0]!)}
                  className="block w-full"
                >
                  <img
                    src={galeria[0]}
                    alt={`Foto de ${inv.nombre1}`}
                    loading="lazy"
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
                    className="mt-8 aspect-[2/3] w-full rounded-b-full object-cover transition-transform hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            </div>
          </section>
        )}

        {/* Itinerario */}
        {inv.itinerario.length > 0 && (
          <section id="itinerario" className="relative bg-foreground px-8 py-16 text-background">
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
        <section id="ubicacion" className="relative px-8 py-16">
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
                className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-[10px] tracking-widest text-background uppercase"
              >
                <MapPin size={14} /> Google Maps
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
        <section className="relative space-y-8 px-8 pb-16">
          {inv.dressCode.trim() && (
            <Reveal>
              <div
                className={`border border-foreground/10 bg-card p-8 text-center ${relieve ? "tarjeta-relieve" : ""}`}
              >
                <span className="mb-4 block text-[10px] tracking-widest text-olive uppercase">
                  Código de Vestimenta
                </span>
                <h3 className="font-display text-2xl italic">{inv.dressCode}</h3>
                <p className="mt-4 text-xs text-foreground/60">{inv.dressDetalle}</p>
                <div className="mt-5 flex justify-center gap-2">
                  {(inv.coloresSugeridos?.length
                    ? inv.coloresSugeridos
                    : TEMAS[inv.tema].swatch
                  ).map((c) => (
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
              <div
                id="regalos"
                className={`bg-primary/5 p-8 text-center ${relieve ? "tarjeta-relieve" : ""}`}
              >
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
        <section className="relative px-8 pb-16">
          <Reveal>
            <h2 className="mb-6 text-center font-display text-3xl italic">Galería</h2>
            <div className="grid grid-cols-3 gap-2">
              {galeria.map((src, i) => (
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
          <section id="album" className="relative bg-primary/5 px-8 py-16 text-center">
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
              <div className="mt-6 flex justify-center gap-3">
                <a
                  href={inv.albumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-primary px-6 py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
                >
                  Abrir álbum
                </a>
                {inv.instagramUrl?.trim() && (
                  <a
                    href={inv.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border border-foreground/15 px-6 py-3 text-[10px] tracking-widest uppercase hover:border-primary"
                  >
                    <Instagram size={14} /> Filtro
                  </a>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* RSVP */}
        <section id="rsvp" className="relative px-8 py-16">
          <Reveal>
            <div
              className={`border border-foreground/10 bg-card p-8 ${relieve ? "tarjeta-relieve" : ""}`}
            >
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="pases"
                      className="text-[10px] tracking-widest text-olive uppercase"
                    >
                      Número de pases
                    </label>
                    <input
                      id="pases"
                      name="pases"
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="asistencia"
                      className="text-[10px] tracking-widest text-olive uppercase"
                    >
                      ¿Nos acompañas?
                    </label>
                    <select
                      id="asistencia"
                      name="asistencia"
                      className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm outline-none focus:border-primary"
                    >
                      <option>Sí, ahí estaré</option>
                      <option>Lamento no poder asistir</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-foreground py-4 text-[10px] tracking-widest text-background uppercase transition-opacity hover:opacity-85"
                  >
                    Enviar confirmación
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>

        {/* Pie */}
        <footer className="relative border-t border-foreground/10 px-8 py-12 text-center">
          <p className="font-display text-2xl italic">{nombres}</p>
          <p className="mt-2 text-[10px] tracking-widest text-olive uppercase">
            {fechaLarga(inv.fecha)}
          </p>
          <button
            type="button"
            onClick={compartir}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2 text-[10px] tracking-widest uppercase hover:border-primary hover:text-primary"
          >
            <Share2 size={13} /> Compartir invitación
          </button>
        </footer>

        {/* Música */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="sticky bottom-5 left-[calc(100%-4.5rem)] z-40 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-lg backdrop-blur"
        >
          {playing ? <Pause size={18} /> : <Music2 size={18} />}
        </button>

        {/* Lightbox */}
        {foto && (
          <button
            type="button"
            aria-label="Cerrar foto"
            onClick={() => setFoto(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
          >
            <img src={foto} alt="" className="max-h-full w-auto rounded-xl object-contain" />
          </button>
        )}
      </main>
    </div>
  );
}
