import { NextRequest } from 'next/server';
import { resend } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { anthropic } from '@/lib/anthropic';
import { pickTopAgentsForLead, type OASAgent } from '@/lib/agentCatalog';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROSPECT_FROM_ADDRESS = 'Organic AI Solutions <noreply@organicaisolutions.ai>';
const EMAIL_LOGO_URL =
  'https://organic-ai-solutions-git-site-upgrade-may-2026-btctcs-projects.vercel.app/email-logo.png';

interface ConversationMessage {
  role: string;
  content: string;
}

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
    .select('prospect_email, prospect_name, conversation_json')
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

  const conversationJson = (convo.conversation_json as ConversationMessage[]) || [];
  const { industry, painPoints } = extractIndustryAndPainPoints(conversationJson);
  const topAgents = pickTopAgentsForLead(industry, painPoints, 3);

  let agentRationales: Record<string, string> = {};
  try {
    agentRationales = await generateRationales(topAgents, conversationJson, firstName);
  } catch (err) {
    console.error({ stage: 'rationale_gen_failed', error: err instanceof Error ? err.message : 'unknown' });
    for (const a of topAgents) {
      agentRationales[a.id] = a.capability;
    }
  }

  try {
    await resend.emails.send({
      from: PROSPECT_FROM_ADDRESS,
      to: convo.prospect_email,
      subject: 'Your AI Opportunity Report — 3 agents we recommend',
      html: renderProspectEmail(firstName, topAgents, agentRationales),
    });

    await supabaseAdmin
      .from('assessment_conversations')
      .update({
        status: 'audit_triggered',
        recommended_package: topAgents.map((a) => a.id).join(','),
      })
      .eq('id', conversationId);
  } catch (err) {
    console.error({ stage: 'trigger_email_send_failed', error: err instanceof Error ? err.message : 'unknown' });
    return new Response(htmlPage('Email failed', 'The trigger was logged but the email failed to send. Check Resend logs.'), {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const agentNames = topAgents.map((a) => a.name).join(', ');
  return new Response(
    htmlPage(
      'Audit triggered ✓',
      `Sent the 3-agent report to ${convo.prospect_email}. Recommended: ${agentNames}.`
    ),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

function extractIndustryAndPainPoints(messages: ConversationMessage[]): {
  industry: string | null;
  painPoints: string[];
} {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage) return { industry: null, painPoints: [] };

  const content = firstUserMessage.content;
  const industryMatch = content.match(/Industry:\s*(.+?)(?:\n|$)/i);
  const painMatch = content.match(/Top friction:\s*(.+?)(?:\n|$)/i);

  const industry = industryMatch ? industryMatch[1].trim() : null;
  const painPoints = painMatch
    ? painMatch[1].split(',').map((p) => p.trim()).filter((p) => p.length > 0)
    : [];

  return { industry, painPoints };
}

async function generateRationales(
  agents: OASAgent[],
  messages: ConversationMessage[],
  firstName: string
): Promise<Record<string, string>> {
  const conversationText = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const agentBriefs = agents
    .map(
      (a, i) =>
        `${i + 1}. ${a.name} (id: ${a.id}) — ${a.tagline}\n   Capability: ${a.capability}`
    )
    .join('\n\n');

  const prompt = `You are writing personalized rationale paragraphs for an AI Opportunity Report from Organic AI Solutions.

Prospect first name: ${firstName}

CONVERSATION TRANSCRIPT:
${conversationText}

AGENTS TO WRITE RATIONALE FOR:
${agentBriefs}

For each agent above, write a 2-3 sentence rationale tying that specific agent to what the prospect actually said in the conversation. Be specific — reference their actual pain points, industry, business size, and operational details. Do NOT be generic. Do NOT mention pricing.

Return ONLY a valid JSON object with agent IDs as keys and rationale strings as values. Example format:
{
  "lead-qualifier": "Your team is losing leads after hours because...",
  "reviews-reputation": "Since you mentioned reviews are inconsistent..."
}

No preamble, no markdown, no code fences. Just the JSON object.`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  const raw = block.type === 'text' ? block.text : '';

  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Record<string, string>;
    return parsed;
  } catch {
    const fallback: Record<string, string> = {};
    for (const a of agents) fallback[a.id] = a.capability;
    return fallback;
  }
}

function renderProspectEmail(
  firstName: string,
  agents: OASAgent[],
  rationales: Record<string, string>
): string {
  const agentBlocks = agents
    .map(
      (a, i) => `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;background:#FAFAFA;border-radius:8px;border-left:3px solid #E25822;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 4px;color:#888;font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;">Recommendation #${i + 1}</p>
              <h3 style="margin:0 0 6px;color:#1A1A1A;font-size:18px;font-weight:700;line-height:1.3;">${a.name}</h3>
              <p style="margin:0 0 12px;color:#E25822;font-size:14px;font-weight:600;font-style:italic;">${a.tagline}</p>
              <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.6;"><strong>What it does:</strong> ${a.capability}</p>
              <p style="margin:0;color:#333;font-size:14px;line-height:1.6;"><strong>Why it fits you:</strong> ${rationales[a.id] || a.capability}</p>
            </td>
          </tr>
        </table>
      `
    )
    .join('');

  return `<!DOCTYPE html>
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
          <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:640px;background:#FFFFFF;border-collapse:collapse;">
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
              <td style="background:#FFFFFF;padding:32px 32px 16px;color:#333;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 18px;color:#1A1A1A;">Hi ${firstName},</p>
                <p style="margin:0 0 24px;">Thanks for walking us through your business. Based on what you shared, here are the three OAS agents that would have the highest impact for you right now.</p>
                ${agentBlocks}
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:24px;background:#F4F4F4;border-radius:8px;">
                  <tr>
                    <td style="padding:24px;">
                      <h3 style="margin:0 0 12px;color:#1A1A1A;font-size:17px;font-weight:600;line-height:1.35;">Want to see how this would actually run in your business?</h3>
                      <p style="margin:0 0 14px;color:#333;font-size:15px;line-height:1.6;">The next step is a 20-minute call. We'll walk through how these agents would work specifically for you, answer technical questions, and put a realistic price and timeline on the table. There are also a few additional agents we held back from this email that may fit your situation — we'll cover those on the call too.</p>
                      <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">Just reply to this email or reach out to <a href="mailto:tc@organicaisolutions.ai" style="color:#E25822;font-weight:600;text-decoration:none;">tc@organicaisolutions.ai</a> and we'll set it up.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#FFFFFF;padding:24px 32px 32px;border-top:1px solid #EEE;">
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
</html>`;
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
    .card { background: #fff; border: 1px solid #eee; max-width: 560px; padding: 40px; text-align: center; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
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
