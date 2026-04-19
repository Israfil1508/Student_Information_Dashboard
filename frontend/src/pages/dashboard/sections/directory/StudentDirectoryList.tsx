import type { StudentDirectoryRecord } from "../../../../types/index";
import StatusPill from "../../components/StatusPill";

type StudentDirectoryListProps = {
  studentLoading: boolean;
  studentError: string | null;
  students: StudentDirectoryRecord[];
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
};

function StudentDirectoryList({
  studentLoading,
  studentError,
  students,
  selectedStudentId,
  onSelectStudent,
}: StudentDirectoryListProps) {
  return (
    <div className="directory-list-zone" aria-label="Student results">
      {studentLoading ? (
        <p role="status" className="loading-inline">
          Loading students...
        </p>
      ) : studentError ? (
        <p role="alert" className="error-inline">
          {studentError}
        </p>
      ) : students.length === 0 ? (
        <p className="muted">No students match these filters.</p>
      ) : (
        <ul className="directory-list" aria-label="Student cards">
          {students.map((student) => {
            const isActive = student.id === selectedStudentId;
            return (
              <li key={student.id}>
                <button
                  className={`student-card ${isActive ? "is-active" : ""}`}
                  onClick={() => onSelectStudent(student.id)}
                  aria-pressed={isActive}
                >
                  <img
                    src={student.avatarUrl || "https://api.dicebear.com/9.x/thumbs/svg?seed=Student"}
                    alt={`${student.name} avatar`}
                  />
                  <div>
                    <h3>{student.name}</h3>
                    <p>{student.major}</p>
                    <p>{student.academicYear}</p>
                    <div className="row-inline">
                      <StatusPill text={student.enrollmentStatus} />
                      <span>{student.quickStats.gpa.toFixed(2)} GPA</span>
                    </div>
                    <small>
                      {student.quickStats.creditsCompleted}/{student.quickStats.creditsRequired} credits
                    </small>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StudentDirectoryList;
