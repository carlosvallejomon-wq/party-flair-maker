import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { InvitacionVista } from "@/components/InvitacionVista";
import { cargarBorrador, plantillaPorSlug, type Invitacion } from "@/lib/invitacion";

const TITULO = "Invitaciones digitales interactivas | Votos & Seda";
const DESCRIPCION =
  "Crea invitaciones digitales interactivas para bodas, XV años, bautizos y cumpleaños: música, cuenta regresiva, decoración animada y confirmación de asistencia.";

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
  component: Inicio,
});

function Inicio() {
  const [inv, setInv] = useState<Invitacion>(() => plantillaPorSlug());

  useEffect(() => {
    const borrador = cargarBorrador();
    if (borrador) setInv(borrador);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-foreground/5 bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-widest text-olive uppercase">
            Invitaciones de
          </span>
          <span className="font-display text-xl font-semibold italic">Votos &amp; Seda</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/plantillas"
            className="text-[10px] tracking-widest text-olive uppercase hover:text-foreground"
          >
            Plantillas
          </Link>
          <Link
            to="/editor"
            search={{ p: undefined }}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium tracking-tight text-background transition-opacity hover:opacity-85"
          >
            Crear Invitación
          </Link>
        </div>
      </header>

      <InvitacionVista inv={inv} />
    </div>
  );
}
