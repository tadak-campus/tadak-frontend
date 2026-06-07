type UpcomingSentencesProps = {
  sentences: string[];
};

const UpcomingSentences = ({ sentences }: UpcomingSentencesProps) => {
  return (
    <div className="space-y-2">
      {sentences.map((sentence, i) => (
        <p
          key={i}
          className="w-full px-3 text-sm font-medium text-slate-400 sm:text-base"
        >
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default UpcomingSentences;
