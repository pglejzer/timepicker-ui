import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React onUpdate Example",
  description:
    "React time picker onUpdate - react to live time changes via the onUpdate callback in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  alternates: {
    canonical: "/react/examples/controlled/on-update",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/controlled/on-update" />
      {children}
    </>
  );
}
