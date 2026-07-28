"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/components/LanguageProvider";
import type {
  ConversationMessage,
  InterviewResponse,
  MemoryType,
  StoryMemory,
} from "@/types/story";

export type InterviewPhase = "idle" | "recording";

export type DoorContext = {
  lead?: string;
  leadType?: MemoryType;
  types: MemoryType[];
};

export function useInterview(seedQuestion: string, mode: "guided" | "random") {
  const { t, locale } = useTranslation();

  const [memory, setMemory] = useState("");
  const [phase, setPhase] = useState<InterviewPhase>("idle");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [memories, setMemories] = useState<StoryMemory[]>([]);
  const [recorderText, setRecorderText] = useState<string>(seedQuestion);
  const [doorContext, setDoorContext] = useState<DoorContext>({ types: [] });
  const [hasStarted, setHasStarted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const convRef = useRef(conversation);
  const memRef = useRef(memories);
  const seedRef = useRef(seedQuestion);
  convRef.current = conversation;
  memRef.current = memories;
  seedRef.current = seedQuestion;

  useEffect(() => {
    if (conversation.length === 0) {
      setRecorderText(seedQuestion);
    }
  }, [seedQuestion, conversation.length]);

  const submit = useCallback(
    async (answer: string) => {
      if (phase !== "idle" || answer.trim().length === 0) return;

      setPhase("recording");
      setMemory("");
      setHasStarted(true);

      let base = convRef.current;
      if (base.length === 0) {
        base = [
          {
            role: "recorder" as const,
            content: seedRef.current,
            timestamp: Date.now(),
          },
        ];
      } else {
        const lastMsg = base[base.length - 1];
        if (lastMsg.role === "recorder") {
          base = base.slice(0, -1);
        }
        if (base.length === 0) {
          base = [
            {
              role: "recorder" as const,
              content: seedRef.current,
              timestamp: Date.now(),
            },
          ];
        }
      }

      const userMessage: ConversationMessage = {
        role: "user",
        content: answer,
        timestamp: Date.now(),
      };
      const newConversation = [...base, userMessage];
      setConversation(newConversation);
      setTurnCount((prev) => prev + 1);

      const fallback = () => {
        const recorderMessage: ConversationMessage = {
          role: "recorder",
          content: t.recorder.fallback,
          timestamp: Date.now(),
        };
        setConversation([...newConversation, recorderMessage]);
        setRecorderText(t.recorder.fallback);
        setPhase("idle");
      };

      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: answer,
            conversation: base,
            existingMemories: memRef.current,
            mode,
            lang: locale,
          }),
        });

        if (!res.ok) {
          fallback();
          return;
        }

        const data: InterviewResponse = await res.json();

        const recorderMessage: ConversationMessage = {
          role: "recorder",
          content: data.recorderResponse,
          timestamp: Date.now(),
        };
        setConversation([...newConversation, recorderMessage]);
        setRecorderText(data.recorderResponse);

        if (data.lead) {
          setDoorContext({
            lead: data.lead.value,
            leadType: data.lead.type,
            types: data.newMemories.map((m) => m.type),
          });
        } else if (data.newMemories.length > 0) {
          setDoorContext({
            lead: data.newMemories[0].value,
            leadType: data.newMemories[0].type,
            types: data.newMemories.map((m) => m.type),
          });
        } else {
          const lastUserMsg = [...newConversation]
            .reverse()
            .find((m) => m.role === "user");
          if (lastUserMsg) {
            const words = lastUserMsg.content.split(/\s+/).filter((w) => w.length > 2);
            if (words.length > 0) {
              const topic = words.slice(0, 3).join(" ");
              setDoorContext({
                lead: topic.length > 30 ? topic.slice(0, 30) + "…" : topic,
                leadType: "meaning",
                types: ["meaning"],
              });
            }
          }
        }

        if (data.newMemories.length > 0) {
          setMemories((prev) => [...prev, ...data.newMemories]);
        }
      } catch {
        fallback();
      } finally {
        setPhase("idle");
      }
    },
    [phase, mode, t, locale],
  );

  const resetConversation = useCallback(() => {
    setConversation([]);
    setMemories([]);
    setRecorderText(seedQuestion);
    setDoorContext({ types: [] });
    setHasStarted(false);
    setTurnCount(0);
  }, [seedQuestion]);

  return {
    memory,
    setMemory,
    phase,
    conversation,
    memories,
    recorderText,
    doorContext,
    hasStarted,
    turnCount,
    submit,
    resetConversation,
  };
}