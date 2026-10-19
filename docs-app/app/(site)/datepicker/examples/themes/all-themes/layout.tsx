import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Themes Example",
  description:
    "Preview all ten themes and switch between them live. Live demo for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/examples/themes/all-themes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/themes/all-themes" />
      {children}
    </>
  );
}
