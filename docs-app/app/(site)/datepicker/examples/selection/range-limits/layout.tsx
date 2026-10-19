import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Range Length Limits Example",
  description:
    "Limit a range to 3 to 14 days with range.minLength and maxLength in @pglejzer/datepicker-ui, the companion of timepicker-ui, and combine it with minDate.",
  path: "/datepicker/examples/selection/range-limits",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/selection/range-limits" />
      {children}
    </>
  );
}
