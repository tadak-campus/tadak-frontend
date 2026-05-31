import type { ItemSkin, ShopItemType } from "@components/Keyboard/cosmetics";

// 백엔드 응답 형태 + 미리보기 스킨(목업)
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
  skin: ItemSkin; // 목업 전용: 실제 에셋 대신 CSS로 표현
};

export const SHOP_ITEMS: ShopItem[] = [
  // 배경
  {
    id: 1,
    name: "네온",
    type: "BACKGROUND",
    price: 120,
    thumbnail_url: "",
    asset_url: "",
    is_owned: false,
    is_equipped: false,
    sound_files: [],
    skin: { kind: "BACKGROUND", background: "linear-gradient(135deg,#1e3a8a,#7c3aed)" },
  },
  {
    id: 2,
    name: "우드",
    type: "BACKGROUND",
    price: 90,
    thumbnail_url: "",
    asset_url: "",
    is_owned: true,
    is_equipped: false,
    sound_files: [],
    skin: { kind: "BACKGROUND", background: "#92400e" },
  },
  {
    id: 3,
    name: "다크",
    type: "BACKGROUND",
    price: 100,
    thumbnail_url: "",
    asset_url: "",
    is_owned: true,
    is_equipped: true,
    sound_files: [],
    skin: { kind: "BACKGROUND", background: "#0f172a" },
  },
  {
    id: 4,
    name: "파스텔",
    type: "BACKGROUND",
    price: 150,
    thumbnail_url: "",
    asset_url: "",
    is_owned: false,
    is_equipped: false,
    sound_files: [],
    skin: { kind: "BACKGROUND", background: "linear-gradient(135deg,#fbcfe8,#bfdbfe)" },
  },
  // 키캡
  {
    id: 11,
    name: "민트",
    type: "KEYCAP",
    price: 80,
    thumbnail_url: "",
    asset_url: "",
    is_owned: true,
    is_equipped: false,
    sound_files: [],
    skin: {
      kind: "KEYCAP",
      keycap: {
        plate: "#ecfdf5",
        base: "#a7f3d0",
        border: "#6ee7b7",
        text: "#065f46",
        pressed: "#34d399",
        pressedBorder: "#10b981",
        pressedText: "white",
      },
    },
  },
  {
    id: 12,
    name: "레트로",
    type: "KEYCAP",
    price: 110,
    thumbnail_url: "",
    asset_url: "",
    is_owned: false,
    is_equipped: false,
    sound_files: [],
    skin: {
      kind: "KEYCAP",
      keycap: {
        plate: "#1f2937",
        base: "#f5f5f4",
        border: "#d6d3d1",
        text: "#1c1917",
        pressed: "#f97316",
        pressedBorder: "#ea580c",
        pressedText: "white",
      },
    },
  },
  // 효과음 (라벨만 표시)
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
    skin: { kind: "SOUND", label: "청축" },
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
    skin: { kind: "SOUND", label: "적축" },
  },
  // 장식
  {
    id: 31,
    name: "식물",
    type: "DECORATION",
    price: 70,
    thumbnail_url: "",
    asset_url: "",
    is_owned: false,
    is_equipped: false,
    sound_files: [],
    skin: {
      kind: "DECORATION",
      decorations: [
        { emoji: "🌿", position: "top-left" },
        { emoji: "🪴", position: "top-right" },
      ],
    },
  },
  {
    id: 32,
    name: "별빛",
    type: "DECORATION",
    price: 70,
    thumbnail_url: "",
    asset_url: "",
    is_owned: true,
    is_equipped: false,
    sound_files: [],
    skin: {
      kind: "DECORATION",
      decorations: [
        { emoji: "✨", position: "top-right" },
        { emoji: "⭐", position: "bottom-left" },
      ],
    },
  },
];
