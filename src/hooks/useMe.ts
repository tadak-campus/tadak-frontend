import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getMe } from "@apis/users";
import type { UserMeResponse } from "@app-types/user";
import { authTokenStorage } from "@utils/authTokenStorage";

interface ApiValidationErrorDetail {
  loc?: Array<string | number>;
  msg?: string;
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
        .map((item) => item.msg || "요청 값이 올바르지 않습니다.")
        .join("\n");
    }
  }

  if (error instanceof Error) return error.message;
  return "사용자 정보를 불러오지 못했습니다.";
};

export const useMe = () => {
  const [me, setMe] = useState<UserMeResponse | null>(null);
  const [loading, setLoading] = useState(() => Boolean(authTokenStorage.get()));
  const [error, setError] = useState<string | null>(null);

  const loadMe = useCallback(async () => {
    if (!authTokenStorage.get()) {
      return;
    }

    try {
      const data = await getMe();
      setMe(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadMe();
    };
    void load();
  }, [loadMe]);

  const refetch = useCallback(async () => {
    if (!authTokenStorage.get()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    await loadMe();
  }, [loadMe]);

  return { me, loading, error, refetch };
};
