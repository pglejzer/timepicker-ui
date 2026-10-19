import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Quick Start",
  description:
    "Build your first @pglejzer/datepicker-ui date picker, the companion of timepicker-ui, with one input and one call, plus React, Vue, Svelte and Angular setups.",
  path: "/datepicker/quick-start",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/quick-start" />
      {children}
    </>
  );
}
