import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Dark Theme Example",
  description:
    "React dark theme time picker - a dark-mode analog clock with timepicker-ui-react. Zero-dependency, SSR-safe and fully typed for React, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/themes/dark",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/themes/dark" />
      {children}
    </>
  );
}
