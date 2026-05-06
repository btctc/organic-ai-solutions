"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface IntakeFormData {
  name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  teamSize: string;
  revenue: string;
  painPoints: string[];
  painDetail: string;
  currentAiTools: string[];
  currentAiToolsOther: string;
  websiteStatus: string;
  websiteIssues: string;
  packageInterest: string;
  timeline: string;
  goals: string;
  additionalContext: string;
}

const initialFormData: IntakeFormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  website: "",
  teamSize: "",
  revenue: "",
  painPoints: [],
  painDetail: "",
  currentAiTools: [],
  currentAiToolsOther: "",
  websiteStatus: "",
  websiteIssues: "",
  packageInterest: "",
  timeline: "",
  goals: "",
  additionalContext: "",
};

const stepTitles = [
  "About You",
  "Operational Challenges",
  "Current AI Tools",
  "Website Snapshot",
  "Goals & Timing",
];

const painPointOptions = [
  "Manual repetitive work",
  "Website is outdated or underperforming",
  "Lead management is inconsistent",
  "Customer response times are too slow",
  "Scheduling or booking is disorganized",
  "Content creation takes too much time",
  "Data is spread across too many tools",
  "Unsure where AI would create the most value",
  "Reporting and operations tracking are unclear",
  "No consistent online lead flow",
];

const aiToolOptions = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Zapier",
  "HubSpot AI",
  "Salesforce Einstein",
  "Notion AI",
  "Canva AI",
  "Jasper",
  "Perplexity",
  "None currently",
  "Other",
];

const websiteOptions = [
  {
    label: "We have a website and it is performing well",
    description: "We are primarily looking to layer AI into the business.",
  },
  {
    label: "We have a website, but it needs improvement",
    description: "We likely need design, messaging, conversion, or performance updates.",
  },
  {
    label: "We need a website built",
    description: "We need a professional site created from the ground up.",
  },
  {
    label: "We are not sure how well the website is performing",
    description: "We need an honest assessment before deciding on next steps.",
  },
];

const packageOptions = [
  {
    label: "One-Time Project",
    price: "$500+",
    description: "Best for a focused deliverable or a specific business problem.",
  },
  {
    label: "Starter Engagement",
    price: "$750 + $250/mo",
    description: "Ideal for an AI audit, light automation, and website improvements.",
  },
  {
    label: "Growth Partnership",
    price: "$2,500 + $750/mo",
    description: "Best for deeper automation, AI agents, redesign, and ongoing support.",
  },
  {
    label: "Need Guidance",
    price: "TBD",
    description: "We would like help identifying the right scope and budget.",
  },
];

const timelineOptions = [
  {
    label: "As soon as possible",
    description: "This is an immediate priority.",
  },
  {
    label: "Within 2 weeks",
    description: "We are ready to move soon.",
  },
  {
    label: "This month",
    description: "We are planning actively.",
  },
  {
    label: "Exploring options",
    description: "We are gathering information before deciding.",
  },
];

const sectionLabelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 font-[family-name:var(--font-montserrat)]";
const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#E8420A] focus:ring-4 focus:ring-[#E8420A]/10 placeholder:text-neutral-400";
const textareaClass = `${inputClass} min-h-[112px] resize-y`;

function StepDot({
  active,
  complete,
  onClick,
}: {
  active: boolean;
  complete: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-2.5 rounded-full transition-all duration-300 ${
        active ? "w-8 bg-[#E8420A]" : complete ? "w-3 bg-[#F26A3D]" : "w-3 bg-neutral-200"
      }`}
      aria-label="Go to step"
    />
  );
}

function ChoiceChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
        selected
          ? "border-[#E8420A]/30 bg-orange-50 text-[#A93A10] shadow-sm"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${
            selected
              ? "border-[#E8420A] bg-[#E8420A] text-white"
              : "border-neutral-300 text-transparent"
          }`}
        >
          ✓
        </span>
        <span>{label}</span>
      </span>
    </button>
  );
}

function SelectCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-[#E8420A]/30 bg-orange-50 shadow-sm"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#E8420A]" : "border-neutral-300"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              selected ? "bg-[#E8420A]" : "bg-transparent"
            }`}
          />
        </div>
        <div>
          <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold text-neutral-900">
            {label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

interface IntakeFormProps {
  onSubmitted?: () => void;
}

export default function IntakeForm({ onSubmitted }: IntakeFormProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);

  const totalSteps = stepTitles.length;

  const updateField = (
    field: keyof IntakeFormData,
    value: IntakeFormData[keyof IntakeFormData],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (
    field: "painPoints" | "currentAiTools",
    value: string,
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const canAdvance = () => {
    if (step === 0) {
      return Boolean(formData.name && formData.email && formData.company);
    }

    return true;
  };

  const goToStep = (nextStep: number) => {
    if (nextStep <= step || canAdvance()) {
      setStep(nextStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSubmitted(true);
      onSubmitted?.();
    } catch {
      setSubmitError(
        "We could not submit your intake just yet. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="intake" className="bg-neutral-50 px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-neutral-200 bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(23,23,23,0.08)] md:px-14"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <CheckCircle className="text-[#E8420A]" size={32} />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8420A] font-[family-name:var(--font-montserrat)]">
              Intake Received
            </p>
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-neutral-900 md:text-4xl">
              Thank you, {formData.name.split(" ")[0]}.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
              We have received your intake details and will review them carefully.
              A member of the Organic AI Solutions team will follow up using{" "}
              <span className="font-semibold text-neutral-900">{formData.email}</span>{" "}
              within one business day with recommended next steps.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="intake" className="bg-neutral-50 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl" ref={ref}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="lg:pt-3">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8420A] font-[family-name:var(--font-montserrat)]"
            >
              Free AI Assessment
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="max-w-xl font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-tight text-neutral-900 md:text-5xl"
            >
              Share how your business operates today.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="mt-6 max-w-lg text-sm leading-7 text-neutral-600 md:text-base"
            >
              This intake helps us understand your current workflows, website
              position, and where AI can create the fastest measurable value. It
              takes about two minutes, and only the first step is required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="mt-10 rounded-[28px] border border-neutral-200 bg-white p-7 shadow-sm"
            >
              <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">
                What you can expect
              </p>
              <div className="mt-6 space-y-4">
                {[
                  "A tailored review of your website, workflows, and AI opportunities.",
                  "Recommendations grounded in the tools your team already uses today.",
                  "Clear next-step guidance, not a generic sales pitch.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50">
                      <CheckCircle className="text-[#E8420A]" size={13} />
                    </div>
                    <p className="text-sm leading-6 text-neutral-600">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_rgba(23,23,23,0.08)] md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 font-[family-name:var(--font-montserrat)]">
                  Client Intake
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-neutral-900">
                  {stepTitles[step]}
                </h3>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-600">
                {step + 1} / {totalSteps}
              </div>
            </div>

            <div className="mt-7 flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={stepTitles[index]}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    index < step
                      ? "bg-[#F26A3D]"
                      : index === step
                        ? "bg-[#E8420A]"
                        : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mt-8 space-y-5"
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    Please share your contact details and a little context about the
                    business. Only name, email, and company are required.
                  </p>
                  <div>
                    <label className={sectionLabelClass}>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={sectionLabelClass}>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={sectionLabelClass}>Business Name *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      placeholder="Your business name"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={sectionLabelClass}>Your Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(event) => updateField("role", event.target.value)}
                        placeholder="Founder, CEO, Operations Manager"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={sectionLabelClass}>Current Website</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(event) => updateField("website", event.target.value)}
                        placeholder="https://yourbusiness.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={sectionLabelClass}>Team Size</label>
                      <input
                        type="text"
                        value={formData.teamSize}
                        onChange={(event) => updateField("teamSize", event.target.value)}
                        placeholder="For example: 5 or 11-25"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={sectionLabelClass}>Annual Revenue</label>
                      <input
                        type="text"
                        value={formData.revenue}
                        onChange={(event) => updateField("revenue", event.target.value)}
                        placeholder="For example: $500K or $2M-$5M"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mt-8"
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    Select any challenges that apply. This helps us understand where
                    to focus first.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {painPointOptions.map((option) => (
                      <ChoiceChip
                        key={option}
                        label={option}
                        selected={formData.painPoints.includes(option)}
                        onClick={() => toggleArrayValue("painPoints", option)}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <label className={sectionLabelClass}>
                      Additional Detail
                    </label>
                    <textarea
                      value={formData.painDetail}
                      onChange={(event) => updateField("painDetail", event.target.value)}
                      placeholder="Describe any bottlenecks, frustrations, or operational issues you want us to understand."
                      className={textareaClass}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mt-8"
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    Tell us which AI tools or platforms your team already uses, if any.
                    We will use this to recommend realistic next steps.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {aiToolOptions.map((option) => (
                      <ChoiceChip
                        key={option}
                        label={option}
                        selected={formData.currentAiTools.includes(option)}
                        onClick={() => toggleArrayValue("currentAiTools", option)}
                      />
                    ))}
                  </div>
                  {formData.currentAiTools.includes("Other") && (
                    <div className="mt-6">
                      <label className={sectionLabelClass}>Other Tools</label>
                      <input
                        type="text"
                        value={formData.currentAiToolsOther}
                        onChange={(event) =>
                          updateField("currentAiToolsOther", event.target.value)
                        }
                        placeholder="List any additional AI or automation tools"
                        className={inputClass}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="website"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mt-8"
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    This gives us a clearer picture of your website needs alongside any
                    AI and automation opportunities.
                  </p>
                  <div className="mt-6 space-y-3">
                    {websiteOptions.map((option) => (
                      <SelectCard
                        key={option.label}
                        label={option.label}
                        description={option.description}
                        selected={formData.websiteStatus === option.label}
                        onClick={() => updateField("websiteStatus", option.label)}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <label className={sectionLabelClass}>
                      Website Notes
                    </label>
                    <textarea
                      value={formData.websiteIssues}
                      onChange={(event) => updateField("websiteIssues", event.target.value)}
                      placeholder="Share anything relevant about performance, messaging, lead flow, mobile usability, or design."
                      className={textareaClass}
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="mt-8 space-y-7"
                >
                  <p className="text-sm leading-7 text-neutral-600">
                    Help us understand your priorities so we can recommend the right
                    path forward.
                  </p>
                  <div>
                    <label className={sectionLabelClass}>Level of Engagement</label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {packageOptions.map((option) => (
                        <SelectCard
                          key={option.label}
                          label={`${option.label} (${option.price})`}
                          description={option.description}
                          selected={formData.packageInterest === option.label}
                          onClick={() => updateField("packageInterest", option.label)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={sectionLabelClass}>Desired Timeline</label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {timelineOptions.map((option) => (
                        <SelectCard
                          key={option.label}
                          label={option.label}
                          description={option.description}
                          selected={formData.timeline === option.label}
                          onClick={() => updateField("timeline", option.label)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={sectionLabelClass}>
                      What would success look like in the next 90 days?
                    </label>
                    <textarea
                      value={formData.goals}
                      onChange={(event) => updateField("goals", event.target.value)}
                      placeholder="For example: increase qualified leads, reduce administrative work, improve response speed, or modernize the website."
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className={sectionLabelClass}>
                      Anything Else We Should Know
                    </label>
                    <textarea
                      value={formData.additionalContext}
                      onChange={(event) =>
                        updateField("additionalContext", event.target.value)
                      }
                      placeholder="Share any context, concerns, or goals that would help us prepare a stronger recommendation."
                      className={textareaClass}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-5 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => step > 0 && setStep((currentStep) => currentStep - 1)}
                disabled={step === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <StepDot
                    key={stepTitles[index]}
                    active={index === step}
                    complete={index < step}
                    onClick={() => goToStep(index)}
                  />
                ))}
              </div>

              {step < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={() => canAdvance() && setStep((currentStep) => currentStep + 1)}
                  disabled={!canAdvance()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8420A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c93508] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-3">
                  {submitError ? (
                    <p className="max-w-xs text-right text-sm text-red-600">
                      {submitError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8420A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c93508] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting
                      </>
                    ) : (
                      <>
                        Submit Intake
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
