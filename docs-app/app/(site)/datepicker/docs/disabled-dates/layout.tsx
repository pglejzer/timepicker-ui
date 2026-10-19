import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Disabled Dates and Limits",
  description:
    "Limit selectable days in @pglejzer/datepicker-ui, the companion of timepicker-ui, with minDate, maxDate, disabled weekdays and isDateDisabled.",
  path: "/datepicker/docs/disabled-dates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/disabled-dates" />
      {children}
    </>
  );
}
