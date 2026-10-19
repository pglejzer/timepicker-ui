import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Selection Modes",
  description:
    "Select one date, a range or several dates with @pglejzer/datepicker-ui, the companion of timepicker-ui, and read the value with getValue().",
  path: "/datepicker/docs/selection-modes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/selection-modes" />
      {children}
    </>
  );
}
