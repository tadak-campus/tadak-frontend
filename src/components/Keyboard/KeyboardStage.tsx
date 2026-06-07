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
      className="relative isolate flex min-h-[240px] justify-start overflow-x-auto overflow-y-hidden rounded-[24px] border border-white/80 bg-slate-50 bg-cover bg-center bg-no-repeat p-3 shadow-inner ring-1 ring-slate-100 sm:min-h-[280px] sm:p-4 lg:min-h-[300px] lg:justify-center lg:p-5"
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
          className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-0 bg-white/10" />

      {soundLabel && (
        <span className="pointer-events-none absolute bottom-4 right-4 z-30 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-white/80">
          ♪ {soundLabel}
        </span>
      )}

      <div className="relative z-10 min-w-[860px] max-w-[920px] flex-1">
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
