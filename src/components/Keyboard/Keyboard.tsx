import type { KeyboardLayout } from "@components/Keyboard/KeyboardLayout";
import {
  defaultKeycapSkin,
  type KeycapSkin,
} from "@components/Keyboard/cosmetics";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
  keycapSkin?: KeycapSkin;
};

const Keyboard = ({
  layout,
  pressedCodes,
  shiftActive,
  keycapSkin = defaultKeycapSkin,
}: Props) => {
  return (
    <div
      className="flex flex-col gap-2 p-6 select-none rounded-xl shadow-md"
      style={{ backgroundColor: keycapSkin.plate }}
    >
      {layout.rows.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const isPressed = pressedCodes.has(key.code);
            const baseClasses =
              "min-w-[40px] h-[52px] flex items-center justify-center rounded-md text-sm shadow-md border border-solid translate-y-[2px] transition-[background-color,transform,border-color] duration-[80ms] ease";
            const colorStyle = isPressed
              ? {
                  backgroundColor: keycapSkin.pressed,
                  borderColor: keycapSkin.pressedBorder,
                  color: keycapSkin.pressedText,
                  borderBottomWidth: "1px",
                }
              : {
                  backgroundColor: keycapSkin.base,
                  borderColor: keycapSkin.border,
                  color: keycapSkin.text,
                  borderBottomWidth: "2px",
                };
            const displayText =
              shiftActive && key.shiftLabel ? key.shiftLabel : key.label;
            return (
              <div
                key={key.code}
                style={{
                  flex: `${key.width ?? 1} 1 0`,
                  ...colorStyle,
                }}
                className={baseClasses}
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
