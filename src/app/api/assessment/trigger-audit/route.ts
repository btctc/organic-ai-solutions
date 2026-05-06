import { NextRequest } from 'next/server';
import { resend } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROSPECT_FROM_ADDRESS = 'Organic AI Solutions <noreply@organicaisolutions.ai>';
const EMAIL_LOGO_URL =
  'https://organic-ai-solutions-git-site-upgrade-may-2026-btctcs-projects.vercel.app/email-logo.png';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const conversationId = searchParams.get('conv');

  if (!token || !conversationId) {
    return new Response(htmlPage('Invalid link', 'This link is missing required parameters.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const { data: trigger, error: triggerError } = await supabaseAdmin
    .from('audit_triggers')
    .select('*')
    .eq('token', token)
    .eq('conversation_id', conversationId)
    .single();

  if (triggerError || !trigger) {
    return new Response(htmlPage('Link not found', 'This audit trigger link is invalid or has been removed.'), {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (trigger.used_at) {
    return new Response(htmlPage('Already used', 'This audit trigger has already been used. Each link is single-use.'), {
      status: 410,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (new Date(trigger.expires_at) < new Date()) {
    return new Response(htmlPage('Link expired', 'This audit trigger expired. Magic links are valid for 24 hours.'), {
      status: 410,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  await supabaseAdmin
    .from('audit_triggers')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  const { data: convo, error: convoError } = await supabaseAdmin
    .from('assessment_conversations')
    .select('prospect_email, prospect_name')
    .eq('id', conversationId)
    .single();

  if (convoError || !convo || !convo.prospect_email) {
    return new Response(htmlPage('Prospect missing', 'Could not locate prospect contact info for this conversation.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const firstName = typeof convo.prospect_name === 'string' && convo.prospect_name.trim()
    ? convo.prospect_name.trim().split(/\s+/)[0]
    : 'there';

  try {
    await resend.emails.send({
      from: PROSPECT_FROM_ADDRESS,
      to: convo.prospect_email,
      subject: 'Your AI Opportunity Report is being finalized',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body style="margin:0;padding:0;background:#FAFAFA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:40px 16px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;">
                    <tr><td align="center" style="padding:32px 24px;"><img src="${EMAIL_LOGO_URL}" alt="Organic AI Solutions" width="180" style="max-width:180px;height:auto;" /></td></tr>
                    <tr><td style="padding:24px 32px;font-size:15px;line-height:1.6;">
                      <p style="margin:0 0 16px;">Hi ${firstName},</p>
                      <p style="margin:0 0 16px;">Quick update — your AI Opportunity Report is being finalized right now. You'll receive the full report shortly.</p>
                      <p style="margin:0 0 16px;">If anything urgent comes up, reply directly or email <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a>.</p>
                      <p style="margin:24px 0 0;color:#555;">— Terrence<br/>Organic AI Solutions</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    await supabaseAdmin
      .from('assessment_conversations')
      .update({ status: 'audit_triggered' })
      .eq('id', conversationId);
  } catch (err) {
    console.error({ stage: 'trigger_email_send_failed', error: err instanceof Error ? err.message : 'unknown' });
    return new Response(htmlPage('Email failed', 'The trigger was logged but the email failed to send. Check Resend logs.'), {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new Response(
    htmlPage(
      'Audit triggered ✓',
      `Confirmation email sent to ${convo.prospect_email}. Block B will plug in the real audit pipeline once shipped.`
    ),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

function htmlPage(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — OAS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #333; margin: 0; padding: 40px 24px; display: flex; min-height: 100vh; align-items: center; justify-content: center; }
    .card { background: #fff; border: 1px solid #eee; max-width: 480px; padding: 40px; text-align: center; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    h1 { margin: 0 0 16px; color: #1a1a1a; font-size: 24px; }
    p { margin: 0; color: #555; font-size: 15px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`;
}
