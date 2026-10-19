import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Accessibility",
  description:
    "Keyboard shortcuts, ARIA roles, focus handling and reduced motion in @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/docs/accessibility",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/accessibility" />
      {children}
    </>
  );
}
