import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Multiple Pickers Example",
  description:
    "React multiple time pickers - manage several controlled timepicker-ui-react instances in one component. Zero-dependency, SSR-safe and fully typed, with JSX.",
  path: "/react/examples/controlled/multiple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/controlled/multiple" />
      {children}
    </>
  );
}
