import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "datepicker-ui Kit for Companion Packages",
  description:
    "The kit entry of @pglejzer/datepicker-ui, the timepicker-ui companion, exports surface hosts, color scheme detection and date parsing helpers.",
  path: "/datepicker/docs/kit",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/kit" />
      {children}
    </>
  );
}
