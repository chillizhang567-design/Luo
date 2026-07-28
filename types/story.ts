/**
 * Drift — Story & Memory Types
 *
 * Shared type definitions for the interview engine, memory extraction,
 * and story archive systems.
 */

/** The kinds of memory fragments The Recorder collects. */
export type MemoryType =
  | "scene"
  | "place"
  | "person"
  | "emotion"
  | "moment"
  | "meaning";

/** A single extracted memory fragment. */
export interface StoryMemory {
  id: string;
  type: MemoryType;
  value: string;
  createdAt: number;
}

/** Roles in the conversation — only two speakers. */
export type MessageRole = "recorder" | "user";

/** A single message in the interview conversation. */
export interface ConversationMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

/** Request body sent to /api/interview. */
export interface InterviewRequest {
  message: string;
  conversation: ConversationMessage[];
  existingMemories: StoryMemory[];
  /** Which interview mode produced this turn (affects tone/seed only). */
  mode?: "guided" | "random";
  /** UI language — lets The Recorder answer in the same tongue. */
  lang?: "en" | "zh";
}

/** The most salient subject The Recorder named this turn. */
export interface LeadSubject {
  value: string;
  type: MemoryType;
}

/** Response returned by /api/interview. */
export interface InterviewResponse {
  recorderResponse: string;
  newMemories: StoryMemory[];
  /** The subject The Recorder is following, used to build contextual prompts. */
  lead?: LeadSubject;
}

/** Raw extraction result before id/timestamp are assigned. */
export interface ExtractedMemory {
  type: MemoryType;
  value: string;
}

/** Human-readable labels + icons for each memory type. */
export const MEMORY_TYPE_META: Record<
  MemoryType,
  { icon: string; label: string }
> = {
  scene: { icon: "\u2733", label: "a scene" },
  place: { icon: "\uD83C\uDF3F", label: "a place" },
  person: { icon: "\u2726", label: "a person" },
  emotion: { icon: "\u2248", label: "a feeling" },
  moment: { icon: "\u25C7", label: "a moment" },
  meaning: { icon: "\u25EF", label: "a meaning" },
};
