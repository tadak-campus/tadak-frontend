import type { ShopItemType } from "@components/Keyboard/cosmetics";

type Props = {
  active: ShopItemType;
  onChange: (type: ShopItemType) => void;
};

const TABS: { type: ShopItemType; label: string }[] = [
  { type: "BACKGROUND", label: "배경" },
  { type: "KEYBOARD", label: "키보드" },
  { type: "SOUND", label: "효과음" },
  { type: "DECORATION", label: "장식" },
];

const CategoryTabs = ({ active, onChange }: Props) => {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => {
        const isActive = tab.type === active;
        return (
          <button
            key={tab.type}
            type="button"
            onClick={() => onChange(tab.type)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "bg-sky-400 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
