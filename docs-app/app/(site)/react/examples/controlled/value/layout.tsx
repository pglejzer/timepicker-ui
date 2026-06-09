import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Controlled Value Example",
  description:
    "React controlled time picker - bind the selected time to React state in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/controlled/value",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/controlled/value" />
      {children}
    </>
  );
}
