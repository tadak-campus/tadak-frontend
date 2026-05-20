import { useEffect, useRef, useState } from "react";

const SENTENCES = [
  "클라우드 컴퓨팅은 인터넷을 통해 필요한 만큼 컴퓨팅 자원을 제공하는 방식이다.",
  "데이터 센터에 저장된 서버, 저장 공간 및 데이터베이스에 액세스할 수 있다.",
  "사용자는 하드웨어 인프라를 소유할 필요 없이 유연하게 사용량을 조절한다.",
];

const PlayPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [, setPressedCodes] = useState<Set<string>>(new Set());
  const [, setShiftActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSentence = SENTENCES[currentIndex];
  const remainingSentences = SENTENCES.slice(
    currentIndex + 1,
    currentIndex + 2,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedCodes((prev) => new Set(prev).add(e.code));
      if (e.key === "Shift") setShiftActive(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      if (e.key === "Shift") setShiftActive(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 페이지 열리면 input에 자동 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  // Enter로 다음 문장 진행
  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex < SENTENCES.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTyped("");
      } else {
        // 마지막 문장이면 완료 처리
        alert("연습 완료!");
      }
    }
  };

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">타자연습</h1>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-[#e8f5ec] border-2 border-[#c8e6d0] ">
          <div className="text-[#2d8659]">정확도</div>
          <div className="text-[#1e6b42] font-bold">98%</div>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-[#e8eeff] border-2 border-[#c8d4f0] ">
          <div className="text-[#3b5bc4]">WPM</div>
          <div className="text-[#2a4399] font-bold">350</div>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-[#fce8e8] border-2 border-[#f5cccc] ">
          <div className="text-[#c44545]">오타</div>
          <div className="text-[#a02828] font-bold">2</div>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-[#f0ebf7] border-2 border-[#dcd0ec] ">
          <div className="text-[#8b5cb8]">지난 시간(s)</div>
          <div className="text-[#6b3a99] font-bold">142</div>
        </div>
      </div>

      <div className="p-6 rounded-xl border mb-8">
        {/* 현재 문장 */}
        <p className="text-2xl leading-relaxed mb-6 w-full px-4 py-3 bg-[#7CB9E8] border-3 border-[#7CB9E8] rounded-xl">
          {currentSentence.split("").map((char, i) => {
            const typedChar = typed[i];
            let className = "text-white"; // 아직 안 친 글자
            if (typedChar !== undefined) {
              className = typedChar === char ? "text-black" : "text-red-500"; // 정답/오답
            }
            return (
              <span key={i} className={className}>
                {char}
              </span>
            );
          })}
        </p>

        {/* 입력창 */}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={handleKeyDownInput}
          className="w-full px-4 py-3 border-3 border-[#7CB9E8] rounded-xl text-2xl leading-relaxed mb-6 focus:outline-none"
        />

        {/* 다음 문장들 (회색, 작게) */}
        <div className="space-y-2 flex justify-center">
          {remainingSentences.map((sentence, i) => (
            <p
              key={i}
              className="w-11/12 px-4 py-3 text-xl text-gray-400 border-3 border-gray-400 rounded-xl"
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>

      <div>키보드 레이아웃</div>
    </main>
  );
};

export default PlayPage;
