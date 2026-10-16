import localFont from "next/font/local";

export const fontText = localFont({
  src: "./atkinson-next-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-atkinson",
  declarations: [
    { prop: "font-family", value: "fontText" },
    { prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  ],
});

export const fontTextExt = localFont({
  src: "./atkinson-next-latin-ext.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "fontText" },
    { prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  ],
});

export const fontMono = localFont({
  src: [
    { path: "./atkinson-mono-latin.woff2", weight: "200 800", style: "normal" },
    { path: "./atkinson-mono-italic-latin.woff2", weight: "200 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-atkinson-mono",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "fontMono" },
    { prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  ],
});

export const fontMonoExt = localFont({
  src: [
    { path: "./atkinson-mono-latin-ext.woff2", weight: "200 800", style: "normal" },
    { path: "./atkinson-mono-italic-latin-ext.woff2", weight: "200 800", style: "italic" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "fontMono" },
    { prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  ],
});
