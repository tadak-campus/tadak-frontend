import type { EquippedItems } from "@pages/Shop/shopData";

export interface UserMeResponse {
  id: number;
  kakao_id: string;
  profile_nickname: string;
  point: number;
  equipped_items: EquippedItems;
}
