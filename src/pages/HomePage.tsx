import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ControlPointDuplicateOutlinedIcon from "@mui/icons-material/ControlPointDuplicateOutlined";
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import loadingFrame1 from "@assets/home/bg_loading-1.png";
import loadingFrame2 from "@assets/home/bg_loading-2.png";
import loadingFrame3 from "@assets/home/bg_loading-3.png";
import loadingFrame4 from "@assets/home/bg_loading-4.png";
import uploadHeroImage from "@assets/bg_upload_hero.png";
import { generatePracticeSentences } from "@apis/practice";
import { getShopSummary } from "@apis/shop";
import { usePracticeSentences } from "@contexts/PracticeSentencesContext";
import { panel, panelPadding } from "@design-system";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import { defaultKeycapSkin } from "@components/Keyboard/cosmetics";
import { useMe } from "@hooks/useMe";
import {
  KEYCAP_SKINS,
  SLOT_TO_TYPE,
  type ShopSummary,
} from "@pages/Shop/shopData";

type RecentFile = {
  name: string;
  type: "pdf" | "ppt";
  status: "생성 완료" | "생성 중";
  statusTone: "green" | "purple";
  date: string;
};

const loadingFrames = [
  loadingFrame1,
  loadingFrame2,
  loadingFrame3,
  loadingFrame4,
] as const;

type PracticeSet = {
  title: string;
  detail: string;
  level: "Hard" | "Normal" | "Easy";
  minutes: number;
};

interface ApiValidationErrorDetail {
  msg?: string;
}

interface ApiErrorResponse {
  detail?: string | ApiValidationErrorDetail[];
}

const mockHomeStats = {
  earnedPointToday: 320,
  streakDays: 12,
  bestStreakDays: 15,
  todayTyped: 2840,
  todayTarget: 3000,
};

const mockRecentFiles: RecentFile[] = [
  {
    name: "컴퓨터구조_중간고사_정리.pptx",
    type: "ppt",
    status: "생성 완료",
    statusTone: "green",
    date: "오늘 14:32",
  },
  {
    name: "마케팅원론_1주차_강의자료.pptx",
    type: "ppt",
    status: "생성 중",
    statusTone: "purple",
    date: "어제 11:07",
  },
  {
    name: "서양미술사_요약본.pdf",
    type: "pdf",
    status: "생성 완료",
    statusTone: "green",
    date: "10. 12",
  },
  {
    name: "데이터베이스_개론_정리.pptx",
    type: "ppt",
    status: "생성 완료",
    statusTone: "green",
    date: "10. 10",
  },
  {
    name: "운영체제_핵심정리.pdf",
    type: "pdf",
    status: "생성 완료",
    statusTone: "green",
    date: "10. 08",
  },
];

const mockPracticeSets: PracticeSet[] = [
  {
    title: "컴퓨터구조 핵심 키워드 50",
    detail: "단문 연습 · 50문장",
    level: "Hard",
    minutes: 15,
  },
  {
    title: "마케팅원론 주요 개념",
    detail: "장문 연습 · 20문단",
    level: "Normal",
    minutes: 12,
  },
  {
    title: "서양미술사 시대별 요약",
    detail: "혼합 연습 · 35문장",
    level: "Normal",
    minutes: 18,
  },
  {
    title: "컴퓨터구조 도식화 설명 연습",
    detail: "혼합 연습 · 30문장",
    level: "Easy",
    minutes: 10,
  },
];

const keyboardThemes = [
  "파스텔 스카이",
  "민트 소다",
  "라벤더 드림",
  "피치 펀더",
];
const keyboardColors = ["#c7ddff", "#ffd2e3", "#c8f7df", "#ddd6fe", "#fef3c7"];
const supportedExtensions = [".pdf", ".ppt", ".pptx"];

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail
        .map((item) => item.msg ?? "요청 값이 올바르지 않습니다.")
        .join("\n");
    }
  }

  if (error instanceof Error) return error.message;
  return "연습 세트를 생성하지 못했습니다.";
};

const getFileType = (name: string): RecentFile["type"] =>
  name.toLowerCase().endsWith(".pdf") ? "pdf" : "ppt";

const isSupportedFile = (file: File) => {
  const lowerName = file.name.toLowerCase();
  return supportedExtensions.some((extension) => lowerName.endsWith(extension));
};

const getLevelClass = (level: PracticeSet["level"]) => {
  if (level === "Hard") return "bg-rose-50 text-rose-500";
  if (level === "Easy") return "bg-sky-50 text-sky-500";
  return "bg-violet-50 text-violet-500";
};

const HomePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { me, loading: meLoading } = useMe();
  const [shopSummary, setShopSummary] = useState<ShopSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatingFileName, setGeneratingFileName] = useState<string | null>(
    null,
  );
  const { sentences: generatedSentences, setSentences: setGeneratedSentences } =
    usePracticeSentences();
  const [recentFiles, setRecentFiles] = useState(mockRecentFiles);

  useEffect(() => {
    let active = true;

    const loadShopSummary = async () => {
      try {
        const data = await getShopSummary();
        if (active) {
          setShopSummary(data);
        }
      } catch {
        if (active) {
          setShopSummary(null);
        }
      }
    };

    void loadShopSummary();

    return () => {
      active = false;
    };
  }, []);

  const point = me?.point ?? shopSummary?.point ?? 0;
  const nickname = me?.profile_nickname ?? "민수";

  const equippedKeyboard = useMemo(() => {
    const equippedItems = me?.equipped_items ?? shopSummary?.equipped_items;
    return equippedItems?.keyboard ?? null;
  }, [me?.equipped_items, shopSummary?.equipped_items]);

  const keycapSkin = equippedKeyboard
    ? (KEYCAP_SKINS[equippedKeyboard.id] ?? defaultKeycapSkin)
    : defaultKeycapSkin;

  const equippedLabel = equippedKeyboard
    ? `${SLOT_TO_TYPE.keyboard} · ${equippedKeyboard.name}`
    : "기본 키보드";

  const generatedSet: PracticeSet | null = generatedSentences.length
    ? {
        title: "방금 생성한 맞춤 연습",
        detail: `AI 생성 · ${generatedSentences.length}문장`,
        level: "Normal",
        minutes: Math.max(5, Math.ceil(generatedSentences.length / 4)),
      }
    : null;

  const practiceSets = generatedSet
    ? [generatedSet, ...mockPracticeSets.slice(0, 3)]
    : mockPracticeSets;

  const handleFile = useCallback(
    async (file: File) => {
      if (!isSupportedFile(file)) {
        setUploadError("PDF, PPT, PPTX 파일만 업로드할 수 있습니다.");
        setUploadMessage(null);
        return;
      }

      setIsGenerating(true);
      setUploadError(null);
      setGeneratingFileName(file.name);
      setUploadMessage(`${file.name} 연습 세트를 생성하고 있어요.`);

      try {
        const data = await generatePracticeSentences(file);
        setGeneratedSentences(data.sentences);
        setRecentFiles((prev) => [
          {
            name: file.name,
            type: getFileType(file.name),
            status: "생성 완료",
            statusTone: "green",
            date: "방금 전",
          },
          ...prev.slice(0, 4),
        ]);
        setUploadMessage(
          `${data.sentences.length}개의 맞춤 문장을 생성했어요.`,
        );
      } catch (error) {
        setUploadError(getErrorMessage(error));
        setUploadMessage(null);
      } finally {
        setIsGenerating(false);
        setGeneratingFileName(null);
      }
    },
    [setGeneratedSentences],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      void handleFile(file);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 xl:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-lg font-bold text-slate-950 sm:text-xl">
          안녕하세요, {nickname}님!
        </h1>
        <p className="text-sm font-medium text-slate-500 sm:text-base">
          오늘도 타닥캠퍼스와 함께 즐거운 학습을 시작해볼까요?
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.95fr)]">
        <article className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-sky-100/80 bg-[#f3fbff] p-5 shadow-[0_18px_42px_rgba(125,173,220,0.12)] sm:p-7 lg:min-h-[460px]">
          <img
            src={uploadHeroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/25 to-transparent" />
          <div className="relative z-10 flex min-h-[472px] max-w-fit flex-col items-start justify-center lg:min-h-[404px]">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-sky-500 shadow-sm">
              <AutoAwesomeOutlinedIcon fontSize="small" />
              AI 맞춤 학습
            </p>
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
              학습 자료 업로드
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              PDF 또는 PPT 파일을 업로드하면 타닥 AI가 맞춤형 타자 연습 세트를
              자동으로 생성해드려요.
            </p>

            {isGenerating ? (
              <GenerationLoadingDropzone
                fileName={generatingFileName}
                message={uploadMessage}
              />
            ) : (
              <div
                role="button"
                tabIndex={0}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="relative mt-6 flex h-[214px] flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-sky-200/80 bg-white/75 px-4 py-6 text-center shadow-inner backdrop-blur-[1px] transition hover:border-sky-300 hover:bg-white/90 focus-visible:outline-3 w-90 lg:w-[460px] focus-visible:outline-offset-4 focus-visible:outline-sky-300"
              >
                <CloudUploadOutlinedIcon
                  className="text-sky-400"
                  sx={{ fontSize: 44 }}
                />
                <p className="mt-3 text-sm font-bold text-slate-800">
                  클릭하거나 파일을 여기로 드래그하세요
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  지원 형식: .pdf, .ppt, .pptx
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 rounded-full border border-sky-200 bg-white px-9 py-2 text-sm font-bold text-sky-500 shadow-sm transition hover:bg-sky-50 disabled:cursor-wait disabled:opacity-60"
                >
                  파일 선택
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {((!isGenerating && uploadMessage) || uploadError) && (
              <p
                className={`mt-3 rounded-full px-4 py-2 text-xs font-semibold ${
                  uploadError
                    ? "bg-rose-50 text-rose-500"
                    : "bg-white/75 text-slate-600"
                }`}
              >
                {uploadError ?? uploadMessage}
              </p>
            )}

            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2 text-xs font-medium text-slate-600">
              <InfoOutlinedIcon fontSize="small" className="text-sky-400" />
              표, 그래프, 주요 키워드를 포함하면 더 정확한 연습 세트를 만들 수
              있어요.
            </p>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <HomeStatCard
            title="보유 포인트"
            value={meLoading && !me ? "..." : point.toLocaleString()}
            suffix="P"
            helper={`+ ${mockHomeStats.earnedPointToday}P 오늘 획득`}
            info="상점에서 사용할 수 있는 현재 포인트예요."
            tone="mint"
            visual={<ControlPointDuplicateOutlinedIcon sx={{ fontSize: 58 }} />}
          />
          <HomeStatCard
            title="연속 학습"
            value={mockHomeStats.streakDays.toString()}
            suffix="일"
            helper={`최고 기록 ${mockHomeStats.bestStreakDays}일`}
            info="하루에 한 번 이상 연습하면 연속 학습 기록이 이어져요."
            tone="violet"
            visual={<CalendarMonthOutlinedIcon sx={{ fontSize: 58 }} />}
          />
          <HomeStatCard
            title="오늘의 타자 수"
            value={mockHomeStats.todayTyped.toLocaleString()}
            suffix="타"
            helper={`목표 ${mockHomeStats.todayTarget.toLocaleString()}타`}
            info="오늘 연습에서 입력한 글자 수를 기준으로 집계해요."
            tone="rose"
            visual={<KeyboardOutlinedIcon sx={{ fontSize: 58 }} />}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(320px,1.2fr)]">
        <article className={`${panel} ${panelPadding}`}>
          <CardHeader title="최근 업로드한 파일" action="전체보기" />
          <div className="mt-5 grid grid-cols-[minmax(0,1.4fr)_88px_70px] gap-3 px-1 text-xs font-bold text-slate-500">
            <span>파일명</span>
            <span>상태</span>
            <span className="text-right">날짜</span>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {recentFiles.map((file) => (
              <RecentFileRow key={`${file.name}-${file.date}`} file={file} />
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
            <CloudUploadOutlinedIcon fontSize="small" />
            파일은 최근 30일간 보관되며, 내 자료에서 관리할 수 있어요.
          </p>
        </article>

        <article
          className={`${panel} ${panelPadding} relative overflow-hidden`}
        >
          <CardHeader
            title="생성된 타자 연습 세트"
            badge="AI 생성"
            action="모든 세트 보기"
          />
          <div className="mt-4 space-y-3">
            {practiceSets.map((set, index) => (
              <PracticeSetRow key={set.title} index={index + 1} set={set} />
            ))}
          </div>
          <a
            href="/play"
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-200 px-5 py-3 text-sm font-bold text-violet-500 shadow-[0_12px_24px_rgba(196,181,253,0.24)] transition hover:bg-violet-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-200"
          >
            모든 연습 세트 보기
            <ChevronRightOutlinedIcon fontSize="small" />
          </a>
        </article>

        <article className={`${panel} ${panelPadding}`}>
          <CardHeader title="나만의 키보드 꾸미기" action="더 보기" />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {keyboardThemes.map((theme, index) => (
              <button
                key={theme}
                type="button"
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  index === 0
                    ? "bg-sky-200 text-sky-500 shadow-sm"
                    : "bg-violet-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-3xl bg-sky-50 p-3">
            <div className="min-w-[540px]">
              <KeyboardStage
                layout={qwertyLayout}
                pressedCodes={new Set()}
                shiftActive={false}
                backgroundImageUrl="/shop/bg-pastel.png"
                decorationImageUrl="/shop/deco-stars.png"
                soundLabel={equippedLabel}
                keycapSkin={keycapSkin}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 text-xs font-semibold text-slate-500 sm:grid-cols-3">
            <div>
              <p>키보드 색상</p>
              <div className="mt-2 flex gap-2">
                {keyboardColors.map((color, index) => (
                  <span
                    key={color}
                    className={`h-5 w-5 rounded-full border ${
                      index === 0
                        ? "border-sky-300 ring-2 ring-sky-100"
                        : "border-white"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p>키 모양</p>
              <div className="mt-2 flex gap-2">
                <span className="h-7 w-7 rounded-lg border-2 border-sky-200" />
                <span className="h-7 w-7 rounded-full border border-slate-200" />
                <span className="h-7 w-7 rounded-xl border border-slate-200" />
              </div>
            </div>
            <div>
              <p>효과</p>
              <div className="mt-2 flex h-7 w-13 items-center rounded-full bg-sky-200 p-1">
                <span className="ml-auto h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>

          <a
            href="/shop"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-500 transition hover:bg-sky-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-200"
          >
            <DownloadOutlinedIcon fontSize="small" />내 키보드 저장하기
          </a>
        </article>
      </section>
    </main>
  );
};

const GenerationLoadingDropzone = ({
  fileName,
  message,
}: {
  fileName: string | null;
  message: string | null;
}) => {
  const frameDurationSeconds = 4.8;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative mt-6 flex h-[214px] w-90 overflow-hidden rounded-[24px] border-2 border-dashed border-sky-200/80 bg-white/75 text-center shadow-inner backdrop-blur-[1px] lg:w-[460px]"
    >
      <style>
        {`
          @keyframes tadakLoadingFrame {
            0%, 100% {
              opacity: 0;
            }
            6%, 24% {
              opacity: 1;
            }
            32%, 100% {
              opacity: 0;
            }
          }
        `}
      </style>
      <span className="sr-only">{message ?? "자료를 읽고 있어요."}</span>
      {loadingFrames.map((frame, index) => (
        <img
          key={frame}
          src={frame}
          alt=""
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-[70%] w-full -translate-y-1/2 object-contain object-center opacity-0"
          style={
            {
              animation: `tadakLoadingFrame ${frameDurationSeconds}s ease-in-out infinite`,
              animationDelay: `${index * (frameDurationSeconds / loadingFrames.length)}s`,
            } satisfies CSSProperties
          }
        />
      ))}
      <p className="absolute inset-x-4 bottom-4 z-10 flex min-w-0 items-center justify-center gap-1 rounded-full bg-white/80 px-4 py-2 text-center text-xs font-bold text-sky-500 shadow-sm">
        {fileName ? (
          <>
            <span className="min-w-0 truncate">{fileName}</span>
            <span className="shrink-0">연습 세트를 생성하고 있어요.</span>
          </>
        ) : (
          "연습 세트를 생성하고 있어요."
        )}
      </p>
    </div>
  );
};

const CardHeader = ({
  title,
  action,
  badge,
}: {
  title: string;
  action?: string;
  badge?: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2">
      <h2 className="truncate text-lg font-bold text-slate-950">{title}</h2>
      {badge && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-violet-500">
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 14 }} />
          {badge}
        </span>
      )}
    </div>
    {action && (
      <button
        type="button"
        className="flex shrink-0 items-center text-xs font-semibold text-slate-500 transition hover:text-sky-500"
      >
        {action}
        <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
      </button>
    )}
  </div>
);

const HomeStatCard = ({
  title,
  value,
  suffix,
  helper,
  info,
  tone,
  visual,
}: {
  title: string;
  value: string;
  suffix: string;
  helper: string;
  info: string;
  tone: "mint" | "violet" | "rose";
  visual: ReactNode;
}) => {
  const toneClass = {
    mint: "border-emerald-100 bg-emerald-50 text-emerald-500",
    violet: "border-violet-100 bg-violet-50 text-violet-500",
    rose: "border-rose-100 bg-rose-50 text-rose-500",
  }[tone];

  return (
    <article
      className={`relative min-h-34 overflow-visible rounded-[28px] border p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] ${toneClass}`}
    >
      <div className="relative z-10">
        <p className="relative flex items-center gap-1 text-sm font-bold">
          {title}
          <span
            tabIndex={0}
            aria-label={info}
            className="group inline-flex cursor-help rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
          >
            <InfoOutlinedIcon sx={{ fontSize: 15 }} className="opacity-60" />
            <span className="pointer-events-none absolute left-0 top-6 z-30 w-52 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold leading-5 text-slate-500 opacity-0 shadow-[0_10px_24px_rgba(148,163,184,0.18)] ring-1 ring-slate-100 transition group-hover:opacity-100 group-focus:opacity-100 group-focus-visible:opacity-100">
              {info}
            </span>
          </span>
        </p>
        <p className="mt-3 flex items-end gap-1 text-3xl font-black leading-none">
          {value}
          <span className="text-base font-bold">{suffix}</span>
        </p>
        <p className="mt-3 text-sm font-semibold opacity-90">{helper}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute -right-3 bottom-1 opacity-30 sm:opacity-40">
          {visual}
        </div>
      </div>
    </article>
  );
};

const RecentFileRow = ({ file }: { file: RecentFile }) => {
  const fileColor =
    file.type === "pdf"
      ? "bg-rose-100 text-rose-500"
      : "bg-amber-100 text-amber-500";
  const statusColor =
    file.statusTone === "green"
      ? "bg-emerald-50 text-emerald-500"
      : "bg-violet-50 text-violet-500";

  return (
    <div className="grid grid-cols-[minmax(0,1.4fr)_88px_70px] items-center gap-3 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${fileColor}`}
        >
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 17 }} />
        </span>
        <span className="truncate text-sm font-semibold text-slate-700">
          {file.name}
        </span>
      </div>
      <span
        className={`rounded-full px-2 py-1 text-center text-xs font-bold ${statusColor}`}
      >
        {file.status}
      </span>
      <span className="text-right text-xs font-semibold text-slate-500">
        {file.date}
      </span>
    </div>
  );
};

const PracticeSetRow = ({
  set,
  index,
}: {
  set: PracticeSet;
  index: number;
}) => (
  <a
    href="/play"
    className="grid grid-cols-[34px_34px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-3 transition hover:border-violet-100 hover:bg-white hover:shadow-sm"
  >
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-200 text-sm font-black text-violet-500">
      {index}
    </span>
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
      <PlayArrowRoundedIcon fontSize="small" />
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-bold text-slate-800">
        {set.title}
      </span>
      <span className="block truncate text-xs font-medium text-slate-500">
        {set.detail}
      </span>
    </span>
    <span className="text-right">
      <span
        className={`block rounded-full px-2 py-0.5 text-xs font-bold ${getLevelClass(
          set.level,
        )}`}
      >
        {set.level}
      </span>
      <span className="mt-1 block text-xs font-semibold text-slate-500">
        {set.minutes}분
      </span>
    </span>
  </a>
);

export default HomePage;
