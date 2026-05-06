import Link from 'next/link';
import AssessmentChat from '@/components/AssessmentChat';
import Logo from '@/components/Logo';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata = {
  title: 'AI Operations Assessment',
  description:
    'Talk to an AI agent built by Organic AI Solutions. In 5 minutes, get a personalized AI Opportunity Report for your business.',
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen">
      {/* Header bar with logo. NOTE: When 3D logo lands in design phase, swap <Logo /> for <Logo3D />. */}
      <header className="border-b border-on-surface/10 bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link href="/" aria-label="Organic AI Solutions home" className="inline-block">
            <Logo width={140} height={44} priority />
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <RevealOnScroll>
            <div className="mb-10 text-center">
              <h1 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Your free AI Operations Assessment.
              </h1>
              <p className="mt-4 text-lg text-on-surface-muted">
                Talk through a typical day at your business. In 5 minutes you&apos;ll get a
                personalized AI Opportunity Report — written by an OAS agent, reviewed by Organic AI Solutions staff.
              </p>
            </div>
          </RevealOnScroll>
          <AssessmentChat />
        </div>
      </section>
    </main>
  );
}
