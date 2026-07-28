/**
 * Question Bank — 按记忆主题分类的追问问题库
 *
 * 当 memory-extractor 识别出用户回答的主题（人物/地点/情绪/时刻/场景/意义）后，
 * 从对应分类中选取追问问题，再交由 AI 做个性化改写。
 *
 * 设计原则：
 * - 每个分类 6–8 个问题，保证对话不重复
 * - 双语镜像（EN / ZH），与整体架构一致
 * - 覆盖深度：从画面 → 感受 → 意义，与记录者的五条寻索对齐
 */

import type { MemoryType } from "@/types/story";
import type { ConversationMessage } from "@/types/story";

export type QuestionLang = "en" | "zh";

/* ────────────────────────────── English ────────────────────────────── */

const QUESTION_BANK_EN: Record<MemoryType, string[]> = {
  person: [
    "What is the first image that appears when you think of them?",
    "What is one small habit of theirs you still remember?",
    "Where did the two of you usually spend time together?",
    "What is something they always used to say?",
    "How did they make you feel, when you were together?",
    "What do you think they taught you, without ever saying it?",
    "Is there a single moment with them that you keep returning to?",
  ],
  place: [
    "What did it look like, the first time it comes back to you?",
    "What sound do you hear when you picture it?",
    "What time of day is it, in that memory?",
    "Can you describe the light there?",
    "What does it smell like, in your memory of it?",
    "If you stood there again now, what would be different?",
    "What part of that place stays with you the most?",
  ],
  emotion: [
    "When did you first notice that feeling?",
    "Where in your body do you feel it?",
    "What was around you when it rose up?",
    "If you gave it a colour, what would it be?",
    "What would you say to that feeling, if you could?",
    "Does it remind you of anything else?",
    "What do you think it's trying to tell you?",
  ],
  moment: [
    "What do you see when you return to that moment?",
    "What happened just before it?",
    "Who else was there with you?",
    "Is there a sound that marks that moment?",
    "What did you think would happen next?",
    "How did you know it was a moment you'd carry?",
    "What changed in you, because of it?",
  ],
  scene: [
    "If the camera stayed there ten seconds, what would it catch?",
    "What sits at the edge of that frame?",
    "What is the light like in it?",
    "Is there a sound that belongs to that image?",
    "What would the camera miss, that you remember?",
    "What's just outside the frame?",
    "If you could freeze that image, what would you hold onto?",
  ],
  meaning: [
    "Is there a single image that carries that meaning?",
    "When did you first understand that?",
    "Who was part of that realization?",
    "What would you call it, in one sentence?",
    "Has that meaning changed since you first found it?",
    "What does it ask of you, now?",
    "If you had to explain it to someone, where would you start?",
  ],
};

/* ────────────────────────────── 中文 ────────────────────────────── */

const QUESTION_BANK_ZH: Record<MemoryType, string[]> = {
  person: [
    "想到ta的时候，最先浮现的，是怎样的一个画面？",
    "关于ta，有没有一个你至今记得的小习惯？",
    "你们，通常在哪里一起度过时光？",
    "ta有没有一句，总是挂在嘴边的话？",
    "和ta在一起时，ta让你感觉自己是怎样的？",
    "你觉得，ta默默教会了你什么？",
    "有没有和ta在一起的某个瞬间，你总在回看？",
  ],
  place: [
    "它第一次浮现在你眼前时，是什么样子？",
    "当你想起它，会听见什么声音？",
    "在那段记忆里，是一天中的什么时候？",
    "那里的光，是什么样的？",
    "你记得那里的气味吗？",
    "如果现在回去，你还会认出那里吗？",
    "那个地方，最让你放不下的，是哪一部分？",
  ],
  emotion: [
    "你第一次察觉到这份感受，是在什么时候？",
    "这份感觉，停留在身体的哪个地方？",
    "它涌上来的时候，你身边是什么样子？",
    "如果给它一个颜色，会是什么？",
    "如果可以对这份感受说一句话，你想说什么？",
    "它让你想起了别的什么吗？",
    "你觉得，它想告诉你什么？",
  ],
  moment: [
    "回到那个瞬间，你看见了什么？",
    "在那之前，发生了什么？",
    "那时候，还有谁在你身边？",
    "有没有一个声音，标记了那个瞬间？",
    "当时的你，以为接下来会发生什么？",
    "你是怎么知道，这会是一个忘不了的时刻？",
    "因为那一刻，你身上有什么改变了？",
  ],
  scene: [
    "如果镜头在那里停十秒，会拍到什么？",
    "画面的边缘，还藏着什么？",
    "那里的光，是什么样的？",
    "有没有一个声音，属于那个画面？",
    "镜头拍不到、但你记得的，是什么？",
    "画面之外，还发生了什么？",
    "如果可以定格那个画面，你会抓住哪一部分？",
  ],
  meaning: [
    "有没有一个画面，装着这份意义？",
    "你是什么时候，第一次明白这件事的？",
    "还有谁，参与了你那一刻的明白？",
    "如果用一句话说出它，你会怎么说？",
    "从你第一次发现到现在，这份意义变了吗？",
    "此刻的它，对你有什么要求？",
    "如果要把它讲给别人听，你会从哪里开始？",
  ],
};

/* ────────────────────────────── 兜底问题 ────────────────────────────── */

const GENERIC_FALLBACK_EN: string[] = [
  "Tell me more about that.",
  "What else comes to mind?",
  "Stay with that image a moment.",
  "Is there a detail you'd add?",
  "Even a single image is enough to begin.",
  "What's the first thing that comes to you?",
  "What do you notice right now?",
];

const GENERIC_FALLBACK_ZH: string[] = [
  "再多说一点吧。",
  "还有什么浮上心头？",
  "在那个画面里，再多停留一会儿。",
  "有没有哪个细节，想再补上？",
  "哪怕只有一个画面，也足够开始了。",
  "浮上心头的，第一个是什么？",
  "此刻，你注意到了什么？",
];

/* ────────────────────────────── 选取逻辑 ────────────────────────────── */

function getBank(lang: QuestionLang): Record<MemoryType, string[]> {
  return lang === "zh" ? QUESTION_BANK_ZH : QUESTION_BANK_EN;
}

function getFallback(lang: QuestionLang): string[] {
  return lang === "zh" ? GENERIC_FALLBACK_ZH : GENERIC_FALLBACK_EN;
}

/**
 * 基于对话历史，为指定主题选一个不重复的问题。
 * 如果所有问题都问过了，则重新从全池中随机。
 */
export function pickQuestion(
  type: MemoryType,
  lang: QuestionLang,
  conversation: ConversationMessage[],
): string {
  const bank = getBank(lang);
  const questions = bank[type] ?? getFallback(lang);

  const recentRecorderMsgs = conversation
    .filter((m) => m.role === "recorder")
    .slice(-5)
    .map((m) => m.content);

  const available = questions.filter(
    (q) => !recentRecorderMsgs.some((msg) => msg.includes(q)),
  );

  const pool = available.length > 0 ? available : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 没有识别出具体主题时，从兜底库选一个通用问题。
 */
export function pickGenericFallback(
  lang: QuestionLang,
  conversation: ConversationMessage[],
): string {
  const fallback = getFallback(lang);
  const recentRecorderMsgs = conversation
    .filter((m) => m.role === "recorder")
    .slice(-5)
    .map((m) => m.content);

  const available = fallback.filter(
    (q) => !recentRecorderMsgs.some((msg) => msg.includes(q)),
  );

  const pool = available.length > 0 ? available : fallback;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 将问题作为 AI 的"改写素材"注入提示。
 * AI 拿到这个问题后，会根据用户刚才的回答做个性化处理，
 * 而不是原样复述。
 */
export function buildQuestionPrompt(
  question: string,
  leadValue?: string,
): string {
  if (leadValue) {
    return `Suggested follow-up question (rewrite naturally based on what they shared about "${leadValue}"): ${question}`;
  }
  return `Suggested follow-up question (rewrite naturally based on what they just shared): ${question}`;
}