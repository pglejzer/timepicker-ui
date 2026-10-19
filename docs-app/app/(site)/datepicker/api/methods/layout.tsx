import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Methods",
  description:
    "Methods of @pglejzer/datepicker-ui, the companion of timepicker-ui: create, open, close, destroy, getValue, setValue, setOptions, setActiveEnd and statics.",
  path: "/datepicker/api/methods",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/methods" />
      {children}
    </>
  );
}
