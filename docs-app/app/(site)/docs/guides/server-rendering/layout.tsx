import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/guides/server-rendering" />
      <JsonLdTechArticle
        pathname="/docs/guides/server-rendering"
        headline="Server Rendering"
        description="Use timepicker-ui with Next.js, Nuxt and SvelteKit: create the picker on the client and destroy it on unmount."
      />
      {children}
    </>
  );
}
