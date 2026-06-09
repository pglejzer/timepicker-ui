import type { Metadata } from "next";

// This layout wraps every /react/examples/** route, so it only carries the
// section-index metadata. BreadcrumbList JSON-LD is emitted by each leaf
// route's own layout to avoid duplicate breadcrumbs on nested pages.
export const metadata: Metadata = {
  // Branded template for the whole /react/examples section so leaf routes
  // render "<Leaf> - timepicker-ui" instead of dropping the brand.
  title: {
    default: "React Time Picker Examples",
    template: "%s - timepicker-ui",
  },
  description:
    "React time picker examples for timepicker-ui-react - controlled value, callbacks, themes, forms and features. Zero-dependency, SSR-safe and fully typed.",
  alternates: {
    canonical: "/react/examples",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
