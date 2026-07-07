import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Getting Started Example",
  description:
    "Get a working timepicker-ui in minutes - the simplest analog clock time picker setup, zero dependencies and SSR-safe, with copy-paste HTML and JavaScript.",
  path: "/examples/basic/getting-started",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/basic/getting-started" />
      {children}
    </>
  );
}
