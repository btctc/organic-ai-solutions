import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const SITE_URL = "https://organic-ai-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Our Team — Organic AI Solutions",
  description:
    "Grow Organically. Scale Intelligently. Learn about Organic AI Solutions — AI built for every business, from solo operators to growing teams, across every industry.",
  openGraph: {
    title: "Our Team — Organic AI Solutions",
    description:
      "Meet the team behind Organic AI Solutions. AI built for every business, from solo operators to growing teams.",
    url: `${SITE_URL}/about`,
    siteName: "Organic AI Solutions",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Organic AI Solutions — Grow Organically. Scale Intelligently.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team — Organic AI Solutions",
    description:
      "Meet the team behind Organic AI Solutions. AI built for every business, from solo operators to growing teams.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

const team = [
  {
    name: "Terrence Crawford",
    title: "Co-Founder & CEO",
    initials: "TC",
    bio: `Terrence Crawford is a serial entrepreneur, dealmaker, and business builder with hands-on experience across real estate, retail, service industries, and trucking. He knows what it takes to build something from nothing — because he has done it multiple times across multiple industries.

A licensed Realtor and active real estate developer, Terrence brings sharp instincts for opportunity, negotiation, and growth. He holds a Marketing degree from Oklahoma State University, giving him a strong foundation in brand strategy, customer acquisition, and market positioning. As a C3 Bitcoin Specialist, he has an early adopter's understanding of digital assets and blockchain technology — a rare edge that positions Organic AI Solutions at the forefront of both traditional business and emerging tech.

What sets Terrence apart is not just what he knows — it is that he is still in the game. He is not a consultant who has never run a business. He is an operator who has navigated the real challenges that small and mid-sized businesses face every day — cash flow, growth, competition, and staying ahead of change.

That experience is exactly why he founded Organic AI Solutions. He saw firsthand how powerful AI tools were transforming large enterprises and knew that small businesses deserved the same advantage. His vision is simple: level the playing field and help everyday business owners grow smarter, run leaner, and scale faster with AI.`,
  },
  {
    name: "Diego Kennedy Templeton",
    title: "Co-Founder & CTO",
    initials: "DT",
    bio: `Diego Kennedy Templeton is an Agentic AI Engineer and technologist with a proven track record building intelligent systems at enterprise scale. His career spans roles as a Data and AI Analyst, Consultant, and Financial Analyst, giving him a rare combination of technical depth and real business acumen.

He has hands-on experience analyzing complex datasets, building AI-driven solutions, and advising organizations on technology strategy across Fortune 500-level environments. Diego holds a Bachelor of Science from Grambling State University and has spent his career at the cutting edge of artificial intelligence, data engineering, and enterprise technology.

As CTO of Organic AI Solutions, Diego leads all technical development and AI architecture — translating enterprise-grade AI capabilities into practical, affordable solutions for small and mid-sized businesses. His mission is simple: bring the same powerful AI tools used by the world's largest companies to the businesses that need them most.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>

        {/* ── Mission ──────────────────────────────────────────────── */}
        <section
          aria-labelledby="mission-heading"
          className="bg-white pt-32 pb-20 px-6 lg:px-10"
        >
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] text-neutral-500">
                <li>
                  <Link href="/" className="hover:text-neutral-800 transition-colors underline underline-offset-2">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-neutral-300">›</li>
                <li aria-current="page" className="text-neutral-800 font-medium">About</li>
              </ol>
            </nav>

            <p
              className="font-[family-name:var(--font-montserrat)] text-[#C73D09] text-xs font-semibold tracking-widest uppercase mb-4"
              aria-hidden="true"
            >
              About Us
            </p>

            <h1
              id="mission-heading"
              className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight max-w-4xl mb-4"
            >
              We Believe Every Business Deserves Powerful AI
            </h1>
            <p className="font-[family-name:var(--font-montserrat)] font-bold text-[#E8420A] text-2xl md:text-[32px] leading-tight mb-10">
              Grow Organically. Scale Intelligently.
            </p>

            <div className="max-w-3xl">
              <p className="font-[family-name:var(--font-dm-sans)] text-lg text-neutral-700 leading-relaxed">
                At Organic AI Solutions our mission is simple. We believe every business deserves access to powerful AI technology — regardless of size, industry, or budget. Whether you have a single great idea or a growing operation, we build practical intelligent solutions that help you{" "}
                <strong className="text-[#E8420A]">Grow Organically and Scale Intelligently.</strong>
              </p>
            </div>

            {/* Mission stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
              {[
                { value: "5–500", label: "Employees — our sweet spot" },
                { value: "6", label: "Core AI service areas" },
                { value: "24 hrs", label: "Audit response turnaround" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-6"
                >
                  <div className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold text-neutral-900">
                    {s.value}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-neutral-600 mt-1 text-sm leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <div className="bg-neutral-100 h-px max-w-7xl mx-auto" aria-hidden="true" />

        {/* ── Team ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="team-heading"
          className="bg-white py-20 px-6 lg:px-10"
        >
          <div className="max-w-7xl mx-auto">
            <p
              className="font-[family-name:var(--font-montserrat)] text-[#C73D09] text-xs font-semibold tracking-widest uppercase mb-4"
              aria-hidden="true"
            >
              The Team
            </p>
            <h2
              id="team-heading"
              className="font-[family-name:var(--font-montserrat)] text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-16"
            >
              Meet the Founders
            </h2>

            <div className="space-y-16">
              {team.map((member) => (
                <article
                  key={member.name}
                  aria-labelledby={`team-${member.initials}`}
                  className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start pb-16 border-b border-neutral-100 last:border-0 last:pb-0"
                >
                  {/* Avatar + name card */}
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div
                      className="w-28 h-28 rounded-2xl bg-[#C73D09] flex items-center justify-center mb-5 shrink-0"
                      aria-hidden="true"
                    >
                      <span className="font-[family-name:var(--font-montserrat)] text-white font-extrabold text-3xl">
                        {member.initials}
                      </span>
                    </div>
                    <h3
                      id={`team-${member.initials}`}
                      className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-neutral-900"
                    >
                      {member.name}
                    </h3>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[#C73D09] font-semibold text-sm mt-1">
                      {member.title}
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-4">
                    {member.bio.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="font-[family-name:var(--font-dm-sans)] text-neutral-700 leading-relaxed text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Work With Us ─────────────────────────────────────────── */}
        <section
          aria-labelledby="work-with-us-heading"
          className="bg-neutral-50 py-20 px-6 lg:px-10"
        >
          <div className="max-w-7xl mx-auto text-center">
            <p
              className="font-[family-name:var(--font-montserrat)] text-[#C73D09] text-xs font-semibold tracking-widest uppercase mb-4"
              aria-hidden="true"
            >
              Let&rsquo;s Build Together
            </p>
            <h2
              id="work-with-us-heading"
              className="font-[family-name:var(--font-montserrat)] text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6"
            >
              Work With Us
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-neutral-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Ready to unlock the power of AI for your business? We&rsquo;d love to hear from you.
              Book a free discovery call and let&rsquo;s explore what&rsquo;s possible together.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#C73D09] text-white font-semibold font-[family-name:var(--font-montserrat)] text-base hover:bg-[#a32d07] transition-colors shadow-md shadow-orange-200 min-h-[44px]"
              aria-label="Contact us — go to the contact form on the homepage"
            >
              Get in Touch
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
