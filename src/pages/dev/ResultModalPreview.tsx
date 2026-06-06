import { useState } from "react";
import ResultModal, {
  type ResultModalStatus,
} from "@pages/Play/components/ResultModal";

// 결과 모달을 상태별로 띄워 시각적으로 디자인하기 위한 dev 전용 프리뷰.
const ResultModalPreview = () => {
  const [status, setStatus] = useState<ResultModalStatus>("success");
  const [earnedPoint, setEarnedPoint] = useState(120);
  const [totalPoint, setTotalPoint] = useState(3420);

  const statuses: ResultModalStatus[] = ["loading", "success", "error"];

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      <h1 className="text-xl font-bold text-slate-950">ResultModal 프리뷰</h1>
      <p className="mt-1 text-sm text-slate-500">
        상태와 포인트 값을 바꿔가며 모달 디자인을 확인하세요.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">상태</span>
          <div className="flex gap-2">
            {statuses.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  status === value
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">
            earned_point
          </span>
          <input
            type="number"
            value={earnedPoint}
            onChange={(event) => setEarnedPoint(Number(event.target.value))}
            className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">
            total_point
          </span>
          <input
            type="number"
            value={totalPoint}
            onChange={(event) => setTotalPoint(Number(event.target.value))}
            className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <ResultModal
        open
        status={status}
        earnedPoint={earnedPoint}
        totalPoint={totalPoint}
        errorMessage={"네트워크 오류로 포인트를 적립하지 못했습니다.\n잠시 후 다시 시도해주세요."}
        onConfirm={() => setStatus("success")}
        onRetry={() => setStatus("loading")}
        onRetryApi={() => setStatus("loading")}
      />
    </div>
  );
};

export default ResultModalPreview;
