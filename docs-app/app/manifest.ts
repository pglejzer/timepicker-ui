import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "timepicker-ui — zero-dependency time picker",
    short_name: "timepicker-ui",
    description:
      "Zero-dependency, framework-agnostic, SSR-safe time picker with analog clock, scroll wheel and compact-wheel modes, 12 themes and TypeScript types.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1F4BFF",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
