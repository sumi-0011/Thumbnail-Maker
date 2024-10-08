import { EmojiType } from "./index.types";

export const get3DEmojiImage = (emoji: EmojiType) => {
  return `https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis/${emoji.image}`;
};
