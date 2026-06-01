import {
  defaultKeycapSkin,
  type KeycapSkin,
  type ShopItemType,
} from "@components/Keyboard/cosmetics";

// 백엔드 응답 형태 — GET /api/shop/summary 의 item 스키마와 동일.
// 주의: API 예시의 `type`은 모두 "KEYBOARD"(Swagger 기본값)이라 신뢰할 수 없어,
// 실제 카테고리는 equipped_items 슬롯 키(keyboard/background/sound/decoration)에 맞춰 둔다.
export type ShopItem = {
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

// 착용 슬롯 키 (API equipped_items 구조)
export type EquippedSlot = "keyboard" | "background" | "sound" | "decoration";

// GET /api/shop/summary 응답 형태
export type ShopSummary = {
  point: number;
  equipped_items: Record<EquippedSlot, ShopItem>;
  items: ShopItem[];
};

// 슬롯 키 ↔ 아이템 타입 매핑 (equipped_items 순회 시 사용)
export const SLOT_TO_TYPE: Record<EquippedSlot, ShopItemType> = {
  keyboard: "KEYBOARD",
  background: "BACKGROUND",
  sound: "SOUND",
  decoration: "DECORATION",
};

// TODO: 키캡 색은 API 명세에 없는 목업 표현 데이터다.
// 실제 키캡 에셋/색 명세가 확정되면 교체한다. KEYBOARD 아이템 id로 조회.
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

// TODO: GET /api/shop/summary 응답으로 교체 (현재는 목업 상수).
// asset_url/thumbnail_url 은 public/shop/ 아래 임시 SVG 플레이스홀더를 가리킨다.
export const SHOP_SUMMARY: ShopSummary = {
  point: 320,
  equipped_items: {
    keyboard: {
      id: 10,
      name: "기본",
      type: "KEYBOARD",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    background: {
      id: 3,
      name: "다크",
      type: "BACKGROUND",
      price: 100,
      thumbnail_url: "/shop/bg-dark.svg",
      asset_url: "/shop/bg-dark.svg",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    sound: {
      id: 20,
      name: "기본",
      type: "SOUND",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    decoration: {
      id: 30,
      name: "기본",
      type: "DECORATION",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
  },
  items: [
    // 배경
    {
      id: 0,
      name: "기본",
      type: "BACKGROUND",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: false,
      sound_files: [],
    },
    {
      id: 1,
      name: "네온",
      type: "BACKGROUND",
      price: 120,
      thumbnail_url: "/shop/bg-neon.svg",
      asset_url: "/shop/bg-neon.svg",
      is_owned: false,
      is_equipped: false,
      sound_files: [],
    },
    {
      id: 2,
      name: "우드",
      type: "BACKGROUND",
      price: 90,
      thumbnail_url: "/shop/bg-wood.svg",
      asset_url: "/shop/bg-wood.svg",
      is_owned: true,
      is_equipped: false,
      sound_files: [],
    },
    {
      id: 3,
      name: "다크",
      type: "BACKGROUND",
      price: 100,
      thumbnail_url: "/shop/bg-dark.svg",
      asset_url: "/shop/bg-dark.svg",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    {
      id: 4,
      name: "파스텔",
      type: "BACKGROUND",
      price: 150,
      thumbnail_url: "/shop/bg-pastel.svg",
      asset_url: "/shop/bg-pastel.svg",
      is_owned: false,
      is_equipped: false,
      sound_files: [],
    },
    // 키보드(키캡)
    {
      id: 10,
      name: "기본",
      type: "KEYBOARD",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    {
      id: 11,
      name: "민트",
      type: "KEYBOARD",
      price: 80,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: false,
      sound_files: [],
    },
    {
      id: 12,
      name: "레트로",
      type: "KEYBOARD",
      price: 110,
      thumbnail_url: "",
      asset_url: "",
      is_owned: false,
      is_equipped: false,
      sound_files: [],
    },
    // 효과음 (라벨만 표시)
    {
      id: 20,
      name: "기본",
      type: "SOUND",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    {
      id: 21,
      name: "청축",
      type: "SOUND",
      price: 60,
      thumbnail_url: "",
      asset_url: "",
      is_owned: false,
      is_equipped: false,
      sound_files: ["blue-switch.mp3"],
    },
    {
      id: 22,
      name: "적축",
      type: "SOUND",
      price: 60,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: false,
      sound_files: ["red-switch.mp3"],
    },
    // 장식
    {
      id: 30,
      name: "기본",
      type: "DECORATION",
      price: 0,
      thumbnail_url: "",
      asset_url: "",
      is_owned: true,
      is_equipped: true,
      sound_files: [],
    },
    {
      id: 31,
      name: "식물",
      type: "DECORATION",
      price: 70,
      thumbnail_url: "/shop/deco-plant.svg",
      asset_url: "/shop/deco-plant.svg",
      is_owned: false,
      is_equipped: false,
      sound_files: [],
    },
    {
      id: 32,
      name: "별빛",
      type: "DECORATION",
      price: 70,
      thumbnail_url: "/shop/deco-stars.svg",
      asset_url: "/shop/deco-stars.svg",
      is_owned: true,
      is_equipped: false,
      sound_files: [],
    },
  ],
};
