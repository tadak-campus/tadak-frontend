import { useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import icPoint from "@assets/ic_point.png";
import BoringAvatar from "@components/BoringAvatar";
import { headerShell, headerActions, headerChip } from "@design-system";
import { useMe } from "@hooks/useMe";
import { authTokenStorage } from "@utils/authTokenStorage";

const Header = () => {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  const { me, loading } = useMe();

  const nickname = me?.profile_nickname || "타다익";
  const pointLabel = loading && !me ? "..." : (me?.point ?? 0).toLocaleString();

  useEffect(() => {
    function handleDoc(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, []);

  const handleLogout = () => {
    authTokenStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className={headerShell}>
      <div className={headerActions}>
        <div className={headerChip} aria-hidden>
          <img src={icPoint} alt="" className="w-8 h-8" />
          <span>{pointLabel}</span>
        </div>

        <div className="relative" ref={popRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`${headerChip} relative pl-12`}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <BoringAvatar
              name={nickname}
              title={`${nickname} 프로필`}
              className="absolute left-0 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full ring-2 ring-white"
            />
            <span className="hidden sm:inline">{nickname}</span>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-3 w-52 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-3 px-2 py-2">
                <BoringAvatar
                  name={nickname}
                  className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {nickname}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    내 프로필
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-slate-600 transition hover:bg-sky-400 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <LogoutIcon fontSize="small" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
