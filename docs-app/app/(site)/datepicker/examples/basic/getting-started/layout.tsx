import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Getting Started Example",
  description:
    "Create a date picker with @pglejzer/datepicker-ui, the companion of timepicker-ui: a default picker and one that writes the confirmed value into the page.",
  path: "/datepicker/examples/basic/getting-started",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/basic/getting-started" />
      {children}
    </>
  );
}
