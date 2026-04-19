import { readStudentDatabase } from "../repositories/student.repository.js";

export const studentServiceHealth = async () => {
  const database = await readStudentDatabase();

  return {
    totalStudents: database.students.length,
  };
};
