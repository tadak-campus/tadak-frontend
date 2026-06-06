import { apiClient } from "@apis/client";
import type {
  PracticeCompleteRequest,
  PracticeCompleteResponse,
  PracticeGenerateResponse,
} from "@app-types/practice";

export const generatePracticeSentences = (file: File) => {
  const body = new FormData();
  body.append("file", file);

  return apiClient.post<PracticeGenerateResponse, PracticeGenerateResponse>(
    "/practice/generate",
    body,
  );
};

export const completePractice = (request: PracticeCompleteRequest) =>
  apiClient.post<
    PracticeCompleteResponse,
    PracticeCompleteResponse,
    PracticeCompleteRequest
  >("/practice/complete", request);
