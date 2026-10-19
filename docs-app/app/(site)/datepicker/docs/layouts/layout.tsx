import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Layouts and Fields",
  description:
    "Show several months, range presets, two fields for a range and per-day content such as prices in @pglejzer/datepicker-ui, the timepicker-ui companion.",
  path: "/datepicker/docs/layouts",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/layouts" />
      {children}
    </>
  );
}
