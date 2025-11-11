import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "timepicker-ui/index.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

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
  console.log(
    `%c
████████╗██╗███╗   ███╗███████╗██████╗ ██╗ ██████╗███████╗██████╗ 
╚══██╔══╝██║████╗ ████║██╔════╝██╔══██╗██║██╔════╝██╔════╝██╔══██╗
   ██║   ██║██╔████╔██║█████╗  ██████╔╝██║██║     █████╗  ██████╔╝
   ██║   ██║██║╚██╔╝██║██╔══╝  ██╔═══╝ ██║██║     ██╔══╝  ██╔══██╗
   ██║   ██║██║ ╚═╝ ██║███████╗██║     ██║╚██████╗███████╗██║  ██║
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝
                    T I M E P I C K E R - U I                  

✨ Because native <input type="time"> is illegal.
🤫 Shh... it just wraps <input>. But damn it looks good.
👉 github.com/pglejzer/timepicker-ui
`,
    "color: #00BCD4; font-weight: bold; font-family: monospace; font-size: 11px;"
  );

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
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
