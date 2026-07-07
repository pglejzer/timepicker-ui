import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React Form Validation Example",
  description:
    "React time picker form validation - validate the selected time in a React form with timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  path: "/react/examples/forms/validation",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/forms/validation" />
      {children}
    </>
  );
}
