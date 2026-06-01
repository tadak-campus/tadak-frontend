export type ShopItemType = "BACKGROUND" | "KEYCAP" | "SOUND" | "DECORATION";

export type KeycapSkin = {
  plate: string; // 키보드 판(plate) 배경
  base: string; // 키 기본 배경
  border: string; // 키 테두리
  text: string; // 키 글자색
  pressed: string; // 눌림 배경
  pressedBorder: string; // 눌림 테두리
  pressedText: string; // 눌림 글자색
};

export type DecorationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type Decoration = {
  emoji: string;
  position: DecorationPosition;
};

// 아이템 종류별 미리보기 스킨(목업: 실제 에셋 대신 CSS로 표현)
export type ItemSkin =
  | { kind: "BACKGROUND"; background: string }
  | { kind: "KEYCAP"; keycap: KeycapSkin }
  | { kind: "DECORATION"; decorations: Decoration[] }
  | { kind: "SOUND"; label: string };

// 현행 Keyboard 모습을 그대로 재현하는 기본 키캡 스킨.
// hex 대신 @theme 토큰(var(--color-*))을 참조해 토큰을 단일 출처로 유지한다.
export const defaultKeycapSkin: KeycapSkin = {
  plate: "white",
  base: "white",
  border: "var(--color-blue-50)",
  text: "black",
  pressed: "var(--color-sky-400)",
  pressedBorder: "var(--color-sky-300)",
  pressedText: "white",
};
