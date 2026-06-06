import { createContext, useContext } from "react";

export interface PracticeSentencesContextValue {
  sentences: string[];
  setSentences: (sentences: string[]) => void;
  clearSentences: () => void;
}

export const PracticeSentencesContext =
  createContext<PracticeSentencesContextValue | null>(null);

export const usePracticeSentences = () => {
  const context = useContext(PracticeSentencesContext);
  if (!context) {
    throw new Error(
      "usePracticeSentences는 PracticeSentencesProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
};
