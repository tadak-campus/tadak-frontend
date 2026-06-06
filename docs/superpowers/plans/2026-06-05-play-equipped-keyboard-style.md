# 타자연습 착용 키보드 스타일 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 타자연습 페이지(`PlayPage`)에 현재 착용 중인 키보드 스킨·배경·장식을 반영한다.

**Architecture:** `GET /api/users/me`로 착용 아이템을 조회하는 신규 훅(`useEquippedKeyboardStyle`)을 만들고, PlayPage가 기존 `KeyboardStage` 컴포넌트(상점 미리보기와 동일)에 그 스타일을 넘겨 렌더한다. 조회 실패·미착용은 모두 기본 스킨으로 조용히 폴백한다.

**Tech Stack:** React 19 + TypeScript, Vite, axios(`apiClient`), 경로 alias(`@apis`, `@app-types`, `@hooks`, `@pages`, `@components`).

**테스트 정책:** 이 레포는 유닛 테스트 프레임워크가 없다(scripts: dev/build/lint/preview). 테스트 러너를 새로 도입하지 않는다. 각 태스크의 검증 게이트는 `npm run build`(tsc 타입체크 포함) + `npm run lint`이며, 마지막에 dev 서버로 수동 확인한다.

**참고 — 설계 문서:** `docs/superpowers/specs/2026-06-05-play-equipped-keyboard-style-design.md`

---

### Task 1: 키캡 스킨 변환 헬퍼 추가

착용 KEYBOARD 아이템을 `KeycapSkin`으로 바꾸는 헬퍼를 `shopData.ts`에 추가한다. `KEYCAP_SKINS`·`defaultKeycapSkin`이 이미 이 파일 범위에 있어 순환참조가 없다.

**Files:**
- Modify: `src/pages/Shop/shopData.ts` (파일 끝에 추가)

- [ ] **Step 1: 헬퍼 함수 추가**

`src/pages/Shop/shopData.ts` 맨 아래(현재 `KEYCAP_SKINS` 선언 다음)에 추가:

```ts
// 착용 KEYBOARD 아이템 → 키캡 스킨. 매칭 스킨이 없거나 아이템이 없으면 기본 스킨.
export const keycapSkinForItem = (
  item: ShopItem | null | undefined,
): KeycapSkin => (item && KEYCAP_SKINS[item.id]) || defaultKeycapSkin;
```

(`ShopItem`은 같은 파일에 정의돼 있고, `KeycapSkin`·`defaultKeycapSkin`은 파일 상단에서 이미 import 중이다.)

- [ ] **Step 2: 타입체크 + 린트**

Run: `npm run build` 그리고 `npm run lint`
Expected: 둘 다 에러 없이 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/pages/Shop/shopData.ts
git commit -m "feat: 착용 아이템→키캡 스킨 변환 헬퍼 추가"
```

---

### Task 2: 사용자 정보 타입 + API 추가

`GET /api/users/me` 응답 타입과 호출 함수를 추가한다. `auth.ts`/`@app-types/auth` 패턴을 그대로 따른다.

**Files:**
- Create: `src/types/user.ts`
- Create: `src/apis/user.ts`

- [ ] **Step 1: `UserMe` 타입 작성**

Create `src/types/user.ts`:

```ts
import type { EquippedItems } from "@pages/Shop/shopData";

// GET /api/users/me 응답. equipped_items의 각 슬롯은 ShopItem | null.
export interface UserMe {
  id: number;
  kakao_id: string;
  profile_nickname: string;
  point: number;
  equipped_items: EquippedItems;
}
```

- [ ] **Step 2: API 호출 함수 작성**

Create `src/apis/user.ts`:

```ts
import { apiClient } from "@apis/client";
import type { UserMe } from "@app-types/user";

// 현재 로그인 사용자 정보(포인트 · 착용 아이템 포함) 조회.
export const getCurrentUser = () => apiClient.get<UserMe, UserMe>("/users/me");
```

- [ ] **Step 3: 타입체크 + 린트**

Run: `npm run build` 그리고 `npm run lint`
Expected: 둘 다 에러 없이 통과.

- [ ] **Step 4: 커밋**

```bash
git add src/types/user.ts src/apis/user.ts
git commit -m "feat: 사용자 정보 조회 API(/users/me) 추가"
```

---

### Task 3: 착용 키보드 스타일 훅 추가

`/users/me`를 마운트 시 1회 조회해 키캡 스킨·배경·장식 URL로 변환하는 훅을 추가한다. 실패는 조용히 무시(기본 스킨 유지), 언마운트 가드 포함.

**Files:**
- Create: `src/hooks/useEquippedKeyboardStyle.ts`

- [ ] **Step 1: 훅 작성**

Create `src/hooks/useEquippedKeyboardStyle.ts`:

```ts
import { useEffect, useState } from "react";
import { getCurrentUser } from "@apis/user";
import { resolveAssetUrl } from "@apis/assetUrl";
import { keycapSkinForItem } from "@pages/Shop/shopData";
import {
  defaultKeycapSkin,
  type KeycapSkin,
} from "@components/Keyboard/cosmetics";

// 착용 중인 키보드 스타일(키캡 스킨 + 배경 + 장식). KeyboardStage props와 호환된다.
export type EquippedKeyboardStyle = {
  keycapSkin: KeycapSkin;
  backgroundImageUrl?: string;
  decorationImageUrl?: string;
};

// 마운트 시 GET /api/users/me로 착용 아이템을 1회 조회해 스타일로 변환한다.
// 초기값은 기본 스킨(배경·장식 없음)이며 조회 성공 시 교체한다.
// 비로그인·네트워크 오류 등 실패는 조용히 무시해 기본 스킨을 유지한다(타자연습을 막지 않음).
export const useEquippedKeyboardStyle = (): EquippedKeyboardStyle => {
  const [style, setStyle] = useState<EquippedKeyboardStyle>({
    keycapSkin: defaultKeycapSkin,
  });

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (!active) return;
        const { keyboard, background, decoration } = user.equipped_items;
        setStyle({
          keycapSkin: keycapSkinForItem(keyboard),
          backgroundImageUrl:
            resolveAssetUrl(background?.asset_url ?? null) ?? undefined,
          decorationImageUrl:
            resolveAssetUrl(decoration?.asset_url ?? null) ?? undefined,
        });
      })
      .catch(() => {
        // 착용 정보 조회 실패 시 기본 스킨 유지.
      });

    return () => {
      active = false;
    };
  }, []);

  return style;
};
```

- [ ] **Step 2: 타입체크 + 린트**

Run: `npm run build` 그리고 `npm run lint`
Expected: 둘 다 에러 없이 통과. (훅은 아직 미사용이지만 export되어 있어 빌드는 통과한다.)

- [ ] **Step 3: 커밋**

```bash
git add src/hooks/useEquippedKeyboardStyle.ts
git commit -m "feat: 착용 키보드 스타일 조회 훅 추가"
```

---

### Task 4: PlayPage에 스타일 적용

PlayPage의 `Keyboard`를 `KeyboardStage`로 교체하고 훅의 스타일을 넘긴다.

**Files:**
- Modify: `src/pages/Play/PlayPage.tsx` (import 2행, 컴포넌트 본문 1행, JSX 하단 블록)

- [ ] **Step 1: import 교체**

`src/pages/Play/PlayPage.tsx` 2행을 교체하고 훅 import를 추가한다.

변경 전 (2행):
```tsx
import Keyboard from "@components/Keyboard/Keyboard";
```
변경 후:
```tsx
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { useEquippedKeyboardStyle } from "@hooks/useEquippedKeyboardStyle";
```

- [ ] **Step 2: 훅 호출 추가**

컴포넌트 본문에서 다른 훅 호출 근처(예: 19행 `useKeyboardInput()` 다음 줄)에 추가:

변경 전:
```tsx
  const { pressedCodes, shiftActive } = useKeyboardInput();
```
변경 후:
```tsx
  const { pressedCodes, shiftActive } = useKeyboardInput();
  const keyboardStyle = useEquippedKeyboardStyle();
```

- [ ] **Step 3: JSX 하단 Keyboard 블록을 KeyboardStage로 교체**

현재 하단 블록:
```tsx
      <Keyboard
        layout={qwertyLayout}
        pressedCodes={pressedCodes}
        shiftActive={shiftActive}
      />
```
교체 후:
```tsx
      <KeyboardStage
        layout={qwertyLayout}
        pressedCodes={pressedCodes}
        shiftActive={shiftActive}
        {...keyboardStyle}
      />
```

- [ ] **Step 4: 타입체크 + 린트**

Run: `npm run build` 그리고 `npm run lint`
Expected: 둘 다 에러 없이 통과.

- [ ] **Step 5: 커밋**

```bash
git add src/pages/Play/PlayPage.tsx
git commit -m "feat: 타자연습 페이지에 착용 키보드 스타일 적용"
```

---

### Task 5: 수동 검증

**Files:** (없음 — 실행/관찰만)

- [ ] **Step 1: dev 서버 실행 및 확인**

Run: `npm run dev` 후 타자연습 페이지(`/play` 등 해당 라우트) 접속.

확인 항목:
- 로그인 + 키보드/배경/장식 착용 상태: 진입 시 기본 스킨으로 잠깐 보였다가 착용 스타일로 교체되는지.
- 키 입력 시 눌림 색(`pressed`)이 착용 스킨대로 표시되는지.
- 배경/장식 미착용 또는 비로그인 상태: 기본 스킨 + 회색 스테이지 박스로 정상 렌더되고 타이핑·통계가 정상 동작하는지.
- 콘솔에 미처리 에러가 없는지(조회 실패는 조용히 무시되어야 함).

- [ ] **Step 2: (선택) 착용 변경 반영 확인**

상점에서 키보드/배경/장식을 다른 것으로 저장한 뒤 타자연습으로 재진입 → 변경된 스타일이 반영되는지 확인.
