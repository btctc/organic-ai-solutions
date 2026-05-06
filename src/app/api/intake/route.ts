import { NextResponse } from "next/server";
import { sendEmailWithTestingFallback } from "@/lib/resend-delivery";

function escapeHtml(value: unknown) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatList(value: unknown) {
  if (Array.isArray(value) && value.length > 0) {
    return value.join(", ");
  }

  return "—";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("=== NEW INTAKE SUBMISSION ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("============================");

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 },
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const delivery = await sendEmailWithTestingFallback({
      resend,
      from: "Organic AI Solutions <hello@organicaisolutions.ai>",
      to: process.env.NOTIFICATION_EMAIL || "tc@overtimerealestate.com",
      subject: `New AI Audit Request: ${data.company} — ${data.name}`,
      html: `
        <h2>New Intake Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.company)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.role)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.website)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Team Size</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.teamSize)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Annual Revenue</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.revenue)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pain Points</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(formatList(data.painPoints))}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pain Point Details</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.painDetail)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Current AI Tools</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(formatList(data.currentAiTools))}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Other AI Tools</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.currentAiToolsOther)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website Status</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.websiteStatus)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website Notes</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.websiteIssues)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Engagement Level</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.packageInterest)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Timeline</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.timeline)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">90-Day Goals</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.goals)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Additional Context</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.additionalContext)}</td></tr>
        </table>
      `,
    });

    if (!delivery.success) {
      console.error("Email send failed:", delivery.error);
      return NextResponse.json(
        { error: "Email delivery failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Intake submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
