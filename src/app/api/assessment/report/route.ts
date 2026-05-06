import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { resend } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROSPECT_FROM_ADDRESS = 'Organic AI Solutions <noreply@organicaisolutions.ai>';
const STAFF_FROM_ADDRESS = 'OAS Assessor <noreply@organicaisolutions.ai>';
// Temp: Preview URL until site-upgrade-may-2026 merges to main
const EMAIL_LOGO_URL =
  'https://organic-ai-solutions-git-site-upgrade-may-2026-btctcs-projects.vercel.app/email-logo.png';

const REPORT_PROMPT = `You are writing a personalized AI Opportunity Report for a prospect of Organic AI Solutions.

Below is the discovery conversation. Generate a tailored report in clean HTML (no markdown, no code fences) with these sections:

1. Snapshot — One paragraph summarizing what you learned about their business.
2. Top 3 AI Opportunities — The three highest-leverage places AI agents would help, specific to what they told you. Each includes: opportunity name, what it does, why it matters for them.

Tone: senior operator, not salesy. Specific to their answers — no generic AI consulting fluff.

Constraints:
- Do NOT include package recommendations, named service tiers, plans, dollar amounts, or closing next-step sections.
- Do NOT invent client case studies.
- Use <h2>, <h3>, <p>, <ul>, <li> tags only. Keep total length under 500 words.
- Output ONLY the HTML. No preamble, no explanation, no code fences.

CONVERSATION:`;

export async function POST(req: NextRequest) {
  const { conversationId, email, name, messages } = await req.json();

  const { data: convo, error } = await supabaseAdmin
    .from('assessment_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  const fallbackMessages = Array.isArray(messages) ? messages : null;
  if ((error || !convo) && !fallbackMessages) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const conversationJson = (convo?.conversation_json as any[]) || fallbackMessages;
  const conversationText = conversationJson
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const reportResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: `${REPORT_PROMPT}\n\n${conversationText}` }],
  });

  const block = reportResponse.content[0];
  const reportHtml = block.type === 'text' ? block.text : '';
  const firstName = typeof name === 'string' && name.trim() ? name.trim().split(/\s+/)[0] : 'there';

  await supabaseAdmin
    .from('assessment_conversations')
    .upsert({
      id: conversationId,
      conversation_json: conversationJson,
      prospect_email: email,
      prospect_name: name,
      report_html: reportHtml,
      status: 'completed',
    });

  // Update budget tracker for the report call (Sonnet 4: $3/M input, $15/M output)
  const inputTokens = reportResponse.usage?.input_tokens || 0;
  const outputTokens = reportResponse.usage?.output_tokens || 0;
  const cost = (inputTokens / 1_000_000) * 3.0 + (outputTokens / 1_000_000) * 15.0;
  if (cost > 0) {
    const { data: b } = await supabaseAdmin
      .from('assessment_budget')
      .select('estimated_cost_usd')
      .eq('id', 1)
      .single();
    await supabaseAdmin
      .from('assessment_budget')
      .update({ estimated_cost_usd: Number(b?.estimated_cost_usd || 0) + cost })
      .eq('id', 1);
  }

  try {
    // Email prospect
    await sendAssessmentEmail({
      from: PROSPECT_FROM_ADDRESS,
      to: email,
      subject: 'Your AI Opportunity Report is here',
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Your AI Opportunity Report</title>
          </head>
          <body style="margin:0;padding:0;background:#FAFAFA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAFAFA;margin:0;padding:0;">
              <tr>
                <td align="center" style="padding:40px 16px;">
                  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background:#FFFFFF;border-collapse:collapse;">
                    <tr>
                      <td align="center" style="background:#FFFFFF;padding:40px 32px 24px;">
                        <img src="${EMAIL_LOGO_URL}" alt="Organic AI Solutions" width="200" style="display:block;max-width:200px;height:auto;margin:0 auto;" />
                        <p style="margin:12px 0 0;color:#555;font-size:14px;font-style:italic;line-height:1.4;">Grow Organically. Scale Intelligently.</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background:#E25822;padding:24px 32px;">
                        <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:600;line-height:1.3;">Your AI Opportunity Report</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#FFFFFF;padding:32px;color:#333;font-size:15px;line-height:1.6;">
                        <p style="margin:0 0 18px;color:#1A1A1A;font-size:15px;line-height:1.6;">Hi ${firstName},</p>
                        <p style="margin:0 0 24px;color:#333;font-size:15px;line-height:1.6;">Thanks for taking the time to walk through your business. Here's your personalized AI Opportunity Report:</p>
                        <div style="color:#333;font-size:15px;line-height:1.6;">
                          ${reportHtml}
                        </div>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;background:#F4F4F4;border-radius:8px;">
                          <tr>
                            <td style="padding:24px;">
                              <h3 style="margin:0 0 12px;color:#1A1A1A;font-size:17px;font-weight:600;line-height:1.35;">Want to dig deeper?</h3>
                              <p style="margin:0 0 14px;color:#333;font-size:15px;line-height:1.6;">The next step is a quick 20-minute conversation. We'll walk through how these would work in your specific business, answer technical questions, and put a realistic price and timeline on the table.</p>
                              <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">Just reply to this email or send a note to <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a> and we'll set it up.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#FFFFFF;padding:32px;border-top:1px solid #EEE;">
                        <p style="margin:0 0 4px;color:#1A1A1A;font-size:15px;font-weight:700;line-height:1.5;">Terrence Crawford</p>
                        <p style="margin:0 0 6px;color:#555;font-size:14px;line-height:1.5;">Co-Founder &amp; CEO, Organic AI Solutions</p>
                        <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-size:14px;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background:#F8F8F8;padding:24px 32px;color:#888;font-size:12px;line-height:1.6;text-align:center;">
                        <p style="margin:0 0 8px;">You received this because you requested an AI Opportunity Assessment at <a href="https://organicaisolutions.ai" style="color:#888;text-decoration:underline;">organicaisolutions.ai</a></p>
                        <p style="margin:0 0 8px;">Organic AI Solutions &middot; Dallas, Texas</p>
                        <p style="margin:0;"><a href="https://organicaisolutions.ai/privacy" style="color:#888;text-decoration:underline;">Privacy</a> &middot; <a href="https://organicaisolutions.ai/terms" style="color:#888;text-decoration:underline;">Terms</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      conversationId,
      recipientType: 'prospect',
    });

    // Brief to TC + Diego
    const notifyEmail = process.env.ASSESSMENT_NOTIFY_EMAIL;
    const notifyEmailDiego = process.env.ASSESSMENT_NOTIFY_EMAIL_DIEGO;
    if (!notifyEmail || !notifyEmailDiego) {
      console.error({
        stage: 'email_send_failed',
        error: 'Assessment notification email environment variables are missing.',
        errorName: 'MissingEmailConfig',
        statusCode: undefined,
        conversationId,
      });
      return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    }

    await sendAssessmentEmail({
      from: STAFF_FROM_ADDRESS,
      to: [notifyEmail, notifyEmailDiego],
      subject: `New OAS Assessment: ${name || email}`,
      html: `
        <p><strong>Email:</strong> ${email}<br/>
        <strong>Name:</strong> ${name || '(not provided)'}<br/>
        <strong>Conversation ID:</strong> ${conversationId}</p>
        <h3>Conversation</h3>
        <pre style="background: #f5f5f5; padding: 16px; white-space: pre-wrap; font-family: monospace; font-size: 13px;">${conversationText}</pre>
        <h3>Generated Report</h3>
        <div style="border-left: 3px solid #d4a574; padding-left: 16px;">${reportHtml}</div>
      `,
      conversationId,
      recipientType: 'staff',
      notifyEmail,
    });
  } catch {
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 });
  }

  return NextResponse.json({ success: true, report: reportHtml });
}

async function sendAssessmentEmail({
  from,
  to,
  subject,
  html,
  conversationId,
  recipientType,
  notifyEmail,
}: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  conversationId: string;
  recipientType: 'prospect' | 'staff';
  notifyEmail?: string;
}) {
  try {
    console.log({
      stage: 'email_send_start',
      to: recipientType === 'staff' ? notifyEmail : 'prospect',
      from,
      conversationId,
    });
    const result = await resend.emails.send({ from, to, subject, html });
    if (result.error) {
      throw result.error;
    }
    console.log({
      stage: 'email_send_success',
      messageId: result.data?.id,
      conversationId,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    console.error({
      stage: 'email_send_failed',
      error: err.message,
      errorName: err.name,
      statusCode: err.statusCode,
      conversationId,
    });
    throw error;
  }
}
