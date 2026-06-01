import { useState } from "react";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import type { ShopItemType } from "@components/Keyboard/cosmetics";
import { SHOP_ITEMS, type ShopItem } from "@pages/Shop/shopData";
import CategoryTabs from "@pages/Shop/components/CategoryTabs";
import ItemGrid from "@pages/Shop/components/ItemGrid";

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
    <main className="flex min-h-[calc(100vh-6rem)] flex-col p-8">
      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* 좌측: 상점 아이템 목록 카드 */}
        <section className="flex flex-col rounded-2xl bg-white p-5 shadow-md lg:w-110 lg:shrink-0">
          <h2 className="mb-4 text-2xl font-bold">상점</h2>
          <div className="mb-4">
            <CategoryTabs active={activeTab} onChange={setActiveTab} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ItemGrid
              items={itemsForTab}
              selectedId={previewByType[activeTab]}
              onSelect={handleSelect}
            />
          </div>
        </section>

        {/* 우측: 키보드 꾸미기 카드 (미리보기 + 저장 버튼 위아래 배치) */}
        <section className="flex flex-1 flex-col rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">키보드 꾸미기</h2>
          <div className="flex flex-1 flex-col justify-center">
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
          <div className="mt-4 flex justify-end">
            {/* TODO: 아이템 착용 상태 저장 (백엔드 연동) */}
            <button
              type="button"
              className="rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-300"
            >
              내 키보드 저장하기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
