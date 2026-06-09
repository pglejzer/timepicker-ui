import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Material 3 Green Example",
  description:
    "React Material 3 green time picker - use the M3 green theme with timepicker-ui-react. Zero-dependency, SSR-safe and fully typed for React, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/themes/m3-green",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/themes/m3-green" />
      {children}
    </>
  );
}
