import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithKakaoAccessToken } from "@apis/auth";
import {
  consumeKakaoOAuthState,
  createKakaoAuthorizationUrl,
  requestKakaoAccessToken,
} from "@apis/kakao";
import { authTokenStorage } from "@utils/authTokenStorage";

interface ApiValidationErrorDetail {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

interface ApiErrorResponse {
  detail?: string | ApiValidationErrorDetail[];
}

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return detail
        .map((item) => {
          const path = item.loc?.join(".") || "request";
          return `${path}: ${item.msg || "요청 값이 올바르지 않습니다."}`;
        })
        .join("\n");
    }
  }

  if (error instanceof Error) return error.message;
  return "카카오 로그인 처리 중 오류가 발생했습니다.";
};

export const useKakaoLogin = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const handledCallbackRef = useRef<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startKakaoLogin = useCallback(() => {
    try {
      window.location.assign(createKakaoAuthorizationUrl());
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    const kakaoError = params.get("error_description") || params.get("error");

    if (kakaoError) {
      alert(kakaoError);
      navigate("/login", { replace: true });
      return;
    }

    if (!code) return;
    if (handledCallbackRef.current === search) return;

    handledCallbackRef.current = search;

    const state = params.get("state");

    const completeKakaoLogin = async () => {
      setIsLoggingIn(true);
      setErrorMessage(null);

      try {
        if (!consumeKakaoOAuthState(state)) {
          throw new Error("카카오 로그인 상태값이 올바르지 않습니다.");
        }

        const kakaoToken = await requestKakaoAccessToken({ code });
        const authToken = await loginWithKakaoAccessToken(
          kakaoToken.access_token,
        );

        authTokenStorage.save(authToken);
        navigate("/", { replace: true });
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        alert(message);
        navigate("/login", { replace: true });
      } finally {
        setIsLoggingIn(false);
      }
    };

    void completeKakaoLogin();
  }, [navigate, search]);

  return {
    errorMessage,
    isLoggingIn,
    startKakaoLogin,
  };
};
