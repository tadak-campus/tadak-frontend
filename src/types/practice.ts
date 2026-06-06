export interface PracticeGenerateResponse {
  sentences: string[];
}

export interface PracticeCompleteRequest {
  completed_count: number;
  accuracy: number;
  speed: number;
}

export interface PracticeCompleteResponse {
  earned_point: number;
  total_point: number;
}
