import { type ElementType } from "react";

type IconSize = "sm" | "md" | "lg" | number;

interface IconProps {
  icon: ElementType;
  size?: IconSize;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

const sizeMap = {
  sm: "small",
  md: "medium",
  lg: "large",
} as const;

const Icon = ({
  icon: IconComponent,
  size = "md",
  className,
  color,
  ariaLabel,
}: IconProps) => {
  const fontSize = typeof size === "number" ? undefined : sizeMap[size];
  const style =
    typeof size === "number"
      ? { fontSize: size, color }
      : color
        ? { color }
        : undefined;

  return (
    <IconComponent
      fontSize={fontSize}
      style={style}
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    />
  );
};

export default Icon;
