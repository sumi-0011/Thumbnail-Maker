# Thumbnail Maker 기능 명세서

## 개요

Thumbnail Maker는 블로그 썸네일을 제작하는 React 기반 에디터 컴포넌트이다. 3D 이모지와 텍스트 태그를 조합하고, 10가지 팔레트 프리셋과 캔버스 크기를 선택하여 PNG 이미지로 다운로드할 수 있다.

## 컴포넌트 계층 구조

```
ThumbnailMaker (index.tsx)
├── MenuBar                        # 상단 메뉴 (캔버스/드래그 모드 전환, 정렬, 랜덤 셔플)
├── AddTagSection                  # 태그 입력 (텍스트/이모지, variant/shape 선택)
├── CanvasContainer / DragModeCanvas  # 캔버스 렌더링 (일반/드래그 모드)
│   └── TagList                    # 태그 목록 렌더링
│       └── TagItem                # 개별 태그 (CVA 기반 스타일링)
├── TagChangeSheet                 # 텍스트 태그 수정 Sheet
├── TagEmojiSheet                  # 이모지 태그 수정 Sheet
├── PalettePicker                  # 팔레트 선택기
└── SubMenu/
    ├── SubActionMenu              # 다운로드/템플릿 액션 메뉴
    ├── AlignmentMenu              # 태그 정렬 메뉴 (start/center/end)
    ├── SaveTemplateSheet          # Supabase 갤러리 저장
    ├── ImportTemplateConfirm      # JSON 템플릿 가져오기
    └── DownloadTemplateToLocalConfirm  # JSON 템플릿 내보내기
```

## 핵심 기능

### 1. 태그 관리

태그 추가, 수정, 삭제, 롤백을 지원한다.

**추가 흐름:**

1. AddTagSection에서 텍스트 입력 또는 3D 이모지 선택
2. Enter 또는 Add 버튼으로 태그 생성 (`id = Date.now()`)
3. `requestAnimationFrame`으로 DOM 업데이트 후 오버플로우 체크
4. 오버플로우 발생 시 자동 롤백 + 토스트 알림

**오버플로우 에러 메시지 (한국어):**

- 수직: "공간이 부족해 태그를 더 이상 추가할 수 없습니다."
- 수평: "너무 긴 태그는 추가할 수 없습니다."

**IME 처리:** `isComposing` 및 `keyCode 229` 체크로 한글 입력 중 조기 제출 방지

### 2. 팔레트 시스템 (10가지 프리셋)

| 이름            | 배경                   | 특징                         |
| --------------- | ---------------------- | ---------------------------- |
| `blue_gradient` | 파란 그라데이션 이미지 | 기본값, 그라데이션 채움      |
| `rose_gradient` | 분홍 그라데이션 이미지 | 핑크/퍼플 그라데이션         |
| `yellow_dark`   | `#141417` (다크)       | 노란/주황 강조               |
| `green_dark`    | `#141417` (다크)       | 밝은 녹색 (`#DDF867`)        |
| `blue_dark`     | `#141417` (다크)       | 인디고 블루 (`#3D7EFF`)      |
| `purple_light`  | `#A0A0FB`              | 흰 텍스트 + 보라 text-shadow |
| `blue_light`    | `#81AFFF`              | 파란 채움 + text-shadow      |
| `green_light`   | `#7AD79D`              | 녹색 채움 + text-shadow      |
| `orange_light`  | `#E98D74`              | 주황 채움 + text-shadow      |
| `pink_light`    | `#E97497`              | 핑크 채움 + text-shadow      |

각 팔레트는 `{variant}-{shape}` 키 조합으로 태그 CSS 스타일을 정의한다.

### 3. 캔버스

| 프리셋        | 비율             | 패딩        | 갭         |
| ------------- | ---------------- | ----------- | ---------- |
| `wide` (기본) | 1080/565 ≈ 1.911 | `40px 50px` | `16px 8px` |
| `square`      | 1:1              | `40px`      | `16px 8px` |

배경 스타일은 팔레트에 따라 이미지 URL 또는 CSS 색상/그라데이션으로 지정된다.

### 4. 드래그 모드 (@dnd-kit)

- `@dnd-kit/core`, `@dnd-kit/sortable` 라이브러리 사용
- `DndContext` + `closestCenter` 충돌 감지 + `verticalListSortingStrategy`
- 센서: `PointerSensor` + `KeyboardSensor`
- 드래그 종료 시 `arrayMove`로 태그 순서 변경
- 드래그 중 태그에 `opacity-50` 적용

### 5. AI 태그 추천 (Groq API)

**API 설정:**

- 엔드포인트: `https://api.groq.com/openai/v1/chat/completions`
- 모델: `llama-3.1-70b-versatile`
- 환경변수: `VITE_GROQ_API_KEY`

**분석 기반 2단계 생성 프로세스:**

1. **구조 분석** (`analyzeContent`): 블로그 콘텐츠(최대 2000자) → 도입부/본문/마무리 구조 분석 → `AnalysisResult` 반환
2. **제목 생성** (`generateTitlesFromAnalysis`): 분석 결과 + 선택된 제목 타입 → 3개 제목 추천

**AnalysisResult 데이터 모델:**

```typescript
interface AnalysisResult {
  intro: {
    hook: string;                  // 도입부 후킹 요소
    hook_type: "problem" | "curiosity" | "empathy" | "challenge" | "none";
    writing_motivation: string;    // 글쓴 동기
  };
  body: {
    core_topic: string;            // 핵심 주제 (20자 이내)
    key_terms: string[];           // 핵심 키워드 3~5개
    unique_angle: string;          // 글만의 차별점
    content_type: string;          // tutorial | comparison | deep-dive | ...
  };
  conclusion: {
    takeaway: string;              // 핵심 교훈/결론
    emotion: string;               // satisfied | reflective | hopeful | ...
  };
  recommended_types: TitleType[];  // 추천 제목 타입 2~3개
  language: "ko" | "en" | "mixed";
}
```

**8가지 제목 타입 (`TitleType`):**

| 타입             | 한국어명         | 설명                              |
| ---------------- | --------------- | --------------------------------- |
| `narrative`      | 서술형          | 자연스럽게 이어지는 문장형 제목    |
| `question`       | 질문형          | 질문으로 호기심을 유발             |
| `keyword_stack`  | 키워드 스택      | 핵심 키워드를 나열                 |
| `subtitle`       | 부제 포함형      | 메인 제목 + 부제                   |
| `retrospective`  | 회고/감성형      | 시간과 감성을 담은 회고            |
| `provocative`    | 도발/놀라움형    | 의외성으로 시선을 끄는 제목        |
| `highlight`      | 핵심 강조형      | 핵심 키워드를 강조                 |
| `casual`         | 캐주얼/재미형    | 친근하고 재미있는 표현             |

**폴백:** API 키 미설정 또는 Rate Limit 시 `keywordExtractor.ts`로 로컬 키워드 추출 → 최소한의 `AnalysisResult`로 변환

**AI 태그 추천 흐름:**

1. `/ai-recommend` 페이지에서 블로그 콘텐츠 입력 (최소 10자)
2. "블로그 분석하기" 클릭 → 분석 결과(hook, core_topic, key_terms, takeaway) 표시
3. 추천 제목 타입(2~3개) 중 하나 클릭 → 해당 타입으로 제목 3개 생성
4. 제목 클릭 → navigate("/", { state: { newTags } })로 메인 에디터에 태그 적용

### 6. 템플릿 저장/불러오기

- **Supabase 저장:** SaveTemplateSheet에서 제목/설명 입력 후 썸네일 PNG + 태그/팔레트 JSON 업로드
- **JSON 내보내기:** DownloadTemplateToLocalConfirm에서 현재 상태를 JSON 파일로 다운로드
- **JSON 가져오기:** ImportTemplateConfirm에서 파일 선택 → JSON 파싱 → `useSetTemplate`으로 적용

### 7. 이미지 다운로드

- `html2canvas` 라이브러리 사용 (`{ allowTaint: true, useCORS: true }`)
- 캔버스 DOM을 PNG blob으로 변환
- `file-saver`의 `saveAs`로 "result.png" 다운로드
- 다운로드 후 "갤러리에 업로드" 액션이 포함된 토스트 표시

## 상태 관리 구조

### TagProvider (6개 Context)

| Context                  | 타입                                                                                                     | 훅                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------ |
| `TagListContext`         | `{ tags: Tag[] }`                                                                                        | `useTagList()`           |
| `TagActionContext`       | `{ onAddTag, onRemoveTag, onUpdateTag, onResetTags, onRollbackTags, onUpdateTagOrder, onRandomShuffle }` | `useTagAction()`         |
| `SelectedTagContext`     | `{ selectedTag: Tag \| null }`                                                                           | `useSelectedTag()`       |
| `SelectTagActionContext` | `{ onSelectTag, clearSelectedTag }`                                                                      | `useSelectedTagAction()` |
| `TagStyleContext`        | `{ alignment: TagAlignment }`                                                                            | `useTagStyle()`          |
| `TagStyleActionContext`  | `{ setAlignment }`                                                                                       | `useTagStyleAction()`    |

`TagAlignment = "start" | "center" | "end"` — 각각 flex-start, center, flex-end에 대응

### PaletteProvider (2개 Context)

| Context                | 훅                                                |
| ---------------------- | ------------------------------------------------- |
| `PaletteContext`       | `usePalette()` → `currentPalette: PaletteVariant` |
| `PaletteActionContext` | `usePaletteAction()` → `onPaletteChange(palette)` |

추가 훅: `useCurrentPaletteStyle()` → 현재 팔레트의 `PaletteStyle` 객체 반환

### CanvasSizeProvider (2개 Context)

| Context                   | 훅                                                 |
| ------------------------- | -------------------------------------------------- |
| `CanvasSizeContext`       | `useCanvasSize()` → `{ currentSize, canvasStyle }` |
| `CanvasSizeActionContext` | `useCanvasSizeAction()` → `onSizeChange(size)`     |

## 커스텀 훅 명세

### useThumbnailTagList

태그 리스트 상태 관리. `useRef`로 이전 상태(`prevTags`)를 추적하여 롤백 지원.

```typescript
Returns: {
  tags: Tag[];
  onAddTag: (newTag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  onRollbackTags: () => void;
  onUpdateTag: (tagId: number, newTag: Tag) => void;
  onResetTags: () => void;
  onUpdateTagOrder: (newTags: Tag[]) => void;
  onRandomShuffle: () => void;
}
```

### usePreview

HTML → PNG 변환 및 다운로드.

```typescript
Returns: {
  previewRef: React.RefObject<HTMLDivElement>;
  onDownload: () => void;
  getImageFile: () => Promise<Blob | null>;
}
```

### useCheckTagOverflow

태그 컨테이너 오버플로우 감지.

```typescript
Returns: {
  tagsContainerRef: React.RefObject<HTMLDivElement>;
  checkOverflow: () => false | "vertical-overflow" | "horizontal-overflow";
  showOverflowToast: (overflow: OverflowMessage) => void;
}
```

### useAITagRecommend

분석 기반 2단계 AI 추천 프로세스 관리.

```typescript
State: {
  step: "idle" | "analysis" | "titles";
  status: "idle" | "loading" | "success" | "error" | "fallback";
  analysisResult: AnalysisResult | null;
  selectedTitleType: TitleType | null;
  titles: TitleRecommendation[];
  error: string | null;
  language: "ko" | "en" | "mixed";
  usedFallback: boolean;
}

Returns: {
  ...state,
  analyzeContent: (content: string) => Promise<void>;
  generateTitles: (titleType: TitleType) => Promise<void>;
  backToAnalysis: () => void;
  reset: () => void;
  isLoading: boolean;
}
```

### usePendingAITags

AI 페이지에서 선택한 태그를 홈 페이지로 전달하는 버퍼.

```typescript
Returns: {
  pendingTags: Tag[] | null;
  setPendingTags: (tags: Tag[] | null) => void;
  clearPendingTags: () => void;
  hasPendingTags: boolean;
}
```

### useSetTemplate

템플릿을 현재 캔버스에 적용.

```typescript
Returns: {
  onUseTemplate: (template: { palette: { type: PaletteVariant }; tags: string }) => void;
}
```

### useImportTemplate

JSON 파일에서 템플릿 가져오기.

```typescript
Returns: {
  handleImportTemplate: () => void;  // 파일 선택 다이얼로그 오픈
}
```

## 데이터 모델

### Tag

```typescript
type Tag = {
  id: number; // Date.now() 기반
  content: TagContentType;
  tagVariant: TagVariant;
  tagShape: TagShape;
};

type TagContentType =
  | { type: "text"; value: string }
  | { type: "3d-emoji"; value: EmojiType };

type TagVariant = "filled" | "outlined" | "ghost";
type TagShape = "round" | "squared" | "emoji";

const EMPTY_TAG = {
  id: -1,
  content: { type: "text", value: "" },
  tagVariant: "filled",
  tagShape: "round",
} as const;
```

### 팔레트 구조

```typescript
type PaletteVariant =
  | "blue_gradient"
  | "rose_gradient"
  | "yellow_dark"
  | "green_dark"
  | "blue_dark"
  | "purple_light"
  | "blue_light"
  | "green_light"
  | "orange_light"
  | "pink_light";

type PaletteTag = `${TagVariant}-${TagShape}`; // 예: "filled-round"

type PaletteStyle = {
  background: string; // URL 또는 CSS 색상
  paletteBackground: string; // 팔레트 피커 표시 색상
  tagStyle: Partial<PaletteTagStyle>; // variant-shape별 CSS 스타일
};
```

### 캔버스 사이즈

```typescript
type CanvasSizePreset = "wide" | "square";
```

## 사용자 인터랙션 흐름

### 기본 태그 편집

```
텍스트 입력 / 이모지 선택 → variant/shape 선택 → Enter/Add
→ 태그 생성 → 오버플로우 체크 → (성공) 캔버스에 표시
                                → (실패) 롤백 + 토스트
태그 클릭 → TagChangeSheet/TagEmojiSheet 열림 → 스타일 변경/삭제
```

### AI 추천 → 태그 적용

```
/ai-recommend 접속 → 콘텐츠 입력 (10자 이상) → "블로그 분석하기" 클릭
→ 분석 결과 표시 (hook, core_topic, key_terms, takeaway)
→ 추천 제목 타입 선택 → 제목 3개 생성
→ 제목 클릭 → navigate("/", { state: { newTags } }) → 메인 에디터 적용
```

### 드래그 앤 드롭 재정렬

```
Ctrl+D / 메뉴에서 드래그 모드 전환
→ DragModeCanvas 활성화 → 태그 드래그
→ 드롭 → arrayMove로 순서 변경
→ Ctrl+D로 일반 모드 복귀
```

## 키보드 단축키

| 단축키   | 동작                                |
| -------- | ----------------------------------- |
| `Ctrl+D` | 드래그 모드 ↔ 셀렉트 모드 전환      |
| `Ctrl+R` | 랜덤 셔플 (태그 스타일 무작위 배정) |

라이브러리: `react-hotkeys-hook`

## localStorage 키 목록

| 키                                 | 타입                 | 설명               |
| ---------------------------------- | -------------------- | ------------------ |
| `@thumbnail-maker/tags`            | `Tag[]`              | 현재 태그 리스트   |
| `@thumbnail-maker/palette`         | `PaletteVariant`     | 선택된 팔레트      |
| `@thumbnail-maker/canvas-size`     | `"wide" \| "square"` | 캔버스 크기 프리셋 |
| `@thumbnail-maker/pending-ai-tags` | `Tag[] \| null`      | AI 추천 대기 태그  |

## 기본값

| 항목         | 기본값            |
| ------------ | ----------------- |
| 캔버스 크기  | `"wide"`          |
| 태그 variant | `"filled"`        |
| 태그 shape   | `"round"`         |
| 팔레트       | `"blue_gradient"` |
| 태그 정렬    | `"start"`         |

## 라우팅

| 경로      | 페이지      | 설명                                             |
| --------- | ----------- | ------------------------------------------------ |
| `/`       | `HomePage`  | 메인 에디터 (TagProvider + PaletteProvider 래핑) |
| `/ai-tag` | `AITagPage` | AI 태그 추천 페이지                              |

## TagItem 스타일링 (CVA)

`class-variance-authority` 기반 태그 렌더링:

- **variant**: `filled` (px-6), `outlined` (px-6 + border-4px), `ghost` (px-3 + bg-transparent)
- **shape**: `round` (rounded-45px), `squared` (rounded-16px), `emoji` (rounded-0 + p-0)
- **size**: `base` (h-90px, text-48px), `small` (h-48px, text-24px)
- 3D 이모지 태그는 `get3DEmojiImage()`로 이미지 URL을 가져와 `<img>`로 렌더링

## 유틸리티 함수 (assets/utils.ts)

| 함수                       | 설명                                                            |
| -------------------------- | --------------------------------------------------------------- |
| `getTagStyleKey(tag)`      | 태그의 `{variant}-{shape}` 키 반환                              |
| `getStyleCombinations()`   | 6가지 스타일 조합 배열 반환                                     |
| `shuffleArray(array)`      | Fisher-Yates 셔플                                               |
| `getRandomTagStyles(tags)` | 태그에 랜덤 스타일 배정 (이모지 태그 제외, 인접 태그 중복 방지) |
