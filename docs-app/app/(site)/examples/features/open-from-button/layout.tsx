import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Open From a Button Example",
  description:
    "Open timepicker-ui from an icon button with data-open while the input stays a normal text field you can type in. Zero-dependency and SSR-safe, with HTML and React code.",
  path: "/examples/features/open-from-button",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/open-from-button" />
      {children}
    </>
  );
}
