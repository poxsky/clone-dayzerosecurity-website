import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anonymous_Pro, Roboto_Mono } from "next/font/google";
import "./globals.css";

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-anonymous-pro",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "0day Security — Cybersecurity Services, VAPT & Red Teaming",
  description:
    "0day Security Team: VAPT, red teaming, application security, compliance advisory, security awareness training and incident response. Hall of Fame and CVE credited offensive security researchers.",
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
