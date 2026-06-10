import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "timepicker-ui - zero-dependency time picker for the web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "linear-gradient(135deg, #1F4BFF 0%, #1536c4 60%, #0f2a99 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Clock motif echoing app/icon.svg */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7.5" fill="#ffffff" opacity="0.12" />
          <g stroke="#ffffff" strokeLinecap="round">
            <circle cx="16" cy="16" r="9" strokeWidth="2" />
            <path d="M16 16 11.2 13.2" strokeWidth="2.2" />
            <path d="M16 16 22.1 12.5" strokeWidth="2.5" />
          </g>
          <circle cx="16" cy="16" r="1.7" fill="#ffffff" />
        </svg>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 800,
            letterSpacing: "-2px",
          }}
        >
          timepicker-ui
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          fontSize: "40px",
          fontWeight: 600,
          lineHeight: 1.25,
          maxWidth: "960px",
        }}
      >
        Zero-dependency time picker · analog · wheel · 12 themes
      </div>

      <div
        style={{
          marginTop: "32px",
          fontSize: "28px",
          fontWeight: 400,
          opacity: 0.85,
        }}
      >
        Framework-agnostic · SSR-safe · TypeScript · accessible
      </div>
    </div>,
    { ...size },
  );
}
