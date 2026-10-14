import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Mobile Version Example",
  description:
    "Examples of the keyboard view in timepicker-ui (ui.initialView), where users type the time: custom labels, the view switch, and 24h format.",
  path: "/examples/features/mobile",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/mobile" />
      {children}
    </>
  );
}
