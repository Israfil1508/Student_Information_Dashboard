import type { EnrollmentStatus } from "../../../../types/index";
import { enrollmentStatuses } from "../../constants";

type DirectoryFiltersProps = {
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
};

function DirectoryFilters({
  search,
  onSearchChange,
  academicYear,
  onAcademicYearChange,
  enrollmentFilter,
  onEnrollmentFilterChange,
  majorFilter,
  onMajorFilterChange,
  majors,
}: DirectoryFiltersProps) {
  return (
    <div className="filter-grid">
      <label>
        Search
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Name, email, major"
        />
      </label>

      <label>
        Academic Year
        <select
          value={academicYear}
          onChange={(event) =>
            onAcademicYearChange(
              event.target.value as "All" | "Freshman" | "Sophomore" | "Junior" | "Senior",
            )
          }
        >
          <option value="All">All</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
      </label>

      <label>
        Enrollment
        <select
          value={enrollmentFilter}
          onChange={(event) => onEnrollmentFilterChange(event.target.value as "All" | EnrollmentStatus)}
        >
          <option value="All">All</option>
          {enrollmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label>
        Major
        <select value={majorFilter} onChange={(event) => onMajorFilterChange(event.target.value)}>
          <option value="">All majors</option>
          {majors.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default DirectoryFilters;
