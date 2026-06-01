import type { KakaoTokenResponse } from "@app-types/auth";

const KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_OAUTH_STATE_KEY = "tadakcampus.kakaoOAuthState";

interface RequestKakaoAccessTokenParams {
  code: string;
}

const createRandomState = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getKakaoRestApiKey = () => {
  const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY?.trim();
  if (!restApiKey) {
    throw new Error("VITE_KAKAO_REST_API_KEY가 설정되어 있지 않습니다.");
  }

  return restApiKey;
};

export const getKakaoRedirectUri = () => {
  return (
    import.meta.env.VITE_KAKAO_REDIRECT_URI?.trim() ||
    `${window.location.origin}/login`
  );
};

export const createKakaoAuthorizationUrl = () => {
  const state = createRandomState();
  window.sessionStorage.setItem(KAKAO_OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: getKakaoRestApiKey(),
    redirect_uri: getKakaoRedirectUri(),
    response_type: "code",
    state,
  });

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

export const consumeKakaoOAuthState = (state: string | null) => {
  const storedState = window.sessionStorage.getItem(KAKAO_OAUTH_STATE_KEY);
  window.sessionStorage.removeItem(KAKAO_OAUTH_STATE_KEY);

  return Boolean(state && storedState && state === storedState);
};

export const requestKakaoAccessToken = async ({
  code,
}: RequestKakaoAccessTokenParams): Promise<KakaoTokenResponse> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getKakaoRestApiKey(),
    redirect_uri: getKakaoRedirectUri(),
    code,
  });

  const clientSecret = import.meta.env.VITE_KAKAO_CLIENT_SECRET?.trim();
  if (clientSecret) {
    body.set("client_secret", clientSecret);
  }

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
  });

  const responseBody = (await response.json()) as KakaoTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    throw new Error(
      responseBody.error_description ||
        responseBody.error ||
        "카카오 토큰 요청에 실패했습니다.",
    );
  }

  return responseBody;
};
