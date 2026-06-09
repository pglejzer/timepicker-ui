import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Clear Button Example",
  description:
    "Clear button example - add a reset button to clear the selected time in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/features/clear-button",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/clear-button" />
      {children}
    </>
  );
}
