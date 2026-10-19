import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Options",
  description:
    "All @pglejzer/datepicker-ui options in the calendar, ui, labels, behavior and callbacks groups, with types and defaults. Companion of timepicker-ui.",
  path: "/datepicker/api/options",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/options" />
      {children}
    </>
  );
}
