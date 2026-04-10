import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";

import ChatWidget from "@/components/landing/ChatWidget";
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Organic AI Solutions — AI Optimization for Real Businesses",
  description:
    "We help small and mid-sized businesses harness AI automation, workflow optimization, and data insights to grow faster and work smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${dmSans.variable} antialiased`}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
