import { useEffect, useRef, useState } from "react";
import Keyboard from "@components/Keyboard/Keyboard";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import useKeyboardInput from "@components/Keyboard/useKeyboardInput";
import StatCard from "@pages/Play/components/StatCard";
import SentenceDisplay from "@pages/Play/components/SentenceDisplay";
import UpcomingSentences from "@pages/Play/components/UpcomingSentences";
import TypingInput from "@pages/Play/components/TypingInput";

const SENTENCES = [
  "클라우드 컴퓨팅은 인터넷을 통해 필요한 만큼 컴퓨팅 자원을 제공하는 방식이다.",
  "데이터 센터에 저장된 서버, 저장 공간 및 데이터베이스에 액세스할 수 있다.",
  "사용자는 하드웨어 인프라를 소유할 필요 없이 유연하게 사용량을 조절한다.",
];

const PlayPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const { pressedCodes, shiftActive } = useKeyboardInput();

  // 통계 관련 state
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentCPM, setCurrentCPM] = useState(0);
  const [finalCPM, setFinalCPM] = useState<number>(0);

  const currentSentence = SENTENCES[currentIndex];
  const remainingSentences = SENTENCES.slice(
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

      if (currentIndex < SENTENCES.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTyped("");
      } else {
        // 마지막 문장이면 완료 처리
        finishTyping();
      }
    }
  };

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
  };

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">타자연습</h1>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard
          label="정확도"
          value={`${accuracy}%`}
          variant="green"
        />
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

      <div className="p-6 rounded-xl shadow-md mb-8">
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

      <Keyboard
        layout={qwertyLayout}
        pressedCodes={pressedCodes}
        shiftActive={shiftActive}
      />
    </main>
  );
};

export default PlayPage;
