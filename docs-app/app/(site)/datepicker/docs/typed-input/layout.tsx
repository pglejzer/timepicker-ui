import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Typed Input, Format and Mask",
  description:
    "Let users type dates into @pglejzer/datepicker-ui, set the format and mask, and validate the value. A date picker companion of timepicker-ui.",
  path: "/datepicker/docs/typed-input",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/typed-input" />
      {children}
    </>
  );
}
