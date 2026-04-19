import type { EnrollmentStatus, MeetingStatus, ScholarshipStatus } from "../../types/index";
import type { ModuleTab } from "./types";

export const scholarshipStatuses: ScholarshipStatus[] = [
  "Researching",
  "Applied",
  "Interview",
  "Awarded",
  "Rejected",
];

export const meetingStatuses: MeetingStatus[] = ["Scheduled", "Completed", "Cancelled"];

export const enrollmentStatuses: EnrollmentStatus[] = [
  "Full-time",
  "Part-time",
  "Leave of Absence",
  "Graduated",
];

export const moduleTabOrder: ModuleTab[] = ["dashboard", "scholarships", "mentorship"];

export const defaultScholarshipForm = {
  name: "",
  provider: "",
  amount: 2000,
  currency: "USD",
  status: "Researching" as ScholarshipStatus,
  deadline: "",
  requirements: "",
  essayRequired: false,
  essaySubmitted: false,
  notes: "",
  dateApplied: "",
};

export const defaultMeetingForm = {
  mentorId: "",
  date: "",
  duration: 45,
  status: "Scheduled" as MeetingStatus,
  notes: "",
  actionItems: "",
};
