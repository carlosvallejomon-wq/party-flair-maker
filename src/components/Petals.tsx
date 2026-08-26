const PETALS = [
  { left: "8%", duration: 11, delay: 0, scale: 1 },
  { left: "22%", duration: 14, delay: 2, scale: 0.7 },
  { left: "41%", duration: 9, delay: 4, scale: 1.2 },
  { left: "58%", duration: 13, delay: 1, scale: 0.85 },
  { left: "74%", duration: 10, delay: 6, scale: 1.1 },
  { left: "89%", duration: 15, delay: 3, scale: 0.75 },
];

export function Petals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            scale: p.scale,
          }}
        />
      ))}
    </div>
  );
}
