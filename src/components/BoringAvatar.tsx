type BoringAvatarProps = {
  name: string;
  size?: number;
  className?: string;
  title?: string;
};

const palettes = [
  ["#83B6FC", "#DDEBFF", "#F7A8C8", "#FDE68A", "#FFFFFF"],
  ["#7CB9E8", "#C8E6D0", "#F0EBF7", "#F5CCCC", "#FFFFFF"],
  ["#3B5BC4", "#E8EEFF", "#A7F3D0", "#F7A8C8", "#FFFFFF"],
  ["#8B5CB8", "#DCD0EC", "#C8D4F0", "#FDE68A", "#FFFFFF"],
];

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const BoringAvatar = ({
  name,
  size = 36,
  className,
  title,
}: BoringAvatarProps) => {
  const seed = name.trim() || "tadak-campus";
  const hash = hashString(seed);
  const colors = palettes[hash % palettes.length];
  const clipId = `boring-avatar-${hash.toString(36)}`;
  const rotate = hash % 360;
  const offset = (hash % 18) - 9;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <clipPath id={clipId}>
          <circle cx="18" cy="18" r="18" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="36" height="36" fill={colors[1]} />
        <circle cx={10 + offset / 3} cy="12" r="15" fill={colors[0]} />
        <circle cx={27 - offset / 4} cy="10" r="12" fill={colors[2]} />
        <circle cx="23" cy={27 + offset / 5} r="16" fill={colors[3]} />
        <path
          d="M-2 27C6 18 12 15 20 20C27 24 31 20 38 12V38H-2V27Z"
          fill={colors[4]}
          opacity="0.72"
          transform={`rotate(${rotate} 18 18)`}
        />
        <circle cx="13" cy="16" r="2" fill="#1F2937" opacity="0.9" />
        <circle cx="23" cy="16" r="2" fill="#1F2937" opacity="0.9" />
        <path
          d="M14 22C16 24 20 24 22 22"
          stroke="#1F2937"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default BoringAvatar;
