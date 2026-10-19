import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Disabled Dates Example",
  description:
    "Disable weekends, listed dates or a custom rule in @pglejzer/datepicker-ui, the companion of timepicker-ui, or allow only an explicit list of days.",
  path: "/datepicker/examples/constraints/disabled-dates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/constraints/disabled-dates" />
      {children}
    </>
  );
}
