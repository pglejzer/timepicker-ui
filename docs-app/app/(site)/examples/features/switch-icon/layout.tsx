import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Switch Icon Example",
  description:
    "Switch icon example - toggle the keyboard/clock switch icon on timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/features/switch-icon",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/switch-icon" />
      {children}
    </>
  );
}
