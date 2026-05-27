export type KeyDef = {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: number;
};

export type KeyboardLayout = {
  rows: KeyDef[][];
};

export const qwertyLayout: KeyboardLayout = {
  rows: [
    [
      { code: "Backquote", label: "`", shiftLabel: "~" },
      { code: "Digit1", label: "1", shiftLabel: "!" },
      { code: "Digit2", label: "2", shiftLabel: "@" },
      { code: "Digit3", label: "3", shiftLabel: "#" },
      { code: "Digit4", label: "4", shiftLabel: "$" },
      { code: "Digit5", label: "5", shiftLabel: "%" },
      { code: "Digit6", label: "6", shiftLabel: "^" },
      { code: "Digit7", label: "7", shiftLabel: "&" },
      { code: "Digit8", label: "8", shiftLabel: "*" },
      { code: "Digit9", label: "9", shiftLabel: "(" },
      { code: "Digit0", label: "0", shiftLabel: ")" },
      { code: "Minus", label: "-", shiftLabel: "_" },
      { code: "Equal", label: "=", shiftLabel: "+" },
      { code: "Backspace", label: "←", width: 2 },
    ],
    [
      { code: "Tab", label: "Tab", width: 1.5 },
      { code: "KeyQ", label: "ㅂ", shiftLabel: "ㅃ" },
      { code: "KeyW", label: "ㅈ", shiftLabel: "ㅉ" },
      { code: "KeyE", label: "ㄷ", shiftLabel: "ㄸ" },
      { code: "KeyR", label: "ㄱ", shiftLabel: "ㄲ" },
      { code: "KeyT", label: "ㅅ", shiftLabel: "ㅆ" },
      { code: "KeyY", label: "ㅛ" },
      { code: "KeyU", label: "ㅕ" },
      { code: "KeyI", label: "ㅑ" },
      { code: "KeyO", label: "ㅐ" },
      { code: "KeyP", label: "ㅔ" },
      { code: "BracketLeft", label: "[", shiftLabel: "{" },
      { code: "BracketRight", label: "]", shiftLabel: "}" },
      { code: "Backslash", label: "\\", shiftLabel: "|", width: 1.5 },
    ],
    [
      { code: "CapsLock", label: "Caps", width: 1.75 },
      { code: "KeyA", label: "ㅁ" },
      { code: "KeyS", label: "ㄴ" },
      { code: "KeyD", label: "ㅇ" },
      { code: "KeyF", label: "ㄹ" },
      { code: "KeyG", label: "ㅎ" },
      { code: "KeyH", label: "ㅗ" },
      { code: "KeyJ", label: "ㅓ" },
      { code: "KeyK", label: "ㅏ" },
      { code: "KeyL", label: "ㅣ" },
      { code: "Semicolon", label: ";", shiftLabel: ":" },
      { code: "Quote", label: "'", shiftLabel: '"' },
      { code: "Enter", label: "Enter", width: 2.25 },
    ],
    [
      { code: "ShiftLeft", label: "Shift", width: 2.25 },
      { code: "KeyZ", label: "ㅋ" },
      { code: "KeyX", label: "ㅌ" },
      { code: "KeyC", label: "ㅊ" },
      { code: "KeyV", label: "ㅍ" },
      { code: "KeyB", label: "ㅠ" },
      { code: "KeyN", label: "ㅜ" },
      { code: "KeyM", label: "ㅡ" },
      { code: "Comma", label: ",", shiftLabel: "<" },
      { code: "Period", label: ".", shiftLabel: ">" },
      { code: "Slash", label: "/", shiftLabel: "?" },
      { code: "ShiftRight", label: "Shift", width: 2.75 },
    ],
    [
      { code: "ControlLeft", label: "Ctrl", width: 1.25 },
      { code: "MetaLeft", label: "Win", width: 1.25 },
      { code: "AltLeft", label: "Alt", width: 1.25 },
      { code: "Space", label: " ", width: 6.25 },
      { code: "AltRight", label: "Alt", width: 1.25 },
      { code: "MetaRight", label: "Win", width: 1.25 },
      { code: "ControlRight", label: "Ctrl", width: 1.25 },
    ],
  ],
};
