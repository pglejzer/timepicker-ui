import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SimpleMobileSidebar } from "@/components/simple-mobile-sidebar";
import { SoftwareApplicationJsonLd } from "@/components/json-ld";

/**
 * Site chrome layout.
 *
 * This is a route-group layout - the `(site)` parentheses mean it does NOT add
 * a URL segment, so paths like `/`, `/docs`, `/examples`, `/react` and
 * `/bundle-stats` are unchanged. It wraps every real content page with the
 * header, mobile sidebar, footer and structured data.
 *
 * The global 404 (`app/not-found.tsx`) lives OUTSIDE this group, so it renders
 * directly under the slim root layout - no header/footer, a single scrollbar.
 *
 * Nested layout: it emits no `<html>`/`<body>` (those stay in the root layout),
 * just the chrome around `{children}`.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <Header />
      <SimpleMobileSidebar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}

