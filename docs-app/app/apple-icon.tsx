import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeLinecap="round">
          <circle cx="12" cy="12" r="8.75" strokeWidth="1.6" />
          <path d="M12 12 8.7 10.1" strokeWidth="1.7" />
          <path d="M12 12 16.8 9.2" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.3" fill="#0d0d0d" stroke="none" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
