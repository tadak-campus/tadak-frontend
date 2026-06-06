import { apiClient } from "@apis/client";
import type { UserMeResponse } from "@app-types/user";

// 현재 로그인 사용자 정보(포인트 · 착용 아이템 포함) 조회.
export const getCurrentUser = () =>
  apiClient.get<UserMeResponse, UserMeResponse>("/users/me");
