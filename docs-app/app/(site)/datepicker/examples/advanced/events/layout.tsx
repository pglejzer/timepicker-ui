import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Events Example",
  description:
    "Watch every picker event arrive in a live log. Live demo for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/examples/advanced/events",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/advanced/events" />
      {children}
    </>
  );
}
