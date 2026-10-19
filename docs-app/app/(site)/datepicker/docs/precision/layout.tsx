import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Month and Year Date Picker",
  description:
    "Pick a whole month or year instead of a day with calendar.precision in @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/docs/precision",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/precision" />
      {children}
    </>
  );
}
