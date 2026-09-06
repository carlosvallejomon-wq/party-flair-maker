import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SEPARADORES } from "@/components/Divisor";
import { InvitacionVista } from "@/components/InvitacionVista";
import { ICONOS } from "@/lib/iconos";
import { SubirArchivo } from "@/components/SubirArchivo";
import { CORONAS, ESQUINAS, MARCOS, TEXTURAS, type Adorno } from "@/lib/adornos";
import {
  ANIMACIONES,
  MELODIAS,
  PLANTILLAS,
  TEMAS,
  cargarBorradorCompleto,
  guardarBorradorCompleto,
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
    void cargarBorradorCompleto().then((borrador) => {
      if (borrador) setInv(borrador);
    });
  }, [p]);

  const set = <K extends keyof Invitacion>(clave: K, valor: Invitacion[K]) =>
    setInv((prev) => ({ ...prev, [clave]: valor }));

  const setItem = (
    i: number,
    clave: "hora" | "titulo" | "lugar" | "icono" | "seccion",
    valor: string,
  ) =>
    setInv((prev) => ({
      ...prev,
      itinerario: prev.itinerario.map((it, idx) => (idx === i ? { ...it, [clave]: valor } : it)),
    }));

  const guardar = () => {
    void guardarBorradorCompleto(inv).then((ok) => {
      setGuardado(true);
      if (!ok) setAviso("No se pudo guardar: los archivos subidos son muy pesados para el navegador.");
      else setAviso("");
      setTimeout(() => setGuardado(false), 2500);
    });
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

            <div className="mb-6">
              <label className={etiqueta} htmlFor="separador">
                Separador entre secciones
              </label>
              <select
                id="separador"
                className={campo}
                value={inv.separador ?? "asterisco"}
                onChange={(e) => set("separador", e.target.value)}
              >
                {SEPARADORES.map((sep) => (
                  <option key={sep.id} value={sep.id}>
                    {sep.nombre}
                  </option>
                ))}
              </select>
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
                  value={inv.musicaUrl?.startsWith("data:") ? "" : (inv.musicaUrl ?? "")}
                  onChange={(e) => set("musicaUrl", e.target.value)}
                />
              </div>
              <div>
                <SubirArchivo
                  etiqueta="…o sube tu mp3"
                  acepta="audio/*"
                  ayuda="Máximo 8 MB. Reemplaza el enlace de arriba."
                  valor={inv.musicaUrl?.startsWith("data:") ? inv.musicaUrl : ""}
                  onCambio={(v) => set("musicaUrl", v)}
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
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={etiqueta} htmlFor="marco-ajuste">
                    Cómo se ajusta
                  </label>
                  <select
                    id="marco-ajuste"
                    className={campo}
                    value={inv.marcoAjuste ?? "estirar"}
                    onChange={(e) =>
                      set("marcoAjuste", e.target.value as NonNullable<Invitacion["marcoAjuste"]>)
                    }
                  >
                    <option value="estirar">Estirar al borde</option>
                    <option value="contener">Mantener proporción</option>
                  </select>
                </div>
                <div>
                  <label className={etiqueta} htmlFor="marco-margen">
                    Margen del marco ({inv.marcoMargen ?? 3}%)
                  </label>
                  <input
                    id="marco-margen"
                    type="range"
                    min={0}
                    max={12}
                    className="w-full accent-[var(--primary)]"
                    value={inv.marcoMargen ?? 3}
                    onChange={(e) => set("marcoMargen", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="marco-opa">
                    Opacidad del marco ({inv.marcoOpacidad ?? 85}%)
                  </label>
                  <input
                    id="marco-opa"
                    type="range"
                    min={10}
                    max={100}
                    className="w-full accent-[var(--primary)]"
                    value={inv.marcoOpacidad ?? 85}
                    onChange={(e) => set("marcoOpacidad", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <Galeria
              titulo="Corona de la portada"
              lista={CORONAS}
              valor={inv.corona}
              onElegir={(id) => {
                setInv((prev) => ({
                  ...prev,
                  corona: id,
                  coronaUrl: "",
                  coronaTamano: 74,
                  coronaHueco: 17,
                  coronaGiro: 0,
                  coronaEncuadreAuto: true,
                  coronaFotoEscala: 100,
                  coronaFotoPosX: 50,
                  coronaFotoPosY: 50,
                  coronaFotoForma: "automatica",
                  coronaRecorteEscala: 100,
                  coronaRecortePosX: 0,
                  coronaRecortePosY: 0,
                }));
              }}
            />
            <div className="mb-8">
              <SubirArchivo
                etiqueta="Subir mi propia corona (PNG)"
                valor={inv.coronaUrl}
                onCambio={(v) => setInv((prev) => ({
                  ...prev,
                  coronaUrl: v,
                  coronaTamano: 74,
                  coronaHueco: 17,
                  coronaGiro: 0,
                  coronaEncuadreAuto: true,
                  coronaFotoEscala: 100,
                  coronaFotoPosX: 50,
                  coronaFotoPosY: 50,
                  coronaFotoForma: "automatica",
                  coronaRecorteEscala: 100,
                  coronaRecortePosX: 0,
                  coronaRecortePosY: 0,
                }))}
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="flex items-center gap-3 text-sm sm:col-span-3">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--primary)]"
                    checked={inv.coronaEncuadreAuto !== false}
                    onChange={(e) => set("coronaEncuadreAuto", e.target.checked)}
                  />
                  Detectar automáticamente el hueco de la corona
                </label>
                <div>
                  <label className={etiqueta} htmlFor="corona-tam">
                    Tamaño de la corona ({inv.coronaTamano ?? 74}%)
                  </label>
                  <input
                    id="corona-tam"
                    type="range"
                    min={40}
                    max={100}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaTamano ?? 74}
                    onChange={(e) => set("coronaTamano", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-hueco">
                    Encuadre de la foto ({inv.coronaHueco ?? 17}%)
                  </label>
                  <input
                    id="corona-hueco"
                    type="range"
                    min={0}
                    max={35}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaHueco ?? 17}
                    onChange={(e) => set("coronaHueco", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-giro">
                    Girar la corona
                  </label>
                  <select
                    id="corona-giro"
                    className={campo}
                    value={inv.coronaGiro ?? 0}
                    onChange={(e) => set("coronaGiro", Number(e.target.value))}
                  >
                    <option value={0}>Sin girar</option>
                    <option value={90}>90°</option>
                    <option value={180}>180°</option>
                    <option value={270}>270°</option>
                  </select>
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-foto-forma">
                    Forma del recorte
                  </label>
                  <select
                    id="corona-foto-forma"
                    className={campo}
                    value={inv.coronaFotoForma ?? "automatica"}
                    onChange={(e) => set("coronaFotoForma", e.target.value as NonNullable<Invitacion["coronaFotoForma"]>)}
                  >
                    <option value="automatica">Automática según la corona</option>
                    <option value="circular">Circular</option>
                    <option value="ovalada">Ovalada vertical (3/4)</option>
                    <option value="ovalada-h">Ovalada horizontal (4/3)</option>
                    <option value="cuadrada">Cuadrada</option>
                    <option value="rectangular">Rectangular vertical (3/4)</option>
                    <option value="rectangular-h">Rectangular horizontal (4/3)</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <p className="border-t border-foreground/10 pt-4 text-xs font-medium text-foreground/80">
                    Alinear el recorte dentro de la corona
                  </p>
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-recorte-escala">
                    Tamaño del recorte ({inv.coronaRecorteEscala ?? 100}%)
                  </label>
                  <input
                    id="corona-recorte-escala"
                    type="range"
                    min={60}
                    max={140}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaRecorteEscala ?? 100}
                    onChange={(e) => set("coronaRecorteEscala", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-recorte-x">
                    Recorte a los lados ({inv.coronaRecortePosX ?? 0})
                  </label>
                  <input
                    id="corona-recorte-x"
                    type="range"
                    min={-30}
                    max={30}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaRecortePosX ?? 0}
                    onChange={(e) => set("coronaRecortePosX", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-recorte-y">
                    Recorte arriba y abajo ({inv.coronaRecortePosY ?? 0})
                  </label>
                  <input
                    id="corona-recorte-y"
                    type="range"
                    min={-30}
                    max={30}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaRecortePosY ?? 0}
                    onChange={(e) => set("coronaRecortePosY", Number(e.target.value))}
                  />
                </div>
                <div className="sm:col-span-3">
                  <p className="border-t border-foreground/10 pt-4 text-xs font-medium text-foreground/80">
                    Encuadrar la foto dentro del recorte
                  </p>
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-foto-escala">
                    Tamaño de la foto ({inv.coronaFotoEscala ?? 100}%)
                  </label>
                  <input
                    id="corona-foto-escala"
                    type="range"
                    min={50}
                    max={250}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaFotoEscala ?? 100}
                    onChange={(e) => set("coronaFotoEscala", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-foto-x">
                    Foto a los lados ({inv.coronaFotoPosX ?? 50}%)
                  </label>
                  <input
                    id="corona-foto-x"
                    type="range"
                    min={0}
                    max={100}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaFotoPosX ?? 50}
                    onChange={(e) => set("coronaFotoPosX", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={etiqueta} htmlFor="corona-foto-y">
                    Foto arriba y abajo ({inv.coronaFotoPosY ?? 50}%)
                  </label>
                  <input
                    id="corona-foto-y"
                    type="range"
                    min={0}
                    max={100}
                    className="w-full accent-[var(--primary)]"
                    value={inv.coronaFotoPosY ?? 50}
                    onChange={(e) => set("coronaFotoPosY", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm transition-colors hover:border-primary"
                    onClick={() => setInv((prev) => ({
                      ...prev,
                      coronaFotoEscala: 100,
                      coronaFotoPosX: 50,
                      coronaFotoPosY: 50,
                      coronaFotoForma: "automatica",
                      coronaRecorteEscala: 100,
                      coronaRecortePosX: 0,
                      coronaRecortePosY: 0,
                    }))}
                  >
                    Restablecer foto
                  </button>
                </div>
              </div>
            </div>

            <Galeria
              titulo="Decoración de esquinas"
              lista={ESQUINAS}
              valor={inv.esquinas}
              onElegir={(id) => {
                set("esquinas", id);
                set("esquinasUrl", "");
              }}
            />
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <SubirArchivo
                etiqueta="Subir mi propia esquina (PNG)"
                valor={inv.esquinasUrl}
                onCambio={(v) => set("esquinasUrl", v)}
                ayuda="Se repite en las 4 esquinas."
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
              <div>
                <label className={etiqueta} htmlFor="esq-giro">
                  Girar la esquina
                </label>
                <select
                  id="esq-giro"
                  className={campo}
                  value={inv.esquinasGiro ?? 0}
                  onChange={(e) => set("esquinasGiro", Number(e.target.value))}
                >
                  <option value={0}>Sin girar</option>
                  <option value={90}>90°</option>
                  <option value={180}>180°</option>
                  <option value={270}>270°</option>
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="esq-modo">
                  Cómo se acomoda en cada esquina
                </label>
                <select
                  id="esq-modo"
                  className={campo}
                  value={inv.esquinasModo ?? "espejo"}
                  onChange={(e) =>
                    set("esquinasModo", e.target.value as NonNullable<Invitacion["esquinasModo"]>)
                  }
                >
                  <option value="espejo">Espejo (se reflejan)</option>
                  <option value="giro">Girar 90° por esquina</option>
                  <option value="igual">Todas iguales</option>
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="esq-disp">
                  Dónde se colocan
                </label>
                <select
                  id="esq-disp"
                  className={campo}
                  value={inv.esquinasDisposicion ?? "cuatro"}
                  onChange={(e) =>
                    set(
                      "esquinasDisposicion",
                      e.target.value as NonNullable<Invitacion["esquinasDisposicion"]>,
                    )
                  }
                >
                  <option value="cuatro">Las 4 esquinas</option>
                  <option value="arriba">2 arriba</option>
                  <option value="abajo">2 abajo</option>
                  <option value="diagonal">1 arriba y 1 abajo (en diagonal)</option>
                  <option value="lados">2 a los lados</option>
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="esq-margen">
                  Separación del borde ({inv.esquinasMargen ?? 0}%)
                </label>
                <input
                  id="esq-margen"
                  type="range"
                  min={0}
                  max={15}
                  className="w-full accent-[var(--primary)]"
                  value={inv.esquinasMargen ?? 0}
                  onChange={(e) => set("esquinasMargen", Number(e.target.value))}
                />
              </div>
              <div>
                <label className={etiqueta} htmlFor="esq-opa">
                  Opacidad de las esquinas ({inv.esquinasOpacidad ?? 100}%)
                </label>
                <input
                  id="esq-opa"
                  type="range"
                  min={10}
                  max={100}
                  className="w-full accent-[var(--primary)]"
                  value={inv.esquinasOpacidad ?? 100}
                  onChange={(e) => set("esquinasOpacidad", Number(e.target.value))}
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
              <div className="mt-4">
                <label className={etiqueta} htmlFor="tex-opa">
                  Intensidad de la textura ({inv.texturaOpacidad ?? 50}%)
                </label>
                <input
                  id="tex-opa"
                  type="range"
                  min={5}
                  max={100}
                  className="w-full accent-[var(--primary)]"
                  value={inv.texturaOpacidad ?? 50}
                  onChange={(e) => set("texturaOpacidad", Number(e.target.value))}
                />
              </div>
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

          {/* Contenido de las secciones */}
          <section className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-1 font-display text-2xl italic">Secciones de la invitación</h2>
            <p className="mb-5 text-xs text-foreground/60">
              Escribe una línea por tarjeta, separando los datos con el símbolo |
            </p>

            <div className="mb-4">
              <label className={etiqueta} htmlFor="familia">
                Línea de apertura
              </label>
              <input
                id="familia"
                className={campo}
                value={inv.familia ?? ""}
                onChange={(e) => set("familia", e.target.value)}
                placeholder="Con la bendición de nuestros padres"
              />
            </div>

            <div className="mb-4">
              <label className={etiqueta} htmlFor="historia-titulo">
                Título de la sección de historia
              </label>
              <input
                id="historia-titulo"
                className={`${campo} mb-4`}
                value={inv.historiaTitulo ?? ""}
                onChange={(e) => set("historiaTitulo", e.target.value)}
                placeholder="Nuestra Historia"
              />
              <label className={etiqueta} htmlFor="hitos">
                Nuestra historia (año | título | texto | enlace de foto)
              </label>
              <textarea
                id="hitos"
                rows={4}
                className={campo}
                value={(inv.hitos ?? [])
                  .map((h) => [h.anio, h.titulo, h.texto, h.foto ?? ""].join(" | "))
                  .join("\n")}
                onChange={(e) =>
                  set(
                    "hitos",
                    e.target.value
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((l) => {
                        const [anio = "", titulo = "", texto = "", foto = ""] = l
                          .split("|")
                          .map((x) => x.trim());
                        return { anio, titulo, texto, foto };
                      }),
                  )
                }
              />
            </div>

            <div className="mb-4">
              <label className={etiqueta} htmlFor="sedes">
                Lugares (etiqueta | lugar | hora | dirección | mapa | waze | uber)
              </label>
              <textarea
                id="sedes"
                rows={3}
                className={campo}
                value={(inv.sedes ?? [])
                  .map((s) =>
                    [
                      s.etiqueta,
                      s.nombre,
                      s.hora,
                      s.direccion,
                      s.mapsUrl,
                      s.wazeUrl ?? "",
                      s.uberUrl ?? "",
                    ].join(" | "),
                  )
                  .join("\n")}
                onChange={(e) =>
                  set(
                    "sedes",
                    e.target.value
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((l) => {
                        const [
                          etiqueta = "",
                          nombre = "",
                          hora = "",
                          direccion = "",
                          mapsUrl = "",
                          wazeUrl = "",
                          uberUrl = "",
                        ] = l.split("|").map((x) => x.trim());
                        return { etiqueta, nombre, hora, direccion, mapsUrl, wazeUrl, uberUrl };
                      }),
                  )
                }
              />
            </div>

            <div className="mb-4">
              <label className={etiqueta} htmlFor="notas">
                A tomar en cuenta (título | texto)
              </label>
              <textarea
                id="notas"
                rows={4}
                className={campo}
                value={(inv.notas ?? []).map((n) => [n.titulo, n.texto].join(" | ")).join("\n")}
                onChange={(e) =>
                  set(
                    "notas",
                    e.target.value
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((l) => {
                        const [titulo = "", texto = ""] = l.split("|").map((x) => x.trim());
                        return { titulo, texto };
                      }),
                  )
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-[var(--primary)]"
                checked={inv.muroActivo !== false}
                onChange={(e) => set("muroActivo", e.target.checked)}
              />
              Mostrar muro de felicitaciones
            </label>
            <div className="mt-4">
              <label className={etiqueta} htmlFor="muro-titulo">
                Título del muro de felicitaciones
              </label>
              <input
                id="muro-titulo"
                className={campo}
                value={inv.muroTitulo ?? ""}
                onChange={(e) => set("muroTitulo", e.target.value)}
                placeholder="Muro de Felicitaciones & Buenos Deseos"
              />
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
                ayuda="Se recorta dentro de la corona."
              />
              <label className="flex items-center gap-2 self-end text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--primary)]"
                  checked={inv.videoPortadaSonido === true}
                  onChange={(e) => set("videoPortadaSonido", e.target.checked)}
                />
                Reproducir el video de la corona con sonido
              </label>
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
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">
                  Zoom del fondo ({inv.fondoZoom ?? 100}%)
                </span>
                <input
                  type="range"
                  min={60}
                  max={200}
                  value={inv.fondoZoom ?? 100}
                  onChange={(e) => set("fondoZoom", Number(e.target.value))}
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
                <div key={i} className="grid gap-3 rounded-xl border border-foreground/10 p-3 sm:grid-cols-2">
                  <input
                    aria-label={`Hora del momento ${i + 1}`}
                    className={campo}
                    value={item.hora}
                    onChange={(e) => setItem(i, "hora", e.target.value)}
                  />
                  <select
                    aria-label={`Sección enlazada al momento ${i + 1}`}
                    className={campo}
                    value={item.seccion ?? ""}
                    onChange={(e) => setItem(i, "seccion", e.target.value)}
                  >
                    <option value="">Solo desplegar información</option>
                    <option value="ubicacion">Abrir ubicación</option>
                    <option value="vestimenta">Abrir vestimenta</option>
                    <option value="regalos">Abrir mesa de regalos</option>
                    <option value="album">Abrir álbum</option>
                    <option value="rsvp">Abrir confirmación</option>
                  </select>
                  <select
                    aria-label={`Icono del momento ${i + 1}`}
                    className={campo}
                    value={item.icono ?? "auto"}
                    onChange={(e) => setItem(i, "icono", e.target.value)}
                  >
                    <option value="auto">Automático</option>
                    {ICONOS.map((ic) => (
                      <option key={ic.id} value={ic.id}>
                        {ic.nombre}
                      </option>
                    ))}
                  </select>
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
                    className="rounded-lg border border-foreground/15 px-3 py-2 text-xs text-foreground/60 hover:border-destructive hover:text-destructive"
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
                  { hora: "00:00 HRS", titulo: "Nuevo momento", lugar: "", icono: "reloj" },
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
              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <SubirArchivo
                  etiqueta="Guía visual de vestimenta (imagen)"
                  valor={inv.dressFotoUrl ?? ""}
                  onCambio={(v) => set("dressFotoUrl", v)}
                />
                {[0, 1].map((indice) => (
                  <SubirArchivo
                    key={indice}
                    etiqueta={`Foto adicional de vestimenta ${indice + 1}`}
                    valor={inv.dressFotos?.[indice] ?? ""}
                    onCambio={(v) => {
                      const fotos = [...(inv.dressFotos ?? [])];
                      fotos[indice] = v;
                      set("dressFotos", fotos.filter(Boolean));
                    }}
                  />
                ))}
                <div>
                  <label className={etiqueta} htmlFor="dress-guia">
                    Enlace de la guía completa
                  </label>
                  <input
                    id="dress-guia"
                    className={campo}
                    value={inv.dressGuiaUrl ?? ""}
                    onChange={(e) => set("dressGuiaUrl", e.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={etiqueta} htmlFor="dress-nota">
                    Nota especial de vestimenta
                  </label>
                  <input
                    id="dress-nota"
                    className={campo}
                    value={inv.dressNota ?? ""}
                    onChange={(e) => set("dressNota", e.target.value)}
                    placeholder="Se reserva el color blanco para la novia."
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className={etiqueta}>Paleta de colores sugerida para vestimenta</span>
                <div className="flex flex-wrap items-center gap-3">
                  {(inv.coloresSugeridos ?? []).map((c, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <input
                        type="color"
                        aria-label={`Color sugerido ${i + 1}`}
                        value={c}
                        onChange={(e) =>
                          set(
                            "coloresSugeridos",
                            (inv.coloresSugeridos ?? []).map((v, idx) =>
                              idx === i ? e.target.value : v,
                            ),
                          )
                        }
                        className="size-9 cursor-pointer rounded-full border border-foreground/15 bg-transparent"
                      />
                      <button
                        type="button"
                        aria-label={`Quitar color ${i + 1}`}
                        onClick={() =>
                          set(
                            "coloresSugeridos",
                            (inv.coloresSugeridos ?? []).filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-xs text-foreground/40 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set("coloresSugeridos", [...(inv.coloresSugeridos ?? []), "#c9a86a"])
                    }
                    className="rounded-full border border-primary px-4 py-2 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
                  >
                    Agregar color
                  </button>
                </div>
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
              <div className="sm:col-span-2">
                <span className={etiqueta}>Opciones de dinero y regalos físicos</span>
                <div className="mb-4 space-y-3">
                  {(inv.regalos ?? []).map((regalo, i) => (
                    <div key={i} className="grid gap-2 rounded-xl border border-foreground/10 p-3 sm:grid-cols-2">
                      <select
                        aria-label={`Tipo de regalo ${i + 1}`}
                        className={campo}
                        value={regalo.icono ?? "regalo"}
                        onChange={(e) =>
                          set("regalos", (inv.regalos ?? []).map((r, idx) => idx === i ? { ...r, icono: e.target.value } : r))
                        }
                      >
                        <option value="efectivo">Dinero en efectivo / sobre</option>
                        <option value="transferencia">Transferencia bancaria</option>
                        <option value="regalo">Regalo físico</option>
                        <option value="tienda">Lista en tienda</option>
                        <option value="viaje">Fondo de viaje</option>
                      </select>
                      <input
                        aria-label={`Título del regalo ${i + 1}`}
                        className={campo}
                        value={regalo.titulo}
                        placeholder="Título"
                        onChange={(e) => set("regalos", (inv.regalos ?? []).map((r, idx) => idx === i ? { ...r, titulo: e.target.value } : r))}
                      />
                      <textarea
                        aria-label={`Detalle del regalo ${i + 1}`}
                        className={`${campo} resize-none`}
                        rows={2}
                        value={regalo.detalle}
                        placeholder="Datos de cuenta, dirección o indicaciones"
                        onChange={(e) => set("regalos", (inv.regalos ?? []).map((r, idx) => idx === i ? { ...r, detalle: e.target.value } : r))}
                      />
                      <div className="flex gap-2">
                        <input
                          aria-label={`Enlace del regalo ${i + 1}`}
                          className={campo}
                          value={regalo.url ?? ""}
                          placeholder="Enlace opcional"
                          onChange={(e) => set("regalos", (inv.regalos ?? []).map((r, idx) => idx === i ? { ...r, url: e.target.value } : r))}
                        />
                        <button
                          type="button"
                          aria-label={`Eliminar regalo ${i + 1}`}
                          onClick={() => set("regalos", (inv.regalos ?? []).filter((_, idx) => idx !== i))}
                          className="rounded-lg border border-destructive/30 px-3 text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => set("regalos", [...(inv.regalos ?? []), { titulo: "Aporte en dinero", detalle: "", icono: "efectivo" }])}
                    className="rounded-full border border-primary px-4 py-2 text-[10px] tracking-widest text-primary uppercase"
                  >
                    + Dinero
                  </button>
                  <button
                    type="button"
                    onClick={() => set("regalos", [...(inv.regalos ?? []), { titulo: "Regalo físico", detalle: "", icono: "regalo" }])}
                    className="rounded-full border border-primary px-4 py-2 text-[10px] tracking-widest text-primary uppercase"
                  >
                    + Regalo físico
                  </button>
                </div>
                <label className={etiqueta} htmlFor="regalos-nota">
                  Nota de la mesa de regalos
                </label>
                <input
                  id="regalos-nota"
                  className={`${campo} mb-4`}
                  value={inv.regalosNota ?? ""}
                  onChange={(e) => set("regalosNota", e.target.value)}
                  placeholder="Tu presencia es nuestro mejor regalo…"
                />
                <label className={etiqueta} htmlFor="regalos-url">
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
