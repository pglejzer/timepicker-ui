import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker External API Example",
  description:
    "Drive the picker from your code with open, setValue and getValue. Live demo for @pglejzer/datepicker-ui, the date picker companion of timepicker-ui.",
  path: "/datepicker/examples/advanced/external-api",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/examples/advanced/external-api" />
      {children}
    </>
  );
}
