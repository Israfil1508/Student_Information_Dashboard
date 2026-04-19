import type { Database, Student } from "../types.js";
import { readDatabase, writeDatabase } from "../config/db.js";

export const readStudentDatabase = (): Promise<Database> => readDatabase();

export const writeStudentDatabase = (database: Database): Promise<void> => writeDatabase(database);

export const findStudentById = (database: Database, studentId: string): Student | undefined => {
  return database.students.find((student) => student.id === studentId);
};

export const findStudentByEmail = (database: Database, email: string): Student | undefined => {
  const normalized = email.toLowerCase();
  return database.students.find((student) => student.email.toLowerCase() === normalized);
};
