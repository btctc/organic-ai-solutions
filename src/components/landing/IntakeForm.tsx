"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  teamSize: string;
  painPoints: string[];
  currentTools: string;
  budget: string;
  timeline: string;
  goals: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  industry: "",
  teamSize: "",
  painPoints: [],
  currentTools: "",
  budget: "",
  timeline: "",
  goals: "",
};

const painPointOptions = [
  "Manual data entry & repetitive tasks",
  "Customer service / response time",
  "Lead generation & follow-up",
  "Scheduling & calendar management",
  "Inventory / supply chain",
  "Reporting & analytics",
  "Content creation & marketing",
  "Employee onboarding & training",
];

const teamSizeOptions = ["1-5", "6-15", "16-50", "51-100", "100+"];
const budgetOptions = ["Under $1K/mo", "$1K-$3K/mo", "$3K-$5K/mo", "$5K+/mo", "Not sure yet"];
const timelineOptions = ["ASAP", "1-2 months", "3-6 months", "Just exploring"];

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white font-[family-name:var(--font-dm-sans)] text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#E8420A] focus:ring-2 focus:ring-[#E8420A]/10 transition-all";

export default function IntakeForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePainPoint = (point: string) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(point)
        ? prev.painPoints.filter((p) => p !== point)
        : [...prev.painPoints, point],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAdvance = () => {
    switch (step) {
      case 0:
        return formData.name && formData.email && formData.company;
      case 1:
        return formData.industry && formData.teamSize;
      case 2:
        return formData.painPoints.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const totalSteps = 4;

  if (isSubmitted) {
    return (
      <section id="intake" className="bg-white py-28 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-[#E8420A]" size={32} />
            </div>
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              You&apos;re all set, {formData.name.split(" ")[0]}!
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm leading-relaxed">
              We&apos;ll review your information and send your personalized AI
              audit within 48 hours. Check your email at{" "}
              <span className="text-[#E8420A] font-medium">{formData.email}</span>{" "}
              for next steps.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-28 px-6 lg:px-10" id="intake">
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
              Free AI Audit
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6"
              style={{ fontWeight: 700 }}
            >
              Tell Us About Your Business
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="font-[family-name:var(--font-dm-sans)] text-neutral-500 leading-relaxed mb-10 text-sm"
            >
              Takes about 2 minutes. We&apos;ll use this to build a custom AI
              roadmap showing you exactly where to start and what ROI to expect.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-3.5"
            >
              {[
                "Free — no credit card, no commitment",
                "Custom AI audit delivered in 48 hours",
                "Actionable roadmap, not a sales pitch",
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
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-[#E8420A]" : "bg-neutral-100"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-1">
                    Let&apos;s start with the basics
                  </h3>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="Company name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      placeholder="e.g. CEO, Operations Manager"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-1">
                    About your business
                  </h3>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      placeholder="e.g. Real estate, Healthcare, E-commerce"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-3">
                      Team Size *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {teamSizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateField("teamSize", size)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            formData.teamSize === size
                              ? "bg-[#E8420A] border-[#E8420A] text-white"
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      Current AI / Automation Tools
                    </label>
                    <input
                      type="text"
                      value={formData.currentTools}
                      onChange={(e) => updateField("currentTools", e.target.value)}
                      placeholder="e.g. ChatGPT, Zapier, HubSpot, None"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-1">
                    Where does it hurt?
                  </h3>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-neutral-500">
                    Select all that apply *
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {painPointOptions.map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={() => togglePainPoint(point)}
                        className={`text-left px-4 py-3 rounded-lg text-sm border transition-all ${
                          formData.painPoints.includes(point)
                            ? "bg-orange-50 border-[#E8420A]/30 text-[#E8420A]"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                              formData.painPoints.includes(point)
                                ? "bg-[#E8420A] border-[#E8420A] text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {formData.painPoints.includes(point) && "✓"}
                          </span>
                          {point}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-1">
                    Almost there — goals & timing
                  </h3>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-3">
                      Monthly Budget Range
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => updateField("budget", b)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            formData.budget === b
                              ? "bg-[#E8420A] border-[#E8420A] text-white"
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-3">
                      Timeline
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timelineOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateField("timeline", t)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            formData.timeline === t
                              ? "bg-[#E8420A] border-[#E8420A] text-white"
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500 mb-1.5">
                      What would success look like in 6 months?
                    </label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => updateField("goals", e.target.value)}
                      placeholder="e.g. Cut admin time by 50%, automate lead follow-up, better reporting..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="px-6 py-3 bg-[#E8420A] text-white rounded-lg font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-orange-100"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-[#E8420A] text-white rounded-lg font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-all disabled:opacity-60 shadow-md shadow-orange-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Get My Free AI Audit"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
