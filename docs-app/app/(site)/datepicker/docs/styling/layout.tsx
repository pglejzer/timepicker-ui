import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Custom Styling",
  description:
    "Restyle @pglejzer/datepicker-ui, the timepicker-ui date picker companion, with --dp-ui-* variables, dp-ui__* classes and ui.cssClass for one picker.",
  path: "/datepicker/docs/styling",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/styling" />
      {children}
    </>
  );
}
