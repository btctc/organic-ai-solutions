"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #E8420A; font-size: 22px; margin-bottom: 24px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Name</strong></td><td style="padding: 8px 0; color: #111;">${form.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Email</strong></td><td style="padding: 8px 0; color: #111;">${form.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Company</strong></td><td style="padding: 8px 0; color: #111;">${form.company || "—"}</td></tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 8px; border-left: 3px solid #E8420A;">
          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</strong>
          <p style="margin-top: 8px; color: #111; line-height: 1.6;">${form.message}</p>
        </div>
      </div>
    `;

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New inquiry from ${form.name} — Organic AI Solutions`,
          html,
        }),
      });

      if (!res.ok) throw new Error("Send failed");
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white font-[family-name:var(--font-dm-sans)] text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#E8420A] focus:ring-2 focus:ring-[#E8420A]/10 transition-all";

  return (
    <section className="bg-neutral-50 py-28 px-6 lg:px-10" id="contact">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left copy */}
          <div className="lg:pt-2">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-semibold tracking-widest uppercase mb-4"
            >
              Get In Touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6"
              style={{ fontWeight: 700 }}
            >
              Tell us what&apos;s breaking. We&apos;ll tell you what to build.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="font-[family-name:var(--font-dm-sans)] text-neutral-500 leading-relaxed mb-10 text-sm"
            >
              Tell us where work is getting missed, repeated, or delayed. We&apos;ll
              respond within one business day with a practical next step — no
              sales pressure, just honest advice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-3.5"
            >
              {[
                "Free 30-minute discovery call included",
                "No long-term contracts required",
                "Results-focused engagement model",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-[#E8420A]" size={12} />
                  </div>
                  <span className="font-[family-name:var(--font-dm-sans)] text-neutral-600 text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="bg-white rounded-2xl p-8 lg:p-10 border border-neutral-100 shadow-sm"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-14 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                  <CheckCircle className="text-[#E8420A]" size={28} />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-neutral-900">
                  Message Sent!
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm max-w-xs">
                  Thank you for reaching out. We&apos;ll be in touch within one
                  business day.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-5 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your Business LLC"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                    How Can We Help? *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business and the challenges you're facing..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
                    <AlertCircle size={15} className="text-red-500 shrink-0" />
                    <span className="font-[family-name:var(--font-dm-sans)] text-red-600 text-sm">
                      Something went wrong. Please try again.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#E8420A] text-white font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-orange-100"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
