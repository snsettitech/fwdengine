import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared OpenGraph image composition.
 *
 * Art direction matches the site: near-black canvas, engineering grid, a
 * lattice of nodes and hairlines, display type against a mono label. No stock
 * photography, no gradients standing in for a picture.
 *
 * Satori renders a subset of CSS. Notably it has no CSS grid and cannot read
 * woff2, so the grid is drawn from positioned divs and the fonts are TTF.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

async function loadFonts() {
  const [display, mono] = await Promise.all([
    fs.readFile(path.join(FONT_DIR, "GeneralSans-Semibold.ttf")),
    fs.readFile(path.join(FONT_DIR, "JetBrainsMono-Regular.ttf")),
  ]);

  return [
    { name: "General Sans", data: display, weight: 600 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

const CANVAS = "#05060a";
const INK = "#f2f4f8";
const INK_MUTED = "#9aa3b2";
const INK_DIM = "#78839a";
const CYAN = "#3ddcff";

/** Faint engineering grid, drawn as positioned hairlines. */
function Grid() {
  const columns = Array.from({ length: 11 }, (_, index) => (index + 1) * 100);
  const rows = Array.from({ length: 6 }, (_, index) => (index + 1) * 90);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      {columns.map((x) => (
        <div
          key={`c${x}`}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: 630,
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
      {rows.map((y) => (
        <div
          key={`r${y}`}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: 1200,
            height: 1,
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  );
}

/** A small node lattice in the lower right: squares joined by rotated hairlines. */
function Lattice() {
  const nodes = [
    { x: 812, y: 300 },
    { x: 926, y: 246 },
    { x: 1042, y: 318 },
    { x: 902, y: 392 },
    { x: 1030, y: 458 },
    { x: 784, y: 452 },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [0, 3],
    [2, 4],
    [3, 4],
    [3, 5],
  ] as const;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      {edges.map(([a, b]) => {
        const from = nodes[a];
        const to = nodes[b];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        // Satori rotates about the element's centre and ignores
        // transform-origin, so the edge is laid out centred on the midpoint
        // of the two nodes rather than anchored at one end.
        return (
          <div
            key={`${a}-${b}`}
            style={{
              position: "absolute",
              left: (from.x + to.x) / 2 - length / 2,
              top: (from.y + to.y) / 2,
              width: length,
              height: 1,
              background: "rgba(132,148,200,0.5)",
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}
      {nodes.map((node, index) => (
        <div
          key={`n${index}`}
          style={{
            position: "absolute",
            left: node.x - 3.5,
            top: node.y - 3.5,
            width: 7,
            height: 7,
            background: index % 3 === 0 ? CYAN : INK,
          }}
        />
      ))}
    </div>
  );
}

export async function renderOgImage({
  kicker,
  title,
  footer,
}: {
  kicker: string;
  title: string;
  footer?: string;
}) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          position: "relative",
          fontFamily: "General Sans",
        }}
      >
        <Grid />

        {/* Volumetric light, top right */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 760,
            height: 760,
            borderRadius: 760,
            background:
              "radial-gradient(circle, rgba(76,76,245,0.46) 0%, rgba(76,76,245,0) 66%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: 560,
            background:
              "radial-gradient(circle, rgba(61,220,255,0.18) 0%, rgba(61,220,255,0) 68%)",
          }}
        />

        <Lattice />

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "56px 64px 0",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              border: "2px solid rgba(242,244,248,0.32)",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderTop: `2px solid ${INK}`,
                borderRight: `2px solid ${INK}`,
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 26, color: INK, letterSpacing: -0.8 }}>
            <span>Fwd</span>
            <span style={{ color: INK_MUTED }}>Engine</span>
          </div>
        </div>

        {/* Copy block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 64px 60px",
            maxWidth: 880,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "JetBrains Mono",
              fontSize: 15,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: INK_DIM,
            }}
          >
            <span style={{ color: CYAN }}>{"//"}</span>
            <span>{kicker}</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: title.length > 76 ? 52 : 62,
              lineHeight: 1.06,
              letterSpacing: -2,
              color: INK,
            }}
          >
            {title}
          </div>

          {footer ? (
            <div
              style={{
                display: "flex",
                marginTop: 30,
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "JetBrains Mono",
                fontSize: 16,
                color: INK_MUTED,
              }}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
