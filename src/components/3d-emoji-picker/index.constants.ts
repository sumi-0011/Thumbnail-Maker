import ThreeDEmojiMap from "src/assets/emojis/3d-emoji-map.json";

export const THREE_D_EMOJI_CATEGORIES = Object.keys(ThreeDEmojiMap);

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
