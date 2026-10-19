import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker with React, Vue, Svelte and Angular",
  description:
    "Use @pglejzer/datepicker-ui, the companion of timepicker-ui, in React, Next.js, Vue, Svelte and Angular: create on mount, destroy on unmount.",
  path: "/datepicker/docs/frameworks",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/frameworks" />
      {children}
    </>
  );
}
