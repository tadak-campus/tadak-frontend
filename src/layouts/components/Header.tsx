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
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
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
