import { apiClient } from "@apis/client";
import type {
  EquippedItems,
  ShopItem,
  ShopSummary,
} from "@pages/Shop/shopData";

// POST /api/shop/items/{id}/buy 응답
export type BuyItemResponse = {
  message: string;
  point: number;
  item: ShopItem;
};

// POST /api/shop/items/{id}/equip 응답
export type EquipItemResponse = {
  message: string;
  equipped_items: EquippedItems;
};

// 상점 요약(포인트 · 착용 아이템 · 전체 아이템) 조회.
export const getShopSummary = () =>
  apiClient.get<ShopSummary, ShopSummary>("/shop/summary");

// 아이템 구매. 요청 바디 없음.
export const buyItem = (itemId: number) =>
  apiClient.post<BuyItemResponse, BuyItemResponse>(
    `/shop/items/${itemId}/buy`,
  );

// 아이템 착용. 요청 바디 없음.
export const equipItem = (itemId: number) =>
  apiClient.post<EquipItemResponse, EquipItemResponse>(
    `/shop/items/${itemId}/equip`,
  );
