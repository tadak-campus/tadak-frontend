import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import ShortTextOutlinedIcon from "@mui/icons-material/ShortTextOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { panel, panelPadding } from "@design-system";
import { usePracticeSentences } from "@contexts/PracticeSentencesContext";
import { DEFAULT_SENTENCES } from "@pages/Play/defaultSentences";
import PracticeStartModal from "@pages/Play/components/PracticeStartModal";

type PracticeMenu = {
  key: "basic" | "short" | "long";
  title: string;
  description: string;
  icon: ReactNode;
  tone: "sky" | "violet" | "rose";
  available: boolean;
  path?: string;
};

const toneClass: Record<PracticeMenu["tone"], string> = {
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
  rose: "bg-rose-100 text-rose-600",
};

const PracticeMenuPage = () => {
  const navigate = useNavigate();
  const { sentences } = usePracticeSentences();
  const [startMenu, setStartMenu] = useState<PracticeMenu | null>(null);

  // 실제 연습할 문장 수 (업로드한 문장이 없으면 기본 문장 수)
  const sentenceCount = sentences.length || DEFAULT_SENTENCES.length;

  const menus: PracticeMenu[] = [
    {
      key: "basic",
      title: "기본 연습",
      description: "키 위치와 자세를 익히는 기본 타자 연습이에요.",
      icon: <KeyboardOutlinedIcon sx={{ fontSize: 30 }} />,
      tone: "sky",
      available: false,
    },
    {
      key: "short",
      title: "단문 연습",
      description: sentences.length
        ? `업로드한 자료로 만든 ${sentences.length}개의 문장을 연습해요.`
        : "짧은 문장으로 또박또박 정확도를 끌어올려요.",
      icon: <ShortTextOutlinedIcon sx={{ fontSize: 30 }} />,
      tone: "violet",
      available: true,
      path: "/play/typing",
    },
    {
      key: "long",
      title: "장문 연습",
      description: "긴 문단을 집중해서 끝까지 완성하는 연습이에요.",
      icon: <NotesOutlinedIcon sx={{ fontSize: 30 }} />,
      tone: "rose",
      available: false,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">
          타자연습
        </h1>
        <p className="text-sm font-medium text-slate-500 sm:text-base">
          연습 유형을 선택하고 바로 타자 연습을 시작해보세요.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu) => (
          <PracticeMenuCard
            key={menu.key}
            menu={menu}
            onSelect={() => setStartMenu(menu)}
          />
        ))}
      </section>

      <PracticeStartModal
        open={startMenu !== null}
        title={startMenu?.title ?? ""}
        sentenceCount={sentenceCount}
        onStart={() => startMenu?.path && navigate(startMenu.path)}
        onCancel={() => setStartMenu(null)}
      />
    </main>
  );
};

const PracticeMenuCard = ({
  menu,
  onSelect,
}: {
  menu: PracticeMenu;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={menu.available ? onSelect : undefined}
    disabled={!menu.available}
    aria-disabled={!menu.available}
    className={`${panel} ${panelPadding} flex min-h-52 flex-col items-start gap-4 text-left transition ${
      menu.available
        ? "cursor-pointer hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_46px_rgba(124,58,237,0.16)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-400"
        : "cursor-not-allowed opacity-60"
    }`}
  >
    <div className="flex w-full items-start justify-between">
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${toneClass[menu.tone]}`}
      >
        {menu.icon}
      </span>
      {!menu.available && (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          준비 중
        </span>
      )}
    </div>

    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-bold text-slate-950">{menu.title}</h2>
      <p className="text-sm font-medium leading-6 text-slate-500">
        {menu.description}
      </p>
    </div>

    {menu.available && (
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-violet-600">
        연습 시작하기
        <ChevronRightOutlinedIcon fontSize="small" />
      </span>
    )}
  </button>
);

export default PracticeMenuPage;
