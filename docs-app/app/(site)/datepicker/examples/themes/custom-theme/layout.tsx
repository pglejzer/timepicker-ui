import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Custom Theme Example",
  description:
    "Build your own look with ui.cssClass and CSS variables. Live demo for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/examples/themes/custom-theme",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/themes/custom-theme" />
      {children}
    </>
  );
}
