export type StatCardVariant = "green" | "blue" | "red" | "purple";

type StatCardProps = {
  label: string;
  value: string | number;
  variant: StatCardVariant;
};

const VARIANT_STYLES: Record<
  StatCardVariant,
  { container: string; label: string; value: string }
> = {
  green: {
    container: "bg-green-50 border-green-200",
    label: "text-green-600",
    value: "text-green-700",
  },
  blue: {
    container: "bg-blue-50 border-blue-200",
    label: "text-blue-600",
    value: "text-blue-700",
  },
  red: {
    container: "bg-red-50 border-red-200",
    label: "text-red-600",
    value: "text-red-700",
  },
  purple: {
    container: "bg-purple-50 border-purple-200",
    label: "text-purple-600",
    value: "text-purple-700",
  },
};

const StatCard = ({ label, value, variant }: StatCardProps) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-2xl border-2 ${styles.container}`}
    >
      <div className={styles.label}>{label}</div>
      <div className={`font-bold ${styles.value}`}>{value}</div>
    </div>
  );
};

export default StatCard;
