import { SoftwareApplicationJsonLd } from "@/components/json-ld";
import { MobileMenu } from "@/components/mobile-menu";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <SiteHeader />
      <MobileMenu />
      {children}
      <SiteFooter />
    </>
  );
}
