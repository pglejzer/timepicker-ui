import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React onCancel Example",
  description:
    "React time picker onCancel - respond when the user dismisses the picker in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  path: "/react/examples/callbacks/on-cancel",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/callbacks/on-cancel" />
      {children}
    </>
  );
}
