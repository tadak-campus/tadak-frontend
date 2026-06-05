import type { EquippedItems } from "@pages/Shop/shopData";

// GET /api/users/me 응답. equipped_items의 각 슬롯은 ShopItem | null.
export interface UserMe {
  id: number;
  kakao_id: string;
  profile_nickname: string;
  point: number;
  equipped_items: EquippedItems;
}
