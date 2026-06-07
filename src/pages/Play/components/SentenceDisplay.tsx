type SentenceDisplayProps = {
  sentence: string;
  typed: string;
};

const SentenceDisplay = ({ sentence, typed }: SentenceDisplayProps) => {
  return (
    <p className="w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-1 text-lg font-semibold leading-8 text-slate-500 sm:text-xl">
      {sentence.split("").map((char, i) => {
        const typedChar = typed[i];
        let className = "text-slate-500";
        if (typedChar !== undefined) {
          className = typedChar === char ? "text-slate-950" : "text-red-600";
        }
        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </p>
  );
};

export default SentenceDisplay;
