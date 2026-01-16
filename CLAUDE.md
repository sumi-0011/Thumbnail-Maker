# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thumbnail Maker is a React-based web application for creating blog thumbnails with 3D emojis and customizable tags. Users can add text/emoji tags, customize styles, select color palettes, and download the result as PNG images.

## Development Commands

```bash
# Install dependencies (pnpm only - enforced via preinstall hook)
pnpm install

# Start dev server (port 5000)
pnpm dev

# Build (runs typecheck first)
pnpm build

# Type checking
pnpm typecheck
pnpm typecheck:watch

# Linting
pnpm lint
pnpm lint:fix
```

## Architecture

### Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Less (globals.less)
- **UI Components**: shadcn/ui (Radix primitives) - configured in `components.json`
- **State**: React Context + `use-storage-state` for localStorage persistence
- **Data Fetching**: TanStack Query + Supabase (templates gallery)
- **i18n**: i18next with dynamic imports (`src/i18n/locales/{en,ko}/`)
- **Image Export**: html2canvas + file-saver

### Key Directories

```
src/
├── components/
│   ├── thumbnail-maker/   # Core editor component
│   │   ├── *.context.tsx  # State providers (Tag, Palette, CanvasSize)
│   │   ├── hooks/         # Custom hooks (usePreview, useThumbnailTagList)
│   │   ├── assets/        # Types, constants, palette definitions
│   │   ├── DragMode/      # Drag-and-drop tag reordering
│   │   └── SubMenu/       # Menu components
│   ├── ui/                # shadcn/ui components
│   └── 3d-emoji-picker/   # Emoji selection component
├── pages/
│   ├── home/              # Main editor page
│   └── gallery/           # Templates gallery (Supabase-backed)
└── lib/
    └── supabaseClient.ts  # Supabase client setup
```

### State Management Pattern

The app uses a split context pattern (state/action separation):

```typescript
// Example from Tag.context.tsx
const TagListContext = createContext<{tags: Tag[]}>()      // Read-only state
const TagActionContext = createContext<{onAddTag, ...}>()  // Actions
```

Context providers wrap the app at `pages/home/index.tsx`:

- `PaletteProvider` → color theme selection
- `TagProvider` → tag list, selection, alignment
- `CanvasSizeProvider` → canvas dimensions (wide/square)

### Tag Data Model

```typescript
type Tag = {
  id: number;
  content:
    | { type: "text"; value: string }
    | { type: "3d-emoji"; value: EmojiType };
  tagVariant: "filled" | "outlined" | "ghost";
  tagShape: "round" | "squared" | "emoji";
};
```

### Path Aliases

TypeScript and Vite are configured with `src/*` alias:

```typescript
import { Button } from "src/components/ui/button";
```

### Environment Variables

Required for full functionality (prefix with `VITE_APP_`):

- `VITE_APP_GA_ID` - Google Analytics
- `VITE_APP_SUPABASE_PROJECT_URL` - Supabase URL
- `VITE_APP_SUPABASE_KEY` - Supabase anon key

## Conventions

- Components use named exports with PascalCase filenames
- Context providers follow `[Feature]Provider` / `use[Feature]` / `use[Feature]Action` pattern
- Local storage keys prefixed with `@thumbnail-maker/`
- UI components in `src/components/ui/` are shadcn/ui primitives - modify with caution

## Development Rules

### Reuse Existing Systems

새로운 기능을 추가할 때 반드시 기존 시스템과 패턴을 우선적으로 활용할 것:

- **UI 컴포넌트**: `src/components/ui/`의 shadcn/ui 컴포넌트를 먼저 확인하고 활용 (Button, Sheet, Select, Dialog 등)
- **상태 관리**: 기존 Context 패턴(state/action 분리)을 따르고, 새로운 전역 상태가 필요하면 동일한 패턴으로 생성
- **스타일링**: Tailwind CSS 유틸리티 클래스 사용, `globals.less`의 기존 스타일 변수 활용
- **훅 패턴**: `src/components/thumbnail-maker/hooks/`의 기존 커스텀 훅 패턴 참고
- **타입 정의**: `assets/palette.types.d.ts`와 같이 기존 타입 파일에 추가하거나 동일한 구조로 생성

새 컴포넌트나 패턴을 만들기 전에 항상 기존 코드베이스를 먼저 탐색할 것.
