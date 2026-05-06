"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { X, Send, Loader2, CheckCircle, ExternalLink, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type LeadPhase = "none" | "prompted" | "form" | "done";

// ── Error boundary — hides widget silently if anything crashes ──
class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ── Strip markdown symbols while keeping emojis and newlines ──
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^[-•]\s/gm, "")
    .trim();
}

const STARTERS = [
  "How can you help me?",
  "What can AI automate?",
  "What does it cost?",
  "How do I start?",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there! Whether you are a solo operator or running a team I can help you figure out how AI fits your business. What would you like to know?",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"
          aria-hidden="true"
          style={{ animationDelay: `${i * 0.12}s`, animationDuration: "0.6s" }}
        />
      ))}
    </div>
  );
}

function ChatWidgetInner() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [leadPhase, setLeadPhase] = useState<LeadPhase>("none");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", consent: false });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (open) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      try { trackEvent("chatbot_opened"); } catch { /* silent */ }
    } else {
      openButtonRef.current?.focus();
    }
  }, [open]);

  // Lead capture prompt after 3 user messages
  useEffect(() => {
    if (userMsgCount >= 3 && leadPhase === "none") {
      setLeadPhase("prompted");
    }
  }, [userMsgCount, leadPhase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    try {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch { /* silent */ }
  }, [messages, streaming, leadPhase]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setStreaming(true);
      setUserMsgCount((c) => c + 1);

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/widget-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok || !res.body) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "Sorry, I couldn't connect right now. Please try again." }
                : m
            )
          );
          setStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as {
                type: string;
                delta?: { type: string; text?: string };
              };
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.type === "text_delta" &&
                parsed.delta.text
              ) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.delta!.text! }
                      : m
                  )
                );
              }
            } catch { /* skip malformed SSE */ }
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Sorry, something went wrong. Please try again." }
              : m
          )
        );
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [messages, streaming]
  );

  const submitLead = async () => {
    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      setLeadError("Please enter your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) {
      setLeadError("Please enter a valid email address.");
      return;
    }
    if (!leadForm.consent) {
      setLeadError("Please agree to be contacted.");
      return;
    }

    setLeadSubmitting(true);
    setLeadError("");
    try {
      const res = await fetch("/api/chatbot-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          consent: leadForm.consent,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setLeadPhase("done");
      try { trackEvent("chatbot_lead_captured"); } catch { /* silent */ }
      const firstName = leadForm.name.trim().split(" ")[0];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Thanks, ${firstName}! A specialist from Organic AI Solutions will reach out within 24 hours. Feel free to keep chatting in the meantime.`,
        },
      ]);
    } catch {
      setLeadError("Something went wrong. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const lastIsEmpty =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-[family-name:var(--font-dm-sans)] text-[#2B2B2B] text-sm placeholder-neutral-500 focus:outline-none focus:border-[#C73D09] focus:ring-2 focus:ring-[#C73D09]/25 transition-all min-h-[40px]";

  return (
    <>
      {/* ── Floating chat button ── */}
      <div className="fixed bottom-20 right-4 z-50 sm:bottom-8 sm:right-6">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.15, 0.92, 1.05, 1],
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { times: [0, 0.4, 0.65, 0.85, 1], duration: 0.7 },
                opacity: { duration: 0.2 },
              }}
              className="relative"
            >
              {/* Green live indicator dot */}
              <span className="absolute -top-1 -right-1 z-10 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white" />
              </span>

              <button
                ref={openButtonRef}
                onClick={() => {
                  try { trackEvent("chatbot_opened"); } catch { /* silent */ }
                  window.location.href = "/assessment";
                }}
                className="flex items-center gap-2 pl-4 pr-5 h-[60px] rounded-full bg-[#C73D09] text-white shadow-lg shadow-orange-300/40 hover:bg-[#a32d07] transition-colors"
                aria-label="Open AI assessment"
                aria-expanded={false}
              >
                <MessageSquare size={24} aria-hidden="true" />
                <span className="hidden sm:block font-[family-name:var(--font-montserrat)] font-semibold text-sm">
                  Chat with us
                </span>
                <span className="sm:hidden font-[family-name:var(--font-montserrat)] font-semibold text-sm">
                  Chat
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat dialog ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Organic AI Solutions chat assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-20 right-3 z-50 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl shadow-neutral-900/20 border border-neutral-200 flex flex-col overflow-hidden sm:bottom-6 sm:right-6"
            style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#C73D09] shrink-0">
              <div className="flex items-center gap-3">
                {/* Full horizontal logo — white version on orange background */}
                <Logo width={160} height={50} variant="white" priority />
                {/* Online indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" aria-hidden="true" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-white/90 text-xs font-medium">
                    Online
                  </span>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setOpen(false)}
                aria-label="Close chat assistant"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Message area */}
            <div
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              aria-relevant="additions"
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-white"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && msg.content === "" ? (
                    <div className="bg-neutral-100 rounded-2xl rounded-tl-sm border border-neutral-200">
                      <TypingIndicator />
                    </div>
                  ) : (
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-[family-name:var(--font-dm-sans)] ${
                        msg.role === "user"
                          ? "bg-[#C73D09] text-white rounded-tr-sm"
                          : "bg-neutral-100 text-[#2B2B2B] rounded-tl-sm whitespace-pre-wrap"
                      }`}
                    >
                      {msg.role === "assistant" ? stripMarkdown(msg.content) : msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} aria-hidden="true" />
            </div>

            {/* Lead prompt card */}
            {leadPhase === "prompted" && (
              <div className="mx-3 mb-2 p-4 rounded-xl bg-orange-50 border border-orange-200 shrink-0">
                <p className="font-[family-name:var(--font-montserrat)] font-bold text-neutral-900 text-sm mb-1">
                  Want personalized recommendations?
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-700 text-xs mb-3 leading-snug">
                  Get your free AI Assessment or connect with a specialist.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/assessment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#C73D09] text-white text-xs font-semibold font-[family-name:var(--font-montserrat)] hover:bg-[#a32d07] transition-colors min-h-[36px]"
                  >
                    Get Free Assessment
                    <ExternalLink size={10} aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => setLeadPhase("form")}
                    className="px-3 py-2 rounded-lg border border-[#C73D09] text-[#C73D09] text-xs font-semibold font-[family-name:var(--font-montserrat)] hover:bg-orange-50 transition-colors min-h-[36px]"
                  >
                    Talk to Specialist
                  </button>
                </div>
                <button
                  onClick={() => setLeadPhase("none")}
                  className="mt-2 text-[10px] text-neutral-500 hover:text-neutral-700 transition-colors min-h-[36px] w-full text-left"
                >
                  No thanks, just browsing
                </button>
              </div>
            )}

            {/* Lead capture form */}
            {leadPhase === "form" && (
              <div
                className="mx-3 mb-2 p-4 rounded-xl bg-white border border-neutral-200 shadow-sm shrink-0 space-y-3"
                aria-label="Specialist contact form"
              >
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-600 text-xs leading-relaxed">
                  By sharing your contact info, you agree to be contacted by Organic AI Solutions.
                  You can unsubscribe at any time.
                </p>
                <div>
                  <label htmlFor="chat-lead-name" className="sr-only">Your name</label>
                  <input
                    id="chat-lead-name"
                    type="text"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className={inputCls}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="chat-lead-email" className="sr-only">Your email</label>
                  <input
                    id="chat-lead-email"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Your email address"
                    className={inputCls}
                    autoComplete="email"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leadForm.consent}
                    onChange={(e) => setLeadForm((p) => ({ ...p, consent: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-[#C73D09] shrink-0"
                    aria-label="I agree to be contacted"
                  />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-neutral-700 leading-snug">
                    I agree to be contacted by Organic AI Solutions
                  </span>
                </label>
                {leadError && (
                  <p role="alert" className="text-red-600 text-xs">{leadError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => void submitLead()}
                    disabled={leadSubmitting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#C73D09] text-white text-xs font-bold font-[family-name:var(--font-montserrat)] hover:bg-[#a32d07] transition-colors disabled:opacity-60 min-h-[40px]"
                  >
                    {leadSubmitting ? (
                      <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                    ) : null}
                    Connect with Specialist
                  </button>
                  <button
                    onClick={() => setLeadPhase("prompted")}
                    className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 text-xs hover:bg-neutral-50 transition-colors min-h-[40px]"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Done */}
            {leadPhase === "done" && (
              <div className="mx-3 mb-2 p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-2 shrink-0">
                <CheckCircle size={14} className="text-[#C73D09] shrink-0" aria-hidden="true" />
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-700 text-xs">
                  A specialist will reach out within 24 hours!
                </p>
              </div>
            )}

            {/* Suggested starters — show after welcome message */}
            {messages.length === 1 && !streaming && leadPhase === "none" && (
              <div
                className="px-4 pb-3 shrink-0 bg-white border-t border-neutral-100"
                aria-label="Suggested questions"
              >
                <p className="text-xs text-neutral-500 font-[family-name:var(--font-dm-sans)] mb-2 pt-2">
                  Pick a question:
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((q) => (
                    <button
                      key={q}
                      onClick={() => void sendMessage(q)}
                      className="text-xs px-3 py-2 rounded-full border border-neutral-300 text-[#2B2B2B] font-[family-name:var(--font-dm-sans)] hover:border-[#C73D09] hover:text-[#C73D09] transition-colors bg-white min-h-[36px]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-neutral-200 shrink-0 bg-white"
              aria-label="Send a message"
            >
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={streaming}
                autoComplete="off"
                className="flex-1 text-sm font-[family-name:var(--font-dm-sans)] text-[#2B2B2B] placeholder-neutral-500 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#C73D09] focus:ring-2 focus:ring-[#C73D09]/25 transition-all disabled:opacity-60"
                aria-label="Type your message to the AI assistant"
                aria-disabled={streaming}
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label="Send message"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#C73D09] text-white flex items-center justify-center hover:bg-[#a32d07] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {streaming && lastIsEmpty ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ChatWidget() {
  return (
    <ChatErrorBoundary>
      <ChatWidgetInner />
    </ChatErrorBoundary>
  );
}
