import Keyboard from "@components/Keyboard/Keyboard";
import type { KeyboardLayout } from "@components/Keyboard/KeyboardLayout";
import type { KeycapSkin } from "@components/Keyboard/cosmetics";

type Props = {
  layout: KeyboardLayout;
  pressedCodes: Set<string>;
  shiftActive: boolean;
  backgroundImageUrl?: string; // 배경 에셋(asset_url) — 스테이지 전체 배경 이미지
  decorationImageUrl?: string; // 장식 에셋(asset_url) — 키보드 위 투명 오버레이
  soundLabel?: string;
  keycapSkin?: KeycapSkin;
};

const KeyboardStage = ({
  layout,
  pressedCodes,
  shiftActive,
  backgroundImageUrl,
  decorationImageUrl,
  soundLabel,
  keycapSkin,
}: Props) => {
  return (
    <div
      className="relative flex justify-center overflow-hidden rounded-2xl bg-slate-50 bg-cover bg-center p-8"
      style={
        backgroundImageUrl
          ? { backgroundImage: `url("${backgroundImageUrl}")` }
          : undefined
      }
    >
      {decorationImageUrl && (
        <img
          src={decorationImageUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {soundLabel && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
          ♪ {soundLabel}
        </span>
      )}

      <div className="relative w-full max-w-190">
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
