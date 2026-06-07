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
    <div className="flex gap-1 overflow-x-auto rounded-full bg-sky-50/80 p-1 shadow-inner ring-1 ring-sky-100/70">
      {TABS.map((tab) => {
        const isActive = tab.type === active;
        return (
          <button
            key={tab.type}
            type="button"
            onClick={() => onChange(tab.type)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
              isActive
                ? "bg-white text-sky-500 shadow-[0_8px_18px_rgba(131,182,252,0.22)] ring-1 ring-sky-100"
                : "text-slate-500 hover:bg-white/80 hover:text-slate-950"
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
