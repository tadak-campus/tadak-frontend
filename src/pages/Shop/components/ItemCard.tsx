import { useState } from "react";
import { resolveAssetUrl } from "@apis/assetUrl";
import { KEYCAP_SKINS, type ShopItem } from "@pages/Shop/shopData";
import { defaultKeycapSkin } from "@components/Keyboard/cosmetics";

type Props = {
  item: ShopItem;
  selected: boolean;
  onSelect: (item: ShopItem) => void;
  onBuy: (item: ShopItem) => void;
  busy?: boolean;
};

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex h-16 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-400">
    {label}
  </div>
);

// 아이템 종류별 썸네일 미리보기
const Thumbnail = ({ item }: { item: ShopItem }) => {
  const [broken, setBroken] = useState(false);

  // 배경·장식: 이미지 에셋(thumbnail_url) 표시. 없거나 로드 실패 시 중립 플레이스홀더.
  if (item.type === "BACKGROUND" || item.type === "DECORATION") {
    const src = resolveAssetUrl(item.thumbnail_url);
    if (!src || broken) {
      return <Placeholder label="기본" />;
    }
    return (
      <img
        src={src}
        alt={item.name}
        onError={() => setBroken(true)}
        className="h-16 w-full rounded-lg object-cover"
      />
    );
  }

  // 키보드(키캡): CSS 색 스킨 미리보기 (목업 — KEYCAP_SKINS, 미등록 id는 기본 스킨).
  if (item.type === "KEYBOARD") {
    const keycap = KEYCAP_SKINS[item.id] ?? defaultKeycapSkin;
    return (
      <div
        className="flex h-16 items-center justify-center gap-1 rounded-lg"
        style={{ background: keycap.plate }}
      >
        {[keycap.base, keycap.pressed, keycap.base].map((c, i) => (
          <span
            key={i}
            className="h-6 w-5 rounded"
            style={{ backgroundColor: c, border: `1px solid ${keycap.border}` }}
          />
        ))}
      </div>
    );
  }

  // SOUND: 라벨 표시 (재생 없음)
  return (
    <div className="flex h-16 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
      ♪ {item.name}
    </div>
  );
};

const ItemCard = ({ item, selected, onSelect, onBuy, busy }: Props) => {
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl bg-white p-3 text-center transition ${
        selected ? "border-2 border-blue-500" : "border border-slate-200"
      }`}
    >
      {/* 카드 본문 클릭 = 미리보기 선택 */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="flex w-full flex-col items-center text-center"
      >
        <Thumbnail item={item} />
        <div className="mt-2 text-sm font-semibold text-slate-900">
          {item.name}
        </div>
        <div className="text-xs text-slate-500">
          {item.is_owned ? "보유함" : `${item.price}P`}
        </div>
      </button>

      {/* 착용중 = 적용중 / 보유·미착용 = 보유중 (착용은 '저장하기'로) / 미보유 = 구매 버튼 */}
      {item.is_equipped ? (
        <span className="mt-2 block w-full rounded-lg bg-green-100 py-1 text-center text-xs font-semibold text-green-700">
          적용중
        </span>
      ) : item.is_owned ? (
        <span className="mt-2 block w-full rounded-lg bg-blue-100 py-1 text-center text-xs font-semibold text-blue-700">
          보유중
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onBuy(item)}
          disabled={busy}
          className="mt-2 block w-full rounded-lg bg-blue-500 py-1 text-center text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          구매하기
        </button>
      )}
    </div>
  );
};

export default ItemCard;
