import {
  defaultKeycapSkin,
  type KeycapSkin,
  type ShopItemType,
} from "@components/Keyboard/cosmetics";
import basic01 from "@assets/sounds/basic-01.wav";
import basic02 from "@assets/sounds/basic-02.wav";
import basic03 from "@assets/sounds/basic-03.wav";
import spacebar01 from "@assets/sounds/spacebar-01.wav";
import psyEe from "@assets/sounds/special-psy-ee.wav";
import psyHey from "@assets/sounds/special-psy-hey.wav";
import psyOp from "@assets/sounds/special-psy-op.mp3";

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

// TODO: 효과음도 API 명세의 sound_files 대신 SOUND 아이템 id로 @assets/sounds 파일을 매핑하는 목업이다.
// 각 팩은 사운드 URL 배열이며, 키 입력마다 배열에서 랜덤으로 하나를 재생한다.
// special- 팩(사운드 5)은 여러 효과음을 무작위로 재생하고, 나머지는 단일 basic 사운드를 사용한다.
export const SOUND_PACKS: Record<number, string[]> = {
  4: [basic01],
  5: [basic02],
  6: [basic03],
  7: [spacebar01],
  8: [psyEe, psyHey, psyOp],
};

// 착용 SOUND 아이템 → 사운드 팩(URL 배열). 매칭 팩이 없거나 아이템이 없으면 null(무음).
export const soundPackForItem = (
  item: ShopItem | null | undefined,
): string[] | null => (item ? SOUND_PACKS[item.id] : undefined) ?? null;
