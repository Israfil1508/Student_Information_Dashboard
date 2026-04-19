import { assignMentor, fetchMentors } from "../api/mentor.api";

export const getMentors = () => fetchMentors();

export const linkMentorToStudent = (studentId: string, mentorId: string) =>
  assignMentor(studentId, mentorId);
