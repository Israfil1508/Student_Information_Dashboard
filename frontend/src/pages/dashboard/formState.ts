import type { StudentProfilePayload } from "../../types/index";
import { toDateInputValue } from "../../utils/helpers";
import type { StudentFormState } from "./types";

export const emptyStudentForm = (): StudentFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  avatarUrl: "",
  academicYear: "Freshman",
  major: "",
  gpa: "0",
  enrollmentStatus: "Full-time",
  creditsCompleted: "0",
  creditsRequired: "120",
  expectedGraduation: "",
  firstGeneration: false,
  lowIncome: false,
  underrepresentedMinority: false,
  assignedMentorId: "",
});

export const mapProfileToStudentForm = (profile: StudentProfilePayload): StudentFormState => ({
  firstName: profile.student.firstName,
  lastName: profile.student.lastName,
  email: profile.student.email,
  avatarUrl: profile.student.avatarUrl ?? "",
  academicYear: profile.student.academicYear,
  major: profile.student.major,
  gpa: String(profile.student.gpa),
  enrollmentStatus: profile.student.enrollmentStatus,
  creditsCompleted: String(profile.student.creditsCompleted),
  creditsRequired: String(profile.student.creditsRequired),
  expectedGraduation: toDateInputValue(profile.student.expectedGraduation),
  firstGeneration: profile.student.demographics.firstGeneration,
  lowIncome: profile.student.demographics.lowIncome,
  underrepresentedMinority: profile.student.demographics.underrepresentedMinority,
  assignedMentorId: profile.student.assignedMentorId ?? "",
});
