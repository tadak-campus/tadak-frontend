import type { AuthLoginResponse, StoredAuthToken } from "@app-types/auth";

const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const TOKEN_TYPE_STORAGE_KEY = "token_type";

export const authTokenStorage = {
  get(): StoredAuthToken | null {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!accessToken) {
      return null;
    }

    return {
      accessToken,
      tokenType: window.localStorage.getItem(TOKEN_TYPE_STORAGE_KEY) || "Bearer",
    };
  },

  save(response: AuthLoginResponse) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.access_token);
    window.localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, response.token_type);
  },

  clear() {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
  },
};
