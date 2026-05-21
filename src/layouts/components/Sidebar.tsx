import { type ElementType } from "react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Icon from "@components/Icon";
import lgLarge from "@assets/lg_large.png";
import lgSmall from "@assets/lg_small.png";
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
          />
        ))}
      </nav>
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
}: {
  label: string;
  href: string;
  icon: ElementType;
}) => {
  return (
    <a href={href} className={sidebarNavItem}>
      <Icon icon={icon} size="sm" ariaLabel={label} />
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
};
