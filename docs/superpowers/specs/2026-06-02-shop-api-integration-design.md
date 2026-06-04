# 상점 API 연동 설계

작성일: 2026-06-02

## 목적

현재 UI만 구성되어 있고 mock 상수(`SHOP_SUMMARY`)로 동작하는 상점 페이지를 로컬 백엔드(`http://localhost:8000`)의 실제 API에 연결한다. 조회·구매·착용 세 흐름을 모두 연동한다.

## 검증된 API 계약

dev 로그인(`POST /api/auth/login`, body `{"kakao_access_token":"123"}`)으로 토큰을 받아 실제 응답을 확인했다.

### `GET /api/shop/summary`
```jsonc
{
  "point": 1000,
  "equipped_items": {           // 각 슬롯 null 가능
    "keyboard": null,
    "background": { ...ShopItem } | null,
    "sound": null,
    "decoration": null
  },
  "items": [ ...ShopItem ]
}
```

### `POST /api/shop/items/{item_id}/buy` (요청 바디 없음)
```jsonc
{ "message": "구매가 완료되었습니다.", "point": 800, "item": { ...ShopItem } }
```

### `POST /api/shop/items/{item_id}/equip` (요청 바디 없음)
```jsonc
{ "message": "장착이 완료되었습니다.", "equipped_items": { ...EquippedItems } }
```

### ShopItem 실제 스키마
```ts
{
  id: number;
  name: string;
  type: "KEYBOARD" | "BACKGROUND" | "SOUND" | "DECORATION"; // 실제로 정확함
  price: number;
  thumbnail_url: string | null;
  asset_url: string | null;
  is_owned: boolean;
  is_equipped: boolean;
  sound_files: { id: number; name: string; file_url: string }[];
}
```

## 현재 mock 타입과의 차이 (교정 필요)

1. `equipped_items`의 각 슬롯이 **null 가능** → `Record<EquippedSlot, ShopItem | null>`.
   현재 `initialPreview`가 null에서 `.id` 접근 시 런타임 에러.
2. `sound_files`가 `string[]`이 아니라 `{ id, name, file_url }[]`.
3. `thumbnail_url`, `asset_url`이 null 가능.
4. `type` 필드는 실제로 정확함 — "신뢰 불가" 주석은 옛 정보.
5. **언착용(unequip) 엔드포인트가 없음** → "착용 해제" 라벨은 동작 불가, "착용중" 표시로 처리.

## UX 모델: 미리보기 + 저장하기

- 카드 클릭 = 해당 타입 미리보기(local state). 현재 동작 유지.
- 카드 하단 버튼: 미보유 → "구매"(buy), 보유·미착용 → "보유" 표시, 착용중 → "착용중" 표시.
- "내 키보드 저장하기" = 타입별 미리보기 항목 중 **보유 중이고 미착용**인 것만 equip 호출 후 summary 재조회.

## 구조

```
ShopPage (UI + 상태)
  └─ useShop()                  신규 훅: summary 조회/로딩/에러 + buy/save
       └─ apis/shop.ts          신규 API 모듈 (auth.ts 패턴)
            └─ apiClient (axios) 기존 — Bearer 주입, res.data 반환, 401 리다이렉트
```

### 변경/신규 파일

- `src/pages/Shop/shopData.ts` — 타입 교정, `SoundFile` 추가, `SHOP_SUMMARY` mock 제거. `KEYCAP_SKINS`/`SLOT_TO_TYPE`는 유지.
- `src/apis/shop.ts` (신규) — `getShopSummary`, `buyItem`, `equipItem` + 응답 타입.
- `src/apis/assetUrl.ts` 또는 util (신규) — `resolveAssetUrl(url)`: `/static/...` 상대경로에 백엔드 origin prefix, 절대 URL은 그대로, null은 빈 값. 백엔드 origin은 `VITE_API_BASE_URL`에서 `/api` 제거로 도출.
- `src/pages/Shop/useShop.ts` (신규) — `{ summary, loading, error, refetch, buy, save, saving }`.
- `src/pages/Shop/ShopPage.tsx` — 로딩/에러/성공 분기, summary로 미리보기 초기화, 저장하기 연동.
- `src/pages/Shop/components/ItemCard.tsx` — 구매 버튼, 상태 표시, `resolveAssetUrl` + `<img onError>` fallback.

## 이미지 처리

- `/static/...` → 백엔드 origin prefix (예: `http://127.0.0.1:8000/static/...`). 200 서빙 확인됨.
- `https://example.com/...` → 깨진 placeholder(기본 아이템). `<img onError>`로 중립 placeholder 대체.
- `null` → 중립 placeholder.

## 에러 처리

- 조회 실패 → 에러 메시지 + 재시도 버튼. 401은 apiClient가 `/login` 리다이렉트.
- buy/equip 실패 → 백엔드 메시지(422 detail, 예: 포인트 부족) 노출 후 상태 유지.

## 검증

- `npm run build` (tsc 타입체크 포함) 통과.
- dev 토큰으로 조회 → 구매 → 저장 흐름 수동 확인.
