import { hubs } from "@/content/hubs";

/**
 * The still frame. Shown when WebGL is unavailable, when the visitor has asked
 * for reduced motion, or on a metered connection.
 *
 * It is drawn from the same hub data as the 3D scene, so it is a real
 * projection of the delivery network rather than a decorative placeholder.
 */
export function GlobeFallback({ label }: { label?: string }) {
  const size = 520;
  const radius = size / 2 - 24;
  const centre = size / 2;

  // Orthographic projection centred on 20°E so Europe, the Gulf and South
  // Asia are all visible in the still.
  // Coordinates are rounded so the server and client serialise the same
  // string. Raw floats differ in their last digit between the two and React
  // reports it as a hydration mismatch.
  const round = (value: number) => Math.round(value * 100) / 100;

  const project = (lat: number, lng: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = ((lng - 20) * Math.PI) / 180;
    return {
      x: round(centre + radius * Math.cos(latRad) * Math.sin(lngRad)),
      y: round(centre - radius * Math.sin(latRad)),
      visible: Math.cos(latRad) * Math.cos(lngRad) > -0.08,
    };
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full max-h-[min(70vh,520px)] w-full"
        role="img"
        aria-label={label ?? "Projection of FwdEngine delivery hubs across seven time zones"}
      >
        <defs>
          <radialGradient id="fwd-globe-core" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="var(--indigo)" stopOpacity="0.22" />
            <stop offset="62%" stopColor="var(--indigo)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={centre} cy={centre} r={radius} fill="url(#fwd-globe-core)" />
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
        />

        {/* Parallels */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const latRad = (lat * Math.PI) / 180;
          return (
            <ellipse
              key={`lat-${lat}`}
              cx={centre}
              cy={round(centre - radius * Math.sin(latRad))}
              rx={round(radius * Math.cos(latRad))}
              ry={round(radius * Math.cos(latRad) * 0.17)}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
            />
          );
        })}

        {/* Meridians */}
        {[0, 30, 60, 90, 120, 150].map((lng) => (
          <ellipse
            key={`lng-${lng}`}
            cx={centre}
            cy={centre}
            rx={round(radius * Math.abs(Math.cos((lng * Math.PI) / 180)))}
            ry={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}

        {hubs.map((hub) => {
          const point = project(hub.lat, hub.lng);
          if (!point.visible) return null;
          const planned = hub.status === "planned";
          return (
            <g key={hub.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={planned ? 8 : 11}
                fill="none"
                stroke={planned ? "var(--amber)" : "var(--cyan)"}
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <rect
                x={point.x - 2.5}
                y={point.y - 2.5}
                width="5"
                height="5"
                fill={planned ? "var(--amber)" : "var(--cyan)"}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
