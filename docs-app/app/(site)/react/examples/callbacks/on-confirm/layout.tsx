import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React onConfirm Example",
  description:
    "React time picker onConfirm - capture the confirmed time when the user clicks OK in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  alternates: {
    canonical: "/react/examples/callbacks/on-confirm",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/on-confirm" />
      {children}
    </>
  );
}
