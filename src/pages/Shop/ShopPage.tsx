import { useState } from "react";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import type { ShopItemType } from "@components/Keyboard/cosmetics";
import {
  KEYCAP_SKINS,
  SHOP_SUMMARY,
  SLOT_TO_TYPE,
  type EquippedSlot,
  type ShopItem,
} from "@pages/Shop/shopData";
import CategoryTabs from "@pages/Shop/components/CategoryTabs";
import ItemGrid from "@pages/Shop/components/ItemGrid";

// TODO: GET /api/shop/summary 응답으로 교체 (현재는 목업 상수)
const summary = SHOP_SUMMARY;

// equipped_items(착용중)로 카테고리별 미리보기 초기값을 구성한다.
const initialPreview = (
  Object.keys(summary.equipped_items) as EquippedSlot[]
).reduce<Partial<Record<ShopItemType, number>>>((acc, slot) => {
  acc[SLOT_TO_TYPE[slot]] = summary.equipped_items[slot].id;
  return acc;
}, {});

const ShopPage = () => {
  const { pressedCodes, shiftActive } = useKeyboardInput();
  const [activeTab, setActiveTab] = useState<ShopItemType>("BACKGROUND");
  const [previewByType, setPreviewByType] =
    useState<Partial<Record<ShopItemType, number>>>(initialPreview);

  const pick = (type: ShopItemType): ShopItem | undefined =>
    summary.items.find((i) => i.type === type && i.id === previewByType[type]);

  const bg = pick("BACKGROUND");
  const keyboard = pick("KEYBOARD");
  const deco = pick("DECORATION");
  const sound = pick("SOUND");

  // 배경·장식은 이미지 에셋(asset_url), 키캡은 목업 색 스킨, 효과음은 라벨로 미리보기에 반영.
  const backgroundImageUrl = bg?.asset_url || undefined;
  const decorationImageUrl = deco?.asset_url || undefined;
  const keycapSkin = keyboard ? KEYCAP_SKINS[keyboard.id] : undefined;
  const soundLabel = sound?.name;

  const itemsForTab = summary.items.filter((i) => i.type === activeTab);

  const handleSelect = (item: ShopItem) =>
    setPreviewByType((prev) => ({ ...prev, [item.type]: item.id }));

  return (
    <main className="flex min-h-[calc(100vh-6rem)] flex-col p-8">
      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* 좌측: 상점 아이템 목록 카드 */}
        <section className="flex flex-col rounded-2xl bg-white p-5 shadow-md lg:w-110 lg:shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">상점</h2>
            {/* TODO: 포인트도 GET /api/shop/summary 의 point 값 (현재는 목업 상수) */}
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              💰 {summary.point.toLocaleString()}
            </span>
          </div>
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
              backgroundImageUrl={backgroundImageUrl}
              decorationImageUrl={decorationImageUrl}
              soundLabel={soundLabel}
              keycapSkin={keycapSkin}
            />
          </div>
          <div className="mt-4 flex justify-end">
            {/* TODO: 아이템 착용 상태 저장 (POST /api/shop/items/{id}/equip) */}
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
