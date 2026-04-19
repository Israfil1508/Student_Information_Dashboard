import {
  createStudent,
  deleteStudent,
  fetchDashboardSummary,
  fetchStudentProfile,
  fetchStudents,
  updateStudent,
} from "../api/student.api";
import type { StudentCreateInput, StudentFilters, StudentUpdateInput } from "../api/student.api";

export const getDashboardSummary = () => fetchDashboardSummary();

export const getStudents = (filters: StudentFilters) => fetchStudents(filters);

export const getStudentProfile = (studentId: string) => fetchStudentProfile(studentId);

export const addStudent = (payload: StudentCreateInput) => createStudent(payload);

export const editStudent = (studentId: string, payload: StudentUpdateInput) =>
  updateStudent(studentId, payload);

export const removeStudent = (studentId: string) => deleteStudent(studentId);
