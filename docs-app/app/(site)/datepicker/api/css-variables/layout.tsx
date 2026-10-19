import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker CSS Variables",
  description:
    "Every --dp-ui CSS variable of @pglejzer/datepicker-ui, the timepicker-ui companion, with default values, plus a custom theme example you can try live.",
  path: "/datepicker/api/css-variables",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/css-variables" />
      {children}
    </>
  );
}
