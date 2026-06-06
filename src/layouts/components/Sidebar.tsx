import { type ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Icon from "@components/Icon";
import lgLarge from "@assets/lg_large.png";
import lgSmall from "@assets/lg_small.png";
import illustSidebarShop from "@assets/sidebar/illust_sidebar_shop.png";
import {
  sidebarShell,
  sidebarLogo,
  sidebarLogoImage,
  sidebarNav,
  sidebarNavItem,
} from "@design-system";

const navItems = [
  { label: "홈", href: "/home", icon: CloudOutlinedIcon },
  { label: "타자연습", href: "/play", icon: KeyboardOutlinedIcon },
  { label: "타닥상점", href: "/shop", icon: StorefrontOutlinedIcon },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className={sidebarShell}>
      <div className={sidebarLogo}>
        <Logo />
      </div>
      <nav className={`${sidebarNav} mt-4`}>
        {navItems.map((item) => (
          <Item
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
          />
        ))}
      </nav>

      <div className="mt-auto hidden lg:flex lg:flex-col lg:gap-5">
        <section className="overflow-hidden rounded-xl border border-sky-100 bg-sky-50/70 px-4 pb-4 pt-5 shadow-[0_14px_32px_rgba(59,91,196,0.08)]">
          <p className="text-xs font-bold text-blue-400">
            포인트를 모아
            <br />
            나만의 키보드를
            <br />
            꾸며보세요!
          </p>
          <img
            src={illustSidebarShop}
            alt=""
            aria-hidden
            className="mx-auto -mb-1 mt-1 h-30 w-30 object-contain drop-shadow-[0_12px_22px_rgba(59,91,196,0.16)]"
          />
        </section>

        <a
          href="mailto:support@tadakcampus.com"
          className="flex items-center gap-3 px-2 text-sm font-bold text-slate-500 transition hover:text-blue-500"
        >
          <HelpOutlineOutlinedIcon fontSize="small" />
          문의하기
        </a>

        <p className="px-2 text-xs font-semibold text-slate-300">
          © 2024 Tadak Campus
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

const Logo = () => {
  return (
    <>
      <img
        src={lgLarge}
        className={`${sidebarLogoImage} hidden lg:block`}
        alt="타닥로고"
      />
      <img
        src={lgSmall}
        className={`${sidebarLogoImage} block lg:hidden`}
        alt="타닥로고"
      />
    </>
  );
};

const Item = ({
  label,
  href,
  icon,
  isActive,
}: {
  label: string;
  href: string;
  icon: ElementType;
  isActive: boolean;
}) => {
  return (
    <Link
      to={href}
      aria-current={isActive ? "page" : undefined}
      className={`${sidebarNavItem} ${isActive ? "bg-sky-400! text-white!" : ""}`}
    >
      <Icon icon={icon} size="sm" ariaLabel={label} />
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
};
