import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Required Field Example",
  description:
    "React required time field - make the time picker a required form input in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  path: "/react/examples/forms/required",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/forms/required" />
      {children}
    </>
  );
}
