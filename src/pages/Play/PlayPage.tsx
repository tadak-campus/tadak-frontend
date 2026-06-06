import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import KeyboardStage from "@components/Keyboard/KeyboardStage";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import { useEquippedKeyboardStyle } from "@hooks/useEquippedKeyboardStyle";
import StatCard from "@pages/Play/components/StatCard";
import SentenceDisplay from "@pages/Play/components/SentenceDisplay";
import UpcomingSentences from "@pages/Play/components/UpcomingSentences";
import TypingInput from "@pages/Play/components/TypingInput";
import ResultModal, {
  type ResultModalStatus,
} from "@pages/Play/components/ResultModal";
import { completePractice } from "@apis/practice";
import type {
  PracticeCompleteRequest,
  PracticeCompleteResponse,
} from "@app-types/practice";
import { usePracticeSentences } from "@contexts/PracticeSentencesContext";

const DEFAULT_SENTENCES = [
  "클라우드 컴퓨팅은 인터넷을 통해 필요한 만큼 컴퓨팅 자원을 제공하는 방식이다.",
  "데이터 센터에 저장된 서버, 저장 공간 및 데이터베이스에 액세스할 수 있다.",
  "사용자는 하드웨어 인프라를 소유할 필요 없이 유연하게 사용량을 조절한다.",
];

interface ApiValidationErrorDetail {
  msg?: string;
}

interface ApiErrorResponse {
  detail?: string | ApiValidationErrorDetail[];
}

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
  return "포인트 적립에 실패했습니다.";
};

const PlayPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const { pressedCodes, shiftActive } = useKeyboardInput();
  const keyboardStyle = useEquippedKeyboardStyle();
  const { sentences } = usePracticeSentences();
  const activeSentences = sentences.length ? sentences : DEFAULT_SENTENCES;

  // 통계 관련 state
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentCPM, setCurrentCPM] = useState(0);
  const [finalCPM, setFinalCPM] = useState<number>(0);

  // 결과 모달 관련 state
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ResultModalStatus>("loading");
  const [completeResult, setCompleteResult] =
    useState<PracticeCompleteResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastPayloadRef = useRef<PracticeCompleteRequest | null>(null);

  const currentSentence = activeSentences[currentIndex];
  const remainingSentences = activeSentences.slice(
    currentIndex + 1,
    currentIndex + 2,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalCharsRef = useRef(0);
  const typedRef = useRef("");
  const currentSentenceRef = useRef(currentSentence);
  const pastErrorsRef = useRef(0);

  // 페이지 열리면 input에 자동 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    currentSentenceRef.current = currentSentence;
  }, [currentSentence]);

  // 경과 시간 0.2초마다 업데이트
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const interval = setInterval(() => {
      if (startTimeRef.current === null) return;

      const seconds = (Date.now() - startTimeRef.current) / 1000;
      setElapsedSeconds(Math.floor(seconds));

      const currentTyped = typedRef.current;
      const currentTarget = currentSentenceRef.current;

      // 현재 문장 정답/오답 카운트
      let correctInCurrent = 0;
      let wrongInCurrent = 0;
      for (let i = 0; i < currentTyped.length; i++) {
        if (currentTyped[i] === currentTarget[i]) {
          correctInCurrent++;
        } else {
          wrongInCurrent++;
        }
      }

      // 누적 정답 글자 = 완료한 문장 글자 - 그 문장들의 오타 + 현재 문장 정답
      const totalCorrect =
        totalCharsRef.current - pastErrorsRef.current + correctInCurrent;
      // 누적 친 글자 = 완료한 문장 글자 + 현재 친 글자
      const totalTyped = totalCharsRef.current + currentTyped.length;

      // CPM (정답 글자 기준)
      const cpm = seconds > 0 ? Math.round((totalCorrect / seconds) * 60) : 0;
      setCurrentCPM(cpm);

      // 오타: 이전 문장들 누적 + 현재 문장
      setErrorCount(pastErrorsRef.current + wrongInCurrent);

      // 정확도
      if (totalTyped > 0) {
        const acc = Math.round((totalCorrect / totalTyped) * 100);
        setAccuracy(acc);
      } else {
        setAccuracy(100);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isStarted, isFinished]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (startTimeRef.current === null && e.target.value.length > 0) {
      startTimeRef.current = Date.now();
      setIsStarted(true);
    }
    setTyped(e.target.value);
  };

  // Enter로 다음 문장 진행
  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      let wrongInCurrent = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== currentSentence[i]) {
          wrongInCurrent++;
        }
      }
      // 이전 문장들에 오타 누적
      pastErrorsRef.current += wrongInCurrent;

      // 현재 문장 길이 누적
      totalCharsRef.current += currentSentence.length;

      if (currentIndex < activeSentences.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTyped("");
      } else {
        // 마지막 문장이면 완료 처리
        finishTyping();
      }
    }
  };

  const submitResult = useCallback(async (payload: PracticeCompleteRequest) => {
    lastPayloadRef.current = payload;
    setSubmitStatus("loading");
    setSubmitError(null);

    try {
      const data = await completePractice(payload);
      setCompleteResult(data);
      setSubmitStatus("success");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setSubmitStatus("error");
    }
  }, []);

  const finishTyping = () => {
    if (startTimeRef.current === null) return;
    if (isFinished) return;

    const totalSeconds = (Date.now() - startTimeRef.current) / 1000;
    // 누적 정답 = 전체 글자 - 누적 오타
    const totalCorrect = totalCharsRef.current - pastErrorsRef.current;

    // CPM 계산: (글자 수 / 초) * 60
    const cpm =
      totalSeconds > 0 ? Math.round((totalCorrect / totalSeconds) * 60) : 0;

    setFinalCPM(cpm);
    setElapsedSeconds(Math.floor(totalSeconds));
    setIsFinished(true);

    // 결과 백엔드 전송 + 모달 오픈
    setIsModalOpen(true);
    void submitResult({
      completed_count: activeSentences.length,
      accuracy,
      speed: cpm,
    });
  };

  // 타자 상태 전체 초기화 (다시하기)
  const resetTyping = () => {
    setCurrentIndex(0);
    setTyped("");
    setAccuracy(100);
    setErrorCount(0);
    setElapsedSeconds(0);
    setIsStarted(false);
    setIsFinished(false);
    setCurrentCPM(0);
    setFinalCPM(0);
    startTimeRef.current = null;
    totalCharsRef.current = 0;
    typedRef.current = "";
    pastErrorsRef.current = 0;
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/play");
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    resetTyping();
    inputRef.current?.focus();
  };

  const handleRetryApi = () => {
    if (lastPayloadRef.current) {
      void submitResult(lastPayloadRef.current);
    }
  };

  return (
    <main className="flex-1 p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">타자연습</h1>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-5 gap-4 mb-2">
        <StatCard label="정확도" value={`${accuracy}%`} variant="green" />
        <StatCard
          label="CPM"
          value={isFinished ? finalCPM : currentCPM}
          variant="blue"
        />
        <StatCard label="오타" value={errorCount} variant="red" />
        <StatCard
          label="지난 시간(s)"
          value={elapsedSeconds}
          variant="purple"
        />
      </div>

      <div className="p-6 rounded-xl shadow-md mb-4">
        {/* 현재 문장 */}
        <SentenceDisplay sentence={currentSentence} typed={typed} />

        {/* 입력창 */}
        <TypingInput
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDownInput}
        />

        {/* 다음 문장들 (회색, 작게) */}
        <UpcomingSentences sentences={remainingSentences} />
      </div>

      <KeyboardStage
        layout={qwertyLayout}
        pressedCodes={pressedCodes}
        shiftActive={shiftActive}
        {...keyboardStyle}
      />

      <ResultModal
        open={isModalOpen}
        status={submitStatus}
        earnedPoint={completeResult?.earned_point ?? 0}
        totalPoint={completeResult?.total_point ?? 0}
        errorMessage={submitError}
        onConfirm={handleConfirm}
        onRetry={handleRetry}
        onRetryApi={handleRetryApi}
      />
    </main>
  );
};

export default PlayPage;
