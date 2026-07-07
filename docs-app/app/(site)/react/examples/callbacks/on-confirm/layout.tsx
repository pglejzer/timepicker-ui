import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React onConfirm Example",
  description:
    "React time picker onConfirm - capture the confirmed time when the user clicks OK in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  path: "/react/examples/callbacks/on-confirm",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/on-confirm" />
      {children}
    </>
  );
}
