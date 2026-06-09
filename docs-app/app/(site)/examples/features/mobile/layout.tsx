import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Mobile Version Example",
  description:
    "Mobile time picker example - touch-optimized timepicker-ui with a native-style mobile view. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/features/mobile",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/mobile" />
      {children}
    </>
  );
}
