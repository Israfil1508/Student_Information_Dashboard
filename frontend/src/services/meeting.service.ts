import { createMeeting, fetchMeetings, updateMeeting } from "../api/meeting.api";
import type { MeetingCreateInput, MeetingUpdateInput } from "../api/meeting.api";

export const getMeetings = (studentId: string, search?: string) => fetchMeetings(studentId, search);

export const addMeeting = (studentId: string, payload: MeetingCreateInput) =>
  createMeeting(studentId, payload);

export const editMeeting = (meetingId: string, payload: MeetingUpdateInput) =>
  updateMeeting(meetingId, payload);
