import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Docked Date Picker Example",
  description:
    "Open @pglejzer/datepicker-ui, the companion of timepicker-ui, as a docked popover under the input, with and without a Today button in the footer.",
  path: "/datepicker/examples/basic/docked",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/basic/docked" />
      {children}
    </>
  );
}
