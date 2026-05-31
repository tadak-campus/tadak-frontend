# 상점 페이지 (Shop) 설계

작성일: 2026-05-31

## 목표

타닥(tadak-frontend)에 상점 페이지를 추가한다. 사용자는 키보드 꾸밈 아이템(배경 / 키캡 / 효과음 / 장식)을 둘러보고, 아이템을 선택하면 상단 키보드 미리보기에 즉시 반영되는 것을 본다. 이번 작업은 **UI만** 만든다 — 실제 백엔드 연동과 구매·착용 동작은 stub으로 비워둔다.

## 범위 (이번 작업)

포함:
- `/shop` 라우트에 상점 메인 페이지(`ShopPage`) 렌더링
- 상단 키보드 미리보기 + 하단 카테고리 탭 + 아이템 그리드 (세로 배치, "카드 중심" 레이아웃)
- 아이템 클릭 시 상단 미리보기에 즉시 반영 (로컬 state)
- 가격 / 보유(`is_owned`) / 착용중(`is_equipped`) 배지 **표시**
- 구매 / 착용 / 착용 해제 버튼 **표시** (클릭 동작은 stub)
- 목업 아이템 데이터 (백엔드 응답 형태)

제외 (deferred):
- 백엔드 API 연동, 실제 구매/착용 로직
- Play 페이지에 착용 아이템 반영 (전역 상태 공유 없음)
- 효과음 실제 재생 (라벨 표시만)
- 실제 에셋 이미지(`thumbnail_url`/`asset_url`) — 목업은 CSS 스킨으로 대체

## 결정 사항

- **상태 공유**: 전역 store/Context 없이 `ShopPage` 로컬 state로 미리보기만 처리. Play 연동은 추후 별도 작업.
- **키보드 확장**: `Keyboard`를 직접 확장하지 않고 `KeyboardStage` 래퍼를 신설한다. Stage가 배경·장식 레이어를 깔고 그 위에 `Keyboard`(키캡 스킨 적용)를 올린다.
- **구매 흐름**: 가격·보유·구매·착용을 UI에 표시하되 클릭 동작은 stub.
- **효과음 미리보기**: 라벨 표시만 (재생 stub 함수도 만들지 않음).
- **레이아웃**: "카드 중심" — 각 아이템 카드 안에 가격·버튼을 둔다.

## 파일 구조

```
src/
├─ pages/Shop/
│  ├─ ShopPage.tsx              # 미리보기 state 보유 + 레이아웃 조립
│  ├─ shopData.ts               # 목업 아이템 데이터 (ShopItem[]) + CSS 스킨 매핑
│  └─ components/
│     ├─ CategoryTabs.tsx       # 배경/키캡/효과음/장식 탭
│     ├─ ItemGrid.tsx           # 선택 카테고리의 아이템 그리드
│     └─ ItemCard.tsx           # 썸네일 + 이름 + 가격/보유 배지 + 버튼
└─ components/Keyboard/
   ├─ KeyboardStage.tsx         # 신설: 배경+장식 레이어로 Keyboard를 감쌈
   ├─ Keyboard.tsx              # keycapSkin prop 추가, 배경 하드코딩 제거(기본값=현행 흰 배경)
   ├─ KeyboardLayout.tsx        # 변경 없음
   └─ cosmetics.ts              # 신설: 꾸밈 타입/스킨 정의
```

## 데이터 모델

`cosmetics.ts` — 카테고리 타입과 스킨 정의:

```ts
type ShopItemType = 'BACKGROUND' | 'KEYCAP' | 'SOUND' | 'DECORATION';

type ShopItem = {
  id: number;
  name: string;
  type: ShopItemType;
  price: number;
  thumbnail_url: string;
  asset_url: string;
  is_owned: boolean;
  is_equipped: boolean;
  sound_files: string[];
};
```

> 참고: 백엔드 예시의 `type: "KEYBOARD"`는 임시값으로 보고, 프론트는 위 4종 enum으로 매핑한다. 실제 enum 문자열은 백엔드 확정 시 교체한다.

목업 아이템마다 화면에 그릴 **CSS 스킨**을 함께 둔다(에셋 이미지 부재 대응):
- BACKGROUND: 배경 CSS(gradient/색)
- KEYCAP: 키캡 색 세트 (기본/눌림/테두리)
- DECORATION: 키보드 주변에 배치할 이모지/요소 + 위치
- SOUND: 표시용 라벨 (재생 없음)

스킨 색상은 콘텐츠 데이터이므로 `shopData.ts`에 두고 inline style로 적용한다(컴포넌트 하드코딩 아님). UI 크롬 색은 `@theme` 토큰을 사용한다.

## 컴포넌트 책임

- **`ShopPage`** — `previewByType` state(`{ BACKGROUND?, KEYCAP?, SOUND?, DECORATION? }`) 보유. 아이템 클릭 핸들러로 미리보기 갱신. 합성 스킨을 `KeyboardStage`에 전달. 카테고리 탭 선택 state 보유.
- **`KeyboardStage`** — props: 배경 스킨, 장식 목록, 키캡 스킨, 그리고 `Keyboard`에 넘길 입력 props. 배경 div + 장식 레이어 위에 `Keyboard` 렌더. 기본값(스킨 없음)이면 현행 모습 유지.
- **`Keyboard`** — `keycapSkin?` prop 추가. 기존 하드코딩된 키캡/배경 색을 스킨 기본값으로 치환(미전달 시 현행과 동일).
- **`CategoryTabs`** — 4개 탭, 선택값/변경 콜백.
- **`ItemGrid`** — 현재 카테고리 아이템을 카드 그리드로.
- **`ItemCard`** — 썸네일(CSS 스킨), 이름, 가격, `is_owned`/`is_equipped` 배지, 보유여부에 따른 버튼(구매/착용/착용 해제). 클릭=미리보기 적용. 버튼 onClick은 stub.

## 미리보기 상태 흐름

1. 사용자가 카테고리 탭 선택 → `ItemGrid`가 해당 type 아이템 표시
2. 아이템 카드 클릭 → `previewByType[type] = id` 갱신 (선택 카드에 강조 테두리)
3. `ShopPage`가 `previewByType`로부터 합성 스킨 계산 → `KeyboardStage`에 전달 → 상단 키보드 즉시 반영
4. 구매/착용/착용 해제 버튼: `onClick`은 `// TODO: 백엔드 연동` stub. 배지는 목업 데이터의 `is_owned`/`is_equipped`로만 표시.

## 라우팅

`src/routes/AppRoutes.tsx`의 `/shop` placeholder(`<div>Shop</div>`)를 `<ShopPage />`로 교체. import는 `@pages/Shop/ShopPage`.

## 스타일

- 레이아웃은 `src/designs/design-system.ts`의 `panel`, `sectionHeadline` 등 재사용.
- 새 UI 색이 필요하면 `src/index.css`의 `@theme`에 토큰 추가 (하드코딩 hex 금지).
- 크로스영역 import는 path alias 사용(`@components/*`, `@pages/*`, `@designs/*`).

## 검증

- `npm run build` (tsc + 빌드) 통과
- `npm run lint` 통과
- `/shop` 진입 → 탭 전환, 아이템 클릭 시 상단 미리보기 변경 확인 (수동)
- `PlayPage`(/play)가 기존과 동일하게 동작하는지 확인 (Keyboard 리팩터 회귀 없음)
