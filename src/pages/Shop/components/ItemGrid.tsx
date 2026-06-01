import type { ShopItem } from "../shopData";
import ItemCard from "./ItemCard";

type Props = {
  items: ShopItem[];
  selectedId?: number;
  onSelect: (item: ShopItem) => void;
};

const ItemGrid = ({ items, selectedId, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
