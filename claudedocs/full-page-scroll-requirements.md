# Full-Page Scroll + Template Gallery 요구사항 명세서

## Overview

Full-page scroll 기반 2+ 섹션 레이아웃으로 썸네일 에디터와 템플릿 갤러리를 분리 제공

## Decisions

| 항목 | 결정 |
|------|------|
| 스크롤 구현 방식 | CSS scroll-snap (네이티브) |
| 템플릿 선택 동작 | 미리보기 모달 → 확인 후 적용 |
| 네비게이션 UI | 스크롤 힌트만 (화살표 + bounce) |
| 추가 섹션 | 예정됨 (확장 가능 구조 필요) |
| 데이터 소스 | JSON 파일 분리 |
| 목록 UI | Stagger 그리드 애니메이션 |
| 미리보기 방식 | 이미지 스냅샷 |

## Scope

### In Scope
- Page 1: 기존 썸네일 메이커 (100vh 화면 차지)
- Page 2: 템플릿 갤러리 섹션
- 스크롤 힌트 UI (하단 화살표 + bounce 애니메이션)
- 템플릿 미리보기 모달 (이미지 스냅샷)
- 추가 섹션 확장 가능 구조

### Out of Scope
- 실시간 템플릿 렌더링 (스냅샷 이미지 사용)
- 서버/API 연동 (JSON 파일 사용)

## Technical Constraints

- CSS scroll-snap 사용 (라이브러리 없이 네이티브)
- 템플릿 데이터는 JSON 파일로 분리 관리
- 기존 컨텍스트 구조와 호환 필요
- Framer Motion 미설치 → Tailwind CSS 애니메이션 활용

## Proposed Architecture

```
src/
├── components/
│   ├── landing/
│   │   ├── FullPageScroller.tsx    # scroll-snap 컨테이너
│   │   ├── ScrollHint.tsx          # 화살표 + bounce 애니메이션
│   │   └── Section.tsx             # 100vh 섹션 wrapper
│   ├── template-gallery/
│   │   ├── TemplateGallery.tsx     # 메인 갤러리 컴포넌트
│   │   ├── TemplateCard.tsx        # 개별 카드 (stagger 대상)
│   │   ├── TemplatePreviewModal.tsx # 미리보기 모달
│   │   └── useTemplates.ts         # JSON 로딩 훅
│   └── thumbnail-maker/            # 기존 유지
├── data/
│   └── templates.json              # 템플릿 정의
```

## UI Specifications

### Page 1 - Thumbnail Editor
- 100vh 화면 차지
- 기존 ThumbnailMaker 컴포넌트 그대로 유지
- 하단에 스크롤 힌트 (화살표 + bounce)

### Page 2 - Template Gallery
- 100vh 섹션
- Stagger 그리드 애니메이션 (순차적 fade-in)
- 카테고리 필터 (optional)
- 카드 hover 효과

### Template Card
- 스냅샷 이미지 썸네일
- 템플릿 이름
- 클릭 → 미리보기 모달

### Preview Modal
- 큰 이미지 스냅샷
- "적용" / "취소" 버튼
- 적용 시 기존 작업 대체 확인 다이얼로그

## Animation Specifications

### Scroll Hint
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Stagger Grid
- 각 카드 순차적 fade-in
- `animation-delay: calc(index * 100ms)`
- Intersection Observer로 viewport 진입 시 트리거

## Template Data Schema

```typescript
interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;  // 이미지 경로
  tags: Tag[];
  palette: PaletteVariant;
  canvasSize: CanvasSizeType;
}
```

## Success Criteria

1. Page 1 ↔ Page 2 부드러운 스크롤 전환
2. 기존 ThumbnailMaker 기능 100% 유지
3. 템플릿 선택 → 미리보기 → 적용 플로우 완성
4. 모바일/데스크톱 반응형 지원
5. 추가 섹션 확장 용이한 구조
