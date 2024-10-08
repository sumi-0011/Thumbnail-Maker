import { EmojiType } from "./index.types";

/** 3D 이모지 이미지의 기본 URL */
const BASE_3D_EMOJI_URL =
  "https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis";

/**
 * 주어진 이모지 객체에 대한 3D 이모지 이미지 URL을 생성합니다.
 * @param {EmojiType} emoji - 이모지 객체
 * @returns {string} 3D 이모지 이미지의 전체 URL
 */
export const get3DEmojiImage = (emoji: EmojiType): string => {
  return `${BASE_3D_EMOJI_URL}/${emoji.image}`;
};
