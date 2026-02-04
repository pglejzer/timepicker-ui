import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "timepicker-ui/index.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SimpleMobileSidebar } from "@/components/simple-mobile-sidebar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timepicker-UI - Modern Time Picker Library",
  description:
    "Modern, accessible, and customizable time picker for web applications. Built with TypeScript, supports 12h/24h formats, themes, inline mode, and mobile devices.",
  keywords: [
    "timepicker",
    "time picker",
    "react",
    "typescript",
    "ui library",
    "component",
    "vue component",
    "angular component",
    "web component",
    "customizable",
  ],
  authors: [{ name: "Piotr Glejzer" }],
  openGraph: {
    title: "Timepicker-UI",
    description: "Modern time picker library for web applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <SimpleMobileSidebar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
