// 상점 아이템 종류. API의 equipped_items 슬롯 키(keyboard/background/sound/decoration)와 1:1 매핑.
export type ShopItemType = "KEYBOARD" | "BACKGROUND" | "SOUND" | "DECORATION";

export type KeycapStyle = {
  base: string;
  border: string;
  text: string;
  shadow?: string;
  highlight?: string;
};

export type PressedKeycapStyle = {
  base: string;
  border: string;
  text: string;
  shadow?: string;
};

export type KeycapVariant =
  | "key"
  | "modifierKey"
  | "accentKey"
  | "spaceKey"
  | "enterKey"
  | "arrowKey";

export type KeycapSkin = {
  plate: string; // 키보드 판(plate) 배경
  plateBorder?: string;
  plateShadow?: string;
  key?: KeycapStyle;
  modifierKey?: KeycapStyle;
  accentKey?: KeycapStyle;
  spaceKey?: KeycapStyle;
  enterKey?: KeycapStyle;
  arrowKey?: KeycapStyle;
  pressed: PressedKeycapStyle | string;

  // 이전 단순 스킨 구조와 호환하기 위한 필드. 신규 테마는 key/pressed 객체를 사용한다.
  base?: string;
  border?: string;
  text?: string;
  shadow?: string;
  pressedBorder?: string;
  pressedText?: string;
};

const fallbackKeycapStyle: KeycapStyle = {
  base: "white",
  border: "var(--color-blue-50)",
  text: "black",
  shadow:
    "inset 0 1px 0 rgba(255,255,255,0.86), 0 2px 5px rgba(15,23,42,0.11)",
  highlight:
    "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0) 48%)",
};

const fallbackPressedStyle: PressedKeycapStyle = {
  base: "var(--color-sky-400)",
  border: "var(--color-sky-300)",
  text: "white",
  shadow:
    "inset 0 2px 4px rgba(15,23,42,0.18), 0 1px 2px rgba(15,23,42,0.12)",
};

const baseStyleForSkin = (skin: KeycapSkin): KeycapStyle => ({
  base: skin.key?.base ?? skin.base ?? fallbackKeycapStyle.base,
  border: skin.key?.border ?? skin.border ?? fallbackKeycapStyle.border,
  text: skin.key?.text ?? skin.text ?? fallbackKeycapStyle.text,
  shadow: skin.key?.shadow ?? skin.shadow ?? fallbackKeycapStyle.shadow,
  highlight: skin.key?.highlight ?? fallbackKeycapStyle.highlight,
});

export const getKeycapStyle = (
  skin: KeycapSkin,
  variant: KeycapVariant = "key",
): KeycapStyle => {
  const keyStyle = baseStyleForSkin(skin);
  if (variant === "key") return keyStyle;
  return skin[variant] ?? keyStyle;
};

export const getPressedKeycapStyle = (
  skin: KeycapSkin,
): PressedKeycapStyle => {
  if (typeof skin.pressed === "string") {
    return {
      base: skin.pressed,
      border: skin.pressedBorder ?? fallbackPressedStyle.border,
      text: skin.pressedText ?? fallbackPressedStyle.text,
      shadow: fallbackPressedStyle.shadow,
    };
  }

  return {
    ...fallbackPressedStyle,
    ...skin.pressed,
  };
};

// 타닥캠퍼스 기본 톤에 맞춘 Cloud Blue 키캡 스킨.
export const defaultKeycapSkin: KeycapSkin = {
  plate: "#eff6ff",
  plateBorder: "#dbeafe",
  plateShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(15,23,42,0.11)",
  key: {
    base: "#ffffff",
    border: "#dbe3ee",
    text: "#334155",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.92), 0 2px 5px rgba(15,23,42,0.1)",
  },
  modifierKey: {
    base: "#dbeafe",
    border: "#bfdbfe",
    text: "#1e3a8a",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.82), 0 2px 5px rgba(37,99,235,0.14)",
  },
  accentKey: {
    base: "#fde68a",
    border: "#fbbf24",
    text: "#78350f",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.72), 0 2px 5px rgba(217,119,6,0.14)",
  },
  spaceKey: {
    base: "#bfdbfe",
    border: "#93c5fd",
    text: "#1e3a8a",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.76), 0 2px 6px rgba(59,130,246,0.14)",
  },
  enterKey: {
    base: "#bae6fd",
    border: "#7dd3fc",
    text: "#075985",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.78), 0 2px 5px rgba(14,165,233,0.15)",
  },
  arrowKey: {
    base: "#c7d2fe",
    border: "#a5b4fc",
    text: "#3730a3",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.78), 0 2px 5px rgba(99,102,241,0.13)",
  },
  pressed: {
    base: "var(--color-sky-400)",
    border: "var(--color-sky-300)",
    text: "white",
  },
};
