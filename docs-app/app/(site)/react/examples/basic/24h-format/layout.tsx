import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "React 24-Hour Format Example",
  description:
    "React time picker in 24-hour format - configure timepicker-ui-react for 24h clock. Zero-dependency, SSR-safe and fully typed for React, with copy-paste JSX.",
  path: "/react/examples/basic/24h-format",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/react/examples/basic/24h-format" />
      {children}
    </>
  );
}
