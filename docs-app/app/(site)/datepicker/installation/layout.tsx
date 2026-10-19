import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Installation",
  description:
    "Install @pglejzer/datepicker-ui, the date picker companion of timepicker-ui, with npm, yarn, pnpm or a CDN, then import index.css or one theme file.",
  path: "/datepicker/installation",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/installation" />
      {children}
    </>
  );
}
