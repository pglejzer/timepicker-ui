import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Modal Date Picker Example",
  description:
    "Show the @pglejzer/datepicker-ui calendar in a modal dialog, the companion of timepicker-ui, and open it on the text input view with initialView.",
  path: "/datepicker/examples/basic/modal",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/basic/modal" />
      {children}
    </>
  );
}
