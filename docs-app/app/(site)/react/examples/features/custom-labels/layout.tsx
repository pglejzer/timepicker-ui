import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Custom Labels Example",
  description:
    "React custom labels time picker - localize OK, Cancel and AM/PM text in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  path: "/react/examples/features/custom-labels",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/features/custom-labels" />
      {children}
    </>
  );
}
