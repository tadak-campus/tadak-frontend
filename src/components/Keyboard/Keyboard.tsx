import type {
  KeyDef,
  KeyboardLayout,
} from "@components/Keyboard/KeyboardLayout";
import {
  defaultKeycapSkin,
  getKeycapStyle,
  getPressedKeycapStyle,
  type KeycapSkin,
  type KeycapVariant,
} from "@components/Keyboard/cosmetics";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
  keycapSkin?: KeycapSkin;
};

const modifierCodes = new Set([
  "Tab",
  "CapsLock",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "Backspace",
]);

const modifierLabels = new Set(["Tab", "Caps", "Shift", "Ctrl", "Alt", "Fn", "Win"]);
const arrowCodes = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

const keycapVariantForKey = (key: KeyDef): KeycapVariant => {
  if (key.code === "Escape" || key.label === "Esc") return "accentKey";
  if (key.code === "Enter" || key.label === "Enter") return "enterKey";
  if (key.code === "Space") return "spaceKey";
  if (arrowCodes.has(key.code)) return "arrowKey";
  if (modifierCodes.has(key.code) || modifierLabels.has(key.label)) {
    return "modifierKey";
  }
  return "key";
};

const Keyboard = ({
  layout,
  pressedCodes,
  shiftActive,
  keycapSkin = defaultKeycapSkin,
}: Props) => {
  return (
    <div
      className="flex w-full select-none flex-col gap-2.5 rounded-[18px] border p-4 sm:p-5"
      style={{
        backgroundColor: keycapSkin.plate,
        borderColor: keycapSkin.plateBorder ?? "rgba(255,255,255,0.82)",
        boxShadow:
          keycapSkin.plateShadow ??
          "inset 0 1px 0 rgba(255,255,255,0.88), 0 18px 40px rgba(15,23,42,0.1)",
      }}
    >
      {layout.rows.map((row, i) => (
        <div key={i} className="flex gap-1.5 sm:gap-2">
          {row.map((key) => {
            const isPressed = pressedCodes.has(key.code);
            const variant = keycapVariantForKey(key);
            const keyStyle = getKeycapStyle(keycapSkin, variant);
            const pressedStyle = getPressedKeycapStyle(keycapSkin);
            const visualStyle = isPressed ? pressedStyle : keyStyle;
            const baseClasses =
              "flex h-[50px] min-w-[40px] items-center justify-center rounded-md border border-solid text-[13px] font-semibold leading-none transition-[background-color,background-image,box-shadow,transform,border-color,color] duration-[90ms] ease-out sm:h-[52px]";
            const sizeClasses = (key.width ?? 1) > 1.5 ? "text-[11px]" : "";
            const displayText =
              shiftActive && key.shiftLabel ? key.shiftLabel : key.label;
            return (
              <div
                key={key.code}
                style={{
                  flex: `${key.width ?? 1} 1 0`,
                  backgroundColor: visualStyle.base,
                  backgroundImage: isPressed ? undefined : keyStyle.highlight,
                  borderColor: visualStyle.border,
                  borderBottomWidth: isPressed ? "1px" : "2px",
                  boxShadow: visualStyle.shadow,
                  color: visualStyle.text,
                  transform: isPressed ? "translateY(2px)" : "translateY(0)",
                }}
                className={`${baseClasses} ${sizeClasses}`}
              >
                <span className="pointer-events-none">{displayText}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
