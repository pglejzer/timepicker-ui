import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Inline Date Picker Example",
  description:
    "Render the @pglejzer/datepicker-ui calendar inline in a page container, the companion of timepicker-ui, with ui.inline and an optional footer.",
  path: "/datepicker/examples/basic/inline",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/basic/inline" />
      {children}
    </>
  );
}
