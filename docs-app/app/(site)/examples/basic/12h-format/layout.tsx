import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "12-Hour Format Example",
  description:
    "12-hour time picker example with AM/PM - configure timepicker-ui for 12h clock format. Zero-dependency, framework-agnostic and SSR-safe, copy-paste ready.",
  alternates: {
    canonical: "/examples/basic/12h-format",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/basic/12h-format" />
      {children}
    </>
  );
}
