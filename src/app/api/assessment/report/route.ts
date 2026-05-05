import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { resend } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const REPORT_PROMPT = `You are writing a personalized AI Opportunity Report for a prospect of Organic AI Solutions.

Below is the discovery conversation. Generate a tailored report in clean HTML (no markdown, no code fences) with these sections:

1. Snapshot — One paragraph summarizing what you learned about their business.
2. Top 3 AI Opportunities — The three highest-leverage places AI agents would help, specific to what they told you. Each includes: opportunity name, what it does, why it matters for them.
3. Recommended Package — One of: Starter, Pro, All-Star, Enterprise, or Custom. Explain why this fits.
4. What Happens Next — Brief: TC will reach out within one business day to schedule a no-pressure conversation.

Tone: senior operator, not salesy. Specific to their answers — no generic AI consulting fluff.

Constraints:
- Do NOT quote dollar amounts. Just package name + rationale.
- Do NOT invent client case studies.
- Use <h2>, <h3>, <p>, <ul>, <li> tags only. Keep total length under 600 words.
- Open with this exact opening sentence wrapped in a <p> tag: "This is your personalized AI Opportunity Report from Organic AI Solutions, a Dallas-based AI consulting firm that deploys production AI agents and AI-native websites for businesses like yours."
- Output ONLY the HTML. No preamble, no explanation, no code fences.

CONVERSATION:`;

export async function POST(req: NextRequest) {
  const { conversationId, email, name } = await req.json();

  const { data: convo, error } = await supabaseAdmin
    .from('assessment_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error || !convo) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const conversationText = (convo.conversation_json as any[])
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const reportResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4',
    max_tokens: 2000,
    messages: [{ role: 'user', content: `${REPORT_PROMPT}\n\n${conversationText}` }],
  });

  const block = reportResponse.content[0];
  const reportHtml = block.type === 'text' ? block.text : '';

  await supabaseAdmin
    .from('assessment_conversations')
    .update({
      prospect_email: email,
      prospect_name: name,
      report_html: reportHtml,
      status: 'completed',
    })
    .eq('id', conversationId);

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

  // Email prospect
  await resend.emails.send({
    from: 'TC at Organic AI Solutions <tc@organicaisolutions.ai>',
    to: email,
    subject: 'Your AI Opportunity Report is here',
    html: `
      <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1a1a1a;">
        <p>Hi ${name || 'there'},</p>
        <p>Thanks for taking the time to walk me through your business. Here's your personalized AI Opportunity Report:</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
        ${reportHtml}
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
        <p>I'll be in touch within one business day to schedule a quick call.</p>
        <p>— TC<br/>CEO, Organic AI Solutions<br/>organicaisolutions.ai</p>
      </div>
    `,
  });

  // Brief to TC + Diego
  await resend.emails.send({
    from: 'OAS Assessor <noreply@organicaisolutions.ai>',
    to: [process.env.ASSESSMENT_NOTIFY_EMAIL!, process.env.ASSESSMENT_NOTIFY_EMAIL_DIEGO!],
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
  });

  return NextResponse.json({ success: true, report: reportHtml });
}
