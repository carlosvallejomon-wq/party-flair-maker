import { useEffect, useState } from "react";

/** Genera un código QR (cliente) para el enlace del álbum de fotos. */
export function QrAlbum({ url, color }: { url: string; color?: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let vivo = true;
    if (!url.trim()) {
      setSrc("");
      return;
    }
    void import("qrcode").then(async (mod) => {
      const dataUrl = await mod.toDataURL(url, {
        margin: 1,
        width: 420,
        color: { dark: color ?? "#1b1b1b", light: "#ffffff" },
      });
      if (vivo) setSrc(dataUrl);
    });
    return () => {
      vivo = false;
    };
  }, [url, color]);

  if (!src) return null;
  return (
    <img
      src={src}
      alt="Código QR del álbum de fotos"
      width={200}
      height={200}
      className="mx-auto size-40 rounded-xl bg-white p-2 shadow-lg"
    />
  );
}
