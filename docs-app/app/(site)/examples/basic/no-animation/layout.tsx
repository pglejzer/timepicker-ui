import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Without Animation Example",
  description:
    "Disable open/close animations on the time picker - an instant, motion-free timepicker-ui setup. Zero-dependency and SSR-safe, with copy-paste example code.",
  path: "/examples/basic/no-animation",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/basic/no-animation" />
      {children}
    </>
  );
}
