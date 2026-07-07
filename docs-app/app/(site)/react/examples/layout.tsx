import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

// This layout wraps every /react/examples/** route, so it only carries the
// section-index metadata. BreadcrumbList JSON-LD is emitted by each leaf
// route's own layout to avoid duplicate breadcrumbs on nested pages.
// section: true re-establishes the branded title template so leaf routes
// render "<Leaf> - timepicker-ui" instead of dropping the brand.
export const metadata: Metadata = buildMetadata({
  title: "React Time Picker Examples",
  section: true,
  description:
    "React time picker examples for timepicker-ui-react - controlled value, callbacks, themes, forms and features. Zero-dependency, SSR-safe and fully typed.",
  path: "/react/examples",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
