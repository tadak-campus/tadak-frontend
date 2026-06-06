import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import uploadHeroImage from "@assets/bg_upload_hero.png";
import icPoint from "@assets/ic_point.png";
import { generatePracticeSentences } from "@apis/practice";
import { getShopSummary } from "@apis/shop";
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
const keyboardColors = ["#83b6fc", "#f7a8c8", "#a7f3d0", "#c4b5fd", "#fde68a"];
const supportedExtensions = [".pdf", ".ppt", ".pptx"];
const maxFileSize = 50 * 1024 * 1024;

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
  if (level === "Hard") return "bg-rose-100 text-rose-600";
  if (level === "Easy") return "bg-sky-100 text-sky-600";
  return "bg-violet-100 text-violet-600";
};

const HomePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { me, loading: meLoading } = useMe();
  const [shopSummary, setShopSummary] = useState<ShopSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatedSentences, setGeneratedSentences] = useState<string[]>([]);
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

  const handleFile = useCallback(async (file: File) => {
    if (!isSupportedFile(file)) {
      setUploadError("PDF, PPT, PPTX 파일만 업로드할 수 있습니다.");
      setUploadMessage(null);
      return;
    }

    if (file.size > maxFileSize) {
      setUploadError("최대 50MB 이하 파일만 업로드할 수 있습니다.");
      setUploadMessage(null);
      return;
    }

    setIsGenerating(true);
    setUploadError(null);
    setUploadMessage(`${file.name} 파일을 분석하고 있습니다.`);

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
      setUploadMessage(`${data.sentences.length}개의 맞춤 문장을 생성했어요.`);
    } catch (error) {
      setUploadError(getErrorMessage(error));
      setUploadMessage(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
        <article className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-sky-200/80 bg-[#eaf6ff] p-5 shadow-[0_18px_42px_rgba(59,91,196,0.12)] sm:p-7 lg:min-h-[460px]">
          <img
            src={uploadHeroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/25 to-transparent" />
          <div className="relative z-10 flex min-h-[472px] max-w-[620px] flex-col justify-center lg:min-h-[404px]">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
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
              className="mt-6 flex min-h-42 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-sky-300/80 bg-white/75 px-4 py-6 text-center shadow-inner backdrop-blur-[1px] transition hover:border-sky-400 hover:bg-white/90 focus-visible:outline-3 w-[70%] focus-visible:outline-offset-4 focus-visible:outline-sky-400"
            >
              <CloudUploadOutlinedIcon
                className="text-sky-500"
                sx={{ fontSize: 44 }}
              />
              <p className="mt-3 text-sm font-bold text-slate-800">
                클릭하거나 파일을 여기로 드래그하세요
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                지원 형식: .pdf, .ppt, .pptx (최대 50MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="mt-5 rounded-full border border-sky-400 bg-white px-9 py-2 text-sm font-bold text-sky-600 shadow-sm transition hover:bg-sky-50 disabled:cursor-wait disabled:opacity-60"
              >
                {isGenerating ? "생성 중" : "파일 선택"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {(uploadMessage || uploadError) && (
              <p
                className={`mt-3 rounded-full px-4 py-2 text-xs font-semibold ${
                  uploadError
                    ? "bg-red-50 text-red-600"
                    : "bg-white/75 text-slate-600"
                }`}
              >
                {uploadError ?? uploadMessage}
              </p>
            )}

            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2 text-xs font-medium text-slate-600">
              <InfoOutlinedIcon fontSize="small" className="text-sky-500" />
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
            tone="mint"
            visual={<PointCoin />}
          />
          <HomeStatCard
            title="연속 학습"
            value={mockHomeStats.streakDays.toString()}
            suffix="일"
            helper={`최고 기록 ${mockHomeStats.bestStreakDays}일`}
            tone="violet"
            visual={<CalendarMonthOutlinedIcon sx={{ fontSize: 58 }} />}
          />
          <HomeStatCard
            title="오늘의 타자 수"
            value={mockHomeStats.todayTyped.toLocaleString()}
            suffix="타"
            helper={`목표 ${mockHomeStats.todayTarget.toLocaleString()}타`}
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
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(124,58,237,0.24)] transition hover:bg-violet-500 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-400"
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
                    ? "bg-sky-400 text-white shadow-sm"
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
                        ? "border-sky-500 ring-2 ring-sky-200"
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
                <span className="h-7 w-7 rounded-lg border-2 border-sky-400" />
                <span className="h-7 w-7 rounded-full border border-slate-200" />
                <span className="h-7 w-7 rounded-xl border border-slate-200" />
              </div>
            </div>
            <div>
              <p>효과</p>
              <div className="mt-2 flex h-7 w-13 items-center rounded-full bg-sky-400 p-1">
                <span className="ml-auto h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>

          <a
            href="/shop"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-sky-300 bg-white px-4 py-3 text-sm font-bold text-sky-600 transition hover:bg-sky-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-400"
          >
            <DownloadOutlinedIcon fontSize="small" />내 키보드 저장하기
          </a>
        </article>
      </section>
    </main>
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
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-xs font-bold text-violet-600">
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 14 }} />
          {badge}
        </span>
      )}
    </div>
    {action && (
      <button
        type="button"
        className="flex shrink-0 items-center text-xs font-semibold text-slate-500 transition hover:text-sky-600"
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
  tone,
  visual,
}: {
  title: string;
  value: string;
  suffix: string;
  helper: string;
  tone: "mint" | "violet" | "rose";
  visual: ReactNode;
}) => {
  const toneClass = {
    mint: "border-emerald-100 bg-emerald-50 text-emerald-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
    rose: "border-rose-100 bg-rose-50 text-rose-600",
  }[tone];

  return (
    <article
      className={`relative min-h-34 overflow-hidden rounded-[28px] border p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] ${toneClass}`}
    >
      <div className="relative z-10">
        <p className="flex items-center gap-1 text-sm font-bold">
          {title}
          <InfoOutlinedIcon sx={{ fontSize: 15 }} className="opacity-60" />
        </p>
        <p className="mt-3 flex items-end gap-1 text-3xl font-black leading-none">
          {value}
          <span className="text-base font-bold">{suffix}</span>
        </p>
        <p className="mt-3 text-sm font-semibold opacity-90">{helper}</p>
      </div>
      <div className="absolute -right-3 bottom-1 opacity-30 sm:opacity-40">
        {visual}
      </div>
    </article>
  );
};

const PointCoin = () => (
  <div className="relative h-20 w-20">
    <div className="absolute inset-0 rounded-full bg-amber-300 shadow-[inset_-8px_-8px_0_rgba(217,119,6,0.22)]" />
    <img
      src={icPoint}
      alt=""
      aria-hidden
      className="absolute left-1/2 top-1/2 h-13 w-13 -translate-x-1/2 -translate-y-1/2"
    />
  </div>
);

const RecentFileRow = ({ file }: { file: RecentFile }) => {
  const fileColor =
    file.type === "pdf" ? "bg-red-500 text-white" : "bg-orange-500 text-white";
  const statusColor =
    file.statusTone === "green"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-violet-100 text-violet-700";

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
    className="grid grid-cols-[34px_34px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-3 transition hover:border-violet-200 hover:bg-white hover:shadow-sm"
  >
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-black text-white">
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
