import type { TagRecommendation, GeminiResponse } from "./geminiService";

/**
 * Fallback title chunker when Gemini API is unavailable.
 * Attempts to split the first line (assumed to be title) into meaningful pieces.
 * Enhanced with description utilization and better Korean parsing.
 */

// Korean grammatical particles for natural split points
const KOREAN_PARTICLES = [
  "을", "를", "이", "가", "은", "는", "의", "에", "로", "와", "과",
  "에서", "으로", "부터", "까지", "처럼", "같은", "대로", "만큼",
  "하는", "하기", "한다", "했다", "하여", "하면", "위한", "대한", "통한",
];

// Question patterns for detecting question-style content
const QUESTION_PATTERNS = [
  /\?$/, /뭐\s*쓰지/, /할까/, /어떻게/, /왜\s/, /무엇을/, /어디서/,
];

// Keyword to emoji mapping based on enriched-emoji.json (scripts/emoji/output/)
const EMOJI_MAPPING: Record<string, { glyph: string; cldr: string }> = {
  // Tech & Development
  react: { glyph: "⚛️", cldr: "atom_symbol" },
  vue: { glyph: "💚", cldr: "green_heart" },
  angular: { glyph: "🔴", cldr: "red_circle" },
  typescript: { glyph: "📘", cldr: "blue_book" },
  javascript: { glyph: "📒", cldr: "ledger" },
  nodejs: { glyph: "💚", cldr: "green_heart" },
  python: { glyph: "🐍", cldr: "snake" },
  golang: { glyph: "🐹", cldr: "hamster" },
  rust: { glyph: "🦀", cldr: "crab" },
  docker: { glyph: "🐳", cldr: "spouting_whale" },
  kubernetes: { glyph: "☸️", cldr: "wheel_of_dharma" },
  api: { glyph: "⚙️", cldr: "gear" },
  backend: { glyph: "⚙️", cldr: "gear" },
  frontend: { glyph: "🎨", cldr: "artist_palette" },
  database: { glyph: "🗄️", cldr: "file_cabinet" },
  git: { glyph: "🔀", cldr: "shuffle_tracks_button" },
  css: { glyph: "🎨", cldr: "artist_palette" },
  tailwind: { glyph: "💨", cldr: "dashing_away" },
  nextjs: { glyph: "▲", cldr: "up_pointing_red_triangle" },

  // Content Types
  guide: { glyph: "📝", cldr: "memo" },
  가이드: { glyph: "📝", cldr: "memo" },
  tutorial: { glyph: "📖", cldr: "open_book" },
  입문: { glyph: "📖", cldr: "open_book" },
  project: { glyph: "🚀", cldr: "rocket" },
  프로젝트: { glyph: "🚀", cldr: "rocket" },
  debug: { glyph: "🔧", cldr: "wrench" },
  디버그: { glyph: "🔧", cldr: "wrench" },
  error: { glyph: "🔧", cldr: "wrench" },
  에러: { glyph: "🔧", cldr: "wrench" },
  performance: { glyph: "⚡", cldr: "high_voltage" },
  성능: { glyph: "⚡", cldr: "high_voltage" },
  optimization: { glyph: "⚡", cldr: "high_voltage" },
  최적화: { glyph: "⚡", cldr: "high_voltage" },
  security: { glyph: "🛡️", cldr: "shield" },
  보안: { glyph: "🛡️", cldr: "shield" },
  testing: { glyph: "🧪", cldr: "test_tube" },
  테스트: { glyph: "🧪", cldr: "test_tube" },
  deploy: { glyph: "📦", cldr: "package" },
  배포: { glyph: "📦", cldr: "package" },
  package: { glyph: "📦", cldr: "package" },
  패키지: { glyph: "📦", cldr: "package" },

  // Actions & Concepts
  만들기: { glyph: "🔨", cldr: "hammer" },
  만들어: { glyph: "🔨", cldr: "hammer" },
  building: { glyph: "🔨", cldr: "hammer" },
  build: { glyph: "🔨", cldr: "hammer" },
  learning: { glyph: "📚", cldr: "books" },
  배우기: { glyph: "📚", cldr: "books" },
  review: { glyph: "👀", cldr: "eyes" },
  리뷰: { glyph: "👀", cldr: "eyes" },
  비교: { glyph: "⚖️", cldr: "balance_scale" },
  compare: { glyph: "⚖️", cldr: "balance_scale" },
  분석: { glyph: "🔍", cldr: "magnifying_glass_tilted_left" },
  analysis: { glyph: "🔍", cldr: "magnifying_glass_tilted_left" },

  // Emotions & Tones
  고민: { glyph: "🤔", cldr: "thinking_face" },
  질문: { glyph: "🤔", cldr: "thinking_face" },
  question: { glyph: "🤔", cldr: "thinking_face" },
  완벽: { glyph: "🎯", cldr: "bullseye" },
  perfect: { glyph: "🎯", cldr: "bullseye" },
  best: { glyph: "🏆", cldr: "trophy" },
  추천: { glyph: "👍", cldr: "thumbs_up" },
  recommend: { glyph: "👍", cldr: "thumbs_up" },
  tip: { glyph: "💡", cldr: "light_bulb" },
  팁: { glyph: "💡", cldr: "light_bulb" },
  꿀팁: { glyph: "🍯", cldr: "honey_pot" },
};

// Default emojis for different contexts
const DEFAULT_EMOJIS = {
  tech: [
    { glyph: "✨", cldr: "sparkles" },
    { glyph: "🚀", cldr: "rocket" },
    { glyph: "💡", cldr: "light_bulb" },
    { glyph: "⚙️", cldr: "gear" },
  ],
  question: [
    { glyph: "🤔", cldr: "thinking_face" },
    { glyph: "💭", cldr: "thought_balloon" },
  ],
  casual: [
    { glyph: "😎", cldr: "smiling_face_with_sunglasses" },
    { glyph: "🐱", cldr: "cat_face" },
    { glyph: "✨", cldr: "sparkles" },
  ],
};

function detectLanguage(text: string): "ko" | "en" | "mixed" {
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const total = koreanChars + englishChars;

  if (total === 0) return "mixed";
  if (koreanChars / total > 0.6) return "ko";
  if (englishChars / total > 0.6) return "en";
  return "mixed";
}

interface ExtractedContent {
  title: string;
  description: string;
  isQuestion: boolean;
}

function extractTitleAndDescription(content: string): ExtractedContent {
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  let title = "";
  let description = "";
  let isQuestion = false;

  // Try to find title
  for (const line of lines) {
    const cleaned = line.replace(/^#+\s*/, "").trim();
    if (cleaned.length > 3 && cleaned.length < 100) {
      // Check for colon-separated title:description pattern
      const colonIndex = cleaned.indexOf(":");
      if (colonIndex > 5 && colonIndex < cleaned.length - 3) {
        title = cleaned.substring(0, colonIndex).trim();
        description = cleaned.substring(colonIndex).trim(); // Keep the colon for display
      } else {
        title = cleaned;
      }
      break;
    }
  }

  // If no title found, use first 100 chars
  if (!title) {
    title = content.substring(0, 100).trim();
  }

  // Check if content is question-style
  const fullText = title + " " + description;
  isQuestion = QUESTION_PATTERNS.some((pattern) => pattern.test(fullText));

  return { title, description, isQuestion };
}

function chunkKoreanTitle(title: string): string[] {
  const chunks: string[] = [];
  const words = title.split(/\s+/);

  let currentChunk = "";

  // Natural break point suffixes (particles should stay attached to their word)
  const breakSuffixes = ["으로", "에서", "부터", "까지", "처럼", "같은", "대로", "만큼"];
  const attachSuffixes = ["의", "와", "과", "로", "는", "은", "을", "를", "이", "가", "에"];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // If adding this word would make the chunk too long, save and start new
    if (currentChunk.length + word.length > 10 && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? " " : "") + word;
    }

    // Check for natural break points (longer particles)
    const hasBreakSuffix = breakSuffixes.some((suffix) => word.endsWith(suffix));
    // Check for attachment suffixes (particles that create flow)
    const hasAttachSuffix = attachSuffixes.some((suffix) => word.endsWith(suffix));

    if (hasBreakSuffix || hasAttachSuffix) {
      if (currentChunk.length >= 2) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // If we got too few chunks, try splitting by length
  if (chunks.length < 2 && title.length > 10) {
    return splitByLength(title, 6);
  }

  // Merge very short chunks with adjacent ones
  const mergedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].length < 2 && mergedChunks.length > 0) {
      mergedChunks[mergedChunks.length - 1] += " " + chunks[i];
    } else if (chunks[i].length < 2 && i < chunks.length - 1) {
      chunks[i + 1] = chunks[i] + " " + chunks[i + 1];
    } else {
      mergedChunks.push(chunks[i]);
    }
  }

  return mergedChunks.filter((c) => c.length >= 2);
}

function chunkEnglishTitle(title: string): string[] {
  const chunks: string[] = [];
  const words = title.split(/\s+/);

  let currentChunk = "";

  for (const word of words) {
    // Common prepositions and conjunctions as break points
    const isBreakWord = [
      "with",
      "for",
      "to",
      "in",
      "on",
      "and",
      "the",
      "a",
      "an",
      "of",
      "using",
      "via",
      "through",
    ].includes(word.toLowerCase());

    if (currentChunk.length + word.length > 15 && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = isBreakWord ? "" : word;
    } else if (isBreakWord && currentChunk.length > 0) {
      currentChunk += " " + word;
      chunks.push(currentChunk.trim());
      currentChunk = "";
    } else {
      currentChunk += (currentChunk ? " " : "") + word;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length >= 2);
}

function splitByLength(text: string, targetLength: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length > targetLength && current) {
      chunks.push(current.trim());
      current = word;
    } else {
      current += (current ? " " : "") + word;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

interface SelectedEmoji {
  glyph: string;
  cldr: string;
}

function selectEmojis(
  content: string,
  isQuestion: boolean
): SelectedEmoji[] {
  const lowerContent = content.toLowerCase();
  const selectedEmojis: SelectedEmoji[] = [];

  // Search through EMOJI_MAPPING for matching keywords
  for (const [keyword, emoji] of Object.entries(EMOJI_MAPPING)) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      // Avoid duplicates
      if (!selectedEmojis.some((e) => e.cldr === emoji.cldr)) {
        selectedEmojis.push(emoji);
      }
      // Limit to 2 emojis
      if (selectedEmojis.length >= 2) break;
    }
  }

  // If question-style and no thinking emoji yet, add one
  if (isQuestion && !selectedEmojis.some((e) => e.cldr.includes("thinking") || e.cldr.includes("thought"))) {
    const questionEmoji = DEFAULT_EMOJIS.question[0];
    selectedEmojis.unshift(questionEmoji); // Add at beginning
  }

  // If still no emojis, use defaults
  if (selectedEmojis.length === 0) {
    const defaults = DEFAULT_EMOJIS.tech;
    selectedEmojis.push(defaults[Math.floor(Math.random() * defaults.length)]);
  }

  // Ensure we have at least 1 and at most 2 emojis
  return selectedEmojis.slice(0, 2);
}

export function extractKeywords(content: string): GeminiResponse {
  const language = detectLanguage(content);
  const { title, description, isQuestion } = extractTitleAndDescription(content);

  let chunks: string[];

  if (language === "ko") {
    chunks = chunkKoreanTitle(title);
  } else if (language === "en") {
    chunks = chunkEnglishTitle(title);
  } else {
    // Mixed - try both approaches
    const koreanPart = title.match(/[가-힣\s]+/g)?.join(" ") || "";
    const englishPart = title.match(/[a-zA-Z\s]+/g)?.join(" ") || "";

    if (koreanPart.length > englishPart.length) {
      chunks = chunkKoreanTitle(title);
    } else {
      chunks = chunkEnglishTitle(title);
    }
  }

  // Limit to reasonable number of chunks
  if (chunks.length > 6) {
    chunks = chunks.slice(0, 6);
  }

  // Select emojis based on content analysis
  const emojis = selectEmojis(content, isQuestion);

  // Build tags array
  const tags: TagRecommendation[] = [];

  // For question-style content, add thinking emoji after the question
  if (isQuestion && chunks.length > 0) {
    // Find the question chunk (usually first one ending with ?)
    const questionIndex = chunks.findIndex((c) => c.includes("?"));

    if (questionIndex >= 0) {
      // Add chunks up to and including question, then thinking emoji
      for (let i = 0; i <= questionIndex; i++) {
        tags.push({ text: chunks[i], type: "text" });
      }
      // Add thinking emoji after question
      if (emojis.some((e) => e.cldr.includes("thinking") || e.cldr.includes("thought"))) {
        const thinkingEmoji = emojis.find((e) => e.cldr.includes("thinking") || e.cldr.includes("thought"));
        if (thinkingEmoji) {
          tags.push({ text: thinkingEmoji.glyph, type: "emoji" });
        }
      }
      // Add remaining chunks
      for (let i = questionIndex + 1; i < chunks.length; i++) {
        tags.push({ text: chunks[i], type: "text" });
      }
      // Add remaining (non-thinking) emojis at the end
      const remainingEmojis = emojis.filter(
        (e) => !e.cldr.includes("thinking") && !e.cldr.includes("thought")
      );
      for (const emoji of remainingEmojis) {
        tags.push({ text: emoji.glyph, type: "emoji" });
      }
    } else {
      // No explicit question mark, add all chunks then emojis
      tags.push(...chunks.map((text) => ({ text, type: "text" as const })));
      for (const emoji of emojis) {
        tags.push({ text: emoji.glyph, type: "emoji" });
      }
    }
  } else {
    // Standard flow: chunks first, then emojis
    tags.push(...chunks.map((text) => ({ text, type: "text" as const })));
    for (const emoji of emojis) {
      tags.push({ text: emoji.glyph, type: "emoji" });
    }
  }

  // Add description as separate tag if exists (with colon)
  if (description && description.length > 2) {
    // Insert description before last emoji
    const lastEmojiIndex = tags.map((t) => t.type).lastIndexOf("emoji");
    if (lastEmojiIndex > 0) {
      tags.splice(lastEmojiIndex, 0, { text: description, type: "text" });
    } else {
      tags.push({ text: description, type: "text" });
    }
  }

  return {
    titles: [{ tags }],
    language,
  };
}
