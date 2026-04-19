import type { EnrollmentStatus, MeetingStatus, ScholarshipStatus } from "../../types/index";

export type SummaryView = "students" | "mentors" | "scholarships" | "meetings";

export type ModuleTab = "dashboard" | "scholarships" | "mentorship";

export type SummaryListItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  details: Array<{ label: string; value: string }>;
};

export type StudentFormState = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  academicYear: "Freshman" | "Sophomore" | "Junior" | "Senior";
  major: string;
  gpa: string;
  enrollmentStatus: EnrollmentStatus;
  creditsCompleted: string;
  creditsRequired: string;
  expectedGraduation: string;
  firstGeneration: boolean;
  lowIncome: boolean;
  underrepresentedMinority: boolean;
  assignedMentorId: string;
};

export type ScholarshipFormState = {
  name: string;
  provider: string;
  amount: number;
  currency: string;
  status: ScholarshipStatus;
  deadline: string;
  requirements: string;
  essayRequired: boolean;
  essaySubmitted: boolean;
  notes: string;
  dateApplied: string;
};

export type MeetingFormState = {
  mentorId: string;
  date: string;
  duration: number;
  status: MeetingStatus;
  notes: string;
  actionItems: string;
};
