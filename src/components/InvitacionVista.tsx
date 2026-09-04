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
import { Divisor } from "@/components/Divisor";
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
import { iconoPorId } from "@/lib/iconos";
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
  const [momento, setMomento] = useState<number | null>(0);
  const [hito, setHito] = useState<number | null>(0);

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

  const fechaEvento = new Date(inv.fecha);
  const valida = !Number.isNaN(fechaEvento.getTime());
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    valida ? fechaEvento.toLocaleDateString("es-MX", opts) : "";
  const partes = {
    diaSemana: fmt({ weekday: "long" }),
    mes: fmt({ month: "long" }),
    dia: valida ? String(fechaEvento.getDate()).padStart(2, "0") : "",
    anio: valida ? String(fechaEvento.getFullYear()) : "",
    hora: valida
      ? fechaEvento.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
      : "",
  };

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
          className={`relative flex flex-col items-center justify-between overflow-hidden border-b border-primary/10 px-8 pt-10 pb-6 text-center ${embebido ? "min-h-[720px]" : "min-h-[100svh]"}`}
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
            className={`z-10 flex flex-1 flex-col justify-center py-4 ${ANIM[inv.animacionPortada]}`}
          >
            {/* Foto o video de portada, encuadrado automáticamente dentro de la corona */}
            {(corona || inv.videoPortadaUrl?.trim() || inv.fotoPortadaUrl?.trim()) && (
              <div className="relative mx-auto mb-6 aspect-square w-[74%] max-w-[300px]">
                <div
                  className="absolute overflow-hidden rounded-full border border-primary/20 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]"
                  style={{ inset: corona ? "17%" : "0%" }}
                >
                  {inv.videoPortadaUrl?.trim() ? (
                    <video
                      src={inv.videoPortadaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={inv.fotoPortadaUrl?.trim() || pareja1}
                      alt={`Foto de ${nombres}`}
                      className="h-full w-full object-cover object-center"
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

          {/* Cuenta regresiva: ya no flota encima, vive al final de la portada */}
          <div className="z-10 w-full shrink-0 pt-6">
            <p className="mb-3 text-[9px] tracking-[0.3em] text-olive uppercase">
              Falta poco para el gran día
            </p>
            <div
              className={`grid grid-cols-4 gap-2 rounded-full border border-primary/25 bg-card/70 px-4 py-3 backdrop-blur-md ${relieve ? "tarjeta-relieve" : ""}`}
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
        <section
          id="interactuar"
          className="relative border-b border-foreground/5 px-6 py-10 text-center"
        >
          <p className="mb-1 text-[9px] tracking-[0.3em] text-olive uppercase">Todo en un toque</p>
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
                  className={`flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/12 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-background ${relieve ? "icono-relieve" : ""}`}
                >
                  <a.Icono size={22} strokeWidth={1.3} />
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
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary/10 py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary/20"
            >
              <CalendarPlus size={14} /> Agendar recordatorio
            </a>
            <a
              href={archivoIcs(inv)}
              download="invitacion.ics"
              className="rounded-full border border-foreground/15 px-4 py-3 text-[10px] tracking-widest uppercase opacity-70 hover:opacity-100"
            >
              .ics
            </a>
          </div>
        </section>

        <Divisor inv={inv} />

        {/* Historia */}
        {inv.historia.trim() && (
          <section className="relative px-10 py-20 text-center">
            <Reveal>
              <h2 className="mb-8 font-display text-3xl italic">Nuestra Historia</h2>
              <p className="text-sm leading-relaxed text-pretty text-foreground/80">
                {inv.historia}
              </p>
            </Reveal>

            {/* Línea de tiempo por años */}
            {(inv.hitos ?? []).length > 0 && (
              <div className="relative mt-12 space-y-5 text-left">
                {(inv.hitos ?? []).map((h, i) => (
                  <Reveal key={`${h.anio}-${i}`} delay={i * 110}>
                    <button
                      type="button"
                      onClick={() => setHito(hito === i ? null : i)}
                      aria-expanded={hito === i}
                      className={`flex w-full gap-4 rounded-3xl border p-5 text-left transition-all ${hito === i ? "border-primary/40 bg-primary/8" : "border-primary/12 bg-card/80"} ${relieve ? "tarjeta-relieve" : ""}`}
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-[11px] text-primary">
                        {h.anio}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl italic">{h.titulo}</h3>
                        <p
                          className={`text-xs leading-relaxed text-foreground/65 transition-all ${hito === i ? "mt-1 max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                        >
                          {h.texto}
                        </p>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}



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

        {/* Itinerario en zigzag con iconos interactivos */}
        {inv.itinerario.length > 0 && (
          <section id="itinerario" className="relative overflow-hidden px-6 py-16">
            <Reveal>
              <div className="mb-12 text-center">
                <span className="block font-display text-3xl text-olive italic">the</span>
                <h2 className="font-display text-4xl tracking-[0.22em] text-primary uppercase">
                  {(inv.itinerarioTitulo ?? "Itinerary").replace(/^the\s+/i, "")}
                </h2>
              </div>
            </Reveal>

            <div className="relative">
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/40" />
              <div className="space-y-8">
                {inv.itinerario.map((item, i) => {
                  const Icono = iconoPorId(item.icono, `${item.titulo} ${item.lugar}`);
                  const izquierda = i % 2 === 0;
                  const activo = momento === i;
                  return (
                    <Reveal key={`${item.titulo}-${i}`} delay={i * 110}>
                      <button
                        type="button"
                        onClick={() => setMomento(activo ? null : i)}
                        aria-expanded={activo}
                        className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 text-left"
                      >
                        <div className={izquierda ? "text-right" : "order-3 text-left"}>
                          <span className="block font-mono text-2xl text-primary tabular-nums">
                            {item.hora.replace(/\s*HRS?/i, "")}
                          </span>
                          <span className="my-1 block text-[10px] text-primary/60">▾</span>
                          <h3 className="text-sm leading-tight font-semibold tracking-wide uppercase">
                            {item.titulo}
                          </h3>
                          <p
                            className={`text-xs text-foreground/60 transition-all ${activo ? "mt-1 max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                          >
                            {item.lugar}
                          </p>
                        </div>

                        <span className="order-2 flex size-4 items-center justify-center rounded-full border border-primary bg-background">
                          <span className="size-1.5 rounded-full bg-primary" />
                        </span>

                        <span
                          className={`flex size-20 items-center justify-center rounded-full border border-primary/25 bg-primary/8 text-primary transition-transform ${activo ? "scale-105" : ""} ${relieve ? "tarjeta-relieve" : ""} ${izquierda ? "order-3 justify-self-start" : "order-1 justify-self-end"}`}
                        >
                          <Icono size={30} strokeWidth={1.2} />
                        </span>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <Divisor inv={inv} />

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
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] tracking-widest text-primary-foreground uppercase"
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
                className="rounded-full border border-primary py-3 text-center text-[10px] tracking-widest text-primary uppercase hover:bg-primary/10"
              >
                Waze
              </a>
            </div>
          </Reveal>
        </section>

        {/* Lugares de la celebración */}
        {(inv.sedes ?? []).some((s) => s.nombre.trim()) && (
          <section className="relative bg-primary/5 px-8 py-16">
            <Reveal>
              <h2 className="mb-8 text-center font-display text-3xl italic">
                Lugares de la Celebración
              </h2>
            </Reveal>
            <div className="space-y-5">
              {(inv.sedes ?? [])
                .filter((s) => s.nombre.trim())
                .map((s, i) => (
                  <Reveal key={`${s.nombre}-${i}`} delay={i * 120}>
                    <div
                      className={`rounded-3xl border border-primary/15 bg-card/80 p-6 text-center backdrop-blur-sm ${relieve ? "tarjeta-relieve" : ""}`}
                    >
                      <span className="inline-block rounded-full bg-primary px-4 py-1 text-[9px] tracking-widest text-primary-foreground uppercase">
                        {s.etiqueta}
                      </span>
                      <h3 className="mt-4 font-display text-2xl italic">{s.nombre}</h3>
                      {s.hora.trim() && (
                        <p className="mt-1 font-mono text-xs text-primary">{s.hora}</p>
                      )}
                      {s.direccion.trim() && (
                        <p className="mt-2 text-xs text-foreground/60">{s.direccion}</p>
                      )}
                      <a
                        href={
                          s.mapsUrl.trim() ||
                          `https://maps.google.com/?q=${encodeURIComponent(`${s.nombre} ${s.direccion}`)}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
                      >
                        <Navigation size={13} /> Cómo llegar
                      </a>
                    </div>
                  </Reveal>
                ))}
            </div>
          </section>
        )}

        {/* A tomar en cuenta */}
        {(inv.notas ?? []).length > 0 && (
          <section className="relative px-8 py-16">
            <Reveal>
              <p className="text-center text-[9px] tracking-[0.3em] text-olive uppercase">
                Detalles importantes
              </p>
              <h2 className="mt-2 mb-8 text-center font-display text-3xl italic">
                A Tomar en Cuenta
              </h2>
            </Reveal>
            <div className="space-y-4">
              {(inv.notas ?? []).map((n, i) => (
                <Reveal key={`${n.titulo}-${i}`} delay={i * 100}>
                  <div
                    className={`flex gap-4 rounded-3xl border border-primary/12 bg-card/80 p-5 ${relieve ? "tarjeta-relieve" : ""}`}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles size={15} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium">{n.titulo}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/65">{n.texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}



        {/* Detalles */}
        <section className="relative space-y-8 px-8 pb-16">
          {inv.dressCode.trim() && (
            <Reveal>
              <div
                className={`rounded-3xl border border-primary/15 bg-card/80 p-8 text-center backdrop-blur-sm ${relieve ? "tarjeta-relieve" : ""}`}
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
                className={`rounded-3xl border border-primary/15 bg-primary/8 p-8 text-center ${relieve ? "tarjeta-relieve" : ""}`}
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
                    className="inline-block rounded-full border border-primary px-7 py-3 text-[10px] tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-background"
                  >
                    Ver Mesa de Regalos
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </section>

        <Divisor inv={inv} />

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
                  className="rounded-full border border-primary px-7 py-3 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
                >
                  Abrir álbum
                </a>
                {inv.instagramUrl?.trim() && (
                  <a
                    href={inv.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-[10px] tracking-widest uppercase hover:border-primary"
                  >
                    <Instagram size={14} /> Filtro
                  </a>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* Muro de felicitaciones */}
        {inv.muroActivo !== false && (
          <section className="relative bg-primary/5 px-6 py-16 text-center">
            <Reveal>
              <p className="text-[9px] tracking-[0.3em] text-olive uppercase">
                Libro de honor &amp; visitas
              </p>
              <h2 className="mt-2 font-display text-3xl italic">
                {inv.muroTitulo || "Muro de Felicitaciones & Buenos Deseos"}
              </h2>
              <p className="mx-auto mt-3 mb-6 max-w-[34ch] text-xs leading-relaxed text-foreground/60">
                Deja una dedicatoria especial a los anfitriones y comparte tu alegría en este día
                inolvidable.
              </p>
              <Muro clave={`${inv.nombre1}-${inv.fecha}`} relieve={relieve} />
            </Reveal>
          </section>
        )}


        <Divisor inv={inv} />

        {/* RSVP */}

        <section id="rsvp" className="relative px-8 py-16">
          <Reveal>
            <div
              className={`rounded-3xl border border-primary/15 bg-card/80 p-8 backdrop-blur-sm ${relieve ? "tarjeta-relieve" : ""}`}
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
                    className="w-full rounded-full bg-primary py-4 text-[10px] tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-85"
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

        {/* Barra fija: música + confirmación */}
        {abierto && (
          <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-foreground/10 bg-background/85 px-5 py-3 backdrop-blur">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pausar música" : "Reproducir música"}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card text-primary"
            >
              {playing ? <Pause size={17} /> : <Music2 size={17} />}
            </button>
            <button
              type="button"
              onClick={() => irA("rsvp")}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] tracking-widest text-primary-foreground uppercase"
            >
              <CheckCircle2 size={14} /> Confirmar asistencia
            </button>
          </div>
        )}


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
