/**
 * Memory Extractor
 *
 * Analyses user answers and extracts story-memory fragments:
 * places, people, emotions, moments, scenes, and meaning.
 *
 * Uses heuristic pattern matching by default. When an OpenAI key
 * is available, the API route may optionally call the AI extractor
 * for richer results.
 */

import type { ExtractedMemory, MemoryType } from "@/types/story";

/* ──────────────────────────── Pattern Banks ──────────────────────────── */

const PLACE_KEYWORDS = [
  "river", "sea", "ocean", "lake", "mountain", "hill", "forest", "woods",
  "house", "home", "apartment", "school", "college", "university", "city",
  "town", "village", "street", "road", "alley", "garden", "yard", "field",
  "farm", "park", "cafe", "restaurant", "station", "airport", "bridge",
  "window", "room", "kitchen", "bedroom", "living room", "porch", "attic",
  "basement", "hallway", "staircase", "rooftop", "balcony", "shore",
  "beach", "island", "valley", "desert", "campus", "office", "factory",
  "store", "shop", "market", "temple", "church", "mosque", "harbor",
  "dock", "pier", "trail", "path", "highway", "train", "bus",
  "car", "bicycle", "boat", "ship",
];

const PERSON_KEYWORDS = [
  "mother", "mom", "mum", "mama", "father", "dad", "papa",
  "grandfather", "grandmother", "grandma", "grandpa", "gramps", "nana",
  "sister", "brother", "sibling", "uncle", "aunt", "cousin", "niece",
  "nephew", "friend", "boyfriend", "girlfriend", "lover",
  "partner", "wife", "husband", "spouse", "son", "daughter", "child",
  "baby", "kid", "teacher", "student", "classmate", "roommate", "neighbor",
  "colleague", "boss", "stranger", "man", "woman", "boy", "girl",
  "dog", "cat", "pet", "horse",
];

const EMOTION_KEYWORDS: Record<string, string> = {
  happy: "happiness", glad: "gladness", joy: "joy", joyful: "joy",
  sad: "sadness", unhappy: "unhappiness", sorrow: "sorrow",
  angry: "anger", mad: "anger", furious: "fury",
  afraid: "fear", scared: "fear", terrified: "fear", anxious: "anxiety",
  worried: "worry", nervous: "nervousness",
  excited: "excitement", thrilled: "thrill",
  calm: "calm", peaceful: "peace", serene: "serenity",
  warm: "warmth", cold: "coldness", numb: "numbness",
  lonely: "loneliness", alone: "loneliness",
  loved: "love", love: "love", loving: "love",
  free: "freedom", trapped: "feeling trapped",
  safe: "safety", secure: "security",
  lost: "feeling lost", found: "being found",
  grief: "grief", grieving: "grief",
  hope: "hope", hopeful: "hope",
  shame: "shame", ashamed: "shame",
  pride: "pride", proud: "pride",
  wonder: "wonder", awe: "awe",
  nostalgia: "nostalgia", nostalgic: "nostalgia",
  longing: "longing", yearning: "longing",
  regret: "regret", guilty: "guilt",
  grateful: "gratitude", thankful: "gratitude",
  hurt: "pain", pain: "pain", painful: "pain",
  broken: "feeling broken", whole: "wholeness",
  alive: "feeling alive",
  empty: "emptiness", full: "fullness",
  bitter: "bitterness", sweet: "sweetness",
  tender: "tenderness",
};

const MOMENT_PATTERNS = [
  /(?:when i was (?:young|little|a (?:kid|child|boy|girl|teenager)))/i,
  /(?:that|the) (?:summer|winter|spring|autumn|fall|night|day|morning|evening|afternoon|weekend|holiday|christmas|new year)/i,
  /(?:i remember|i recall|looking back|thinking back|back then)/i,
  /(?:years ago|decades ago|long ago|a long time ago|as a kid|in my childhood)/i,
  /(?:one day|once|that time|that moment|that year|those days)/i,
  /(?:first time|last time|every time)/i,
];

const SCENE_PATTERNS = [
  /(?:i (?:saw|see|noticed|watched|remember (?:seeing|watching)))/i,
  /(?:the (?:light|sky|sun|moon|rain|snow|wind|fog|mist|dust))/i,
  /(?:it was (?:dark|bright|cold|warm|quiet|loud|still))/i,
  /(?:i can (?:still )?(?:see|hear|smell|feel|taste))/i,
  /(?:everything was|the world was|time (?:stopped|froze|slowed))/i,
];

const MEANING_PATTERNS = [
  /(?:because|that's why|which is why|the reason)/i,
  /(?:i (?:realized|learned|understood|discovered|found))/i,
  /(?:it (?:changed|shaped|taught) me)/i,
  /(?:that's when i|that was when)/i,
  /(?:never forgot|always remember|stayed with me|still (?:haunts|follows|lingers))/i,
  /(?:matters|important|meant everything|changed everything)/i,
];

/* ──────────────────────────── Extraction Logic ──────────────────────── */

function extractPlaces(text: string): ExtractedMemory[] {
  const results: ExtractedMemory[] = [];
  const found = new Set<string>();

  for (const keyword of PLACE_KEYWORDS) {
    if (found.has(keyword)) continue;

    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const match = regex.exec(text);
    if (!match) continue;

    found.add(keyword);

    // Try to capture a context phrase: "the old river", "my house"
    const ctxRegex = new RegExp(
      `(?:the|my|our|a|an)\\s+(?:old|new|small|big|little|dark|bright|warm|cold|quiet|first|last)?\\s*${keyword}`,
      "i",
    );
    const ctxMatch = ctxRegex.exec(text);
    let value: string;
    if (ctxMatch) {
      const phrase = ctxMatch[0].trim().replace(/\s+/g, " ");
      value = phrase.charAt(0).toUpperCase() + phrase.slice(1);
    } else {
      value = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }

    results.push({ type: "place" as MemoryType, value });
  }

  return results;
}

function extractPeople(text: string): ExtractedMemory[] {
  const results: ExtractedMemory[] = [];
  const found = new Set<string>();

  for (const keyword of PERSON_KEYWORDS) {
    if (found.has(keyword)) continue;

    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    if (!regex.test(text)) continue;

    found.add(keyword);

    // Check for possessive context: "my grandfather"
    const ctxMatch = text.match(
      new RegExp(`(?:my|our|the|a)\\s+${keyword}`, "i"),
    );
    let value = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    if (ctxMatch) {
      const phrase = ctxMatch[0].trim();
      value = phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }
    results.push({ type: "person" as MemoryType, value });
  }

  return results;
}

function extractEmotions(text: string): ExtractedMemory[] {
  const lower = text.toLowerCase();
  const results: ExtractedMemory[] = [];
  const found = new Set<string>();

  for (const [keyword, label] of Object.entries(EMOTION_KEYWORDS)) {
    if (found.has(label)) continue;

    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(lower)) {
      found.add(label);
      results.push({ type: "emotion" as MemoryType, value: label });
    }
  }

  return results;
}

function extractMoments(text: string): ExtractedMemory[] {
  for (const pattern of MOMENT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const value = match[0].trim();
      const formatted =
        value.charAt(0).toUpperCase() + value.slice(1);
      return [{ type: "moment" as MemoryType, value: formatted }];
    }
  }
  return [];
}

function extractScenes(text: string): ExtractedMemory[] {
  for (const pattern of SCENE_PATTERNS) {
    const match = text.match(pattern);
    if (!match?.index) continue;

    const start = Math.max(0, match.index - 5);
    const end = Math.min(text.length, match.index + match[0].length + 30);
    let snippet = text.slice(start, end).trim();
    snippet = snippet.replace(/^[,;.\s]+|[,;.\s]+$/g, "");
    if (snippet.length > 3) {
      const formatted =
        snippet.charAt(0).toUpperCase() + snippet.slice(1);
      return [{ type: "scene" as MemoryType, value: formatted }];
    }
  }
  return [];
}

function extractMeaning(text: string): ExtractedMemory[] {
  for (const pattern of MEANING_PATTERNS) {
    const match = text.match(pattern);
    if (!match?.index) continue;

    const start = Math.max(0, match.index - 5);
    const end = Math.min(text.length, match.index + match[0].length + 40);
    let snippet = text.slice(start, end).trim();
    snippet = snippet.replace(/^[,;.\s]+|[,;.\s]+$/g, "");
    if (snippet.length > 5) {
      return [{ type: "meaning" as MemoryType, value: snippet }];
    }
  }
  return [];
}

/* ──────────────────────────── Deduplication ─────────────────────────── */

function deduplicate(memories: ExtractedMemory[]): ExtractedMemory[] {
  const seen = new Set<string>();
  return memories.filter((m) => {
    const key = `${m.type}:${m.value.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function capLength(value: string, max = 60): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "\u2026";
}

/* ──────────────────────────── Public API ─────────────────────────────── */

/**
 * Extract memory fragments from a user's answer using heuristic
 * pattern matching.
 *
 * @param text     The user's answer.
 * @param existing Values already extracted (to avoid duplicates).
 * @returns        New, deduplicated memory fragments.
 */
export function extractMemories(
  text: string,
  existing: ExtractedMemory[] = [],
): ExtractedMemory[] {
  if (!text || text.trim().length < 3) return [];

  const all = [
    ...extractPlaces(text),
    ...extractPeople(text),
    ...extractEmotions(text),
    ...extractMoments(text),
    ...extractScenes(text),
    ...extractMeaning(text),
  ];

  const existingKeys = new Set(
    existing.map((m) => `${m.type}:${m.value.toLowerCase()}`),
  );

  return deduplicate(all)
    .filter((m) => {
      const key = `${m.type}:${m.value.toLowerCase()}`;
      return !existingKeys.has(key);
    })
    .map((m) => ({ ...m, value: capLength(m.value) }))
    .slice(0, 3);
}

/**
 * Choose the most salient subject from an answer — the "lead" The Recorder
 * can name when responding. People and places read as the strongest anchors,
 * followed by moments, scenes, emotions, then meaning.
 */
const LEAD_PRIORITY: MemoryType[] = [
  "person",
  "place",
  "moment",
  "scene",
  "emotion",
  "meaning",
];

export function pickLeadEntry(
  memories: ExtractedMemory[],
): ExtractedMemory | null {
  if (memories.length === 0) return null;
  for (const type of LEAD_PRIORITY) {
    const found = memories.find((m) => m.type === type);
    if (found) return found;
  }
  return memories[0];
}

export function pickLead(memories: ExtractedMemory[]): string | null {
  return pickLeadEntry(memories)?.value ?? null;
}
