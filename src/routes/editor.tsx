import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { InvitacionVista } from "@/components/InvitacionVista";
import { SubirArchivo } from "@/components/SubirArchivo";
import { CORONAS, ESQUINAS, MARCOS, TEXTURAS, type Adorno } from "@/lib/adornos";
import {
  ANIMACIONES,
  MELODIAS,
  PLANTILLAS,
  TEMAS,
  cargarBorrador,
  guardarBorrador,
  plantillaPorSlug,
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
    p: typeof search["p"] === "string" ? (search["p"] as string) : undefined,
  }),
  component: Editor,
});

const etiqueta = "mb-1 block text-[10px] tracking-widest text-olive uppercase";
const campo =
  "w-full rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm outline-none focus:border-primary";

/** Galería de adornos (marcos, coronas o texturas) con opción "sin adorno". */
function Galeria({
  titulo,
  lista,
  valor,
  onElegir,
}: {
  titulo: string;
  lista: Adorno[];
  valor?: string | undefined;
  onElegir: (id: string) => void;
}) {
  const opciones = [{ id: "ninguno", nombre: "Sin adorno", src: "" }, ...lista];
  return (
    <div className="mb-4">
      <span className={etiqueta}>
        {titulo} ({lista.length} opciones)
      </span>
      <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto rounded-xl border border-foreground/10 p-2 sm:grid-cols-6">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onElegir(o.id)}
            aria-pressed={valor === o.id}
            className={`rounded-xl border p-2 ${
              valor === o.id ? "border-primary bg-primary/5" : "border-foreground/10"
            }`}
          >
            {o.src ? (
              <img src={o.src} alt="" className="mx-auto h-16 w-full object-contain" />
            ) : (
              <span className="flex h-16 items-center justify-center text-[10px] text-foreground/40">
                —
              </span>
            )}
            <span className="mt-1 block text-[9px] leading-tight text-foreground/70">
              {o.nombre}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Editor() {
  const { p } = Route.useSearch();
  const [inv, setInv] = useState<Invitacion>(() => plantillaPorSlug(p));
  const [guardado, setGuardado] = useState(false);
  const [aviso, setAviso] = useState("");

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
    const ok = guardarBorrador(inv);
    setGuardado(true);
    if (!ok) setAviso("No se pudo guardar: los archivos subidos son muy pesados para el navegador.");
    else setAviso("");
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
              Cambia textos, colores, marcos, coronas, texturas, música y videos. Sube tu propia
              decoración y mira la vista previa al instante.
            </p>
            {aviso && <p className="mt-3 text-xs text-destructive">{aviso}</p>}
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
              <div>
                <label className={etiqueta} htmlFor="musicaUrl">
                  Enlace de tu canción (mp3)
                </label>
                <input
                  id="musicaUrl"
                  className={campo}
                  placeholder="https://.../cancion.mp3"
                  value={inv.musicaUrl ?? ""}
                  onChange={(e) => set("musicaUrl", e.target.value)}
                />
              </div>
              <div className="sm:col-span-3 flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--primary)]"
                    checked={inv.sobreActivo ?? true}
                    onChange={(e) => set("sobreActivo", e.target.checked)}
                  />
                  Iniciar con un sobre que el invitado abre
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--primary)]"
                    checked={inv.relieve !== false}
                    onChange={(e) => set("relieve", e.target.checked)}
                  />
                  Relieve y sombras elegantes
                </label>
              </div>
            </div>
          </section>

          {/* Marcos, coronas y texturas */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-1 font-display text-2xl italic">Marcos, coronas y texturas</h2>
            <p className="mb-5 text-xs text-foreground/60">
              Elige un adorno de la galería o sube el tuyo (PNG con fondo transparente).
            </p>

            <Galeria
              titulo="Marco de la invitación"
              lista={MARCOS}
              valor={inv.marco}
              onElegir={(id) => set("marco", id)}
            />
            <div className="mb-8">
              <SubirArchivo
                etiqueta="Subir mi propio marco (PNG)"
                valor={inv.marcoUrl}
                onCambio={(v) => set("marcoUrl", v)}
                ayuda="Si subes uno, reemplaza al marco de la galería."
              />
            </div>

            <Galeria
              titulo="Corona de la portada"
              lista={CORONAS}
              valor={inv.corona}
              onElegir={(id) => set("corona", id)}
            />
            <div className="mb-8">
              <SubirArchivo
                etiqueta="Subir mi propia corona (PNG)"
                valor={inv.coronaUrl}
                onCambio={(v) => set("coronaUrl", v)}
              />
            </div>

            <Galeria
              titulo="Decoración de esquinas"
              lista={ESQUINAS}
              valor={inv.esquinas}
              onElegir={(id) => set("esquinas", id)}
            />
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <SubirArchivo
                etiqueta="Subir mi propia esquina (PNG)"
                valor={inv.esquinasUrl}
                onCambio={(v) => set("esquinasUrl", v)}
                ayuda="Se repite espejada en las 4 esquinas."
              />
              <div>
                <label className={etiqueta} htmlFor="esq-tam">
                  Tamaño de las esquinas ({inv.esquinasTamano ?? 32}%)
                </label>
                <input
                  id="esq-tam"
                  type="range"
                  min={15}
                  max={60}
                  value={inv.esquinasTamano ?? 32}
                  onChange={(e) => set("esquinasTamano", Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Galeria
              titulo="Textura de fondo"
              lista={TEXTURAS}
              valor={inv.textura}
              onElegir={(id) => set("textura", id)}
            />
            <div className="mb-8">
              <SubirArchivo
                etiqueta="Subir mi propia textura"
                valor={inv.texturaUrl}
                onCambio={(v) => set("texturaUrl", v)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SubirArchivo
                etiqueta="Mi decoración (PNG que se superpone)"
                valor={inv.decoracionUrl}
                onCambio={(v) => set("decoracionUrl", v)}
                ayuda="Flores, esquinas, brillos… lo que tú subas."
              />
              <div>
                <label className={etiqueta} htmlFor="opa">
                  Opacidad de mi decoración ({inv.decoracionOpacidad ?? 70}%)
                </label>
                <input
                  id="opa"
                  type="range"
                  min={10}
                  max={100}
                  className="w-full accent-[var(--primary)]"
                  value={inv.decoracionOpacidad ?? 70}
                  onChange={(e) => set("decoracionOpacidad", Number(e.target.value))}
                />
              </div>
            </div>
          </section>

          {/* Fotos y videos */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-5 font-display text-2xl italic">Fotos y videos</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <SubirArchivo
                etiqueta="Foto de portada"
                valor={inv.fotoPortadaUrl}
                onCambio={(v) => set("fotoPortadaUrl", v)}
              />
              <SubirArchivo
                etiqueta="Video al abrir el sobre"
                acepta="video/*"
                valor={inv.videoSobreUrl}
                onCambio={(v) => set("videoSobreUrl", v)}
              />
              <SubirArchivo
                etiqueta="Video dentro de la corona"
                acepta="video/*"
                valor={inv.videoPortadaUrl}
                onCambio={(v) => set("videoPortadaUrl", v)}
              />
              <SubirArchivo
                etiqueta="Video de la historia"
                acepta="video/*"
                valor={inv.videoGaleriaUrl}
                onCambio={(v) => set("videoGaleriaUrl", v)}
              />
              <SubirArchivo
                etiqueta="Imagen de fondo de la portada"
                ayuda="Se muestra a pantalla completa detrás de los nombres."
                valor={inv.fondoUrl}
                onCambio={(v) => set("fondoUrl", v)}
              />
              <SubirArchivo
                etiqueta="Video de fondo de la portada"
                acepta="video/*"
                ayuda="Si lo subes, reemplaza a la imagen de fondo."
                valor={inv.videoFondoUrl}
                onCambio={(v) => set("videoFondoUrl", v)}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">
                  Ajuste del fondo
                </span>
                <select
                  value={inv.fondoAjuste ?? "cubrir"}
                  onChange={(e) => set("fondoAjuste", e.target.value as "cubrir" | "contener")}
                  className="w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm"
                >
                  <option value="cubrir">Cubrir (recomendado en celular)</option>
                  <option value="contener">Contener (ver imagen completa)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">
                  Opacidad del fondo ({inv.fondoOpacidad ?? 25}%)
                </span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={inv.fondoOpacidad ?? 25}
                  onChange={(e) => set("fondoOpacidad", Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">
                  Encuadre horizontal ({inv.fondoPosX ?? 50}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={inv.fondoPosX ?? 50}
                  onChange={(e) => set("fondoPosX", Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">
                  Encuadre vertical ({inv.fondoPosY ?? 50}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={inv.fondoPosY ?? 50}
                  onChange={(e) => set("fondoPosY", Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </label>
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
              <div>
                <label className={etiqueta} htmlFor="dir">
                  Dirección exacta
                </label>
                <input
                  id="dir"
                  className={campo}
                  placeholder="Calle, número, colonia"
                  value={inv.direccion ?? ""}
                  onChange={(e) => set("direccion", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="waze">
                  Enlace de Waze (opcional)
                </label>
                <input
                  id="waze"
                  className={campo}
                  value={inv.wazeUrl ?? ""}
                  onChange={(e) => set("wazeUrl", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="wa">
                  WhatsApp para confirmaciones
                </label>
                <input
                  id="wa"
                  className={campo}
                  placeholder="521 55 1234 5678"
                  value={inv.whatsapp ?? ""}
                  onChange={(e) => set("whatsapp", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="albt">
                  Título del álbum de fotos
                </label>
                <input
                  id="albt"
                  className={campo}
                  value={inv.albumTitulo ?? ""}
                  onChange={(e) => set("albumTitulo", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="albu">
                  Enlace del álbum (se convierte en QR)
                </label>
                <input
                  id="albu"
                  className={campo}
                  placeholder="https://photos.app.goo.gl/..."
                  value={inv.albumUrl ?? ""}
                  onChange={(e) => set("albumUrl", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="hash">
                  Hashtag del evento
                </label>
                <input
                  id="hash"
                  className={campo}
                  placeholder="#ValentinaYMateo2026"
                  value={inv.hashtag ?? ""}
                  onChange={(e) => set("hashtag", e.target.value)}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="ig">
                  Filtro / perfil de Instagram
                </label>
                <input
                  id="ig"
                  className={campo}
                  placeholder="https://instagram.com/..."
                  value={inv.instagramUrl ?? ""}
                  onChange={(e) => set("instagramUrl", e.target.value)}
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
