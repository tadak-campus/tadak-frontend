import { useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import icPoint from "@assets/ic_point.png";
import { headerShell, headerActions, headerChip } from "@design-system";

const Header = () => {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

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
    window.location.href = "/logout";
  };

  return (
    <header className={headerShell}>
      <div className={headerActions}>
        <div className={headerChip} aria-hidden>
          <img src={icPoint} alt="" className="w-8 h-8" />
          <span>12,450</span>
        </div>

        <div className="relative" ref={popRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`${headerChip} relative pl-12`}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              타
            </div>
            <span className="hidden sm:inline">타다익</span>
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
