import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Selection Events Example",
  description:
    "React time picker selection events - handle hour, minute and AM/PM selection in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  path: "/react/examples/callbacks/selection",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/selection" />
      {children}
    </>
  );
}
