import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { useEffect, useRef, useState } from "react";
import { resolveAssetUrl } from "@apis/assetUrl";
import {
  KEYCAP_SKINS,
  shopItemDisplayName,
  soundPackForItem,
  type ShopItem,
} from "@pages/Shop/shopData";
import {
  defaultKeycapSkin,
  getKeycapStyle,
  getPressedKeycapStyle,
  type KeycapSkin,
  type KeycapVariant,
} from "@components/Keyboard/cosmetics";

type Props = {
  item: ShopItem;
  selected: boolean;
  onSelect: (item: ShopItem) => void;
  onBuy: (item: ShopItem) => void;
  busy?: boolean;
};

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex h-16 items-center justify-center rounded-2xl bg-white/80 text-xs font-bold text-slate-400 ring-1 ring-slate-100">
    {label}
  </div>
);

const SOUND_PREVIEW_VOLUME = 0.65;

const soundPreviewUrlsForItem = (item: ShopItem): string[] => {
  if (item.type !== "SOUND") {
    return [];
  }

  const apiUrls = item.sound_files
    .map((file) => resolveAssetUrl(file.file_url))
    .filter((url): url is string => Boolean(url));

  if (apiUrls.length > 0) {
    return apiUrls;
  }

  return soundPackForItem(item) ?? [];
};

type MiniKey = {
  variant: KeycapVariant;
  width?: number;
  pressed?: boolean;
};

const miniRows: MiniKey[][] = [
  [
    { variant: "accentKey" },
    { variant: "key" },
    { variant: "key" },
    { variant: "modifierKey" },
  ],
  [
    { variant: "modifierKey", width: 1.25 },
    { variant: "key" },
    { variant: "key" },
    { variant: "enterKey", width: 1.5 },
  ],
  [
    { variant: "modifierKey" },
    { variant: "spaceKey", width: 2.2 },
    { variant: "arrowKey", pressed: true },
  ],
];

const MiniKeycap = ({
  skin,
  variant,
  width = 1,
  pressed = false,
}: MiniKey & { skin: KeycapSkin }) => {
  const style = pressed
    ? getPressedKeycapStyle(skin)
    : getKeycapStyle(skin, variant);

  return (
    <span
      className="h-3 rounded-[4px] border"
      style={{
        flex: `${width} 1 0`,
        backgroundColor: style.base,
        borderColor: style.border,
        boxShadow: style.shadow,
      }}
    />
  );
};

// 아이템 종류별 썸네일 미리보기
const Thumbnail = ({ item }: { item: ShopItem }) => {
  const [broken, setBroken] = useState(false);
  const displayName = shopItemDisplayName(item);

  // 배경·장식: 이미지 에셋(thumbnail_url) 표시. 없거나 로드 실패 시 중립 플레이스홀더.
  if (item.type === "BACKGROUND" || item.type === "DECORATION") {
    const src = resolveAssetUrl(item.thumbnail_url);
    if (!src || broken) {
      return <Placeholder label="기본" />;
    }
    return (
      <img
        src={src}
        alt={displayName}
        onError={() => setBroken(true)}
        className="h-16 w-full rounded-2xl object-cover shadow-sm"
      />
    );
  }

  // 키보드(키캡): CSS 색 스킨 미리보기 (목업 — KEYCAP_SKINS, 미등록 id는 기본 스킨).
  if (item.type === "KEYBOARD") {
    const keycap = KEYCAP_SKINS[item.id] ?? defaultKeycapSkin;
    return (
      <div
        className="flex h-16 flex-col justify-center gap-1 rounded-2xl border px-3 shadow-inner ring-1 ring-white/70"
        style={{
          background: keycap.plate,
          borderColor: keycap.plateBorder ?? "rgba(255,255,255,0.8)",
        }}
      >
        {miniRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((miniKey, keyIndex) => (
              <MiniKeycap key={keyIndex} skin={keycap} {...miniKey} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // SOUND: 라벨 표시 (재생 없음)
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-xl font-black text-sky-400 shadow-sm ring-1 ring-sky-100">
      <AudiotrackIcon />
    </span>
  );
};

const ItemCard = ({ item, selected, onSelect, onBuy, busy }: Props) => {
  const displayName = shopItemDisplayName(item);
  const [previewing, setPreviewing] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewUrls = soundPreviewUrlsForItem(item);
  const canPreviewSound = item.type === "SOUND";

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
    };
  }, []);

  const handlePreviewSound = () => {
    if (previewUrls.length === 0) {
      return;
    }

    previewAudioRef.current?.pause();

    const url = previewUrls[Math.floor(Math.random() * previewUrls.length)];
    const audio = new Audio(url);
    audio.volume = SOUND_PREVIEW_VOLUME;

    const release = () => {
      if (previewAudioRef.current === audio) {
        previewAudioRef.current = null;
        setPreviewing(false);
      }
      audio.removeEventListener("ended", release);
      audio.removeEventListener("error", release);
    };

    audio.addEventListener("ended", release);
    audio.addEventListener("error", release);
    previewAudioRef.current = audio;
    setPreviewing(true);

    void audio.play().catch(release);
  };

  return (
    <div
      className={`relative flex min-h-[168px] flex-col items-center rounded-2xl p-3 text-center transition ${
        selected
          ? "border-2 border-sky-300 bg-white shadow-[0_14px_28px_rgba(131,182,252,0.22)] ring-4 ring-sky-100/80"
          : "border border-slate-200 bg-white/95 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
      }`}
    >
      {/* 카드 본문 클릭 = 미리보기 선택 */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-pressed={selected}
        className="flex w-full flex-1 flex-col items-center text-center focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-300"
      >
        <Thumbnail item={item} />
        <div className="mt-2 flex min-h-10 items-center text-sm font-bold leading-5 text-slate-900">
          {displayName}
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {item.is_owned ? "보유함" : `${item.price.toLocaleString()}P`}
        </div>
      </button>

      {canPreviewSound && (
        <button
          type="button"
          onClick={handlePreviewSound}
          disabled={previewUrls.length === 0}
          aria-label={`${displayName} 미리듣기`}
          title="미리듣기"
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-sky-500 shadow-sm ring-1 ring-sky-100 transition hover:bg-sky-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:text-slate-300 disabled:ring-slate-100"
        >
          <PlayArrowRoundedIcon sx={{ fontSize: 17 }} />
          <span>{previewing ? "재생 중" : "미리듣기"}</span>
        </button>
      )}

      {/* 착용중 = 적용중 / 보유·미착용 = 보유중 (착용은 '저장하기'로) / 미보유 = 구매 버튼 */}
      {item.is_equipped ? (
        <span className="mt-2 block w-full rounded-xl bg-green-50 py-1.5 text-center text-xs font-bold text-green-700 ring-1 ring-green-200">
          적용중
        </span>
      ) : item.is_owned ? (
        <span className="mt-2 block w-full rounded-xl bg-sky-50 py-1.5 text-center text-xs font-bold text-sky-600 ring-1 ring-sky-100">
          보유중
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onBuy(item)}
          disabled={busy}
          className="mt-2 block w-full rounded-xl bg-sky-400 py-1.5 text-center text-xs font-bold text-white shadow-[0_8px_16px_rgba(131,182,252,0.22)] transition hover:bg-sky-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          구매하기
        </button>
      )}
    </div>
  );
};

export default ItemCard;
