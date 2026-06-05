// TODO: EquippedItems 등 공유 도메인 타입은 추후 src/types/shop.ts로 이전해
//       타입 레이어가 페이지 모듈(@pages/Shop)에 의존하지 않도록 정리한다.
import type { EquippedItems } from "@pages/Shop/shopData";

// GET /api/users/me 응답. equipped_items의 각 슬롯은 ShopItem | null.
export interface UserMe {
  id: number;
  kakao_id: string;
  profile_nickname: string;
  point: number;
  equipped_items: EquippedItems;
}
