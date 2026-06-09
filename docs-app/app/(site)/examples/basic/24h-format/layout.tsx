import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "24-Hour Format Example",
  description:
    "24-hour time picker example - configure timepicker-ui for 24h military clock format. Zero-dependency, framework-agnostic, SSR-safe, with copy-paste code.",
  alternates: {
    canonical: "/examples/basic/24h-format",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/basic/24h-format" />
      {children}
    </>
  );
}
