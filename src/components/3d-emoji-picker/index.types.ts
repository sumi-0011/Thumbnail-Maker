export type EmojiType = {
  /** cldr : 이모지 코드 */
  cldr: string;
  /** 이모지의 시각적 표현 */
  glyph: string;
  /** 이모지의 카테고리 (예: 스마일리, 동물 등) */
  group: string;
  /** 이모지와 관련된 검색 키워드 */
  keywords: string[];
  /** 이모지의 유니코드 표현 */
  unicode: string;
  /** 3D 이모지 이미지의 URL 또는 경로 */
  image: string;
};
