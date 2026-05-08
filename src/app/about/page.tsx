import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CursorGlow from "@/components/CursorGlow";
import HeroParticles from "@/components/HeroParticles";

const SITE_URL = "https://organicaisolutions.ai";

export const metadata: Metadata = {
  title: "About Organic AI Solutions — Operator-Built AI Systems",
  description:
    "Learn how Organic AI Solutions builds production AI agents and AI-native websites for operators who need working software, not strategy decks.",
  openGraph: {
    title: "About Organic AI Solutions — Operator-Built AI Systems",
    description:
      "Meet the team building production AI systems for operators who need software that runs inside the business.",
    url: `${SITE_URL}/about`,
    siteName: "Organic AI Solutions",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Organic AI Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Organic AI Solutions",
    description:
      "Operator-built AI systems. Working software, not strategy decks.",
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
      <CursorGlow />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="overflow-x-hidden bg-white">
        <section
          aria-labelledby="mission-heading"
          className="relative overflow-hidden bg-white px-6 pb-24 pt-32 lg:px-10 md:py-32"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-[700px] w-[700px] translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-bl from-orange-50 via-white to-white"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-orange-50 to-white"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="max-w-3xl">
                <nav aria-label="Breadcrumb" className="mb-8">
                  <ol className="flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] text-neutral-500">
                    <li>
                      <Link href="/" className="underline underline-offset-2 transition-colors hover:text-neutral-800">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-neutral-300">/</li>
                    <li aria-current="page" className="font-medium text-neutral-800">About</li>
                  </ol>
                </nav>

                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold uppercase tracking-wide text-tertiary">
                    About Organic AI Solutions
                  </span>
                </div>

                <h1
                  id="mission-heading"
                  className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
                >
                  AI systems built by operators, for operators.
                </h1>

                <p className="mt-5 font-[family-name:var(--font-dm-sans)] text-xl leading-snug text-neutral-400 md:text-2xl">
                  Grow Organically. Scale Intelligently.
                </p>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-muted md:text-xl">
                  Organic AI Solutions builds production agents and AI-native websites that take work off the floor and put it into software operators can trust.
                </p>
              </div>

              <div className="relative hidden aspect-square min-h-[420px] max-h-[560px] items-center justify-center lg:flex">
                <HeroParticles />
                <div className="relative z-10">
                  <Image
                    src="/oas-logo-3d.png"
                    alt="Organic AI Solutions logo"
                    width={500}
                    height={470}
                    priority
                    className="h-auto w-full max-w-[440px] select-none animate-hero-logo-pulse"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                {
                  heading: "Builder-led",
                  body: "The work is scoped by people who have run businesses and built systems, not by a strategy deck passed between meetings.",
                },
                {
                  heading: "Software first",
                  body: "The outcome is a working agent, website, or operational tool in the environment where the work already happens.",
                },
                {
                  heading: "Scoped before quoted",
                  body: "Every build starts with the work itself: what breaks, what repeats, what gets missed, and what should run without being chased.",
                },
              ].map((pillar) => (
                <div key={pillar.heading} className="border-t border-neutral-200 pt-6">
                  <div className="mb-5 h-px w-12 bg-tertiary" />
                  <h2 className="font-display text-2xl text-on-surface md:text-3xl">{pillar.heading}</h2>
                  <p className="mt-3 text-base leading-relaxed text-on-surface-muted">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="team-heading"
          className="relative overflow-hidden bg-[#0A0A0F] px-6 py-24 text-white lg:px-10 md:py-32"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-tertiary/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl">
            <p className="mb-4 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-widest text-tertiary">
              The Team
            </p>
            <h2
              id="team-heading"
              className="mb-16 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl"
            >
              Meet the Founders
            </h2>

            <div className="space-y-8">
              {team.map((member) => (
                <article
                  key={member.name}
                  aria-labelledby={`team-${member.initials}`}
                  className="grid grid-cols-1 items-start gap-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur lg:grid-cols-[280px_1fr] lg:p-8"
                >
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div
                      className="mb-5 flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-tertiary/40 bg-tertiary/20 shadow-[0_0_32px_rgba(181,66,27,0.22)]"
                      aria-hidden="true"
                    >
                      <span className="font-display text-3xl text-white">
                        {member.initials}
                      </span>
                    </div>
                    <h3
                      id={`team-${member.initials}`}
                      className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-white"
                    >
                      {member.name}
                    </h3>
                    <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-tertiary">
                      {member.title}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {member.bio.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="font-[family-name:var(--font-dm-sans)] text-base leading-relaxed text-white/72"
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

        <section
          aria-labelledby="work-with-us-heading"
          className="bg-neutral px-6 py-24 lg:px-10 md:py-28"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-widest text-tertiary">
              Start the conversation
            </p>
            <h2
              id="work-with-us-heading"
              className="font-display text-4xl leading-[1.05] tracking-tight text-on-surface md:text-6xl"
            >
              Find the work your AI system should own first.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-muted">
              Start with a free assessment. We will map the missed work, the repeated work, and the first system worth building.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="group relative inline-flex items-center justify-center rounded-full bg-tertiary px-8 py-4 text-base font-medium text-on-tertiary transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
              >
                <span>Get a free AI Operations Assessment</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-on-surface/30 px-8 py-4 text-base font-medium text-on-surface transition-all hover:border-on-surface/50 hover:bg-on-surface/5"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
