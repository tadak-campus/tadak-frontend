export interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  id_token?: string;
}

export interface AuthLoginRequest {
  kakao_access_token: string;
}

export interface AuthLoginResponse {
  access_token: string;
  token_type: string;
}

export interface StoredAuthToken {
  accessToken: string;
  tokenType: string;
}
