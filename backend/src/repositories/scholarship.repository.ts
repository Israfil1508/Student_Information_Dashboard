import type { Database, Scholarship } from "../types.js";
import { readDatabase, writeDatabase } from "../config/db.js";

export const readScholarshipDatabase = (): Promise<Database> => readDatabase();

export const writeScholarshipDatabase = (database: Database): Promise<void> => writeDatabase(database);

export const findScholarshipById = (
  database: Database,
  scholarshipId: string,
): Scholarship | undefined => {
  return database.scholarships.find((scholarship) => scholarship.id === scholarshipId);
};
