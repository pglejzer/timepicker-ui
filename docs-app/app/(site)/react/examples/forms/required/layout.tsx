import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Required Field Example",
  description:
    "React required time field - make the time picker a required form input in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/forms/required",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/forms/required" />
      {children}
    </>
  );
}
