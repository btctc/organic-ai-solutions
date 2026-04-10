import { VirtualFileSystem } from "@/lib/file-system";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { buildStrReplaceTool } from "@/lib/tools/str-replace";
import { buildFileManagerTool } from "@/lib/tools/file-manager";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { getLanguageModel } from "@/lib/provider";
import { generationPrompt } from "@/lib/prompts/generation";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "tool"]),
      content: z.union([z.string(), z.array(z.unknown())]),
      id: z.string().optional(),
      toolInvocations: z.array(z.unknown()).optional(),
    })
  ),
  files: z.record(z.string(), z.unknown()),
  projectId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await verifySession(req);
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { messages, files, projectId } = parsed.data;

  // Reconstruct the VirtualFileSystem from serialized data
  const fileSystem = new VirtualFileSystem();
  fileSystem.deserializeFromNodes(files);

  const model = getLanguageModel();
  // Use fewer steps for mock provider to prevent repetition
  const isMockProvider = !process.env.ANTHROPIC_API_KEY;
  const userMessages = messages.filter((m) => m.role !== "system");
  const modelMessages = await convertToModelMessages(userMessages);

  const result = streamText({
    model,
    messages: [
      {
        role: "system",
        content: generationPrompt,
        providerOptions: {
          anthropic: { cacheControl: { type: "ephemeral" } },
        },
      },
      ...modelMessages,
    ],
    maxOutputTokens: 10_000,
    stopWhen: stepCountIs(isMockProvider ? 4 : 40),
    onError: (err: any) => {
      console.error(err);
    },
    tools: {
      str_replace_editor: buildStrReplaceTool(fileSystem),
      file_manager: buildFileManagerTool(fileSystem),
    },
    onFinish: async ({ response }) => {
      // Save to project if projectId is provided and user is authenticated
      if (projectId) {
        try {
          // Combine original user messages with response messages
          const responseMessages = response.messages || [];
          const allMessages = [...userMessages, ...responseMessages];

          await prisma.project.update({
            where: {
              id: projectId,
              userId: session.userId,
            },
            data: {
              messages: JSON.stringify(allMessages),
              data: JSON.stringify(fileSystem.serialize()),
            },
          });
        } catch (error) {
          console.error("Failed to save project data:", error);
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

export const maxDuration = 120;
