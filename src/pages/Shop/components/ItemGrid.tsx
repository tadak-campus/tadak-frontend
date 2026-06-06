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
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
