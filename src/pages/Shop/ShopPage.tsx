import { useEffect, useRef, useState } from "react";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import type { ShopItemType } from "@components/Keyboard/cosmetics";
import icPoint from "@assets/ic_point.png";
import { resolveAssetUrl } from "@apis/assetUrl";
import {
  KEYCAP_SKINS,
  SLOT_TO_TYPE,
  type EquippedItems,
  type EquippedSlot,
  type ShopItem,
} from "@pages/Shop/shopData";
import { useShop } from "@pages/Shop/useShop";
import CategoryTabs from "@pages/Shop/components/CategoryTabs";
import ItemGrid from "@pages/Shop/components/ItemGrid";

// equipped_items(착용중)로 카테고리별 미리보기 초기값을 구성한다. 미착용 슬롯(null)은 건너뛴다.
const buildInitialPreview = (equipped: EquippedItems) =>
  (Object.keys(equipped) as EquippedSlot[]).reduce<
    Partial<Record<ShopItemType, number>>
  >((acc, slot) => {
    const item = equipped[slot];
    if (item) {
      acc[SLOT_TO_TYPE[slot]] = item.id;
    }
    return acc;
  }, {});

const ShopPage = () => {
  const { pressedCodes, shiftActive } = useKeyboardInput();
  const { summary, loading, error, saving, refetch, buy, save } = useShop();

  const [activeTab, setActiveTab] = useState<ShopItemType>("BACKGROUND");
  const [previewByType, setPreviewByType] = useState<
    Partial<Record<ShopItemType, number>>
  >({});

  // 요약을 처음 받아온 시점에만 착용 상태로 미리보기를 초기화한다(이후 사용자의 선택을 보존).
  const initializedRef = useRef(false);
  useEffect(() => {
    if (summary && !initializedRef.current) {
      initializedRef.current = true;
      setPreviewByType(buildInitialPreview(summary.equipped_items));
    }
  }, [summary]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center text-slate-500">
        상점 정보를 불러오는 중…
      </main>
    );
  }

  if (error || !summary) {
    return (
      <main className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center gap-4">
        <p className="text-slate-600">
          {error ?? "상점 정보를 불러오지 못했습니다."}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-300"
        >
          다시 시도
        </button>
      </main>
    );
  }

  const pick = (type: ShopItemType): ShopItem | undefined =>
    summary.items.find((i) => i.type === type && i.id === previewByType[type]);

  const bg = pick("BACKGROUND");
  const keyboard = pick("KEYBOARD");
  const deco = pick("DECORATION");
  const sound = pick("SOUND");

  // 배경·장식은 이미지 에셋(asset_url), 키캡은 목업 색 스킨, 효과음은 라벨로 미리보기에 반영.
  const backgroundImageUrl =
    resolveAssetUrl(bg?.asset_url ?? null) ?? undefined;
  const decorationImageUrl =
    resolveAssetUrl(deco?.asset_url ?? null) ?? undefined;
  const keycapSkin = keyboard ? KEYCAP_SKINS[keyboard.id] : undefined;
  const soundLabel = sound?.name;

  const itemsForTab = summary.items.filter((i) => i.type === activeTab);

  const handleSelect = (item: ShopItem) =>
    setPreviewByType((prev) => ({ ...prev, [item.type]: item.id }));

  // 미리보기로 고른 아이템(타입별)의 실제 객체 목록.
  const previewedItems = (Object.keys(previewByType) as ShopItemType[])
    .map((type) =>
      summary.items.find((i) => i.type === type && i.id === previewByType[type]),
    )
    .filter((item): item is ShopItem => Boolean(item));

  // 현재 착용중이 아닌 아이템이 선택되어 저장할 변경이 있는 상태.
  const hasChanges = previewedItems.some((item) => !item.is_equipped);

  // 저장: 미착용으로 바뀐 항목을 착용한다. 단, 그중 미보유가 하나라도 있으면
  // 아무것도 장착하지 않고 먼저 구매하도록 안내한다.
  const handleSave = () => {
    const changes = previewedItems.filter((item) => !item.is_equipped);

    if (changes.length === 0) {
      alert("저장할 변경 사항이 없어요.");
      return;
    }

    const unowned = changes.filter((item) => !item.is_owned);
    if (unowned.length > 0) {
      alert(
        `미보유 아이템을 먼저 구매해 주세요: ${unowned
          .map((item) => item.name)
          .join(", ")}`,
      );
      return;
    }

    void save(changes.map((item) => item.id));
  };

  return (
    <main className="flex min-h-[calc(100vh-7rem)] flex-col">
      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-stretch">
        {/* 좌측: 상점 아이템 목록 카드 */}
        <section className="flex min-w-0 flex-col rounded-2xl bg-white p-4 shadow-md sm:p-5 xl:basis-[27rem] xl:shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">상점</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              <img src={icPoint} alt="" aria-hidden className="h-5 w-5" />
              {summary.point.toLocaleString()}
            </span>
          </div>
          <div className="mb-4">
            <CategoryTabs active={activeTab} onChange={setActiveTab} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ItemGrid
              items={itemsForTab}
              selectedId={previewByType[activeTab]}
              onSelect={handleSelect}
              onBuy={(item) => void buy(item.id)}
              busy={saving}
            />
          </div>
        </section>

        {/* 우측: 키보드 꾸미기 카드 (미리보기 + 저장 버튼 위아래 배치) */}
        <section className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-4 shadow-md sm:p-5">
          <h2 className="mb-4 text-2xl font-bold">키보드 꾸미기</h2>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
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
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                hasChanges
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "bg-sky-400 hover:bg-sky-300"
              }`}
            >
              {saving ? "저장 중…" : "내 키보드 저장하기"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
