import Keyboard from "@components/Keyboard/Keyboard";
import type { KeyboardLayout } from "@components/Keyboard/KeyboardLayout";
import type {
  Decoration,
  DecorationPosition,
  KeycapSkin,
} from "@components/Keyboard/cosmetics";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
  background?: string; // CSS background 값
  decorations?: Decoration[];
  soundLabel?: string;
  keycapSkin?: KeycapSkin;
};

const POSITION_CLASS: Record<DecorationPosition, string> = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
};

const KeyboardStage = ({
  layout,
  pressedCodes,
  shiftActive,
  background,
  decorations = [],
  soundLabel,
  keycapSkin,
}: Props) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 flex justify-center"
      style={background ? { background } : undefined}
    >
      {decorations.map((deco, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute text-2xl ${POSITION_CLASS[deco.position]}`}
        >
          {deco.emoji}
        </span>
      ))}

      {soundLabel && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
          ♪ {soundLabel}
        </span>
      )}

      <div className="w-full max-w-[760px]">
        <Keyboard
          layout={layout}
          pressedCodes={pressedCodes}
          shiftActive={shiftActive}
          keycapSkin={keycapSkin}
        />
      </div>
    </div>
  );
};

export default KeyboardStage;
