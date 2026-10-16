import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Playground",
  description:
    "Configure timepicker-ui in the browser: pick a mode, theme, format, plugins and colors, and copy the generated JavaScript, React and CSS.",
  path: "/playground",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/playground" />
      {children}
    </>
  );
}
