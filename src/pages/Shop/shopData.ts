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

const strawberryMilkSkin: KeycapSkin = {
    plate: "#fff1f2",
    plateBorder: "#ffe4e6",
    plateShadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(190,18,60,0.11)",
    key: {
      base: "#fffafa",
      border: "#f9d8df",
      text: "#5f3140",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.92), 0 2px 5px rgba(190,18,60,0.09)",
    },
    modifierKey: {
      base: "#fde2e7",
      border: "#fbc7d1",
      text: "#8a2846",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.82), 0 2px 5px rgba(190,18,60,0.12)",
    },
    accentKey: {
      base: "#fb7185",
      border: "#f43f5e",
      text: "white",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 5px rgba(244,63,94,0.2)",
    },
    spaceKey: {
      base: "#f9a8d4",
      border: "#f472b6",
      text: "#831843",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.68), 0 2px 6px rgba(219,39,119,0.14)",
    },
    enterKey: {
      base: "#fda4af",
      border: "#fb7185",
      text: "#881337",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 5px rgba(225,29,72,0.14)",
    },
    arrowKey: {
      base: "#fecdd3",
      border: "#fda4af",
      text: "#9f1239",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.74), 0 2px 5px rgba(225,29,72,0.11)",
    },
    pressed: {
      base: "#f43f5e",
      border: "#e11d48",
      text: "white",
    },
};

const creamSodaSkin: KeycapSkin = {
    plate: "#fffbeb",
    plateBorder: "#fde68a",
    plateShadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(146,64,14,0.1)",
    key: {
      base: "#fffef7",
      border: "#eadfbe",
      text: "#4b3b25",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.92), 0 2px 5px rgba(146,64,14,0.09)",
    },
    modifierKey: {
      base: "#fef3c7",
      border: "#fde68a",
      text: "#78350f",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.78), 0 2px 5px rgba(217,119,6,0.12)",
    },
    accentKey: {
      base: "#fdba74",
      border: "#fb923c",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.68), 0 2px 5px rgba(234,88,12,0.16)",
    },
    spaceKey: {
      base: "#fed7aa",
      border: "#fdba74",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.74), 0 2px 6px rgba(234,88,12,0.12)",
    },
    enterKey: {
      base: "#fef08a",
      border: "#fde047",
      text: "#713f12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(202,138,4,0.14)",
    },
    arrowKey: {
      base: "#fcd9bd",
      border: "#fdba74",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.74), 0 2px 5px rgba(234,88,12,0.11)",
    },
    pressed: {
      base: "#f59e0b",
      border: "#d97706",
      text: "white",
    },
};

const cottonCandyMintSkin: KeycapSkin = {
    plate: "#fff1f5",
    plateBorder: "#fbcfe8",
    plateShadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(190,18,60,0.11)",
    key: {
      base: "#fff7f9",
      border: "#f7c6d2",
      text: "#5f3140",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.92), 0 2px 5px rgba(190,18,60,0.09)",
    },
    modifierKey: {
      base: "#f9c5cf",
      border: "#f3a7b7",
      text: "#7f1d3a",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.76), 0 2px 5px rgba(190,18,60,0.13)",
    },
    accentKey: {
      base: "#a7f3f8",
      border: "#67e8f9",
      text: "#155e75",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(8,145,178,0.15)",
    },
    spaceKey: {
      base: "#bae6fd",
      border: "#7dd3fc",
      text: "#075985",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.76), 0 2px 6px rgba(14,165,233,0.14)",
    },
    enterKey: {
      base: "#a7f3f8",
      border: "#67e8f9",
      text: "#155e75",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(8,145,178,0.15)",
    },
    arrowKey: {
      base: "#bae6fd",
      border: "#7dd3fc",
      text: "#075985",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.76), 0 2px 5px rgba(14,165,233,0.14)",
    },
    pressed: {
      base: "#0ea5e9",
      border: "#0284c7",
      text: "white",
    },
};

const vanillaPeachBoardSkin: KeycapSkin = {
    plate: "#f8fafc",
    plateBorder: "#e2e8f0",
    plateShadow:
      "inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(15,23,42,0.1)",
    key: {
      base: "#ffffff",
      border: "#e2e8f0",
      text: "#334155",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.94), 0 2px 5px rgba(15,23,42,0.09)",
    },
    modifierKey: {
      base: "#fef3c7",
      border: "#fde68a",
      text: "#713f12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.76), 0 2px 5px rgba(202,138,4,0.12)",
    },
    accentKey: {
      base: "#fed7aa",
      border: "#fdba74",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(234,88,12,0.14)",
    },
    spaceKey: {
      base: "#fed7aa",
      border: "#fdba74",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 6px rgba(234,88,12,0.13)",
    },
    enterKey: {
      base: "#fef08a",
      border: "#fde047",
      text: "#713f12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(202,138,4,0.14)",
    },
    arrowKey: {
      base: "#fdba74",
      border: "#fb923c",
      text: "#7c2d12",
      shadow:
        "inset 0 1px 0 rgba(255,255,255,0.68), 0 2px 5px rgba(234,88,12,0.14)",
    },
    pressed: {
      base: "#f97316",
      border: "#ea580c",
      text: "white",
    },
};

// TODO: 키캡 색은 API 명세에 없는 목업 표현 데이터다. KEYBOARD 아이템 id로 조회하며,
// 매칭되는 id가 없으면 기본 스킨(defaultKeycapSkin)으로 폴백한다.
// 실제 키캡 에셋/색 명세가 확정되면 교체한다.
export const KEYCAP_SKINS: Record<number, KeycapSkin> = {
  // Cloud Blue
  1: defaultKeycapSkin,
  // Strawberry Milk
  2: strawberryMilkSkin,
  // Cream Soda
  3: creamSodaSkin,
  // Cotton Candy Mint
  4: cottonCandyMintSkin,
  // Vanilla Peach Board
  5: vanillaPeachBoardSkin,

  // 현재 DB에서는 "키보드 4", "키보드 5"의 실제 item id가 15, 16이다.
  15: cottonCandyMintSkin,
  16: vanillaPeachBoardSkin,
};

export const KEYBOARD_THEME_NAMES: Record<number, string> = {
  1: "클라우드 블루",
  2: "딸기 우유",
  3: "크림 소다",
  4: "솜사탕 민트",
  5: "바닐라 피치",
  15: "솜사탕 민트",
  16: "바닐라 피치",
};

export const shopItemDisplayName = (item: ShopItem): string =>
  item.type === "KEYBOARD"
    ? (KEYBOARD_THEME_NAMES[item.id] ?? item.name)
    : item.name;

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
