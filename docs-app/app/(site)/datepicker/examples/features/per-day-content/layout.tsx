import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Per-day Content Example",
  description:
    "Show a price or any text inside each day with renderDate. Live demo for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/examples/features/per-day-content",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/features/per-day-content" />
      {children}
    </>
  );
}
