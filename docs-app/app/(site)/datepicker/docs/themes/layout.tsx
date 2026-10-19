import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Themes",
  description:
    "Ten themes for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui, with light and dark modes, CSS files and a custom theme.",
  path: "/datepicker/docs/themes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/themes" />
      {children}
    </>
  );
}
