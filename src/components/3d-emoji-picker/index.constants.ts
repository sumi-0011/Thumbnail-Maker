// import ThreeDEmojiMap from "src/assets/emojis/3d-emoji-map.json";
// /Users/sumi/Documents/repo/Thumbnail-Maker/scripts/emoji/output/enriched-emoji.json
import ThreeDEmojiMap from "../../../scripts/emoji/output/enriched-emoji.json";

export const THREE_D_EMOJI_CATEGORIES = Object.keys(ThreeDEmojiMap);
export const THREE_D_EMOJI_MAP = ThreeDEmojiMap;
export const THREE_D_EMOJI_CATEGORY_EMOJI_MAP = {
  "animals&nature": "🐶",
  flags: "🚩",
  "travel&places": "🛫",
  "smileys&emotion": "😊",
  objects: "🔍",
  "food&drink": "🍔",
  symbols: "✡️",
  activities: "⚽️",
  "people&body": "👤",
} as const;

export type ThreeDEmojiCategory = keyof typeof THREE_D_EMOJI_MAP;
