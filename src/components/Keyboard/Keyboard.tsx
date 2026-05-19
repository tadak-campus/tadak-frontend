import type { KeyboardLayout } from "./KeyboardLayout";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
};

const Keyboard = ({ layout, pressedCodes, shiftActive }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px",
        userSelect: "none",
        borderRadius: "12px",
        background: "white",
      }}
    >
      {layout.rows.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: "6px" }}>
          {row.map((key) => {
            const isPressed = pressedCodes.has(key.code);
            const displayText =
              shiftActive && key.shiftLabel ? key.shiftLabel : key.label;
            return (
              <div
                key={key.code}
                style={{
                  flex: `${key.width ?? 1} 1 0`,
                  background: isPressed ? "#3b82f6" : "#262626",
                  minWidth: "40px",
                  height: "52px",
                  border: isPressed ? "1px solid #60a5fa" : "1px solid #404040",
                  borderRadius: "6px",
                  borderBottomWidth: isPressed ? "1px" : "3px",
                  color: isPressed ? "#ffffff" : "#e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  transition:
                    "background-color 80ms ease, transform 80ms ease, border-color 80ms ease",
                  transform: "translateY(2px)",
                }}
              >
                <span style={{ pointerEvents: "none" }}>{displayText}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
