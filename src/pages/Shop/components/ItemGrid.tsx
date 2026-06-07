import type { ShopItem } from "@pages/Shop/shopData";
import ItemCard from "@pages/Shop/components/ItemCard";

type Props = {
  items: ShopItem[];
  selectedId?: number;
  onSelect: (item: ShopItem) => void;
  onBuy: (item: ShopItem) => void;
  busy?: boolean;
};

const ItemGrid = ({ items, selectedId, onSelect, onBuy, busy }: Props) => {
  if (items.length === 0) {
    return (
      <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 text-center text-sm font-semibold text-slate-400">
        준비된 아이템이 없어요.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
          onBuy={onBuy}
          busy={busy}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
