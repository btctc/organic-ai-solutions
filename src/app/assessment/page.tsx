import AssessmentChat from '@/components/AssessmentChat';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata = {
  title: 'AI Operations Assessment',
  description:
    'Talk to an AI agent built by Organic AI Solutions. In 5 minutes, get a personalized AI Opportunity Report for your business.',
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <RevealOnScroll>
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl leading-[1.05]">
              Your free AI Operations Assessment.
            </h1>
            <p className="mt-4 text-lg text-on-surface-muted">
              Talk through a typical day at your business. In 5 minutes you&apos;ll get a
              personalized AI Opportunity Report — written by an OAS agent, reviewed by TC.
            </p>
          </div>
        </RevealOnScroll>
        <AssessmentChat />
      </div>
    </main>
  );
}
