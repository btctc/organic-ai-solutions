import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { subject, html } = body;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "tc@overtimerealestate.com",
    subject: subject ?? "No Subject",
    html: html ?? "",
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data });
}
