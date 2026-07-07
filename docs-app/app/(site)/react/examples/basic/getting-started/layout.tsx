import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Getting Started Example",
  description:
    "React time picker getting-started example - add timepicker-ui-react to a component in minutes. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  path: "/react/examples/basic/getting-started",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/basic/getting-started" />
      {children}
    </>
  );
}
