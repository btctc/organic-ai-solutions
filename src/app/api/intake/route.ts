import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("=== NEW INTAKE SUBMISSION ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("============================");

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "OAS Intake <onboarding@resend.dev>",
          to: process.env.NOTIFICATION_EMAIL || "hello@organicaisolutions.com",
          subject: `New AI Audit Request: ${data.company} — ${data.name}`,
          html: `
            <h2>New Intake Form Submission</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.role || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Industry</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.industry}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Team Size</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.teamSize}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pain Points</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.painPoints?.join(", ") || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Current Tools</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.currentTools || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Budget</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.budget || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Timeline</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.timeline || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Goals</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.goals || "—"}</td></tr>
            </table>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Intake submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
