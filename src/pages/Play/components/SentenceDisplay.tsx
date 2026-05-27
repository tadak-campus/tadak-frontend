type SentenceDisplayProps = {
  sentence: string;
  typed: string;
};

const SentenceDisplay = ({ sentence, typed }: SentenceDisplayProps) => {
  return (
    <p className="text-2xl leading-relaxed mb-6 w-full px-4 py-3 bg-[#7CB9E8] border-3 border-[#7CB9E8] rounded-xl">
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
