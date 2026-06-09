import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Backdrop Example",
  description:
    "Time picker with a dimmed modal backdrop - toggle the backdrop overlay in timepicker-ui. Zero-dependency, accessible and SSR-safe, with copy-paste example code.",
  alternates: {
    canonical: "/examples/basic/backdrop",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/basic/backdrop" />
      {children}
    </>
  );
}
