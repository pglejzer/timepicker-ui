import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Current Time Example",
  description:
    "Current time example - preload the time picker with the user's current time in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  path: "/examples/features/current-time",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/current-time" />
      {children}
    </>
  );
}
