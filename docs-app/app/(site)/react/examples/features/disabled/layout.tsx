import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "React Disabled State Example",
  description:
    "React disabled time picker - disable the input or block specific times in timepicker-ui-react. Zero-dependency, SSR-safe and fully typed, with copy-paste JSX.",
  alternates: {
    canonical: "/react/examples/features/disabled",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/features/disabled" />
      {children}
    </>
  );
}
