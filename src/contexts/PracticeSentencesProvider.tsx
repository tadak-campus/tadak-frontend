import { useCallback, useMemo, useState, type ReactNode } from "react";
import { practiceSentencesStorage } from "@utils/practiceSentencesStorage";
import {
  PracticeSentencesContext,
  type PracticeSentencesContextValue,
} from "@contexts/PracticeSentencesContext";

export const PracticeSentencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sentences, setSentencesState] = useState<string[]>(() =>
    practiceSentencesStorage.get(),
  );

  const setSentences = useCallback((next: string[]) => {
    setSentencesState(next);
    practiceSentencesStorage.save(next);
  }, []);

  const clearSentences = useCallback(() => {
    setSentencesState([]);
    practiceSentencesStorage.clear();
  }, []);

  const value = useMemo<PracticeSentencesContextValue>(
    () => ({ sentences, setSentences, clearSentences }),
    [sentences, setSentences, clearSentences],
  );

  return (
    <PracticeSentencesContext.Provider value={value}>
      {children}
    </PracticeSentencesContext.Provider>
  );
};
