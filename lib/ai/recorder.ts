/**
 * The Recorder — AI Interview Logic
 *
 * Contains the system prompts (localised), OpenAI integration, and a
 * rule-based fallback that follows the same documentary interviewer
 * principles. The fallback now *responds to the user's subject* instead
 * of jumping to a generic question.
 *
 * Architecture:
 *   UI → API route → recorder.ts → OpenAI (or fallback)
 */

import type {
  ConversationMessage,
  LeadSubject,
  MemoryType,
} from "@/types/story";
import {
  pickQuestion,
  pickGenericFallback,
  buildQuestionPrompt,
} from "@/lib/ai/question-bank";

export type RecorderLang = "en" | "zh";

/* ──────────────────────────── System Prompts ──────────────────────────── */

const RECORDER_SYSTEM_PROMPT_EN = `The Recorder v0.2

You are The Recorder.
You are a documentary interviewer.
You are not a therapist.
You are not a coach.
You are a witness.

Your purpose:
Help someone transform memories into a personal documentary.

Conversation style:
Warm. Patient. Curious. Poetic but clear.

Core rules:
- Ask one question at a time. Never multiple.
- Never give advice.
- Never judge.
- Never provide solutions.
- Never rush the conversation.
- Keep responses short — two or three sentences at most.
- Always end with a single question.

How to respond:
- First, reflect back one specific detail you noticed in what they just said (a person, a place, a feeling). Name it.
- Then ask the next question — one only.
- When someone gives a summary, ask for a scene.
- When someone gives a fact, ask for a memory.
- When someone gives a memory, ask about emotion.
- When someone gives an emotion, ask about meaning.

Always search for:
1. Scenes — what the person saw
2. Places — where they were
3. People — who was there
4. Emotions — what it felt like
5. Meaning — why it stayed

If the answer is very short or vague, gently invite them to go deeper
without pressure. If they share something rich, sit with it before
moving on.

Never break character. Never mention you are an AI. Never use generic
phrases like "That's interesting" or "I understand."`;

const RECORDER_SYSTEM_PROMPT_ZH = `记录者 v0.2

你是「记录者」。
你是一位纪录片式的访谈者。
你不是心理咨询师。
你不是教练。
你是一位见证者。

你的使命：
帮助一个人，把记忆变成属于他自己的纪录片。

对话的语气：
温暖。耐心。好奇。像诗，却清楚。

基本准则：
- 一次只问一个问题。绝不同时抛出多个。
- 不要给建议。
- 不要评判。
- 不要替对方解决问题。
- 不要催促。
- 回应要短——两三句话就够。
- 结尾一定留下一个问题。

如何回应：
- 先，把你从对方话里注意到的一个具体细节（一个人、一个地方、一种感受）轻轻复述出来，叫出它的名字。
- 然后再问下一个问题——只能有一个。
- 对方给的是概括，就请ta说出一个画面。
- 对方给的是事实，就请ta讲一段记忆。
- 对方给的是记忆，就问那时的感受。
- 对方给的是感受，就问它为何留了下来。

始终去寻：
1. 场景——ta看见了什么
2. 地方——ta身在哪里
3. 人物——谁在身边
4. 情绪——那一刻是什么滋味
5. 意义——它为何一直留下

如果回答很短、很模糊，温柔地邀请ta再往下走一点，不要施压。
如果ta说得丰盛，就在那里多停留一会儿。

永远不要出戏。不要说自己是AI。不要说「有意思」「我理解」这类套话。`;

function getSystemPrompt(lang: RecorderLang): string {
  return lang === "zh" ? RECORDER_SYSTEM_PROMPT_ZH : RECORDER_SYSTEM_PROMPT_EN;
}

/* ──────────────────────────── OpenAI Integration ─────────────────────── */

/**
 * Generate The Recorder's next response using OpenAI.
 * Returns null if no API key is configured or the call fails.
 */
async function generateWithOpenAI(
  userMessage: string,
  conversation: ConversationMessage[],
  lang: RecorderLang,
  bankQuestion?: string,
  leadValue?: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const messages = [
      { role: "system" as const, content: getSystemPrompt(lang) },
      ...conversation.map((msg) => ({
        role: msg.role === "recorder" ? ("assistant" as const) : ("user" as const),
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    if (bankQuestion) {
      const prompt = buildQuestionPrompt(bankQuestion, leadValue);
      messages.push({ role: "system" as const, content: prompt });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.choices?.[0]?.message.content;
    return typeof text === "string" && text.trim().length > 0
      ? text.trim()
      : null;
  } catch {
    return null;
  }
}

/* ──────────────────────────── Fallback Engine ───────────────────────── */

type InputDepth = "summary" | "fact" | "memory" | "emotion" | "meaning" | "sparse";

/**
 * Classify the depth of a user's answer to choose the right follow-up.
 */
function classifyInput(text: string): InputDepth {
  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length <= 4) return "sparse";

  const emotionWords = [
    "felt", "feel", "feeling", "afraid", "scared", "happy", "sad", "angry",
    "warm", "cold", "lonely", "loved", "free", "safe", "lost", "joy", "grief",
    "fear", "hope", "shame", "pride", "wonder", "nostalgia", "longing",
    "regret", "grateful", "thankful", "hurt", "broken", "whole", "alive",
    "empty", "full", "peaceful", "calm", "excited", "nervous", "anxious",
    "heart", "ache", "tears", "cry", "laugh", "smile", "bitter", "sweet",
    "想念", "难过", "开心", "害怕", "温暖", "孤独", "爱", "自由", "平静",
    "幸福", "心碎", "眼泪", "笑", "疼", "怀念", "遗憾", "感激",
  ];
  if (emotionWords.some((w) => lower.includes(w))) {
    const meaningWords = [
      "because", "why", "realized", "understand", "learned", "taught",
      "changed me", "shaped", "meaning", "reason", "stay with", "stayed",
      "matters", "important", "first time", "never forgot", "always remember",
      "因为", "明白", "懂", "教会", "改变", "意义", "重要", "忘不了", "一直记得",
    ];
    if (meaningWords.some((w) => lower.includes(w))) return "meaning";
    return "emotion";
  }

  const sceneWords = [
    "saw", "see", "looked", "watching", "remember", "recall", "picture",
    "image", "scene", "smelled", "heard", "sound", "voice", "color",
    "light", "dark", "bright", "shadow", "standing", "sitting", "walking",
    "看见", "记得", "想起", "画面", "听见", "光", "黑暗", "站", "坐",
  ];
  if (sceneWords.some((w) => lower.includes(w))) return "memory";

  const factWords = [
    "moved", "went", "started", "finished", "graduated", "born", "began",
    "left", "arrived", "met", "joined", "built", "year", "month", "day",
    "搬到", "毕业", "离开", "遇见", "开始", "出生", "年", "月", "日",
  ];
  if (factWords.some((w) => lower.includes(w))) return "fact";

  return "summary";
}

/* Reflective openers — each can name the subject the person just shared. */
const ACK_EN: Record<InputDepth, (lead?: string) => string> = {
  summary: (l) =>
    l ? `I can feel the weight of “${l}”.` : `There's a whole chapter behind that sentence.`,
  fact: (l) =>
    l ? `I'm holding that detail — ${l}.` : `That's a clear moment to stand inside.`,
  memory: (l) =>
    l ? `I can see ${l} forming.` : `That image is staying with me.`,
  emotion: (l) =>
    l ? `I hear the feeling underneath “${l}”.` : `I hear the feeling in that.`,
  meaning: () => `That's something true you've found.`,
  sparse: () => `Take your time.`,
};

const ACK_ZH: Record<InputDepth, (lead?: string) => string> = {
  summary: (l) =>
    l ? `我感受到了「${l}」的分量。` : `这句话背后，好像藏着一整章故事。`,
  fact: (l) =>
    l ? `我把这个细节记下了——${l}。` : `这是一个很清晰的瞬间，值得站进去。`,
  memory: (l) =>
    l ? `我眼前慢慢浮现出${l}。` : `这个画面，留在了我心里。`,
  emotion: (l) =>
    l ? `我听见了「${l}」底下那份感受。` : `我听见了那份感受。`,
  meaning: () => `这是你找到的、很真实的东西。`,
  sparse: () => `慢慢来。`,
};

/* ── Lead-aware responses ──
 * When a concrete subject is named (a person, a place, a feeling…), The
 * Recorder must acknowledge *that* subject and ask a related follow-up,
 * even if the answer was very short. This is what stops the interview
 * from jumping to unrelated generic questions.
 */

/** Turn "my grandmother" into "your grandmother"; keep it clause-ready. */
function toSecondPerson(lead: string): string {
  const s = lead.trim();
  return s
    .replace(/^my\s+/i, "your ")
    .replace(/^our\s+/i, "your ")
    .replace(/^the\s+/i, "the ")
    .replace(/^a\s+/i, "the ")
    .replace(/^an\s+/i, "the ");
}

/** Lowercase a common-noun lead so it reads naturally mid-sentence. */
function inline(lead: string): string {
  return toSecondPerson(lead).toLowerCase();
}

/** Acknowledgment that names the subject, by memory type. */
const LEAD_ACK_EN: Record<MemoryType, (s: string) => string> = {
  person: (s) => `I hear that ${inline(s)} is an important part of your memory.`,
  place: (s) => `${cap(toSecondPerson(s))} — I can picture it.`,
  emotion: (s) => `I can feel the ${inline(s)} in what you just said.`,
  moment: (s) => `That moment stays with me.`,
  scene: (s) => `I can see that — ${inline(s)}.`,
  meaning: (s) => `That feels like something true you've found.`,
};

const LEAD_ACK_ZH: Record<MemoryType, (s: string) => string> = {
  person: (s) => `我听见了，${zhWho(s)}对你来说，是很重要的一部分。`,
  place: (s) => `${s}——我仿佛看见了它。`,
  emotion: (s) => `我感受到了你话里的那份${s}。`,
  moment: (s) => `那个瞬间，留在了我心里。`,
  scene: (s) => `我看见了那个画面——${s}。`,
  meaning: (s) => `这像是你找到的、很真实的东西。`,
};

/* (追问问题已迁移至 lib/ai/question-bank.ts，由 pickQuestion() / pickGenericFallback() 统一管理) */

function cap(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Chinese: keep possessive natural — "你的外婆" reads better than raw lead. */
function zhWho(lead: string): string {
  const s = lead.trim();
  if (/^我(的)?/.test(s)) return s.replace(/^我(的)?/, "你的");
  return s;
}

/* (通用追问问题已迁移至 lib/ai/question-bank.ts) */

/**
 * Fallback response generator — used when OpenAI is unavailable.
 *
 * Flow: understand the answer → acknowledge the subject → reflect a
 * detail → ask ONE related follow-up.
 *
 * When a concrete subject was named (lead), The Recorder responds to
 * *that* subject with a contextual question — it never jumps to an
 * unrelated generic question. Only when nothing concrete surfaces does
 * it fall back to depth-based prompting.
 */
function generateFallback(
  userMessage: string,
  conversation: ConversationMessage[],
  lang: RecorderLang,
  lead?: LeadSubject,
): string {
  if (lead) {
    const ack = (lang === "zh" ? LEAD_ACK_ZH : LEAD_ACK_EN)[lead.type](
      lead.value,
    );
    const question = pickQuestion(lead.type, lang, conversation);
    return `${ack}\n${question}`;
  }

  const depth = classifyInput(userMessage);
  const ack = (lang === "zh" ? ACK_ZH : ACK_EN)[depth](undefined);
  const question = pickGenericFallback(lang, conversation);
  return `${ack}\n${question}`;
}

/* ──────────────────────────── Public API ─────────────────────────────── */

/**
 * Generate The Recorder's next response.
 *
 * Tries OpenAI first (with a localised system prompt). Falls back to the
 * rule-based engine if no API key is configured or the request fails.
 *
 * @param lead  The subject the user just named (value + type), used to
 *              personalise the acknowledgment and follow-up question.
 */
export async function generateRecorderResponse(
  userMessage: string,
  conversation: ConversationMessage[],
  lang: RecorderLang = "en",
  lead?: LeadSubject,
  bankQuestion?: string,
): Promise<string> {
  const aiResponse = await generateWithOpenAI(
    userMessage,
    conversation,
    lang,
    bankQuestion,
    lead?.value,
  );
  if (aiResponse) return aiResponse;
  return generateFallback(userMessage, conversation, lang, lead);
}

/**
 * The opening question — used before any user input. (Kept for reference;
 * the live opening question is supplied by the locale files.)
 */
export const OPENING_QUESTION =
  "If your life was a documentary,\nwhat would the first scene be?";
