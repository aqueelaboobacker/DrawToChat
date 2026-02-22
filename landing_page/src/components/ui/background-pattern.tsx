export function BackgroundPattern() {
  return (
    <div
      className="absolute inset-0 z-0 h-full w-full opacity-100 pointer-events-none"
      style={{
        backgroundImage: `
        radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)
      `,
        backgroundSize: "40px 40px",
        backgroundPosition: "center center",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
      }}
    />
  );
}
