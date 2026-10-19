import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Min and Max Date Example",
  description:
    "Restrict selectable days with minDate and maxDate in @pglejzer/datepicker-ui, the companion of timepicker-ui, using today or fixed ISO date strings.",
  path: "/datepicker/examples/constraints/min-max",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/constraints/min-max" />
      {children}
    </>
  );
}
