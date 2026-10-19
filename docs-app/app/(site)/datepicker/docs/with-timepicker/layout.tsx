import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date and Time Picker with timepicker-ui",
  description:
    "Combine @pglejzer/datepicker-ui and timepicker-ui into one date and time value: shared theme names, two fields and an ISO datetime string.",
  path: "/datepicker/docs/with-timepicker",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/with-timepicker" />
      {children}
    </>
  );
}
