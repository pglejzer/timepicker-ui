import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Selection Events Example",
  description:
    "React time picker selection events - handle hour, minute and AM/PM selection in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  alternates: {
    canonical: "/react/examples/callbacks/selection",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/selection" />
      {children}
    </>
  );
}
