'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/^[-•]\s/gm, '')
    .trim();
}

type Message = { role: 'user' | 'assistant'; content: string };
type ChatResponse = { message?: string; readyForEmail?: boolean; error?: string; requestId?: string };
type Stage = 'industry' | 'painPoints' | 'chat';

const REPORT_STAGES = [
  'Saving your responses...',
  'Generating your AI Opportunity Report...',
  'Sending to your inbox...',
  'Almost ready...',
];

const INDUSTRIES = [
  'Healthcare & Dental',
  'Home Services',
  'Professional Services',
  'Real Estate & Property Management',
  'Restaurants & Hospitality',
  'Retail & E-commerce',
  'Construction & Trades',
  'Fitness, Wellness & Beauty',
  'Automotive & Transportation',
  'Financial Services & Insurance',
  'Education & Coaching',
  'Other / Not listed',
];

const HOME_SERVICES_PAIN: string[] = [
  'Lead response time',
  'Quoting and estimates',
  'Scheduling and dispatch',
  'Follow-up after the job',
  'Reviews and referrals',
  'Recurring service reminders',
];

const PROFESSIONAL_SERVICES_PAIN: string[] = [
  'Lead qualification',
  'Proposal and contract drafting',
  'Onboarding new clients',
  'Internal knowledge and SOPs',
  'Billing and collections',
  'Reporting and dashboards',
];

const RETAIL_HOSPITALITY_PAIN: string[] = [
  'Customer service and FAQs',
  'Inventory and reordering',
  'Marketing and promotions',
  'Reviews and reputation',
  'Scheduling staff',
  'Loyalty and retention',
];

const PAIN_POINTS_BY_INDUSTRY: Record<string, string[]> = {
  'Healthcare & Dental': [
    'Scheduling and no-shows',
    'Insurance verification',
    'Patient communication and follow-up',
    'Intake paperwork',
    'Reviews and reputation',
    'Staffing and front desk load',
  ],
  'Home Services': HOME_SERVICES_PAIN,
  'Professional Services': PROFESSIONAL_SERVICES_PAIN,
  'Real Estate & Property Management': [
    'Lead response time',
    'Showings and scheduling',
    'Tenant communication',
    'Vendor and maintenance coordination',
    'Reviews and reputation',
    'Listing management',
  ],
  'Restaurants & Hospitality': [
    'Reservations and bookings',
    'Customer service and FAQs',
    'Reviews and reputation',
    'Staff scheduling',
    'Marketing and promotions',
    'Loyalty and repeat customers',
  ],
  'Retail & E-commerce': [
    'Customer service and FAQs',
    'Inventory and reordering',
    'Order tracking and fulfillment',
    'Marketing and promotions',
    'Reviews and reputation',
    'Loyalty and retention',
  ],
  'Construction & Trades': HOME_SERVICES_PAIN,
  'Fitness, Wellness & Beauty': RETAIL_HOSPITALITY_PAIN,
  'Automotive & Transportation': HOME_SERVICES_PAIN,
  'Financial Services & Insurance': PROFESSIONAL_SERVICES_PAIN,
  'Education & Coaching': PROFESSIONAL_SERVICES_PAIN,
  'Other / Not listed': [
    'Customer communication',
    'Scheduling and operations',
    'Lead qualification and intake',
    'Internal knowledge and SOPs',
    'Reporting and visibility',
    'Marketing and follow-up',
  ],
};

export default function AssessmentChat() {
  const [stage, setStage] = useState<Stage>('industry');
  const [industry, setIndustry] = useState<string | null>(null);
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [customPainPoints, setCustomPainPoints] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportStage, setReportStage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reportTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking, stage]);

  useEffect(() => {
    if (stage === 'chat' && !showEmailCapture && !thinking) {
      inputRef.current?.focus();
    }
  }, [messages, thinking, showEmailCapture, stage]);

  useEffect(() => {
    return () => {
      if (reportTimerRef.current) {
        clearInterval(reportTimerRef.current);
      }
    };
  }, []);

  function selectIndustry(choice: string) {
    setIndustry(choice);
    setStage('painPoints');
  }

  function togglePainPoint(point: string) {
    setPainPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  }

  function addCustomPainPoint() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (customPainPoints.includes(trimmed) || painPoints.includes(trimmed)) {
      setCustomInput('');
      return;
    }
    setCustomPainPoints((prev) => [...prev, trimmed]);
    setCustomInput('');
  }

  function removeCustomPainPoint(point: string) {
    setCustomPainPoints((prev) => prev.filter((p) => p !== point));
  }

  async function submitPainPoints() {
    if (!industry || thinking) return;
    const allSelected = [...painPoints, ...customPainPoints];
    if (allSelected.length === 0) return;
    const firstUserMessage: Message = {
      role: 'user',
      content: `Industry: ${industry}\nTop friction: ${allSelected.join(', ')}`,
    };
    const initialMessages = [firstUserMessage];
    setMessages(initialMessages);
    setStage('chat');
    setThinking(true);

    const res = await fetch('/api/assessment/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: initialMessages, conversationId }),
    });

    if (!res.ok) {
      setThinking(false);
      const err = (await res.json().catch(() => ({ error: 'Something went wrong.' }))) as ChatResponse;
      const detail = err.requestId ? ` Reference: ${err.requestId}` : '';
      setMessages([
        ...initialMessages,
        { role: 'assistant', content: `${err.error || 'Hit a snag — please try again in a moment.'}${detail}` },
      ]);
      return;
    }

    const data = (await res.json()) as ChatResponse;
    setMessages([
      ...initialMessages,
      { role: 'assistant', content: data.message || 'Hit a snag — please try again in a moment.' },
    ]);
    if (data.readyForEmail) setShowEmailCapture(true);
    setThinking(false);
  }

  async function send() {
    if (!input.trim() || thinking) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    setThinking(true);

    const res = await fetch('/api/assessment/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next, conversationId }),
    });

    if (!res.ok) {
      setThinking(false);
      const err = (await res.json().catch(() => ({ error: 'Something went wrong.' }))) as ChatResponse;
      const detail = err.requestId ? ` Reference: ${err.requestId}` : '';
      setMessages([...next, { role: 'assistant', content: `${err.error || 'Hit a snag — please try again in a moment.'}${detail}` }]);
      return;
    }

    const data = (await res.json()) as ChatResponse;
    setMessages([...next, { role: 'assistant', content: data.message || 'Hit a snag — please try again in a moment.' }]);
    if (data.readyForEmail) setShowEmailCapture(true);
    setThinking(false);
  }

  async function submitReport() {
    if (!email.trim() || isSubmittingReport) return;
    setThinking(true);
    setIsSubmittingReport(true);
    setReportStage(0);
    setSubmitError('');
    if (reportTimerRef.current) clearInterval(reportTimerRef.current);
    reportTimerRef.current = setInterval(() => {
      setReportStage((s) => Math.min(s + 1, REPORT_STAGES.length - 1));
    }, 3500);
    try {
      const res = await fetch('/api/assessment/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, email, name, messages }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong.' }));
        setSubmitError(err.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      if (reportTimerRef.current) {
        clearInterval(reportTimerRef.current);
        reportTimerRef.current = null;
      }
      setIsSubmittingReport(false);
      setThinking(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-on-surface/10 bg-surface p-10 text-center"
      >
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-tertiary/20 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="font-display text-3xl">We&apos;ve got your assessment.</h2>
        <p className="mt-3 text-on-surface-muted">
          Your personalized AI Opportunity Report will arrive within 24 hours. Check your inbox for a confirmation email — and someone from Organic AI Solutions will follow up directly.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-on-surface/10 bg-surface overflow-hidden">
      <div ref={scrollRef} className="max-h-[60vh] min-h-[400px] overflow-y-auto p-6 space-y-4">
        {stage === 'industry' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-on-surface/5 px-4 py-3 text-sm leading-relaxed text-on-surface max-w-[80%]">
              Hey — I&apos;m the OAS Assessor. To get you a tailored report fast, what kind of business do you run?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => selectIndustry(ind)}
                  className="w-full rounded-xl border border-on-surface/20 px-4 py-3 text-sm font-medium text-left hover:border-tertiary hover:bg-tertiary/10 transition-colors"
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'painPoints' && industry && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="rounded-2xl bg-tertiary px-4 py-3 text-sm text-on-tertiary max-w-[80%]">
                {industry}
              </div>
            </div>
            <div className="rounded-2xl bg-on-surface/5 px-4 py-3 text-sm leading-relaxed text-on-surface max-w-[80%]">
              Got it. Where does friction usually show up? Pick the ones that apply — you can pick more than one.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {PAIN_POINTS_BY_INDUSTRY[industry].map((point) => {
                const selected = painPoints.includes(point);
                return (
                  <button
                    key={point}
                    onClick={() => togglePainPoint(point)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-left transition-colors ${
                      selected
                        ? 'border-tertiary bg-tertiary text-on-tertiary'
                        : 'border-on-surface/20 hover:border-tertiary hover:bg-tertiary/10'
                    }`}
                  >
                    {selected ? '✓ ' : ''}{point}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 space-y-3">
              <div className="flex gap-2">
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomPainPoint();
                    }
                  }}
                  placeholder="+ Add your own"
                  className="flex-1 rounded-lg border border-on-surface/20 bg-neutral px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                />
                <button
                  onClick={addCustomPainPoint}
                  disabled={!customInput.trim()}
                  className="rounded-lg border border-on-surface/20 px-4 py-2 text-sm font-medium hover:border-tertiary hover:bg-tertiary/10 transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              {customPainPoints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customPainPoints.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center gap-1.5 rounded-full bg-tertiary text-on-tertiary px-3 py-1.5 text-sm font-medium"
                    >
                      {point}
                      <button
                        onClick={() => removeCustomPainPoint(point)}
                        className="opacity-80 hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${point}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {(painPoints.length > 0 || customPainPoints.length > 0) && (
              <div className="pt-3">
                <button
                  onClick={submitPainPoints}
                  disabled={thinking}
                  className="rounded-lg bg-tertiary px-5 py-2 text-sm font-medium text-on-tertiary disabled:opacity-50"
                >
                  Continue ({painPoints.length + customPainPoints.length} selected)
                </button>
              </div>
            )}
          </div>
        )}

        {stage === 'chat' && messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-on-surface/5 text-on-surface'
              }`}
            >
              {m.content
                ? (m.role === 'assistant' ? stripMarkdown(m.content) : m.content)
                : (thinking && i === messages.length - 1 ? <ThinkingDots /> : '')}
            </div>
          </div>
        ))}

        {stage === 'chat' && thinking && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-on-surface/5 px-4 py-3 text-sm">
              <ThinkingDots />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'chat' && !showEmailCapture && (
          <motion.div key="input" exit={{ opacity: 0 }} className="border-t border-on-surface/10 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type your answer..."
                className="flex-1 rounded-lg border border-on-surface/20 bg-neutral px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                disabled={thinking}
              />
              <button
                onClick={send}
                disabled={thinking || !input.trim()}
                className="rounded-lg bg-tertiary px-5 py-2 text-sm font-medium text-on-tertiary disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}

        {showEmailCapture && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-on-surface/10 p-6 space-y-3"
          >
            {isSubmittingReport ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-on-surface/10 border-t-[#E25822]" />
                <p className="mt-4 text-sm font-medium text-[#333]">{REPORT_STAGES[reportStage]}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-on-surface-muted">Where should I send your report?</p>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 rounded-lg border border-on-surface/20 bg-neutral px-4 py-2 text-sm"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    type="email"
                    className="flex-[1.5] rounded-lg border border-on-surface/20 bg-neutral px-4 py-2 text-sm"
                  />
                  <button
                    onClick={submitReport}
                    disabled={thinking || isSubmittingReport || !email.trim()}
                    className="rounded-lg bg-tertiary px-5 py-2 text-sm font-medium text-on-tertiary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send my report
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-on-surface/40"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
