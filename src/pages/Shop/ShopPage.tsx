import { useState } from "react";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import type { ShopItemType } from "@components/Keyboard/cosmetics";
import { SHOP_ITEMS, type ShopItem } from "./shopData";
import CategoryTabs from "./components/CategoryTabs";
import ItemGrid from "./components/ItemGrid";

const ShopPage = () => {
  const { pressedCodes, shiftActive } = useKeyboardInput();
  const [activeTab, setActiveTab] = useState<ShopItemType>("BACKGROUND");
  const [previewByType, setPreviewByType] = useState<
    Partial<Record<ShopItemType, number>>
  >({});

  const pick = (type: ShopItemType): ShopItem | undefined =>
    SHOP_ITEMS.find((i) => i.type === type && i.id === previewByType[type]);

  const bg = pick("BACKGROUND");
  const keycap = pick("KEYCAP");
  const deco = pick("DECORATION");
  const sound = pick("SOUND");

  const background = bg?.skin.kind === "BACKGROUND" ? bg.skin.background : undefined;
  const keycapSkin = keycap?.skin.kind === "KEYCAP" ? keycap.skin.keycap : undefined;
  const decorations =
    deco?.skin.kind === "DECORATION" ? deco.skin.decorations : undefined;
  const soundLabel = sound?.skin.kind === "SOUND" ? sound.skin.label : undefined;

  const itemsForTab = SHOP_ITEMS.filter((i) => i.type === activeTab);

  const handleSelect = (item: ShopItem) =>
    setPreviewByType((prev) => ({ ...prev, [item.type]: item.id }));

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">상점</h1>
      </div>

      {/* 상단: 키보드 미리보기 */}
      <div className="mb-8 rounded-2xl bg-white p-4 shadow-md">
        <KeyboardStage
          layout={qwertyLayout}
          pressedCodes={pressedCodes}
          shiftActive={shiftActive}
          background={background}
          decorations={decorations}
          soundLabel={soundLabel}
          keycapSkin={keycapSkin}
        />
      </div>

      {/* 하단: 탭 + 아이템 그리드 */}
      <div className="mb-4">
        <CategoryTabs active={activeTab} onChange={setActiveTab} />
      </div>
      <ItemGrid
        items={itemsForTab}
        selectedId={previewByType[activeTab]}
        onSelect={handleSelect}
      />
    </main>
  );
};

export default ShopPage;
