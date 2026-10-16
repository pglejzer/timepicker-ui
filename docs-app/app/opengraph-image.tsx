import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "timepicker-ui - zero-dependency time picker for the web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ffffff",
          color: "#0d0d0d",
          borderBottom: "2px solid #0d0d0d",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", maxWidth: "660px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "32px", fontWeight: 700 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeLinecap="round">
              <circle cx="12" cy="12" r="8.75" strokeWidth="1.6" />
              <path d="M12 12 8.7 10.1" strokeWidth="1.7" />
              <path d="M12 12 16.8 9.2" strokeWidth="2" />
              <circle cx="12" cy="12" r="1.3" fill="#0d0d0d" stroke="none" />
            </svg>
            timepicker-ui
          </div>
          <div style={{ fontSize: "66px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-1px" }}>
            A time picker you can configure part by part.
          </div>
          <div style={{ fontSize: "26px", color: "#474747" }}>
            Analog clock · scroll wheel · compact wheel · zero dependencies
          </div>
        </div>
        <svg width="360" height="360" viewBox="0 0 360 360" fill="none" stroke="#0d0d0d" strokeLinecap="round">
          <circle cx="200" cy="180" r="140" strokeWidth="3" />
          <path d="M200 180 140 145" strokeWidth="5" />
          <path d="M200 180 285 131" strokeWidth="4" />
          <circle cx="200" cy="180" r="7" fill="#0d0d0d" stroke="none" />
          <polyline points="20,60 110,60 140,145" strokeWidth="2" />
          <circle cx="140" cy="145" r="6" fill="#0d0d0d" stroke="none" />
          <polyline points="20,300 110,300 165,265" strokeWidth="2" />
          <circle cx="165" cy="265" r="6" fill="#0d0d0d" stroke="none" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
