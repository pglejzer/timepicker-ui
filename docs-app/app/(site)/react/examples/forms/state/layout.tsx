import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Form State Example",
  description:
    "React time picker form state - integrate timepicker-ui-react with form state and submission. Zero-dependency, SSR-safe and fully typed for React, with JSX.",
  path: "/react/examples/forms/state",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/forms/state" />
      {children}
    </>
  );
}
