import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Range Presets Example",
  description:
    "Add ready-made ranges such as Last 7 days to a @pglejzer/datepicker-ui range picker, the companion of timepicker-ui, docked and in a modal.",
  path: "/datepicker/examples/selection/range-presets",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/selection/range-presets" />
      {children}
    </>
  );
}
