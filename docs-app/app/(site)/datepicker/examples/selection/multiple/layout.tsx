import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Multiple Dates Picker Example",
  description:
    "Select any number of dates with @pglejzer/datepicker-ui, the companion of timepicker-ui, cap the count with multiple.max and plural headline labels.",
  path: "/datepicker/examples/selection/multiple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/selection/multiple" />
      {children}
    </>
  );
}
