import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker TypeScript Types",
  description:
    "TypeScript types of @pglejzer/datepicker-ui, the timepicker-ui companion: DatepickerOptions, PickerValue, DatepickerEventMap, and narrowing values by mode.",
  path: "/datepicker/api/typescript",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/typescript" />
      {children}
    </>
  );
}
