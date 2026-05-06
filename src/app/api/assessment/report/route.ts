import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROSPECT_FROM_ADDRESS = 'Organic AI Solutions <noreply@organicaisolutions.ai>';
const STAFF_FROM_ADDRESS = 'OAS Assessor <noreply@organicaisolutions.ai>';
const EMAIL_LOGO_URL =
  'https://organic-ai-solutions-git-site-upgrade-may-2026-btctcs-projects.vercel.app/email-logo.png';

const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://organic-ai-solutions-git-site-upgrade-may-2026-btctcs-projects.vercel.app';

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

  const conversationJson = (convo?.conversation_json as Array<{ role: string; content: string }>) || fallbackMessages || [];
  const conversationText = conversationJson
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const firstName = typeof name === 'string' && name.trim() ? name.trim().split(/\s+/)[0] : 'there';

  await supabaseAdmin
    .from('assessment_conversations')
    .upsert({
      id: conversationId,
      conversation_json: conversationJson,
      prospect_email: email,
      prospect_name: name,
      status: 'awaiting_trigger',
    });

  const { data: triggerRow, error: triggerError } = await supabaseAdmin
    .from('audit_triggers')
    .insert({ conversation_id: conversationId })
    .select('token')
    .single();

  if (triggerError || !triggerRow) {
    console.error({ stage: 'audit_trigger_create_failed', error: triggerError });
    return NextResponse.json({ error: 'Failed to create trigger' }, { status: 500 });
  }

  const triggerUrl = `${SITE_BASE_URL}/api/assessment/trigger-audit?token=${triggerRow.token}&conv=${conversationId}`;

  try {
    await resend.emails.send({
      from: PROSPECT_FROM_ADDRESS,
      to: email,
      subject: 'Your AI Opportunity Report is being prepared',
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Your AI Opportunity Report is being prepared</title>
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
                        <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:600;line-height:1.3;">We've got your assessment</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#FFFFFF;padding:32px;color:#333;font-size:15px;line-height:1.6;">
                        <p style="margin:0 0 18px;">Hi ${firstName},</p>
                        <p style="margin:0 0 18px;">Thanks for taking the time to walk through your business. Your personalized AI Opportunity Report is being prepared.</p>
                        <p style="margin:0 0 18px;"><strong>What happens next:</strong> Within 24 hours you'll receive a detailed report covering your specific AI opportunities, plus a tailored recommendation for how Organic AI Solutions can help you implement them.</p>
                        <p style="margin:0 0 24px;">If anything urgent comes up in the meantime, reply to this email or reach out to <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a>.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#FFFFFF;padding:32px;border-top:1px solid #EEE;">
                        <p style="margin:0 0 4px;color:#1A1A1A;font-size:15px;font-weight:700;line-height:1.5;">Terrence Crawford</p>
                        <p style="margin:0 0 6px;color:#555;font-size:14px;line-height:1.5;">Co-Founder &amp; CEO, Organic AI Solutions</p>
                        <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-size:14px;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a>
                        <br/>
                        <a href="https://organicaisolutions.ai" style="color: #E25822; font-size:14px; font-weight: 600; text-decoration: none;">organicaisolutions.ai</a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background:#F8F8F8;padding:24px 32px;color:#888;font-size:12px;line-height:1.6;text-align:center;">
                        <p style="margin:0 0 8px;">You received this because you requested an AI Opportunity Assessment at <a href="https://organicaisolutions.ai" style="color: #888;">organicaisolutions.ai</a></p>
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
    });

    const notifyEmail = process.env.ASSESSMENT_NOTIFY_EMAIL;
    const notifyEmailDiego = process.env.ASSESSMENT_NOTIFY_EMAIL_DIEGO;

    if (!notifyEmail) {
      console.error({
        stage: 'internal_notify_skipped',
        reason: 'ASSESSMENT_NOTIFY_EMAIL not set',
      });
    } else {
      const recipients: string[] = [notifyEmail];
      if (notifyEmailDiego && notifyEmailDiego !== notifyEmail) {
        recipients.push(notifyEmailDiego);
      }

      await resend.emails.send({
        from: STAFF_FROM_ADDRESS,
        to: recipients,
        subject: `🔔 New OAS Lead: ${name || email}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head><meta charset="UTF-8" /></head>
            <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;background:#fafafa;padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #eee;">
                <tr>
                  <td style="background:#E25822;color:#fff;padding:20px 24px;">
                    <h2 style="margin:0;font-size:18px;font-weight:600;">New Lead — Audit Trigger Required</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;font-size:14px;line-height:1.6;">
                    <p style="margin:0 0 12px;"><strong>Name:</strong> ${name || '(not provided)'}<br/>
                    <strong>Email:</strong> <a href="mailto:${email}" style="color:#E25822;">${email}</a><br/>
                    <strong>Conversation ID:</strong> <code style="background:#f4f4f4;padding:2px 6px;border-radius:3px;">${conversationId}</code></p>

                    <p style="margin:24px 0 12px;font-weight:600;font-size:15px;">Decision: real lead or noise?</p>
                    <p style="margin:0 0 16px;color:#555;">If this looks like a real prospect, tap below. The button generates a tailored audit and sends it to ${email}. The link expires in 24 hours and can only be used once.</p>

                    <table cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
                      <tr>
                        <td style="background:#E25822;border-radius:8px;">
                          <a href="${triggerUrl}" style="display:inline-block;padding:14px 28px;color:#fff;font-weight:600;text-decoration:none;font-size:15px;">Generate audit and send to prospect →</a>
                        </td>
                      </tr>
                    </table>

                    <h3 style="margin:24px 0 8px;font-size:14px;color:#1a1a1a;">Conversation transcript</h3>
                    <pre style="background:#f5f5f5;padding:16px;white-space:pre-wrap;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.5;border-radius:4px;color:#333;">${conversationText}</pre>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8f8f8;color:#888;font-size:11px;padding:14px 24px;text-align:center;">
                    Internal use only · Do not forward · Organic AI Solutions
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    }
  } catch (err) {
    console.error({ stage: 'email_send_failed', error: err instanceof Error ? err.message : 'unknown' });
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 });
  }

  return NextResponse.json({ success: true, status: 'awaiting_trigger' });
}
