import type { KeyboardLayout } from "./KeyboardLayout";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
};

const Keyboard = ({ layout, pressedCodes, shiftActive }: Props) => {
  return (
    <div className="flex flex-col gap-2 p-6 select-none rounded-xl bg-white shadow-md">
      {layout.rows.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const isPressed = pressedCodes.has(key.code);
            const baseClasses =
              "min-w-[40px] h-[52px] flex items-center justify-center rounded-md text-sm shadow-md border border-blue-50 translate-y-[2px] transition-[background-color,transform,border-color] duration-[80ms] ease";
            const stateClasses = isPressed
              ? "bg-sky-400 border-sky-300 border-b text-white"
              : "border-b-2 text-black";
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
