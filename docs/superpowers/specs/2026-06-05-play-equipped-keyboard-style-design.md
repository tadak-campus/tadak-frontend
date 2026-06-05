# 타자연습 페이지 착용 키보드 스타일 적용 설계

작성일: 2026-06-05

## 목적

타자연습 페이지(`PlayPage`)에 현재 사용자가 **착용 중인** 키보드 스타일을 반영한다. 적용 범위는 키캡 스킨(KEYBOARD), 배경(BACKGROUND), 장식(DECORATION) 세 가지다. 지금은 항상 기본 스킨·배경 없음으로만 렌더된다.

상점 미리보기가 이미 사용하는 `KeyboardStage` 컴포넌트를 재사용해 동일한 합성 방식(스테이지 배경 + 장식 오버레이 + 키캡 스킨)을 그대로 가져온다.

## 데이터 소스

착용 정보는 `GET /api/users/me`로 가져온다. 응답에 `equipped_items`(slot별 `ShopItem | null`)가 포함된다.

```jsonc
{
  "id": number,
  "kakao_id": string,
  "profile_nickname": string,
  "point": number,
  "equipped_items": {
    "keyboard":   ShopItem | null,
    "background": ShopItem | null,
    "sound":      ShopItem | null,
    "decoration": ShopItem | null
  }
}
```

`/api/shop/summary` 대신 `/users/me`를 쓰는 이유: PlayPage는 착용 아이템만 필요하고, 상점 전체 아이템 목록·포인트·구매/착용 로직은 불필요하다.

## 데이터 흐름

```
PlayPage
  └─ useEquippedKeyboardStyle()         신규 훅 → { keycapSkin, backgroundImageUrl?, decorationImageUrl? }
       ├─ getCurrentUser()              신규 API: GET /api/users/me
       ├─ keycapSkinForItem(keyboard)   키캡: 목업 KEYCAP_SKINS 조회, 폴백 defaultKeycapSkin
       └─ resolveAssetUrl(bg/deco)      배경·장식: asset_url → 절대 URL (기존 assetUrl 재사용)
  → <KeyboardStage {...style} />         기존 컴포넌트 재사용 (상점 미리보기와 동일)
```

## 신규/변경 파일

1. **`src/types/user.ts`** (신규) — `UserMe` 인터페이스. `equipped_items`는 기존 `EquippedItems`(`@pages/Shop/shopData`) 재사용. `auth.ts`가 `@app-types/auth`를 쓰는 패턴과 동일하게 `@app-types/user`에 둔다.

   ```ts
   import type { EquippedItems } from "@pages/Shop/shopData";

   export interface UserMe {
     id: number;
     kakao_id: string;
     profile_nickname: string;
     point: number;
     equipped_items: EquippedItems;
   }
   ```

2. **`src/apis/user.ts`** (신규) — `auth.ts` 패턴 그대로.

   ```ts
   import { apiClient } from "@apis/client";
   import type { UserMe } from "@app-types/user";

   export const getCurrentUser = () => apiClient.get<UserMe, UserMe>("/users/me");
   ```

3. **`src/pages/Shop/shopData.ts`** — `keycapSkinForItem` 헬퍼 추가. `KEYCAP_SKINS`가 이 파일에 있어 순환참조 없이 둘 수 있는 위치다.

   ```ts
   export const keycapSkinForItem = (
     item: ShopItem | null | undefined,
   ): KeycapSkin => (item && KEYCAP_SKINS[item.id]) || defaultKeycapSkin;
   ```

4. **`src/hooks/useEquippedKeyboardStyle.ts`** (신규) — 마운트 시 `getCurrentUser()` 1회 호출. `equipped_items`의 keyboard/background/decoration을 다음 형태로 변환한다.

   ```ts
   type EquippedKeyboardStyle = {
     keycapSkin: KeycapSkin;
     backgroundImageUrl?: string;
     decorationImageUrl?: string;
   };
   ```

   - 초기값: `{ keycapSkin: defaultKeycapSkin }` (배경·장식 없음).
   - 성공 시:
     - `keycapSkin = keycapSkinForItem(equipped_items.keyboard)`
     - `backgroundImageUrl = resolveAssetUrl(equipped_items.background?.asset_url ?? null) ?? undefined`
     - `decorationImageUrl = resolveAssetUrl(equipped_items.decoration?.asset_url ?? null) ?? undefined`
   - 실패(비로그인·네트워크 등): `catch`에서 조용히 무시 → 초기값(기본 스킨, 배경·장식 없음) 유지. 에러 노출 없음.
   - 언마운트 가드(`active` 플래그)로 언마운트 후 setState 방지.
   - 반환: `EquippedKeyboardStyle` 객체 하나. 로딩/에러 상태는 노출하지 않는다.

5. **`src/pages/Play/PlayPage.tsx`** — import를 `Keyboard` → `KeyboardStage`로 교체하고, 하단 `<Keyboard>` 블록(현 199–203행)을 다음으로 바꾼다.

   ```tsx
   const style = useEquippedKeyboardStyle();
   // ...
   <KeyboardStage
     layout={qwertyLayout}
     pressedCodes={pressedCodes}
     shiftActive={shiftActive}
     {...style}
   />
   ```

## 동작

- 페이지 진입 즉시 기본 스킨·배경 없음으로 렌더 → `/users/me` 응답이 오면 착용 스타일로 자연스럽게 교체된다.
- 착용 슬롯이 null이거나, 키캡 매칭 스킨이 없거나, 배경/장식 `asset_url`이 null이거나, 조회 자체가 실패해도 모두 안전하게 폴백(기본 스킨 + 해당 요소 없음)한다. 타자연습 기능은 어떤 경우에도 막히지 않는다.
- 상점에서 착용을 바꾸고 타자연습으로 (재)진입하면 마운트 시 재조회되어 반영된다. 전역 실시간 동기화는 두지 않는다.

## 레이아웃 영향

`KeyboardStage`는 키보드를 `bg-slate-50` 둥근 박스(`p-8`) 안에 감싼다. 배경 미착용 시에도 회색 스테이지 박스가 생기는데, 상점 미리보기와 동일한 모습이며 의도된 변경이다.

## 범위 밖 (YAGNI)

- **효과음(sound)**: 이번 작업 제외. `KeyboardStage`의 `soundLabel` prop은 넘기지 않는다. 추후 재생 기능과 함께 별도 작업으로 추가한다.
- **전역 상태 동기화**: 상점 착용 변경을 타 페이지에 즉시 반영하는 전역 store는 두지 않는다(진입 시 재조회로 충분).
- **ShopPage 리팩터링**: ShopPage는 미리보기(사용자 선택) 기반이라 본 훅을 쓰지 않는다. 현 구조 유지.

## 검증

- `npm run build` (tsc 타입체크 포함) 통과.
- 착용 키보드/배경/장식이 있는 계정으로 타자연습 진입 → 스타일 반영 확인.
- 비로그인/조회 실패 상황 → 기본 스킨으로 정상 렌더, 타이핑 동작 확인.
