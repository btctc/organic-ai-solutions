"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Services from "@/components/landing/Services";
import HowItWorks from "@/components/landing/HowItWorks";
import IntakeForm from "@/components/landing/IntakeForm";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";
import CursorGlow from "@/components/CursorGlow";
import StickyWordmark from "@/components/StickyWordmark";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollDeviceShowcase from "@/components/ScrollDeviceShowcase";
import RevealOnScroll from "@/components/RevealOnScroll";

function Pillar({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="space-y-3">
      <div className="h-px w-12 bg-tertiary" />
      <h3 className="font-display text-2xl md:text-3xl">{heading}</h3>
      <p className="text-base leading-relaxed text-on-surface-muted">{body}</p>
    </div>
  );
}

export default function Home() {
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);

  return (
    <>
      <CursorGlow />
      <StickyWordmark />
      <ScrollProgress />
      <main className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <ScrollDeviceShowcase />
        <RevealOnScroll>
          <section className="py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 md:grid-cols-3 md:gap-8">
                <Pillar
                  heading="Production agent deployments"
                  body="Built on enterprise agent experience from Kyndryl. Real systems running in production — not strategy decks."
                />
                <Pillar
                  heading="AI-native websites"
                  body="Next.js, Claude API, lead capture, and conversion tracking from day one. The site is the product."
                />
                <Pillar
                  heading="Custom builds, scoped & shipped"
                  body="From single-deliverable fixes to multi-agent operational systems. Scoped, quoted, deployed."
                />
              </div>
            </div>
          </section>
        </RevealOnScroll>
        <RevealOnScroll>
          <Problem />
        </RevealOnScroll>
        <RevealOnScroll>
          <Services />
        </RevealOnScroll>
        <RevealOnScroll>
          <HowItWorks />
        </RevealOnScroll>
        <RevealOnScroll>
          <div id="contact" className="scroll-mt-24">
            <IntakeForm onSubmitted={() => setIntakeSubmitted(true)} />
          </div>
        </RevealOnScroll>
        {!intakeSubmitted && (
          <RevealOnScroll>
            <ContactForm />
          </RevealOnScroll>
        )}
        <Footer />
      </main>
    </>
  );
}
