'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { role: 'user' | 'assistant'; content: string };
type ChatResponse = { message?: string; readyForEmail?: boolean; error?: string; requestId?: string };

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hey — I'm the OAS Assessor. Quick way to start: walk me through a typical Monday at your business. What's the first thing you do, and where does the friction usually show up?",
};

export default function AssessmentChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (!showEmailCapture && !thinking) {
      inputRef.current?.focus();
    }
  }, [messages, thinking, showEmailCapture]);

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
    if (data.readyForEmail) {
      setShowEmailCapture(true);
    }

    setThinking(false);
  }

  async function submitReport() {
    if (!email.trim()) return;
    setThinking(true);
    setSubmitError('');
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
        <h2 className="font-display text-3xl">Report on the way.</h2>
        <p className="mt-3 text-on-surface-muted">
          Check your inbox in about 60 seconds. Someone from Organic AI Solutions will follow up within one business day.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-on-surface/10 bg-surface overflow-hidden">
      <div ref={scrollRef} className="max-h-[60vh] min-h-[400px] overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-on-surface/5 text-on-surface'
              }`}
            >
              {m.content || (thinking && i === messages.length - 1 ? <ThinkingDots /> : '')}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showEmailCapture && (
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
                disabled={thinking || !email.trim()}
                className="rounded-lg bg-tertiary px-5 py-2 text-sm font-medium text-on-tertiary disabled:opacity-50"
              >
                {thinking ? 'Sending...' : 'Send my report'}
              </button>
            </div>
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
