const PRACTICE_SENTENCES_STORAGE_KEY = "practice_sentences";

export const practiceSentencesStorage = {
  get(): string[] {
    const raw = window.sessionStorage.getItem(PRACTICE_SENTENCES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (item): item is string => typeof item === "string",
      );
    } catch {
      return [];
    }
  },

  save(sentences: string[]) {
    window.sessionStorage.setItem(
      PRACTICE_SENTENCES_STORAGE_KEY,
      JSON.stringify(sentences),
    );
  },

  clear() {
    window.sessionStorage.removeItem(PRACTICE_SENTENCES_STORAGE_KEY);
  },
};
