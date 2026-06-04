import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { buyItem, equipItem, getShopSummary } from "@apis/shop";
import type { ShopSummary } from "@pages/Shop/shopData";

interface ApiValidationErrorDetail {
  loc?: Array<string | number>;
  msg?: string;
}

interface ApiErrorResponse {
  detail?: string | ApiValidationErrorDetail[];
}

const getErrorMessage = (error: unknown, fallback: string) => {
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
  return fallback;
};

export const useShop = () => {
  const [summary, setSummary] = useState<ShopSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 요약을 불러와 상태에 반영한다. 마운트 시 setState를 동기로 호출하지 않도록
  // (loading 초기값이 이미 true) 첫 await 전에는 setState하지 않는다.
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getShopSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "상점 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchSummary();
    };
    void load();
  }, [fetchSummary]);

  // 재시도(이벤트 핸들러): 로딩 화면을 다시 띄우고 조회한다.
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchSummary();
  }, [fetchSummary]);

  // 아이템 구매 후 요약을 다시 불러와 포인트·보유 상태를 동기화한다.
  const buy = useCallback(
    async (itemId: number) => {
      setSaving(true);
      try {
        await buyItem(itemId);
        await fetchSummary();
      } catch (err) {
        alert(getErrorMessage(err, "구매에 실패했습니다."));
      } finally {
        setSaving(false);
      }
    },
    [fetchSummary],
  );

  // 미리보기로 고른 아이템들(itemIds)을 차례로 착용한 뒤 요약을 다시 불러온다.
  const save = useCallback(
    async (itemIds: number[]) => {
      if (itemIds.length === 0) return;
      setSaving(true);
      try {
        for (const id of itemIds) {
          await equipItem(id);
        }
        await fetchSummary();
      } catch (err) {
        alert(getErrorMessage(err, "착용 저장에 실패했습니다."));
      } finally {
        setSaving(false);
      }
    },
    [fetchSummary],
  );

  return { summary, loading, error, saving, refetch, buy, save };
};
