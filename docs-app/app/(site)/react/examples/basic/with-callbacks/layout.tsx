import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Time Picker With Callbacks",
  description:
    "React time picker with callbacks - handle onConfirm, onCancel and selection events in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with JSX.",
  alternates: {
    canonical: "/react/examples/basic/with-callbacks",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/basic/with-callbacks" />
      {children}
    </>
  );
}
