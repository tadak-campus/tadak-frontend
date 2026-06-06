import icBgModal from "@assets/play/bg_modal.png.png";
import icPoint from "@assets/ic_point.png";

export type ResultModalStatus = "loading" | "success" | "error";

interface ResultModalProps {
  open: boolean;
  status: ResultModalStatus;
  earnedPoint: number;
  totalPoint: number;
  errorMessage?: string | null;
  onConfirm: () => void;
  onRetry: () => void;
  onRetryApi: () => void;
}

const primaryButton =
  "flex-1 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-500";
const secondaryButton =
  "flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-slate-300";

const ResultModal = ({
  open,
  status,
  earnedPoint,
  totalPoint,
  errorMessage,
  onConfirm,
  onRetry,
  onRetryApi,
}: ResultModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />
            <p className="text-sm font-semibold text-slate-600">
              포인트 적립 중...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-center">
            <img src={icBgModal} alt="" aria-hidden className="relative" />
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              연습을 완료했어요!
            </h2>
            <div className="text-sm">
              <div>오늘도 한 걸음 더 성장했네요!</div>
              <div>획득한 포인트를 확인해 보세요.</div>
            </div>

            <div className="my-6 flex w-full justify-center items-center gap-4 rounded-3xl border border-sky-100 bg-sky-50 p-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-200">
                <img src={icPoint} alt="" aria-hidden className="h-10 w-10" />
              </span>
              <div className="flex flex-col text-left">
                <p className="text-2xl font-black text-sky-600">
                  +{earnedPoint.toLocaleString()}P 획득
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  총 {totalPoint.toLocaleString()}P 보유 중
                </p>
              </div>
            </div>

            <div className="mt-7 flex w-full gap-3">
              <button
                type="button"
                onClick={onRetry}
                className={secondaryButton}
              >
                다시하기
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={primaryButton}
              >
                확인
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-slate-950">
              포인트 적립에 실패했어요
            </h2>
            <p className="mt-4 w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold whitespace-pre-line text-red-600">
              {errorMessage ?? "잠시 후 다시 시도해주세요."}
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className={secondaryButton}
              >
                확인
              </button>
              <button
                type="button"
                onClick={onRetryApi}
                className={primaryButton}
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
