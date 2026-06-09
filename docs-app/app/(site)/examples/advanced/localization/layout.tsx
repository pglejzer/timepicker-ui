import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Localization Example",
  description:
    "Localization example - translate the time picker UI for any language in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste code.",
  alternates: {
    canonical: "/examples/advanced/localization",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/localization" />
      {children}
    </>
  );
}
