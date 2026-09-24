import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "0day Security — We break in before they do.",
  description:
    "Boutique offensive security lab. VAPT, red teaming, AppSec, cloud, compliance & IR. Manually validated findings, CVE-credited researchers. Delhi + Remote. Est. 2021.",
  openGraph: {
    title: "0day Security — Offensive Security Lab",
    description: "Serious security for serious businesses. From day zero.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#08080a] scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fallback system fonts if Google blocked - will use anonymous pro & roboto mono if available */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');
          :root {
            --font-anonymous-pro: 'Anonymous Pro', ui-monospace, monospace;
            --font-roboto-mono: 'Roboto Mono', ui-monospace, monospace;
            --font-instrument: 'Anonymous Pro', monospace;
          }
        `}</style>
      </head>
      <body className="bg-[#08080a] text-[#ececec] antialiased selection:bg-[#de5cff] selection:text-black grain vignette">
        {children}
      </body>
    </html>
  );
}
