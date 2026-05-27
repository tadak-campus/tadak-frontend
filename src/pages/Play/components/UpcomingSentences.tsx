type UpcomingSentencesProps = {
  sentences: string[];
};

const UpcomingSentences = ({ sentences }: UpcomingSentencesProps) => {
  return (
    <div className="space-y-2 flex justify-center">
      {sentences.map((sentence, i) => (
        <p
          key={i}
          className="w-11/12 px-4 py-3 text-xl text-gray-400 border-3 border-gray-400 rounded-xl"
        >
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default UpcomingSentences;
