import { useEffect, useState } from "react";
import { getCurrentUser } from "@apis/user";
import { resolveAssetUrl } from "@apis/assetUrl";
import { keycapSkinForItem } from "@pages/Shop/shopData";
import {
  defaultKeycapSkin,
  type KeycapSkin,
} from "@components/Keyboard/cosmetics";

// 착용 중인 키보드 스타일(키캡 스킨 + 배경 + 장식). KeyboardStage props와 호환된다.
export type EquippedKeyboardStyle = {
  keycapSkin: KeycapSkin;
  backgroundImageUrl?: string;
  decorationImageUrl?: string;
};

// 마운트 시 GET /api/users/me로 착용 아이템을 1회 조회해 스타일로 변환한다.
// 초기값은 기본 스킨(배경·장식 없음)이며 조회 성공 시 교체한다.
// 비로그인·네트워크 오류 등 실패는 조용히 무시해 기본 스킨을 유지한다(타자연습을 막지 않음).
export const useEquippedKeyboardStyle = (): EquippedKeyboardStyle => {
  const [style, setStyle] = useState<EquippedKeyboardStyle>({
    keycapSkin: defaultKeycapSkin,
  });

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (!active) return;
        const { keyboard, background, decoration } = user.equipped_items;
        setStyle({
          keycapSkin: keycapSkinForItem(keyboard),
          backgroundImageUrl:
            resolveAssetUrl(background?.asset_url ?? null) ?? undefined,
          decorationImageUrl:
            resolveAssetUrl(decoration?.asset_url ?? null) ?? undefined,
        });
      })
      .catch(() => {
        // 착용 정보 조회 실패 시 기본 스킨 유지.
      });

    return () => {
      active = false;
    };
  }, []);

  return style;
};
