import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Custom Styled Date Picker Example",
  description:
    "Five restyled date pickers with CSS and JS: brand, soft, dense, high contrast and dark. Live demos for @pglejzer/datepicker-ui, the timepicker-ui companion.",
  path: "/datepicker/examples/advanced/custom-styling",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/advanced/custom-styling" />
      {children}
    </>
  );
}
