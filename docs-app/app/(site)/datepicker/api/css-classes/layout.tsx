import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker CSS Classes",
  description:
    "Every dp-ui class, modifier and data attribute that @pglejzer/datepicker-ui renders, with the element each one styles. Companion of timepicker-ui.",
  path: "/datepicker/api/css-classes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/css-classes" />
      {children}
    </>
  );
}
