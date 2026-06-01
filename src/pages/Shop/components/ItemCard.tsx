import { defaultKeycapSkin } from "@components/Keyboard/cosmetics";
import { KEYCAP_SKINS, type ShopItem } from "../shopData";

type Props = {
  item: ShopItem;
  selected: boolean;
  onSelect: (item: ShopItem) => void;
};

// 아이템 종류별 썸네일 미리보기
const Thumbnail = ({ item }: { item: ShopItem }) => {
  // 배경·장식: 이미지 에셋(thumbnail_url) 표시. 없으면(기본 아이템) 중립 플레이스홀더.
  if (item.type === "BACKGROUND" || item.type === "DECORATION") {
    if (!item.thumbnail_url) {
      return (
        <div className="flex h-16 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-400">
          기본
        </div>
      );
    }
    return (
      <img
        src={item.thumbnail_url}
        alt={item.name}
        className="h-16 w-full rounded-lg object-cover"
      />
    );
  }

  // 키보드(키캡): CSS 색 스킨 미리보기 (목업 — KEYCAP_SKINS)
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

const ItemCard = ({ item, selected, onSelect }: Props) => {
  const buttonLabel = item.is_equipped
    ? "착용 해제"
    : item.is_owned
      ? "착용"
      : "구매";

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`relative flex flex-col rounded-2xl bg-white p-3 text-left transition ${
        selected ? "border-2 border-sky-400" : "border border-slate-200"
      }`}
    >
      {item.is_equipped && (
        <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          착용중
        </span>
      )}
      {!item.is_equipped && item.is_owned && (
        <span className="absolute right-2 top-2 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          보유
        </span>
      )}

      <Thumbnail item={item} />

      <div className="mt-2 text-sm font-semibold text-slate-900">
        {item.name}
      </div>
      <div className="text-xs text-slate-500">
        {item.is_owned ? "보유함" : `💰 ${item.price}`}
      </div>

      {/* TODO: 백엔드 연동 — 구매 POST /api/shop/items/{id}/buy,
          착용/해제 POST /api/shop/items/{id}/equip (현재는 라벨 표시만) */}
      <span className="mt-2 block w-full rounded-lg bg-slate-100 py-1 text-center text-xs font-semibold text-slate-700">
        {buttonLabel}
      </span>
    </button>
  );
};

export default ItemCard;
