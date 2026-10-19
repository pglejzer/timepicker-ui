import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Localization and RTL",
  description:
    "Set the locale, week start and labels of @pglejzer/datepicker-ui, the companion of timepicker-ui. Any Intl locale and RTL are supported.",
  path: "/datepicker/docs/localization",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/datepicker/docs/localization" />
      {children}
    </>
  );
}
