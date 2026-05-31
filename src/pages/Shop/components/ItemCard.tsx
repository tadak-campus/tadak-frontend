import type { ShopItem } from "../shopData";

type Props = {
  item: ShopItem;
  selected: boolean;
  onSelect: (item: ShopItem) => void;
};

// 스킨 종류별 썸네일 미리보기
const Thumbnail = ({ item }: { item: ShopItem }) => {
  const skin = item.skin;
  if (skin.kind === "BACKGROUND") {
    return (
      <div
        className="h-16 rounded-lg"
        style={{ background: skin.background }}
      />
    );
  }
  if (skin.kind === "KEYCAP") {
    return (
      <div
        className="flex h-16 items-center justify-center gap-1 rounded-lg"
        style={{ background: skin.keycap.plate }}
      >
        {[skin.keycap.base, skin.keycap.pressed, skin.keycap.base].map(
          (c, i) => (
            <span
              key={i}
              className="h-6 w-5 rounded"
              style={{ backgroundColor: c, border: `1px solid ${skin.keycap.border}` }}
            />
          ),
        )}
      </div>
    );
  }
  if (skin.kind === "DECORATION") {
    return (
      <div className="flex h-16 items-center justify-center gap-2 rounded-lg bg-slate-100 text-2xl">
        {skin.decorations.map((d, i) => (
          <span key={i}>{d.emoji}</span>
        ))}
      </div>
    );
  }
  // SOUND
  return (
    <div className="flex h-16 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
      ♪ {skin.label}
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

      {/* 구매/착용 액션은 백엔드 연동 시 구현 예정 (현재는 라벨 표시만) */}
      <span className="mt-2 block w-full rounded-lg bg-slate-100 py-1 text-center text-xs font-semibold text-slate-700">
        {buttonLabel}
      </span>
    </button>
  );
};

export default ItemCard;
