import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@apis/user";
import { soundPackForItem } from "@pages/Shop/shopData";

// 소리를 내지 않을 키 — 순수 수식/잠금 키.
const SILENT_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
]);

const SOUND_VOLUME = 0.5;

// 주어진 사운드 팩을 키 입력마다 재생하는 코어 훅.
// pack이 null이거나 비어 있으면 무음. (상점 미리보기처럼 팩을 직접 넘길 때 사용)
export const usePlayTypingSound = (pack: string[] | null) => {
  const packRef = useRef(pack);
  // 재생 중인 Audio 인스턴스를 붙들어 GC를 막는다. 지역변수만으로는
  // 다운로드(첫 입력)가 끝나기 전에 수거되어 재생이 시작도 못 하고 사라진다.
  const playingRef = useRef<Set<HTMLAudioElement>>(new Set());

  useEffect(() => {
    packRef.current = pack;
  }, [pack]);

  // 팩이 정해지면 파일을 미리 받아 캐시에 올려둔다(첫 입력 지연·무음 방지).
  // 프리로드 인스턴스도 참조를 유지해야 다운로드 중 수거되지 않는다.
  const preloadRef = useRef<HTMLAudioElement[]>([]);
  useEffect(() => {
    if (!pack) {
      preloadRef.current = [];
      return;
    }
    preloadRef.current = pack.map((url) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.load();
      return audio;
    });
  }, [pack]);

  useEffect(() => {
    const playing = playingRef.current;
    const handleDown = (event: KeyboardEvent) => {
      // 키를 누르고 있을 때의 반복 입력과 수식 키는 소리 없이 넘긴다.
      if (event.repeat || SILENT_KEYS.has(event.key)) return;

      const current = packRef.current;
      if (!current || current.length === 0) return;

      const url = current[Math.floor(Math.random() * current.length)];
      const audio = new Audio(url);
      audio.volume = SOUND_VOLUME;
      // 재생이 끝나거나 실패하면 참조를 푼다.
      const release = () => playing.delete(audio);
      audio.addEventListener("ended", release);
      audio.addEventListener("error", release);
      // 빠른 연타로 재생이 겹쳐도 매번 새 인스턴스라 끊기지 않는다.
      // 재생 시작 전 GC로 수거되지 않도록 참조를 잡아둔다.
      playing.add(audio);
      void audio.play().catch(() => {
        // 자동재생 정책 등으로 재생 실패 시 무시.
        release();
      });
    };

    window.addEventListener("keydown", handleDown);
    return () => {
      window.removeEventListener("keydown", handleDown);
      playing.clear();
    };
  }, []);
};

// 착용 중인 SOUND 아이템의 사운드 팩을 키 입력마다 재생한다(타자연습용).
// 마운트 시 GET /api/users/me로 착용 사운드를 1회 조회하며,
// 미착용·매칭 없음·조회 실패 시 무음으로 둔다(타자연습을 막지 않음).
export const useTypingSound = () => {
  const [pack, setPack] = useState<string[] | null>(null);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (!active) return;
        setPack(soundPackForItem(user.equipped_items.sound));
      })
      .catch(() => {
        // 착용 정보 조회 실패 시 무음 유지.
      });

    return () => {
      active = false;
    };
  }, []);

  usePlayTypingSound(pack);
};
