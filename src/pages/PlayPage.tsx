import { useState, useEffect } from "react";
import Keyboard from "@components/Keyboard/Keyboard";
import { qwertyLayout } from "@components/Keyboard/KeyboardLayout";
import {
  contentShell,
  panel,
  panelPadding,
  sectionHeadline,
  sectionTitle,
} from "@design-system";

const PlayPage = () => {
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [shiftActive, setShiftActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedCodes((prev) => new Set(prev).add(e.code));
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        setShiftActive(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        setShiftActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className={contentShell}>
      {/* 제목 및 진행도 */}
      <div className="mb-8">
        <h1 className={`${sectionHeadline} mb-4`}>타자연습</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">
            푼글 3/10
          </span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-3/10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <StatCard
          icon="📊"
          label="정확도"
          value="98%"
          change="+2%"
          changeColor="text-green-600"
        />
        <StatCard
          icon="⌨️"
          label="WPM"
          value="350"
          change="+15"
          changeColor="text-green-600"
        />
        <StatCard
          icon="❌"
          label="오타"
          value="2"
          change="-1"
          changeColor="text-red-600"
        />
        <StatCard
          icon="👥"
          label="쌍글"
          value="15"
          change="최근 32"
          changeColor="text-slate-500"
        />
        <StatCard
          icon="🏆"
          label="프리트"
          value="120P"
          change="+30P"
          changeColor="text-green-600"
        />
      </div>

      {/* 클라우드 컴퓨팅 설명 */}
      <div className={`${panel} ${panelPadding} mb-8`}>
        <div className="flex gap-2 mb-3">
          <span className="text-lg">💡</span>
          <h2 className="font-semibold text-slate-900">클라우드 컴퓨팅은</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          클라우드 컴퓨팅은 인터넷을 통해 필요한 만큼 컴퓨팅 자원을 제공하는
          방식이다.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          데이터 센터에 저장된 서버, 저장 공간 및 데이터베이스에 액세스할 수
          있다.
          <br />
          사용자는 하드웨어 인프라를 소유할 필요 없이 유연하게 사용할 수 있다.
        </p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <span className="text-sm">💡</span>
          <span className="text-xs text-blue-700 font-medium">
            해커-기업의 정보화혁명!
          </span>
        </div>
      </div>

      {/* 키보드 레이아웃 */}
      <div className={`${panel} ${panelPadding} mb-8`}>
        <p className={`${sectionTitle} mb-4`}>Keyboard</p>
        <Keyboard
          layout={qwertyLayout}
          pressedCodes={pressedCodes}
          shiftActive={shiftActive}
        />
      </div>

      {/* Daily Tip */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">✨</div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Daily Tip</h3>
            <p className="text-sm text-slate-700 mb-4">
              손목을 굽기지 말고, 자신을 잃지 않으세요.
              <br />
              바른 자세가 지속을 중요해요.
            </p>
            <div className="flex gap-2 items-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E9D5FF'/%3E%3C/svg%3E"
                alt="mascot"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  change,
  changeColor,
}: {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeColor: string;
}) => {
  return (
    <div className={`${panel} ${panelPadding}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
      <p className={`text-xs font-semibold ${changeColor}`}>{change}</p>
    </div>
  );
};

export default PlayPage;
