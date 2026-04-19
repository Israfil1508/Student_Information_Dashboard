import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import type {
  EnrollmentStatus,
  Mentor,
  StudentDirectoryRecord,
  StudentProfilePayload,
} from "../../../types/index";
import type { StudentFormState } from "../types";
import DirectoryFilters from "./directory/DirectoryFilters";
import StudentDirectoryList from "./directory/StudentDirectoryList";
import StudentFormPanel from "./directory/StudentFormPanel";

type DirectoryPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  academicYear: "All" | "Freshman" | "Sophomore" | "Junior" | "Senior";
  onAcademicYearChange: (
    value: "All" | "Freshman" | "Sophomore" | "Junior" | "Senior",
  ) => void;
  enrollmentFilter: "All" | EnrollmentStatus;
  onEnrollmentFilterChange: (value: "All" | EnrollmentStatus) => void;
  majorFilter: string;
  onMajorFilterChange: (value: string) => void;
  majors: string[];
  studentLoading: boolean;
  studentError: string | null;
  students: StudentDirectoryRecord[];
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
  studentFormMode: "create" | "edit";
  onResetStudentForm: () => void;
  onEditInForm: () => void;
  profile: StudentProfilePayload | null;
  studentFormPanelRef: RefObject<HTMLDivElement | null>;
  onStudentFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  studentForm: StudentFormState;
  setStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  mentors: Mentor[];
  mentorLoading: boolean;
  mentorError: string | null;
  saving: boolean;
};

function DirectoryPanel({
  search,
  onSearchChange,
  academicYear,
  onAcademicYearChange,
  enrollmentFilter,
  onEnrollmentFilterChange,
  majorFilter,
  onMajorFilterChange,
  majors,
  studentLoading,
  studentError,
  students,
  selectedStudentId,
  onSelectStudent,
  studentFormMode,
  onResetStudentForm,
  onEditInForm,
  profile,
  studentFormPanelRef,
  onStudentFormSubmit,
  studentForm,
  setStudentForm,
  mentors,
  mentorLoading,
  mentorError,
  saving,
}: DirectoryPanelProps) {
  return (
    <aside className="panel directory-panel" aria-label="Module 1 student directory">
      <div className="panel-header">
        <h2>Module 01 - Student Directory</h2>
        <p>Search, create, update, and delete students</p>
      </div>

      <DirectoryFilters
        search={search}
        onSearchChange={onSearchChange}
        academicYear={academicYear}
        onAcademicYearChange={onAcademicYearChange}
        enrollmentFilter={enrollmentFilter}
        onEnrollmentFilterChange={onEnrollmentFilterChange}
        majorFilter={majorFilter}
        onMajorFilterChange={onMajorFilterChange}
        majors={majors}
      />

      <StudentDirectoryList
        studentLoading={studentLoading}
        studentError={studentError}
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={onSelectStudent}
      />

      <StudentFormPanel
        studentFormMode={studentFormMode}
        onResetStudentForm={onResetStudentForm}
        onEditInForm={onEditInForm}
        profile={profile}
        studentFormPanelRef={studentFormPanelRef}
        onStudentFormSubmit={onStudentFormSubmit}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        mentors={mentors}
        mentorLoading={mentorLoading}
        mentorError={mentorError}
        saving={saving}
      />
    </aside>
  );
}

export default DirectoryPanel;
