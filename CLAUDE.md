# Thumbnail-Maker 프로젝트 가이드

## 프로젝트 개요
썸네일 제작 도구 - React + TypeScript + Vite 기반

## 개발 규칙

### 커밋 규칙
- **작업 완료 시 자동 커밋**: 각 기능 구현이나 수정 작업이 완료되면 즉시 커밋
- **커밋 메시지는 한글로 작성**
- **Conventional Commit 형식 사용**:
  - `feat: 새로운 기능 추가 설명`
  - `fix: 버그 수정 설명`
  - `refactor: 코드 리팩토링 설명`
  - `style: 스타일/포맷팅 변경`
  - `docs: 문서 변경`
  - `chore: 빌드/설정 관련 변경`

### 코드 스타일
- TypeScript strict mode
- React functional components with hooks
- Tailwind CSS for styling

## 주요 디렉토리 구조
```
src/
├── components/      # 재사용 가능한 컴포넌트
├── pages/          # 페이지 컴포넌트
├── hooks/          # 커스텀 훅
├── lib/            # 유틸리티 및 설정
├── data/           # 정적 데이터
└── styles/         # 글로벌 스타일
```

## 데이터 소스
- **Supabase**: 템플릿 데이터 저장소
- **로컬 JSON**: `src/data/templates.json` - 노출할 템플릿 ID 관리
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Start Vite dev server (port 5000)
- `pnpm build` - TypeScript check (`tsc --noEmit`) + Vite production build
- `pnpm typecheck` - TypeScript compiler check only
- `pnpm lint` - ESLint (.ts/.tsx) + Stylelint (.less)
- `pnpm lint:fix` - Auto-fix lint issues

Package manager is **pnpm** (enforced via preinstall script). Do not use npm or yarn.

## Tech Stack

- React 18 + TypeScript (strict) + Vite 4
- shadcn/ui (Radix UI primitives) + Tailwind CSS
- react-router-dom v6 (BrowserRouter)
- @dnd-kit for drag-and-drop
- html2canvas for image export
- react-hotkeys-hook for keyboard shortcuts
- react-i18next (en/ko)
- next-themes for dark/light mode
- TanStack React Query v4

## Architecture

### Context Provider Hierarchy

The app nests providers in this order (defined in `app.tsx` and `index.tsx`):

```
QueryClientProvider > ThemeProvider > HotkeysProvider > Router
  └─ PaletteProvider > CanvasSizeProvider > TagProvider > ThumbnailMaker
```

### Split Read/Write Context Pattern

Each domain context is split into separate read and write contexts to minimize re-renders:

- **Tag.context.tsx**: `TagListContext` (read) + `TagActionContext` (write), `SelectedTagContext` + `SelectTagActionContext`, `TagStyleContext` + `TagStyleActionContext`
- **Palette.context.tsx**: `PaletteContext` (read) + `PaletteActionContext` (write)
- **CanvasSize.context.tsx**: `CanvasSizeContext` (read) + `CanvasSizeActionContext` (write)

Hooks follow the naming: `useTagList()` for data, `useTagAction()` for mutations.

### LocalStorage Persistence

State persists to localStorage via `use-storage-state` with these keys:
- `@thumbnail-maker/tags` - Tag list
- `@thumbnail-maker/palette` - Color palette
- `@thumbnail-maker/canvas-size` - Canvas size preset

The tag system supports optimistic updates with rollback via `prevTags` ref and `onRollbackTags()`.

### Two Canvas Modes

Toggled by `isDragMode` state (Ctrl+D shortcut):
- **Select Mode** (default): Click tags to edit via bottom sheets (`TagChangeSheet`, `TagEmojiSheet`)
- **Drag Mode**: Reorder tags via @dnd-kit drag-and-drop (`DragModeCanvas`)

### Image Export

`usePreview` hook uses `html2canvas` to convert the canvas DOM ref to an image blob for download or upload.

## Conventions

- Import alias: `src/*` maps to `./src/*` (e.g., `import { cn } from "src/lib/utils"`)
- Components: PascalCase filenames
- Contexts: `*.context.tsx` suffix
- Hooks: `use*.ts` prefix in `hooks/` directories
- UI primitives live in `src/components/ui/` (shadcn/ui, do not modify without reason)
- Feature components live in `src/components/thumbnail-maker/`
- Styling: `cn()` utility for conditional Tailwind classes (`clsx` + `tailwind-merge`)
- Commitlint enforces conventional commits via Husky
