import {
  defaultKeycapSkin,
  type KeycapSkin,
  type ShopItemType,
} from "@components/Keyboard/cosmetics";

// 효과음 파일 — GET /api/shop/summary 의 sound_files 원소 스키마.
export type SoundFile = {
  id: number;
  name: string;
  file_url: string;
};

// 백엔드 응답 형태 — GET /api/shop/summary 의 item 스키마와 동일.
export type ShopItem = {
  id: number;
  name: string;
  type: ShopItemType;
  price: number;
  thumbnail_url: string | null;
  asset_url: string | null;
  is_owned: boolean;
  is_equipped: boolean;
  sound_files: SoundFile[];
};

// 착용 슬롯 키 (API equipped_items 구조)
export type EquippedSlot = "keyboard" | "background" | "sound" | "decoration";

// 슬롯별 착용 아이템 — 미착용 슬롯은 null.
export type EquippedItems = Record<EquippedSlot, ShopItem | null>;

// GET /api/shop/summary 응답 형태
export type ShopSummary = {
  point: number;
  equipped_items: EquippedItems;
  items: ShopItem[];
};

// 슬롯 키 ↔ 아이템 타입 매핑 (equipped_items 순회 시 사용)
export const SLOT_TO_TYPE: Record<EquippedSlot, ShopItemType> = {
  keyboard: "KEYBOARD",
  background: "BACKGROUND",
  sound: "SOUND",
  decoration: "DECORATION",
};

// TODO: 키캡 색은 API 명세에 없는 목업 표현 데이터다. KEYBOARD 아이템 id로 조회하며,
// 매칭되는 id가 없으면 기본 스킨(defaultKeycapSkin)으로 폴백한다.
// 실제 키캡 에셋/색 명세가 확정되면 교체한다.
export const KEYCAP_SKINS: Record<number, KeycapSkin> = {
  10: defaultKeycapSkin,
  11: {
    plate: "#ecfdf5",
    base: "#a7f3d0",
    border: "#6ee7b7",
    text: "#065f46",
    pressed: "#34d399",
    pressedBorder: "#10b981",
    pressedText: "white",
  },
  12: {
    plate: "#1f2937",
    base: "#f5f5f4",
    border: "#d6d3d1",
    text: "#1c1917",
    pressed: "#f97316",
    pressedBorder: "#ea580c",
    pressedText: "white",
  },
};

// 착용 KEYBOARD 아이템 → 키캡 스킨. KEYBOARD 외 타입이나 매칭 스킨이 없으면(또는 아이템이 없으면) 기본 스킨.
export const keycapSkinForItem = (
  item: ShopItem | null | undefined,
): KeycapSkin =>
  (item ? KEYCAP_SKINS[item.id] : undefined) ?? defaultKeycapSkin;
