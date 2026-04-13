import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { buildAutoResponseEmail, buildInternalEmail } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { sendEmailWithTestingFallback } from "@/lib/resend-delivery";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`chatbot-lead:${ip}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = sanitizeText(body.name);
  const email = sanitizeEmail(body.email);
  const phone = sanitizePhone(body.phone);
  const consent = body.consent === true;
  const rawHistory = Array.isArray(body.chatHistory)
    ? (body.chatHistory as ChatMessage[])
    : [];

  // Derive first/last name
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || "-";

  if (!firstName || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json({ error: "Consent is required" }, { status: 400 });
  }

  // Check unsubscribe list
  const existing = await prisma.unsubscribe.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ success: true });
  }

  const consentTimestamp = new Date().toISOString();

  // Build a readable chat history summary (last 20 exchanges)
  const chatSummary = rawHistory
    .slice(-20)
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
    .join("\n");

  const lead = await prisma.lead.create({
    data: {
      source: "chatbot",
      firstName,
      lastName,
      email,
      phone,
      businessName: sanitizeText(body.businessName) || `${firstName}'s Business`,
      consentTerms: true,
      consentEmail: true,
      consentTimestamp,
      chatHistory: chatSummary,
    },
  });

  const ownerEmail =
    process.env.BUSINESS_OWNER_EMAIL ?? "overtimeincorporated@gmail.com";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://organic-ai-solutions.vercel.app";
  const physicalAddress =
    process.env.PHYSICAL_ADDRESS ?? "Organic AI Solutions, Texas, USA";
  const fromEmail =
    process.env.FROM_EMAIL ?? "Organic AI Solutions <hello@organicaisolutions.ai>";

  const unsubToken = Buffer.from(email).toString("base64url");
  const unsubUrl = `${siteUrl}/unsubscribe?token=${unsubToken}`;
  const privacyUrl = `${siteUrl}/privacy`;
  const termsUrl = `${siteUrl}/terms`;

  const autoResponseHtml = buildAutoResponseEmail({
    firstName,
    unsubUrl,
    privacyUrl,
    termsUrl,
    physicalAddress,
    siteUrl,
    ownerEmail,
  });

  const internalHtml = buildInternalEmail({
    lead: {
      id: lead.id,
      firstName,
      lastName,
      email,
      phone,
      businessName: lead.businessName,
      businessType: "",
      employeeCount: "",
      industry: "",
      currentTools: "",
      painPoints: [],
      source: "chatbot",
      chatHistory: chatSummary,
      consentTimestamp,
    },
    ownerEmail,
  });

  const resend = new Resend(apiKey);

  const [ownerDelivery, autoResponseDelivery] = await Promise.allSettled([
    sendEmailWithTestingFallback({
      resend,
      from: fromEmail,
      to: ownerEmail,
      subject: `New Chatbot Lead — ${firstName} ${lastName}`,
      html: internalHtml,
    }),
    sendEmailWithTestingFallback({
      resend,
      from: fromEmail,
      to: email,
      subject: "Your Free AI Audit is Being Reviewed — Organic AI Solutions",
      html: autoResponseHtml,
    }),
  ]);

  if (ownerDelivery.status === "rejected") {
    console.error("Owner notification send failed:", ownerDelivery.reason);
  } else if (!ownerDelivery.value.success) {
    console.error("Owner notification send failed:", ownerDelivery.value.error);
  }

  if (autoResponseDelivery.status === "rejected") {
    console.error("Chatbot auto-response send failed:", autoResponseDelivery.reason);
  } else if (!autoResponseDelivery.value.success) {
    console.error("Chatbot auto-response send failed:", autoResponseDelivery.value.error);
  }

  return NextResponse.json({ success: true, leadId: lead.id });
}
