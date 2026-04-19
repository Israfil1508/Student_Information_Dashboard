import type { Meeting } from "./meeting.types";
import type { Mentor } from "./mentor.types";
import type { Scholarship } from "./scholarship.types";

export type AcademicYear = "Freshman" | "Sophomore" | "Junior" | "Senior";

export type EnrollmentStatus =
  | "Full-time"
  | "Part-time"
  | "Leave of Absence"
  | "Graduated";

export interface Demographics {
  firstGeneration: boolean;
  lowIncome: boolean;
  underrepresentedMinority: boolean;
}

export interface GpaPoint {
  term: string;
  gpa: number;
  recordedAt: string;
}

export interface StatusHistory<T extends string> {
  status: T;
  changedAt: string;
  note?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  academicYear: AcademicYear;
  major: string;
  gpa: number;
  enrollmentStatus: EnrollmentStatus;
  creditsCompleted: number;
  creditsRequired: number;
  currentCourses: string[];
  expectedGraduation: string;
  demographics: Demographics;
  assignedMentorId: string | null;
  gpaHistory: GpaPoint[];
  enrollmentStatusHistory: StatusHistory<EnrollmentStatus>[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentDirectoryRecord {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  academicYear: AcademicYear;
  major: string;
  enrollmentStatus: EnrollmentStatus;
  quickStats: {
    gpa: number;
    creditsCompleted: number;
    creditsRequired: number;
    scholarshipsTracked: number;
    upcomingScholarshipDeadlines: number;
  };
}

export interface StudentProfilePayload {
  student: Student;
  academicProgress: {
    currentGpa: number;
    gpaTrend: GpaPoint[];
    creditsCompleted: number;
    creditsRequired: number;
    currentCourses: string[];
    completionPercent: number;
  };
  scholarships: Scholarship[];
  mentorship: {
    mentor: Mentor | null;
    meetings: Meeting[];
  };
}
