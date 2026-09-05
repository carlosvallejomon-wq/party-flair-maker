import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  desde = "abajo",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Dirección desde la que entra el contenido. */
  desde?: "abajo" | "izquierda" | "derecha";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const utilidad =
    desde === "izquierda" ? "reveal-izq" : desde === "derecha" ? "reveal-der" : "reveal";

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${utilidad} ${className}`}
    >
      {children}
    </div>
  );
}

