import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Crane Straight Theme Example",
  description:
    "The Crane Straight theme for timepicker-ui - sharp-edged Material-style analog clock time picker. Zero-dependency and SSR-safe, with copy-paste example code.",
  alternates: {
    canonical: "/examples/themes/crane-straight",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/crane-straight" />
      {children}
    </>
  );
}
