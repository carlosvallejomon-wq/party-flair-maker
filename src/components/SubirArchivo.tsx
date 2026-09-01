import { useRef, useState } from "react";

/**
 * Control del editor para subir una imagen o video propio.
 * El archivo se convierte en data URL y se guarda dentro de la invitación,
 * por lo que no requiere servidor.
 */
export function SubirArchivo({
  etiqueta,
  valor,
  acepta = "image/*",
  ayuda,
  onCambio,
}: {
  etiqueta: string;
  valor?: string | undefined;
  acepta?: string | undefined;
  ayuda?: string | undefined;
  onCambio: (dataUrl: string) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  const leer = (archivo: File) => {
    const limite = acepta.includes("video") ? 8 : 3;
    if (archivo.size > limite * 1024 * 1024) {
      setError(`El archivo pesa demasiado (máximo ${limite} MB).`);
      return;
    }
    setError("");
    const lector = new FileReader();
    lector.onload = () => onCambio(String(lector.result));
    lector.readAsDataURL(archivo);
  };

  const esVideo = acepta.includes("video");

  return (
    <div>
      <span className="mb-1 block text-[10px] tracking-widest text-olive uppercase">{etiqueta}</span>
      <div className="flex items-center gap-3">
        {valor ? (
          esVideo ? (
            <video src={valor} muted className="size-14 rounded-lg object-cover" />
          ) : (
            <img
              src={valor}
              alt=""
              className="size-14 rounded-lg border border-foreground/10 bg-secondary object-contain"
            />
          )
        ) : (
          <span className="flex size-14 items-center justify-center rounded-lg border border-dashed border-foreground/20 text-[9px] text-foreground/40">
            vacío
          </span>
        )}
        <div className="flex flex-1 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="rounded-full border border-primary px-4 py-1.5 text-[10px] tracking-widest text-primary uppercase hover:bg-primary hover:text-background"
          >
            Subir
          </button>
          {valor && (
            <button
              type="button"
              onClick={() => onCambio("")}
              className="rounded-full border border-foreground/15 px-4 py-1.5 text-[10px] tracking-widest text-foreground/60 uppercase hover:border-destructive hover:text-destructive"
            >
              Quitar
            </button>
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={acepta}
        className="hidden"
        aria-label={etiqueta}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) leer(archivo);
          e.target.value = "";
        }}
      />
      {(error || ayuda) && (
        <p className={`mt-1 text-[10px] ${error ? "text-destructive" : "text-foreground/50"}`}>
          {error || ayuda}
        </p>
      )}
    </div>
  );
}
