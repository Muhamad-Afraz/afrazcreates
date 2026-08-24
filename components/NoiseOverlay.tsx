const NOISE_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`
  );

export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        width: "100%",
        height: "100%",
        mixBlendMode: "overlay",
        opacity: 0.5,
        backgroundImage: `url("${NOISE_URI}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
