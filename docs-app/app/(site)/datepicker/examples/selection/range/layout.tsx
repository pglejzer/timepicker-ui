import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Range Picker Example",
  description:
    "Pick a start and an end date with @pglejzer/datepicker-ui, the companion of timepicker-ui, in a docked popover or a full screen modal on phones.",
  path: "/datepicker/examples/selection/range",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/selection/range" />
      {children}
    </>
  );
}
