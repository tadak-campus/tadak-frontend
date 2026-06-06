import icSelectTyping from "@assets/play/select-typing.png";

const SECONDS_PER_SENTENCE = 15;

interface PracticeStartModalProps {
  open: boolean;
  title: string;
  sentenceCount: number;
  onStart: () => void;
  onCancel: () => void;
}

const PracticeStartModal = ({
  open,
  title,
  sentenceCount,
  onStart,
  onCancel,
}: PracticeStartModalProps) => {
  if (!open) {
    return null;
  }

  const estimatedMinutes = Math.max(
    1,
    Math.ceil((sentenceCount * SECONDS_PER_SENTENCE) / 60),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <img src={icSelectTyping} alt="" aria-hidden className="relative" />
        <h2 className="text-2xl font-black text-slate-950">
          연습을 시작할까요?
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          선택하신 세트로 타자 실력을 키워보세요!
        </p>

        <div className="mt-6 flex w-full flex-col gap-1 rounded-3xl border border-sky-100 bg-sky-50 p-5 text-left">
          <p className="text-base font-bold text-slate-800">
            {title} · {sentenceCount.toLocaleString()}문장
          </p>
          <p className="text-sm font-semibold text-slate-500">
            약 {estimatedMinutes}분 소요
          </p>
        </div>

        <div className="mt-7 flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onStart}
            className="flex-1 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeStartModal;
