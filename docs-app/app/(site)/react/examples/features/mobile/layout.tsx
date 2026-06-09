import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Mobile Mode Example",
  description:
    "React mobile time picker - touch-optimized mobile view with timepicker-ui-react. Zero-dependency, SSR-safe and fully typed for React, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/features/mobile",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/features/mobile" />
      {children}
    </>
  );
}
