import { apiClient } from "@apis/client";
import type { AuthLoginRequest, AuthLoginResponse } from "@app-types/auth";

export const loginWithKakaoAccessToken = (kakaoAccessToken: string) => {
  const body: AuthLoginRequest = {
    kakao_access_token: kakaoAccessToken,
  };

  return apiClient.post<AuthLoginResponse, AuthLoginResponse, AuthLoginRequest>(
    "/auth/login",
    body,
  );
};
