import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (OFL-licensed) so builds never depend on Google Fonts.
const anonymousPro = localFont({
  src: [
    {
      path: "../fonts/anonymous-pro-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/anonymous-pro-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-anonymous-pro",
  display: "swap",
});

const robotoMono = localFont({
  src: [
    {
      path: "../fonts/roboto-mono-latin-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/roboto-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/roboto-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/roboto-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = "https://0daysecurity.tech";
const SITE_TITLE = "0DAY Research Team — Offensive Security, VAPT & Red Teaming";
const SITE_DESCRIPTION =
  "Penetration testing, red teaming, application security, compliance advisory, security awareness and incident response from 0DAY Research Team — backed by 10+ published CVEs and 100+ Hall of Fame recognitions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — 0DAY Research Team",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "penetration testing",
    "VAPT",
    "red teaming",
    "application security",
    "API security",
    "bug bounty",
    "security compliance",
    "incident response",
    "0DAY Research Team",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "0DAY Research Team",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "0DAY Research Team — offensive security, backed by published CVE and Hall of Fame research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anonymousPro.variable} ${robotoMono.variable} dark bg-black scroll-smooth`}
    >
      <body className="bg-black text-white antialiased selection:bg-[#de5cff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
