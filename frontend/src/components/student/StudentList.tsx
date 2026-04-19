import type { StudentDirectoryRecord } from "../../types/student.types";
import StudentCard from "./StudentCard";

interface StudentListProps {
  students: StudentDirectoryRecord[];
  onSelect?: (studentId: string) => void;
  emptyMessage?: string;
}

function StudentList({ students, onSelect, emptyMessage = "No students found." }: StudentListProps) {
  if (!students.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="student-list">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default StudentList;
