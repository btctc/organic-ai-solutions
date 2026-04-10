import { Resend } from "resend";
import { NextResponse } from "next/server";
import { sendEmailWithTestingFallback } from "@/lib/resend-delivery";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { subject, html } = body;

  const delivery = await sendEmailWithTestingFallback({
    resend,
    from: "onboarding@resend.dev",
    to: "overtimeincorporated@gmail.com",
    subject: subject ?? "No Subject",
    html: html ?? "",
  });

  if (!delivery.success) {
    return NextResponse.json({ error: delivery.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    recipient: delivery.recipient,
    usedFallback: delivery.usedFallback,
  });
}
