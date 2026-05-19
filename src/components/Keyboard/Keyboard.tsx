import type { KeyboardLayout } from "./KeyboardLayout";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
};

const Keyboard = ({ layout, pressedCodes, shiftActive }: Props) => {
  return (
    <div className="flex flex-col gap-1.5 p-3 select-none rounded-xl bg-white">
      {layout.rows.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const isPressed = pressedCodes.has(key.code);
            const baseClasses =
              "min-w-[40px] h-[52px] flex items-center justify-center rounded-md text-sm border translate-y-[2px] transition-[background-color,transform,border-color] duration-[80ms] ease";
            const stateClasses = isPressed
              ? "bg-blue-500 border-blue-400 border-b text-white"
              : "bg-neutral-800 border-neutral-700 border-b-[3px] text-neutral-200";
            const displayText =
              shiftActive && key.shiftLabel ? key.shiftLabel : key.label;
            return (
              <div
                key={key.code}
                style={{
                  flex: `${key.width ?? 1} 1 0`,
                }}
                className={`${baseClasses} ${stateClasses}`}
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
