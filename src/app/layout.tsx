import type { Metadata } from "next";
import { Montserrat, DM_Sans, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://organicaisolutions.ai"),
  title: {
    default: "Organic AI Solutions — AI Agents Your Business Can Run On",
    template: "%s | Organic AI Solutions",
  },
  description:
    "Organic AI Solutions is a Dallas-based AI consulting firm that deploys production AI agents and AI-native websites for small and mid-sized businesses. Built by operators with enterprise-grade experience.",
  keywords: ["AI consulting", "AI agents", "Dallas AI", "AI deployment", "small business AI"],
  authors: [{ name: "Terrence Crawford" }, { name: "Diego Kennedy Templeton" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://organicaisolutions.ai",
    siteName: "Organic AI Solutions",
    title: "AI Agents Your Business Can Run On",
    description:
      "Production AI agent deployments and AI-native websites for small and mid-sized businesses.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Organic AI Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic AI Solutions",
    description: "AI agents your business can actually run on.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${dmSans.variable} ${fraunces.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://organicaisolutions.ai/#organization",
                  name: "Organic AI Solutions",
                  url: "https://organicaisolutions.ai",
                  description:
                    "Dallas-based AI consulting firm that deploys production AI agents and AI-native websites for small and mid-sized businesses.",
                  founder: [
                    { "@type": "Person", name: "Terrence Crawford", jobTitle: "CEO & Co-founder" },
                    {
                      "@type": "Person",
                      name: "Diego Kennedy Templeton",
                      jobTitle: "CTO & Co-founder",
                    },
                  ],
                  areaServed: { "@type": "Place", name: "United States" },
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Dallas",
                    addressRegion: "TX",
                    addressCountry: "US",
                  },
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://organicaisolutions.ai/#service",
                  name: "AI Consulting and Agent Deployment",
                  provider: { "@id": "https://organicaisolutions.ai/#organization" },
                  serviceType: "AI Consulting",
                  areaServed: "United States",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://organicaisolutions.ai/#website",
                  url: "https://organicaisolutions.ai",
                  name: "Organic AI Solutions",
                  publisher: { "@id": "https://organicaisolutions.ai/#organization" },
                },
              ],
            }),
          }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
