type SentenceDisplayProps = {
  sentence: string;
  typed: string;
};

const SentenceDisplay = ({ sentence, typed }: SentenceDisplayProps) => {
  return (
    <p className="text-2xl leading-relaxed mb-2 w-full px-4 py-3 bg-sky-300 border-3 border-sky-300 rounded-xl">
      {sentence.split("").map((char, i) => {
        const typedChar = typed[i];
        let className = "text-white";
        if (typedChar !== undefined) {
          className = typedChar === char ? "text-black" : "text-red-500";
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
