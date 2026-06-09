import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Custom Theme Example",
  description:
    "React custom theme time picker - apply your own CSS theme to timepicker-ui-react. Zero-dependency, SSR-safe and fully typed for React, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/themes/custom",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/themes/custom" />
      {children}
    </>
  );
}
