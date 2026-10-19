import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Events",
  description:
    "Events of @pglejzer/datepicker-ui, the timepicker-ui companion: payloads, when each fires, navigate sources, error codes and the matching callbacks.",
  path: "/datepicker/api/events",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/api/events" />
      {children}
    </>
  );
}
