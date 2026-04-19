import api, { unwrap } from "./client";
import type {
  AcademicYear,
  ApiResponse,
  DashboardSummary,
  EnrollmentStatus,
  Student,
  StudentDirectoryRecord,
  StudentProfilePayload,
} from "../types/index";

export interface StudentFilters {
  search?: string;
  academicYear?: AcademicYear | "All";
  enrollmentStatus?: EnrollmentStatus | "All";
  major?: string;
}

export interface StudentUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  academicYear?: AcademicYear;
  major?: string;
  gpa?: number;
  enrollmentStatus?: EnrollmentStatus;
  creditsCompleted?: number;
  creditsRequired?: number;
  expectedGraduation?: string;
  demographics?: {
    firstGeneration: boolean;
    lowIncome: boolean;
    underrepresentedMinority: boolean;
  };
  assignedMentorId?: string | null;
  gpaHistory?: Array<{
    term: string;
    gpa: number;
    recordedAt: string;
  }>;
}

export interface StudentCreateInput extends StudentUpdateInput {
  firstName: string;
  lastName: string;
  email: string;
  academicYear: AcademicYear;
  major: string;
  gpa: number;
  enrollmentStatus: EnrollmentStatus;
  creditsCompleted: number;
  creditsRequired: number;
  expectedGraduation: string;
  demographics: {
    firstGeneration: boolean;
    lowIncome: boolean;
    underrepresentedMinority: boolean;
  };
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<ApiResponse<DashboardSummary>>("/api/dashboard/summary");
  return unwrap(response);
};

export const fetchStudents = async (
  filters: StudentFilters,
): Promise<{ total: number; students: StudentDirectoryRecord[] }> => {
  const query: Record<string, string> = {};

  if (filters.search) query.search = filters.search;
  if (filters.academicYear && filters.academicYear !== "All") {
    query.academicYear = filters.academicYear;
  }
  if (filters.enrollmentStatus && filters.enrollmentStatus !== "All") {
    query.enrollmentStatus = filters.enrollmentStatus;
  }
  if (filters.major) query.major = filters.major;

  const response = await api.get<
    ApiResponse<{ total: number; students: StudentDirectoryRecord[] }>
  >("/api/students", { params: query });

  return unwrap(response);
};

export const fetchStudentProfile = async (studentId: string): Promise<StudentProfilePayload> => {
  const response = await api.get<ApiResponse<StudentProfilePayload>>(`/api/students/${studentId}`);
  return unwrap(response);
};

export const updateStudent = async (
  studentId: string,
  payload: StudentUpdateInput,
): Promise<Student> => {
  const response = await api.put<ApiResponse<Student>>(`/api/students/${studentId}`, payload);
  return unwrap(response);
};

export const createStudent = async (payload: StudentCreateInput): Promise<Student> => {
  const response = await api.post<ApiResponse<Student>>("/api/students", payload);
  return unwrap(response);
};

export const deleteStudent = async (
  studentId: string,
): Promise<{ student: Student; removedScholarships: number; removedMeetings: number }> => {
  const response = await api.delete<
    ApiResponse<{ student: Student; removedScholarships: number; removedMeetings: number }>
  >(`/api/students/${studentId}`);
  return unwrap(response);
};
