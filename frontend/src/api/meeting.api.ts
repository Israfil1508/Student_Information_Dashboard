import api, { unwrap } from "./client";
import type { ApiResponse, Meeting, MeetingStatus } from "../types/index";

export interface MeetingCreateInput {
  mentorId?: string;
  date: string;
  duration: number;
  notes: string;
  actionItems: string[];
  status: MeetingStatus;
}

export interface MeetingUpdateInput {
  status?: MeetingStatus;
  notes?: string;
  actionItems?: string[];
  date?: string;
}

export const fetchMeetings = async (studentId: string, search?: string): Promise<Meeting[]> => {
  const response = await api.get<ApiResponse<Meeting[]>>(`/api/students/${studentId}/meetings`, {
    params: search ? { search } : undefined,
  });

  return unwrap(response);
};

export const createMeeting = async (
  studentId: string,
  payload: MeetingCreateInput,
): Promise<Meeting> => {
  const response = await api.post<ApiResponse<Meeting>>(
    `/api/students/${studentId}/meetings`,
    payload,
  );

  return unwrap(response);
};

export const updateMeeting = async (
  meetingId: string,
  payload: MeetingUpdateInput,
): Promise<Meeting> => {
  const response = await api.put<ApiResponse<Meeting>>(`/api/meetings/${meetingId}`, payload);
  return unwrap(response);
};
