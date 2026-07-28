/**
 * /api/interview — Interview Engine API Route
 *
 * Architecture:
 *   Client (RecorderScene) → POST /api/interview → recorder.ts + memory-extractor.ts → Response
 *
 * This route is the single boundary between the UI and the AI logic.
 * The client never calls OpenAI directly.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateRecorderResponse } from "@/lib/ai/recorder";
import { extractMemories, pickLeadEntry } from "@/lib/ai/memory-extractor";
import { pickQuestion, pickGenericFallback } from "@/lib/ai/question-bank";
import type {
  ConversationMessage,
  ExtractedMemory,
  InterviewRequest,
  InterviewResponse,
  LeadSubject,
  StoryMemory,
} from "@/types/story";

export const runtime = "edge";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toStoryMemories(
  extracted: ExtractedMemory[],
  existing: StoryMemory[],
): StoryMemory[] {
  const existingKeys = new Set(
    existing.map((m) => `${m.type}:${m.value.toLowerCase()}`),
  );

  return extracted
    .filter(
      (m) => !existingKeys.has(`${m.type}:${m.value.toLowerCase()}`),
    )
    .slice(0, 3)
    .map((m) => ({
      id: makeId(),
      type: m.type,
      value: m.value,
      createdAt: Date.now(),
    }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as InterviewRequest;

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Missing 'message' field." },
        { status: 400 },
      );
    }

    const conversation: ConversationMessage[] = Array.isArray(
      body.conversation,
    )
      ? body.conversation
      : [];

    const existingMemories: StoryMemory[] = Array.isArray(
      body.existingMemories,
    )
      ? body.existingMemories
      : [];

    const lang = body.lang === "zh" ? "zh" : "en";

    // Run both in parallel: generate response + extract memories
    const existingExtracted: ExtractedMemory[] = existingMemories.map(
      (m) => ({ type: m.type, value: m.value }),
    );

    const rawMemories = extractMemories(body.message, existingExtracted);
    const leadEntry = pickLeadEntry(rawMemories);
    const lead: LeadSubject | undefined = leadEntry
      ? { value: leadEntry.value, type: leadEntry.type }
      : undefined;

    const bankQuestion = lead
      ? pickQuestion(lead.type, lang, conversation)
      : pickGenericFallback(lang, conversation);

    const [recorderResponse] = await Promise.all([
      generateRecorderResponse(body.message, conversation, lang, lead, bankQuestion),
      Promise.resolve(rawMemories),
    ]);

    const newMemories = toStoryMemories(rawMemories, existingMemories);

    const response: InterviewResponse = {
      recorderResponse,
      newMemories,
      lead,
    };

    return NextResponse.json(response);
  } catch (err) {
    // Never expose internal errors. Return a graceful fallback.
    console.error("[interview] Error:", err);

    const fallbackResponse: InterviewResponse = {
      recorderResponse:
        "Take your time. Even a single image is enough to begin.",
      newMemories: [],
    };

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
