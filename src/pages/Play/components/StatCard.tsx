type StatCardProps = {
  label: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
  labelColor: string;
  valueColor: string;
};

const StatCard = ({
  label,
  value,
  bgColor,
  borderColor,
  labelColor,
  valueColor,
}: StatCardProps) => {
  return (
    <div
      className="flex flex-col items-center p-4 rounded-2xl border-2"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <div style={{ color: labelColor }}>{label}</div>
      <div className="font-bold" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
