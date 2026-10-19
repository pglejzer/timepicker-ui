import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Display Modes",
  description:
    "Choose how @pglejzer/datepicker-ui, the date picker companion of timepicker-ui, opens: docked popover, modal dialog or inline calendar.",
  path: "/datepicker/docs/display-modes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/display-modes" />
      {children}
    </>
  );
}
