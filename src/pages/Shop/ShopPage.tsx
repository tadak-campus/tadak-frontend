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
  shopItemDisplayName,
  soundPackForItem,
  type EquippedItems,
  type EquippedSlot,
  type ShopItem,
} from "@pages/Shop/shopData";
import { usePlayTypingSound } from "@hooks/useTypingSound";
import { useShop } from "@pages/Shop/useShop";
import CategoryTabs from "@pages/Shop/components/CategoryTabs";
import ItemGrid from "@pages/Shop/components/ItemGrid";
import { panel } from "@design-system";

const DEFAULT_KEYBOARD_ITEM_ID = 1;

// equipped_items(착용중)로 카테고리별 미리보기 초기값을 구성한다.
// KEYBOARD 미착용(null)은 기본 스킨인 Cloud Blue를 장착 상태처럼 보여준다.
const buildInitialPreview = (equipped: EquippedItems) => {
  const preview = (Object.keys(equipped) as EquippedSlot[]).reduce<
    Partial<Record<ShopItemType, number>>
  >((acc, slot) => {
    const item = equipped[slot];
    if (item) {
      acc[SLOT_TO_TYPE[slot]] = item.id;
    }
    return acc;
  }, {});

  if (!preview.KEYBOARD) {
    preview.KEYBOARD = DEFAULT_KEYBOARD_ITEM_ID;
  }

  return preview;
};

const slotForType = (type: ShopItemType): EquippedSlot => {
  if (type === "KEYBOARD") return "keyboard";
  if (type === "BACKGROUND") return "background";
  if (type === "SOUND") return "sound";
  return "decoration";
};

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

  // 미리보기로 고른 SOUND 아이템의 사운드를 타이핑 시 재생한다(보유/착용 여부와 무관한 미리듣기).
  const previewSoundItem =
    summary?.items.find(
      (item) => item.type === "SOUND" && item.id === previewByType.SOUND,
    ) ?? null;
  usePlayTypingSound(soundPackForItem(previewSoundItem));

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div
          className={`${panel} px-6 py-5 text-sm font-semibold text-slate-500`}
        >
          상점 정보를 불러오는 중…
        </div>
      </main>
    );
  }

  if (error || !summary) {
    return (
      <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div
          className={`${panel} flex flex-col items-center gap-4 px-6 py-7 text-center`}
        >
          <p className="text-sm font-semibold text-slate-600">
            {error ?? "상점 정보를 불러오지 못했습니다."}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-2xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(131,182,252,0.26)] transition hover:bg-sky-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-300"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  const items = summary.items.map((item) => {
    const equippedItem = summary.equipped_items[slotForType(item.type)];
    const isDefaultKeyboard =
      item.type === "KEYBOARD" &&
      !summary.equipped_items.keyboard &&
      item.id === DEFAULT_KEYBOARD_ITEM_ID;
    const isEquipped = equippedItem?.id === item.id || isDefaultKeyboard;
    return isEquipped
      ? { ...item, is_equipped: true, is_owned: true }
      : item;
  });

  const pick = (type: ShopItemType): ShopItem | undefined =>
    items.find((i) => i.type === type && i.id === previewByType[type]);

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

  const itemsForTab = items.filter((i) => i.type === activeTab);
  const isSoundTab = activeTab === "SOUND";

  const handleSelect = (item: ShopItem) =>
    setPreviewByType((prev) => ({ ...prev, [item.type]: item.id }));

  // 미리보기로 고른 아이템(타입별)의 실제 객체 목록.
  const previewedItems = (Object.keys(previewByType) as ShopItemType[])
    .map((type) =>
      items.find(
        (i) => i.type === type && i.id === previewByType[type],
      ),
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
          .map((item) => shopItemDisplayName(item))
          .join(", ")}`,
      );
      return;
    }

    void save(changes.map((item) => item.id));
  };

  return (
    <main className="flex h-[calc(100vh-7rem)] min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:gap-5 xl:flex-row xl:items-stretch">
        {/* 좌측: 상점 아이템 목록 카드 */}
        <section
          className={`${panel} flex min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5 xl:basis-[27rem] xl:shrink-0`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                키보드 테마
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">상점</h2>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 shadow-[0_8px_18px_rgba(251,191,36,0.16)] ring-1 ring-amber-100">
              <img src={icPoint} alt="" aria-hidden className="h-5 w-5" />
              {summary.point.toLocaleString()}
            </span>
          </div>
          <div className="mb-4">
            <CategoryTabs active={activeTab} onChange={setActiveTab} />
          </div>
          <div
            className={`min-h-0 flex-1 overscroll-contain rounded-[24px] bg-indigo-50/50 p-2 pr-1 [scrollbar-gutter:stable] ${
              isSoundTab ? "overflow-y-scroll" : "overflow-y-auto"
            }`}
          >
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
        <section
          className={`${panel} flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-5`}
        >
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                미리 입혀보기
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                키보드 꾸미기
              </h2>
            </div>
            <p className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-violet-100">
              {previewedItems.length}개 선택됨
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center rounded-[24px] bg-indigo-50/60 p-2 sm:p-3">
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
              disabled={saving || !hasChanges}
              className={`rounded-2xl px-5 py-3 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60 ${
                hasChanges
                  ? "bg-sky-400 text-white shadow-[0_12px_24px_rgba(131,182,252,0.28)] hover:bg-sky-300 focus-visible:outline-sky-300"
                  : "border border-slate-200 bg-white text-slate-400 focus-visible:outline-slate-200"
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
