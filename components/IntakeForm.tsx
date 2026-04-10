"use client";

import { useState } from "react";

const C = {
  bg: "#0E1117",
  bgCard: "#161B22",
  surface: "#1C2128",
  border: "rgba(255,255,255,0.08)",
  borderFocus: "#2D8C3C",
  green: "#2D8C3C",
  greenGlow: "rgba(45,140,60,0.25)",
  greenLight: "#3DA64D",
  greenSubtle: "rgba(45,140,60,0.08)",
  orange: "#E8682A",
  orangeGlow: "rgba(232,104,42,0.3)",
  text: "#F0F2F5",
  textMuted: "#8B949E",
  textDim: "#6B737E",
  white: "#FFFFFF",
};

const PAIN_POINTS = [
  { label: "Manual repetitive tasks", icon: "⟳" },
  { label: "Outdated or underperforming website", icon: "◇" },
  { label: "No online presence", icon: "○" },
  { label: "Lead management is broken", icon: "△" },
  { label: "Slow customer communication", icon: "◈" },
  { label: "Data scattered across tools", icon: "⬡" },
  { label: "Don't know where AI fits", icon: "?" },
  { label: "Scheduling & booking chaos", icon: "▣" },
  { label: "Content creation bottleneck", icon: "✎" },
  { label: "Operations tracking is a mess", icon: "⊞" },
];

const TOOLS = [
  "Gmail / Google Workspace", "Microsoft 365", "Shopify", "WordPress",
  "Squarespace / Wix", "Salesforce", "HubSpot", "QuickBooks",
  "Slack", "Notion", "Spreadsheets", "Custom CRM", "Social Media", "Other",
];

const BUDGETS = [
  { label: "One-Time Fix", price: "$500", desc: "Single deliverable, done." },
  { label: "Starter", price: "$750 + $250/mo", desc: "AI audit, automations, website updates." },
  { label: "Pro", price: "$2,500 + $750/mo", desc: "Full treatment — agents, redesign, ongoing dev." },
  { label: "Not sure yet", price: "—", desc: "Help me figure out the right plan." },
];

const TIMELINES = [
  { label: "ASAP", sub: "I needed this yesterday" },
  { label: "2 weeks", sub: "Ready to move soon" },
  { label: "This month", sub: "Planning ahead" },
  { label: "Exploring", sub: "Just learning for now" },
];

const WEBSITE_OPTIONS = [
  { label: "Have one, it works", desc: "Just need AI layered in" },
  { label: "Have one, needs refresh", desc: "Redesign or major updates needed" },
  { label: "Need one built", desc: "Starting from scratch" },
  { label: "Not sure if it's working", desc: "Need an honest assessment" },
];

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
  * { box-sizing: border-box; }
`;

function Input({ type = "text", value, onChange, placeholder }: any) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: "100%", padding: "12px 16px", boxSizing: "border-box" as const,
        border: `1.5px solid ${f ? C.borderFocus : C.border}`,
        borderRadius: 10, fontSize: 15, fontFamily: "Satoshi,sans-serif",
        color: C.text, background: C.surface, outline: "none",
        transition: "all 0.2s",
        boxShadow: f ? `0 0 0 3px ${C.greenGlow}` : "none",
      }} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: any) {
  const [f, setF] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: "100%", padding: "12px 16px", boxSizing: "border-box" as const,
        border: `1.5px solid ${f ? C.borderFocus : C.border}`,
        borderRadius: 10, fontSize: 15, fontFamily: "Satoshi,sans-serif",
        color: C.text, background: C.surface, outline: "none",
        resize: "vertical" as const, minHeight: 80, transition: "all 0.2s",
        boxShadow: f ? `0 0 0 3px ${C.greenGlow}` : "none",
      }} />
  );
}

function Field({ label, sub, required, optional, children, style: s }: any) {
  return (
    <div style={s}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
        <span style={{ fontFamily: "Satoshi,sans-serif", fontSize: 13, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</span>
        {required && <span style={{ color: C.orange, fontSize: 13 }}>*</span>}
        {optional && <span style={{ fontFamily: "Satoshi,sans-serif", fontSize: 11, color: C.textDim, fontStyle: "italic" }}>optional</span>}
        {sub && <span style={{ fontFamily: "Satoshi,sans-serif", fontSize: 12, color: C.textDim }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ label, selected, onClick, icon }: any) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 18px", borderRadius: 10,
      border: `1.5px solid ${selected ? C.green : C.border}`,
      background: selected ? C.greenSubtle : "transparent",
      color: selected ? C.greenLight : C.textMuted,
      fontSize: 14, fontFamily: "Satoshi,sans-serif", fontWeight: selected ? 600 : 400,
      cursor: "pointer", transition: "all 0.2s",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: selected ? `0 0 16px ${C.greenGlow}` : "none",
    }}>
      {icon && <span style={{ fontSize: 14, opacity: 0.7 }}>{icon}</span>}
      {selected && "✓ "}{label}
    </button>
  );
}

function RadioCard({ label, desc, selected, onClick }: any) {
  return (
    <button onClick={onClick} style={{
      padding: "16px 20px", borderRadius: 12, textAlign: "left" as const,
      border: `1.5px solid ${selected ? C.green : C.border}`,
      background: selected ? C.greenSubtle : "transparent",
      cursor: "pointer", transition: "all 0.2s", width: "100%",
      boxShadow: selected ? `0 0 20px ${C.greenGlow}` : "none",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: `2px solid ${selected ? C.green : C.textDim}`,
        background: selected ? C.green : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.2s",
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white }} />}
      </div>
      <div>
        <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 15, fontWeight: 600, color: selected ? C.text : C.textMuted }}>{label}</div>
        {desc && <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 13, color: C.textDim, marginTop: 2 }}>{desc}</div>}
      </div>
    </button>
  );
}

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", business: "", website: "", teamSize: "", revenue: "",
    painPoints: [] as string[], painDetail: "",
    tools: [] as string[], toolsOther: "",
    hasWebsite: "", websiteIssues: "",
    budget: "", timeline: "", goals: "", anything: "",
  });

  const N = 5;
  const up = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));
  const tog = (k: string, v: string) => setForm((f: any) => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter((x: string) => x !== v) : [...f[k], v]
  }));
  const ok = () => { if (step === 0) return form.name && form.email && form.business; return true; };
  const go = (s: number) => { setAnimKey((k: number) => k + 1); setStep(s); };

  const summary = () => `--- CLIENT INTAKE: ${form.business.toUpperCase()} ---\nContact: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.business}\nWebsite: ${form.website || "None"}\nTeam Size: ${form.teamSize || "—"} | Revenue: ${form.revenue || "—"}\n\nPAIN POINTS:\n${form.painPoints.length > 0 ? form.painPoints.map((p: string) => "  • " + p).join("\n") : "  None selected"}${form.painDetail ? "\nDetails: " + form.painDetail : ""}\n\nTOOLS: ${form.tools.length > 0 ? form.tools.join(", ") : "None selected"}${form.toolsOther ? ", " + form.toolsOther : ""}\n\nWEBSITE: ${form.hasWebsite || "Not answered"}${form.websiteIssues ? "\nIssues: " + form.websiteIssues : ""}\n\nBUDGET: ${form.budget || "Not answered"} | TIMELINE: ${form.timeline || "Not answered"}\nGOALS: ${form.goals || "—"}\nNOTES: ${form.anything || "—"}`;

  const copy = () => { navigator.clipboard.writeText(summary()); setCopied(true); setTimeout(() => setCopied(false), 2500); };

  const titles = ["About You", "Pain Points", "Current Tools", "Website", "Budget & Goals"];
  const nums = ["01", "02", "03", "04", "05"];

  const page: React.CSSProperties = { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 20px", fontFamily: "Satoshi,sans-serif", position: "relative", overflow: "hidden" };
  const card: React.CSSProperties = { background: C.bgCard, borderRadius: 24, padding: "40px 40px 32px", maxWidth: 680, width: "100%", position: "relative", zIndex: 2, border: `1px solid ${C.border}`, boxShadow: `0 24px 80px rgba(0,0,0,0.4)` };

  if (submitted) {
    return (
      <div style={page}>
        <style>{keyframes}</style>
        <div style={{ ...card, textAlign: "center" as const, maxWidth: 520, animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${C.green},${C.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, color: C.white, boxShadow: `0 0 40px ${C.greenGlow}` }}>✓</div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: 28, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Thank you, {form.name.split(" ")[0]}.</h2>
          <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: "0 0 36px" }}>We have received your information. A member of the Organic AI Solutions team will review your intake and reach out within 24 hours.</p>
          <button onClick={copy} style={{ padding: "14px 32px", borderRadius: 12, border: `1px solid ${copied ? C.green : C.border}`, background: copied ? C.green : C.surface, color: copied ? C.white : C.text, fontSize: 15, fontWeight: 600, fontFamily: "Satoshi,sans-serif", cursor: "pointer", transition: "all 0.2s", width: "100%" }}>{copied ? "✓  Copied to clipboard" : "Copy summary for your records"}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <style>{keyframes}</style>
      <div style={{ position: "fixed", top: "-30%", right: "-20%", width: "60vw", height: "60vw", borderRadius: "50%", background: `radial-gradient(circle,${C.greenGlow} 0%,transparent 70%)`, pointerEvents: "none" as const, zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle,${C.orangeGlow} 0%,transparent 70%)`, pointerEvents: "none" as const, zIndex: 0, opacity: 0.3 }} />

      <div style={{ ...card, animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.orange},${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.white, fontFamily: "Outfit,sans-serif" }}>O</div>
            <div>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Organic AI Solutions</div>
              <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 11, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Client Intake</div>
            </div>
          </div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 13, color: C.textDim, padding: "6px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}` }}>{step + 1} / {N}</div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < step ? C.green : i === step ? C.greenLight : C.surface, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", boxShadow: i === step ? `0 0 12px ${C.greenGlow}` : "none" }} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 48, fontWeight: 800, background: `linear-gradient(135deg,${C.green},${C.greenLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{nums[step]}</span>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.2 }}>{titles[step]}</h2>
        </div>

        <div key={animKey} style={{ minHeight: 380, paddingTop: 20, animation: "slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 4px" }}>Just your name, email, and business name are required. Everything else is optional — share as much or as little as you would like.</p>
              <Field label="Full Name" required><Input value={form.name} onChange={(e: any) => up("name", e.target.value)} placeholder="Your full name" /></Field>
              <Field label="Email" required><Input type="email" value={form.email} onChange={(e: any) => up("email", e.target.value)} placeholder="you@company.com" /></Field>
              <Field label="Business Name" required><Input value={form.business} onChange={(e: any) => up("business", e.target.value)} placeholder="Your business name" /></Field>
              <Field label="Current Website" optional><Input value={form.website} onChange={(e: any) => up("website", e.target.value)} placeholder="https://yourbusiness.com" /></Field>
              <div style={{ display: "flex", gap: 16 }}>
                <Field label="Team Size" optional style={{ flex: 1 }}><Input value={form.teamSize} onChange={(e: any) => up("teamSize", e.target.value)} placeholder="e.g. 5" /></Field>
                <Field label="Annual Revenue" optional style={{ flex: 1 }}><Input value={form.revenue} onChange={(e: any) => up("revenue", e.target.value)} placeholder="e.g. $500K" /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px" }}>Select any that apply, or skip ahead if you would rather discuss on a call.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                {PAIN_POINTS.map(({ label, icon }) => (<Chip key={label} label={label} icon={icon} selected={form.painPoints.includes(label)} onClick={() => tog("painPoints", label)} />))}
              </div>
              <Field label="Anything else?" optional><Textarea value={form.painDetail} onChange={(e: any) => up("painDetail", e.target.value)} placeholder="The more detail, the better we can help..." /></Field>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px" }}>Select what you currently use, or skip if you are not sure.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                {TOOLS.map(t => (<Chip key={t} label={t} selected={form.tools.includes(t)} onClick={() => tog("tools", t)} />))}
              </div>
              {form.tools.includes("Other") && (<Field label="What other tools?" optional><Input value={form.toolsOther} onChange={(e: any) => up("toolsOther", e.target.value)} placeholder="List any other tools..." /></Field>)}
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px" }}>This helps us understand the scope — feel free to skip if you would rather talk it through.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {WEBSITE_OPTIONS.map(({ label, desc }) => (<RadioCard key={label} label={label} desc={desc} selected={form.hasWebsite === label} onClick={() => up("hasWebsite", label)} />))}
              </div>
              {form.hasWebsite && form.hasWebsite !== "Need one built" && (<Field label="What is not working?" optional><Textarea value={form.websiteIssues} onChange={(e: any) => up("websiteIssues", e.target.value)} placeholder="Slow loading, bad mobile experience, no leads..." /></Field>)}
            </div>
          )}

          {step === 4 && (
            <div>
              <p style={{ fontFamily: "Satoshi,sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px" }}>Helps us match you to the right plan — but no commitment here. Skip anything you are unsure about.</p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 13, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>Which plan interests you?</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {BUDGETS.map(({ label, price, desc }) => { const sel = form.budget === label; return (
                    <button key={label} onClick={() => up("budget", label)} style={{ padding: "16px 18px", borderRadius: 12, textAlign: "left" as const, border: `1.5px solid ${sel ? C.green : C.border}`, background: sel ? C.greenSubtle : "transparent", cursor: "pointer", transition: "all 0.2s", boxShadow: sel ? `0 0 16px ${C.greenGlow}` : "none" }}>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 15, fontWeight: 700, color: sel ? C.text : C.textMuted }}>{label}</div>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 13, fontWeight: 600, color: C.green, marginTop: 4 }}>{price}</div>
                      <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 12, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
                    </button>); })}
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 13, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>How soon do you need this?</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                  {TIMELINES.map(({ label, sub }) => { const sel = form.timeline === label; return (
                    <button key={label} onClick={() => up("timeline", label)} style={{ padding: "14px 10px", borderRadius: 10, textAlign: "center" as const, border: `1.5px solid ${sel ? C.green : C.border}`, background: sel ? C.greenSubtle : "transparent", cursor: "pointer", transition: "all 0.2s", boxShadow: sel ? `0 0 12px ${C.greenGlow}` : "none" }}>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 14, fontWeight: 600, color: sel ? C.text : C.textMuted }}>{label}</div>
                      <div style={{ fontFamily: "Satoshi,sans-serif", fontSize: 11, color: C.textDim, marginTop: 3 }}>{sub}</div>
                    </button>); })}
                </div>
              </div>
              <Field label="What does success look like in 90 days?" optional><Textarea value={form.goals} onChange={(e: any) => up("goals", e.target.value)} placeholder="More leads, faster response times, less manual work..." /></Field>
              <div style={{ marginTop: 16 }}><Field label="Anything else we should know?" optional><Textarea value={form.anything} onChange={(e: any) => up("anything", e.target.value)} placeholder="Concerns, questions, past experiences..." /></Field></div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => step > 0 && go(step - 1)} disabled={step === 0} style={{ padding: "12px 24px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 14, fontWeight: 500, fontFamily: "Satoshi,sans-serif", cursor: step === 0 ? "default" : "pointer", transition: "all 0.2s", opacity: step === 0 ? 0.3 : 1 }}>← Back</button>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: N }).map((_, i) => (<button key={i} onClick={() => (i <= step || ok()) && go(i)} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? C.green : i < step ? C.greenLight : C.surface, border: "none", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", boxShadow: i === step ? `0 0 8px ${C.greenGlow}` : "none" }} />))}
          </div>
          {step < N - 1 ? (
            <button onClick={() => ok() && go(step + 1)} disabled={!ok()} style={{ padding: "12px 28px", borderRadius: 12, border: `1px solid ${C.green}`, background: C.green, color: C.white, fontSize: 15, fontWeight: 600, fontFamily: "Satoshi,sans-serif", cursor: ok() ? "pointer" : "default", transition: "all 0.2s", opacity: ok() ? 1 : 0.4, boxShadow: `0 0 20px ${C.greenGlow}` }}>Continue →</button>
          ) : (
            <button onClick={() => setSubmitted(true)} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.orange},#D45A20)`, color: C.white, fontSize: 15, fontWeight: 600, fontFamily: "Satoshi,sans-serif", cursor: "pointer", transition: "all 0.2s", boxShadow: `0 0 24px ${C.orangeGlow}` }}>Submit →</button>
          )}
        </div>
      </div>
    </div>
  );
}
