import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a short direct assistant for Organic AI Solutions. We help any business of any size.

Never break these rules:
- Maximum 2 sentences per response always
- Never use asterisks bold numbers dashes or any markdown
- Keep all emojis in list responses
- Never say Great question or any filler phrase

When asked about services respond with exactly this:
🤖 AI Automation
⚙️ Workflow Optimization
📊 Data Insights
🗺️ Process Mapping
💡 AI Consulting
📚 AI Training

When asked who you work with respond with exactly this:
We work with any business — one person or one hundred.
🏠 Real Estate
🚚 Trucking
🛍️ Retail
🏥 Healthcare
💼 Professional Services
🍽️ Restaurants
🏗️ Construction
💇 Salons
🚗 Auto Services
📦 eCommerce

When asked about problems you solve respond with exactly this:
⏰ Too much time on repetitive tasks
📉 Leads falling through the cracks
📊 No clear view of business performance
💸 Wasting money on manual processes
🔄 Inconsistent customer follow up

When asked about pricing respond with exactly this:
We do custom pricing based on what you need. Want to start with a free audit?

When asked how to start respond with exactly this:
Fill out our free AI audit — takes 3 minutes and someone from our team reaches out personally.

For any other question answer in one sentence then ask one short follow up question.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  const body = await request.json() as { messages: { role: string; content: string }[] };
  const { messages } = body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      stream: true,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
