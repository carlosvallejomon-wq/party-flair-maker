import {
  Banknote,
  CalendarPlus,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  ExternalLink,
  Eye,
  Gift,
  Mail,
  Images,
  Instagram,
  MapPin,
  Music2,
  Plane,
  Navigation,
  Pause,
  Share2,
  Shirt,
  ShoppingBag,
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

/** Icono para cada opción de la mesa de regalos. */
const ICONOS_REGALO = {
  sobre: Mail,
  efectivo: Banknote,
  transferencia: CreditCard,
  tienda: ShoppingBag,
  viaje: Plane,
  regalo: Gift,
} as const;

function iconoRegalo(id?: string, texto = "") {
  if (id && id in ICONOS_REGALO) return ICONOS_REGALO[id as keyof typeof ICONOS_REGALO];
  const t = texto.toLowerCase();
  if (/sobre|lluvia/.test(t)) return Mail;
  if (/efectivo|aporte|dinero/.test(t)) return Banknote;
  if (/transfer|banco|cuenta|cbu|clabe/.test(t)) return CreditCard;
  if (/tienda|liverpool|amazon|palacio|mesa/.test(t)) return ShoppingBag;
  if (/viaje|luna de miel/.test(t)) return Plane;
  return Gift;
}

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

type HuecoCorona = { top: number; right: number; bottom: number; left: number; mascara: string; detectado: boolean };

/** Encuentra el área transparente cerrada del centro sin confundirla con el exterior. */
function useHuecoCorona(src: string, automatico: boolean, manual: number) {
  const [hueco, setHueco] = useState<HuecoCorona>({
    top: manual,
    right: manual,
    bottom: manual,
    left: manual,
    mascara: "",
    detectado: false,
  });

  useEffect(() => {
    const fijo = { top: manual, right: manual, bottom: manual, left: manual, mascara: "", detectado: false };
    // No conserves la máscara de la corona anterior mientras carga la nueva.
    setHueco(fijo);
    if (!src || !automatico) {
      return;
    }
    const imagen = new Image();
    imagen.onload = () => {
      const lado = 240;
      const canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      try {
        const escala = Math.min(lado / imagen.naturalWidth, lado / imagen.naturalHeight);
        const ancho = imagen.naturalWidth * escala;
        const alto = imagen.naturalHeight * escala;
        const offsetX = (lado - ancho) / 2;
        const offsetY = (lado - alto) / 2;
        ctx.clearRect(0, 0, lado, lado);
        ctx.drawImage(imagen, offsetX, offsetY, ancho, alto);
        const alpha = ctx.getImageData(0, 0, lado, lado).data;
        // Incluye los píxeles casi transparentes de acuarelas y PNG suavizados.
        const transparente = (indice: number) => (alpha[indice * 4 + 3] ?? 255) < 96;
        const visitado = new Uint8Array(lado * lado);
        const componentes: Array<{ minX: number; maxX: number; minY: number; maxY: number; area: number; borde: boolean; pixeles: number[] }> = [];
        for (let inicio = 0; inicio < lado * lado; inicio += 1) {
          if (visitado[inicio] || !transparente(inicio)) continue;
          const cola = [inicio];
          visitado[inicio] = 1;
          let cursor = 0;
          let minX = lado;
          let maxX = 0;
          let minY = lado;
          let maxY = 0;
          let borde = false;
          while (cursor < cola.length) {
            const actual = cola[cursor];
            cursor += 1;
            if (actual === undefined) continue;
            const x = actual % lado;
            const y = Math.floor(actual / lado);
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
            if (x === 0 || y === 0 || x === lado - 1 || y === lado - 1) borde = true;
            const vecinos = [actual - 1, actual + 1, actual - lado, actual + lado];
            for (const vecino of vecinos) {
              if (vecino < 0 || vecino >= lado * lado || visitado[vecino]) continue;
              const vx = vecino % lado;
              if (Math.abs(vx - x) > 1 || !transparente(vecino)) continue;
              visitado[vecino] = 1;
              cola.push(vecino);
            }
          }
          componentes.push({ minX, maxX, minY, maxY, area: cola.length, borde, pixeles: cola });
        }
        const centro = lado / 2;
        const huecoCentral = componentes
          .filter((c) => !c.borde && c.area > lado * lado * 0.02)
          .sort((a, b) => {
            const da = Math.abs((a.minX + a.maxX) / 2 - centro) + Math.abs((a.minY + a.maxY) / 2 - centro);
            const db = Math.abs((b.minX + b.maxX) / 2 - centro) + Math.abs((b.minY + b.maxY) / 2 - centro);
            return da - db || b.area - a.area;
          })[0];
        if (!huecoCentral) {
          setHueco(fijo);
          return;
        }
        const seguridad = 2;
        const mascaraCanvas = document.createElement("canvas");
        mascaraCanvas.width = lado;
        mascaraCanvas.height = lado;
        const mascaraCtx = mascaraCanvas.getContext("2d");
        if (!mascaraCtx) {
          setHueco(fijo);
          return;
        }
        const mascaraDatos = mascaraCtx.createImageData(lado, lado);
        for (const indice of huecoCentral.pixeles) {
          const salida = indice * 4;
          mascaraDatos.data[salida] = 255;
          mascaraDatos.data[salida + 1] = 255;
          mascaraDatos.data[salida + 2] = 255;
          mascaraDatos.data[salida + 3] = 255;
        }
        mascaraCtx.putImageData(mascaraDatos, 0, 0);
        setHueco({
          top: Math.max(0, (huecoCentral.minY + seguridad) / lado * 100),
          right: Math.max(0, (lado - huecoCentral.maxX + seguridad) / lado * 100),
          bottom: Math.max(0, (lado - huecoCentral.maxY + seguridad) / lado * 100),
          left: Math.max(0, (huecoCentral.minX + seguridad) / lado * 100),
          mascara: mascaraCanvas.toDataURL("image/png"),
          detectado: true,
        });
      } catch {
        setHueco(fijo);
      }
    };
    imagen.onerror = () => setHueco(fijo);
    imagen.src = src;
    return () => {
      imagen.onload = null;
      imagen.onerror = null;
    };
  }, [src, automatico, manual]);

  return hueco;
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
  const huecoCorona = useHuecoCorona(
    corona,
    inv.coronaEncuadreAuto !== false,
    inv.coronaHueco ?? 17,
  );
  const formaFoto = inv.coronaFotoForma ?? "automatica";
  const usarMascaraCorona = Boolean(corona && huecoCorona.detectado && formaFoto === "automatica");
  const posicionFoto = `${inv.coronaFotoPosX ?? 50}% ${inv.coronaFotoPosY ?? 50}%`;
  const escalaFoto = (inv.coronaFotoEscala ?? 100) / 100;
  const transformarRecorte = `translate(${inv.coronaRecortePosX ?? 0}%, ${inv.coronaRecortePosY ?? 0}%) scale(${(inv.coronaRecorteEscala ?? 100) / 100})`;
  // Todas las formas parten del mismo hueco de la corona para que cambiar de
  // forma no mueva ni agrande el recorte.
  const baseHueco = corona
    ? huecoCorona.detectado
      ? { top: huecoCorona.top, right: huecoCorona.right, bottom: huecoCorona.bottom, left: huecoCorona.left }
      : {
          top: inv.coronaHueco ?? 17,
          right: inv.coronaHueco ?? 17,
          bottom: inv.coronaHueco ?? 17,
          left: inv.coronaHueco ?? 17,
        }
    : { top: 0, right: 0, bottom: 0, left: 0 };
  const esTresCuartos = formaFoto === "ovalada" || formaFoto === "rectangular";
  const estiloRecorteManual: CSSProperties = {
    top: `${baseHueco.top}%`,
    bottom: `${baseHueco.bottom}%`,
    zIndex: 2,
    borderRadius: formaFoto === "circular" || formaFoto === "ovalada" ? "50%" : "0",
    ...(esTresCuartos
      ? {
          left: "50%",
          right: "auto",
          width: "auto",
          aspectRatio: "3 / 4",
          transform: `translateX(-50%) ${transformarRecorte}`,
        }
      : {
          left: `${baseHueco.left}%`,
          right: `${baseHueco.right}%`,
          transform: transformarRecorte,
        }),
  };

  const estiloMedio = {
    objectPosition: posicionFoto,
    transform: `scale(${escalaFoto})`,
    transformOrigin: posicionFoto,
  };
  // La foto principal pertenece solamente al arco/corona. Nunca debe heredarse
  // como fondo cuando el usuario todavía no ha subido una imagen de fondo.
  const fondoPortada = inv.fondoUrl?.trim() || botanical;
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
                style={{
                  objectPosition: posicionFondo,
                  opacity: opacidadFondo,
                  transform: `scale(${(inv.fondoZoom ?? 100) / 100})`,
                  transformOrigin: posicionFondo,
                }}
              />
            ) : (
              <img
                src={fondoPortada}
                alt=""
                aria-hidden
                className={`absolute inset-0 h-full w-full ${ajusteFondo}`}
                style={{
                  objectPosition: posicionFondo,
                  opacity: opacidadFondo,
                  transform: `scale(${(inv.fondoZoom ?? 100) / 100})`,
                  transformOrigin: posicionFondo,
                }}
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
              <div
                className="relative mx-auto mb-6 aspect-square"
                style={{ width: `${inv.coronaTamano ?? 74}%`, maxWidth: 340 }}
              >
                <div
                  className={`absolute overflow-hidden shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] ${usarMascaraCorona ? "" : "border border-primary/20"}`}
                  style={usarMascaraCorona
                    ? {
                        inset: 0,
                        zIndex: 2,
                        transform: transformarRecorte,
                        maskImage: `url(${huecoCorona.mascara})`,
                        WebkitMaskImage: `url(${huecoCorona.mascara})`,
                        maskSize: "100% 100%",
                        WebkitMaskSize: "100% 100%",
                      }
                    : corona && formaFoto === "automatica"
                      ? {
                          top: `${huecoCorona.top}%`,
                          right: `${huecoCorona.right}%`,
                          bottom: `${huecoCorona.bottom}%`,
                          left: `${huecoCorona.left}%`,
                          zIndex: 2,
                          transform: transformarRecorte,
                          ...formaRecorte,
                        }
                      : corona
                        ? { inset: `${inv.coronaHueco ?? 17}%`, zIndex: 2, transform: transformarRecorte, ...formaRecorte }
                        : { inset: 0, transform: transformarRecorte, ...formaRecorte }
                  }
                >
                  {inv.videoPortadaUrl?.trim() ? (
                    <video
                      src={inv.videoPortadaUrl}
                      autoPlay
                      loop
                      muted={inv.videoPortadaSonido !== true}
                      playsInline
                      className={usarMascaraCorona ? "absolute object-cover" : "h-full w-full object-cover"}
                      style={usarMascaraCorona ? {
                        top: `${huecoCorona.top}%`,
                        left: `${huecoCorona.left}%`,
                        width: `${100 - huecoCorona.left - huecoCorona.right}%`,
                        height: `${100 - huecoCorona.top - huecoCorona.bottom}%`,
                        ...estiloMedio,
                      } : estiloMedio}
                    />
                  ) : (
                    <img
                      src={inv.fotoPortadaUrl?.trim() || pareja1}
                      alt={`Foto de ${nombres}`}
                      className={usarMascaraCorona ? "absolute object-cover" : "h-full w-full object-cover"}
                      style={usarMascaraCorona ? {
                        top: `${huecoCorona.top}%`,
                        left: `${huecoCorona.left}%`,
                        width: `${100 - huecoCorona.left - huecoCorona.right}%`,
                        height: `${100 - huecoCorona.top - huecoCorona.bottom}%`,
                        ...estiloMedio,
                      } : estiloMedio}
                    />
                  )}
                </div>
                {corona && (
                  <img
                    src={corona}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    style={{ transform: `rotate(${inv.coronaGiro ?? 0}deg)` }}
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
          <section className="relative px-6 py-20 text-center">
            <Reveal>
              <p className="text-[9px] tracking-[0.3em] text-olive uppercase">
                Recuerdos &amp; trayectoria
              </p>
              <h2 className="mt-2 mb-6 font-display text-4xl">
                {inv.historiaTitulo || "Nuestra Historia"}
              </h2>
              <p className="mx-auto max-w-[38ch] text-sm leading-relaxed text-pretty text-foreground/75">
                {inv.historia}
              </p>
            </Reveal>

            {/* Tarjetas con foto por momento */}
            {(inv.hitos ?? []).length > 0 && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {(inv.hitos ?? []).map((h, i) => (
                  <Reveal key={`${h.anio}-${i}`} delay={i * 110}>
                    <button
                      type="button"
                      onClick={() => setHito(hito === i ? null : i)}
                      aria-expanded={hito === i}
                      className={`group block h-full w-full overflow-hidden rounded-3xl border text-left transition-all ${
                        hito === i ? "border-primary/45" : "border-primary/15"
                      } ${relieve ? "capsula-vidrio" : "bg-card"}`}
                    >
                      <div className="relative">
                        <img
                          src={h.foto?.trim() || galeria[i % galeria.length]!}
                          alt={h.titulo}
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="absolute top-3 right-3 rounded-full border border-primary/50 bg-background/80 px-3 py-1 text-[9px] font-medium tracking-widest text-primary uppercase backdrop-blur-md">
                          {h.anio}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-2xl leading-tight">{h.titulo}</h3>
                        <p
                          className={`text-xs leading-relaxed text-foreground/65 transition-all ${
                            hito === i
                              ? "mt-2 max-h-48 opacity-100"
                              : "max-h-0 overflow-hidden opacity-0"
                          }`}
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
                    <Reveal
                      key={`${item.titulo}-${i}`}
                      delay={i * 110}
                      desde={izquierda ? "izquierda" : "derecha"}
                    >
                      <button
                        type="button"
                        onClick={() => setMomento(activo ? null : i)}
                        aria-expanded={activo}
                        className={`tarjeta-interactiva grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-3xl border border-transparent p-2 text-left ${activo ? "border-primary/30" : ""}`}
                      >

                        <div className={izquierda ? "text-right" : "order-3 text-left"}>
                          <span className="block font-mono text-2xl text-primary tabular-nums">
                            {item.hora.replace(/\s*HRS?/i, "")}
                          </span>
                          <span className="my-1 block text-[10px] text-primary/60">▾</span>
                          <h3 className="text-sm leading-tight font-semibold tracking-wide uppercase">
                            {item.titulo}
                          </h3>
                          <div className={`transition-all ${activo ? "mt-1 max-h-28 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
                            <p className="text-xs text-foreground/60">{item.lugar}</p>
                            {item.seccion && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  irA(item.seccion ?? "itinerario");
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") irA(item.seccion ?? "itinerario");
                                }}
                                className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold tracking-widest text-primary uppercase"
                              >
                                Abrir sección <ChevronDown size={11} />
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="order-2 flex size-4 items-center justify-center rounded-full border border-primary bg-background">
                          <span className="size-1.5 rounded-full bg-primary" />
                        </span>

                        <span
                          className={`flex size-[4.5rem] items-center justify-center rounded-full border text-primary transition-all duration-500 ${activo ? "scale-110 border-primary/60" : "border-primary/25"} ${relieve ? "icono-relieve" : "bg-card"} ${izquierda ? "order-3 justify-self-start" : "order-1 justify-self-end"}`}
                          style={{
                            background:
                              "radial-gradient(circle at 32% 26%, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--card) 88%, transparent))",
                          }}
                        >
                          <Icono size={26} strokeWidth={1.1} />
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
          <section className="relative bg-primary/5 px-6 py-16">
            <Reveal>
              <p className="text-center text-[9px] tracking-[0.3em] text-olive uppercase">
                Ubicaciones
              </p>
              <h2 className="mt-2 mb-8 text-center font-display text-3xl">
                Lugares de la Celebración
              </h2>
            </Reveal>
            <div className="space-y-5">
              {(inv.sedes ?? [])
                .filter((s) => s.nombre.trim())
                .map((s, i) => {
                  const Icono = iconoPorId(undefined, `${s.etiqueta} ${s.nombre}`);
                  const maps =
                    s.mapsUrl.trim() ||
                    `https://maps.google.com/?q=${encodeURIComponent(`${s.nombre} ${s.direccion}`)}`;
                  const waze =
                    s.wazeUrl?.trim() ||
                    `https://waze.com/ul?q=${encodeURIComponent(`${s.nombre} ${s.direccion}`)}`;
                  const uber =
                    s.uberUrl?.trim() ||
                    `https://m.uber.com/ul/?action=setPickup&dropoff[nickname]=${encodeURIComponent(s.nombre)}`;
                  return (
                    <Reveal key={`${s.nombre}-${i}`} delay={i * 120}>
                      <div
                        className={`tarjeta-interactiva rounded-3xl border border-primary/15 p-6 text-left ${relieve ? "capsula-vidrio" : "bg-card"}`}
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1.5 text-[9px] tracking-[0.18em] text-primary uppercase">
                          <Icono size={13} strokeWidth={1.4} /> {s.etiqueta}
                        </span>
                        {s.hora.trim() && (
                          <p className="mt-3 flex items-center gap-2 font-mono text-xs text-primary">
                            <Clock3 size={13} /> {s.hora}
                          </p>
                        )}
                        <h3 className="mt-2 font-display text-2xl leading-tight">{s.nombre}</h3>
                        {s.direccion.trim() && (
                          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-foreground/60">
                            <MapPin size={13} className="mt-0.5 shrink-0 text-primary" />
                            {s.direccion}
                          </p>
                        )}
                        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-primary/12 pt-4">
                          {[
                            { href: maps, Icono: Navigation, texto: "Maps" },
                            { href: waze, Icono: Navigation, texto: "Waze" },
                            { href: uber, Icono: Car, texto: "Uber" },
                          ].map((b) => (
                            <a
                              key={b.texto}
                              href={b.href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 py-2.5 text-[10px] font-medium text-foreground/80 transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                              <b.Icono size={12} className="text-primary" /> {b.texto}
                            </a>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
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
                    className={`tarjeta-interactiva flex gap-4 rounded-3xl border border-primary/12 bg-card/80 p-5 ${relieve ? "tarjeta-relieve" : ""}`}
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
        <section className="relative space-y-8 px-6 pb-16">
          {inv.dressCode.trim() && (
            <Reveal>
              <div
                id="vestimenta"
                className={`tarjeta-interactiva rounded-3xl border border-primary/15 p-7 text-center ${relieve ? "capsula-vidrio" : "bg-card"}`}
              >
                <span
                  className={`mx-auto -mt-14 mb-5 flex size-16 items-center justify-center rounded-full border border-primary/25 text-primary ${relieve ? "icono-relieve" : "bg-card"}`}
                >
                  <Shirt size={26} strokeWidth={1.2} />
                </span>
                <span className="mb-3 block text-[10px] tracking-[0.3em] text-olive uppercase">
                  Código de Vestimenta
                </span>
                <h3 className="font-display text-2xl">{inv.dressCode}</h3>
                <p className="mx-auto mt-3 max-w-[36ch] text-xs leading-relaxed text-foreground/65">
                  {inv.dressDetalle}
                </p>

                {[inv.dressFotoUrl, ...(inv.dressFotos ?? [])].filter((url): url is string => Boolean(url?.trim())).length > 0 && (
                  <div className="relative mt-6 overflow-hidden rounded-2xl border border-primary/15 bg-foreground/[0.03] p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {[inv.dressFotoUrl, ...(inv.dressFotos ?? [])]
                        .filter((url): url is string => Boolean(url?.trim()))
                        .map((url, i) => (
                          <img
                            key={`${url.slice(0, 32)}-${i}`}
                            src={url}
                            alt={`Ejemplo ${i + 1} de vestimenta ${inv.dressCode}`}
                            loading="lazy"
                            className={
                              i === 0
                                ? "col-span-2 mx-auto max-h-[420px] w-full object-contain"
                                : "aspect-square w-full rounded-xl object-cover"
                            }
                          />
                        ))}
                    </div>
                    <a
                      href={inv.dressGuiaUrl?.trim() || inv.dressFotoUrl || inv.dressFotos?.[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-x-6 bottom-5 flex items-center justify-center gap-2 rounded-full bg-foreground/70 py-2.5 text-[9px] tracking-[0.2em] text-background uppercase backdrop-blur-md"
                    >
                      <Eye size={13} /> Ver guía visual de vestimenta
                    </a>
                  </div>
                )}

                <p className="mt-6 mb-3 text-[10px] tracking-[0.28em] text-olive uppercase">
                  Paleta de colores sugerida
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {(inv.coloresSugeridos?.length
                    ? inv.coloresSugeridos
                    : TEMAS[inv.tema].swatch
                  ).map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="size-9 rounded-full border border-foreground/10 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)]"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {inv.dressNota?.trim() && (
                  <p className="mt-6 rounded-2xl border border-primary/20 bg-primary/8 px-5 py-3 text-xs leading-relaxed text-foreground/75">
                    <span className="font-semibold">Nota especial:</span> {inv.dressNota}
                  </p>
                )}
              </div>
            </Reveal>
          )}

          {(inv.regalosTitulo.trim() || (inv.regalos ?? []).length > 0) && (
            <Reveal delay={120}>
              <div
                id="regalos"
                className={`tarjeta-interactiva rounded-3xl border border-primary/15 p-7 text-center ${relieve ? "capsula-vidrio" : "bg-card"}`}
              >
                <span
                  className={`mx-auto -mt-14 mb-5 flex size-16 items-center justify-center rounded-full border border-primary/25 text-primary ${relieve ? "icono-relieve" : "bg-card"}`}
                >
                  <Gift size={26} strokeWidth={1.2} />
                </span>
                <span className="mb-3 block text-[10px] tracking-[0.3em] text-olive uppercase">
                  Mesa de Regalos
                </span>
                <h3 className="font-display text-2xl">
                  {inv.regalosTitulo || "Tu presencia es nuestro mejor regalo"}
                </h3>
                <p className="mx-auto mt-3 mb-6 max-w-[36ch] text-xs leading-relaxed text-foreground/65">
                  {inv.regalosNota ||
                    "Si deseas obsequiarnos algo, aquí tienes algunas opciones con mucho cariño."}
                </p>

                {(inv.regalos ?? []).length > 0 && (
                  <div className="mb-6 space-y-3 text-left">
                    {(inv.regalos ?? []).map((r, i) => {
                      const Icono = iconoRegalo(r.icono, r.titulo);
                      return (
                        <div
                          key={`${r.titulo}-${i}`}
                          className={`tarjeta-interactiva flex items-start gap-4 rounded-2xl border border-primary/15 p-4 ${relieve ? "tarjeta-relieve" : "bg-card"}`}
                        >
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                            <Icono size={18} strokeWidth={1.3} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold">{r.titulo}</h4>
                            <p className="mt-1 text-xs leading-relaxed break-words text-foreground/65">
                              {r.detalle}
                            </p>
                            {r.url?.trim() && (
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-widest text-primary uppercase hover:underline"
                              >
                                <ExternalLink size={12} /> Abrir
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {inv.regalosUrl.trim() && (
                  <a
                    href={inv.regalosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[10px] tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-85"
                  >
                    <Gift size={13} /> Ver mesa de regalos
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
