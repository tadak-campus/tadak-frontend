import { apiClient } from "@apis/client";
import type { UserMeResponse } from "@app-types/user";

export const getMe = () =>
  apiClient.get<UserMeResponse, UserMeResponse>("/users/me");
