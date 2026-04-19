import type { StudentDirectoryRecord } from "../../types/student.types";

interface StudentCardProps {
  student: StudentDirectoryRecord;
  onSelect?: (studentId: string) => void;
}

function StudentCard({ student, onSelect }: StudentCardProps) {
  return (
    <article className="student-card">
      <h3>{student.name}</h3>
      <p>{student.email}</p>
      <p>
        {student.academicYear} | {student.major}
      </p>
      <p>Status: {student.enrollmentStatus}</p>
      <p>GPA: {student.quickStats.gpa.toFixed(2)}</p>
      {onSelect ? (
        <button type="button" onClick={() => onSelect(student.id)}>
          View Profile
        </button>
      ) : null}
    </article>
  );
}

export default StudentCard;
