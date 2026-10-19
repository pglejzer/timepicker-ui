import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Range With Two Fields Example",
  description:
    "Use two inputs for a check-in and check-out range with @pglejzer/datepicker-ui, the companion of timepicker-ui, via the ui.endInput option.",
  path: "/datepicker/examples/selection/two-fields",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/selection/two-fields" />
      {children}
    </>
  );
}
