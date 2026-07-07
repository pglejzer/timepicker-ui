import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React All Events Example",
  description:
    "React time picker all events - wire up every lifecycle and selection callback in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  path: "/react/examples/callbacks/all-events",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/all-events" />
      {children}
    </>
  );
}
