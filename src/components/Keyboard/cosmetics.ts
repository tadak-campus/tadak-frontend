// 상점 아이템 종류. API의 equipped_items 슬롯 키(keyboard/background/sound/decoration)와 1:1 매핑.
export type ShopItemType = "KEYBOARD" | "BACKGROUND" | "SOUND" | "DECORATION";

export type KeycapSkin = {
  plate: string; // 키보드 판(plate) 배경
  base: string; // 키 기본 배경
  border: string; // 키 테두리
  text: string; // 키 글자색
  pressed: string; // 눌림 배경
  pressedBorder: string; // 눌림 테두리
  pressedText: string; // 눌림 글자색
};

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
