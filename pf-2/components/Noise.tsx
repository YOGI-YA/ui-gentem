export default function Noise() {
  return (
    <svg className="grain-overlay" aria-hidden="true">
      <filter id="pixzen-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#pixzen-noise)" />
    </svg>
  );
}
