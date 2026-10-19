import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Validation Example",
  description:
    "Validate a date with calendar.validate in @pglejzer/datepicker-ui, the companion of timepicker-ui, and show the error message next to the field.",
  path: "/datepicker/examples/constraints/validation",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/constraints/validation" />
      {children}
    </>
  );
}
