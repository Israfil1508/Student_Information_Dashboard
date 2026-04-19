import api, { unwrap } from "./client";
import type { ApiResponse, Mentor } from "../types/index";

export const fetchMentors = async (): Promise<Mentor[]> => {
  const response = await api.get<ApiResponse<Mentor[]>>("/api/mentors");
  return unwrap(response);
};

export const assignMentor = async (
  studentId: string,
  mentorId: string,
): Promise<{ studentId: string; mentor: Mentor; assignedAt: string }> => {
  const response = await api.put<
    ApiResponse<{ studentId: string; mentor: Mentor; assignedAt: string }>
  >(`/api/students/${studentId}/mentor`, { mentorId });
  return unwrap(response);
};
