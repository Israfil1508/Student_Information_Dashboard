import type { Database, Mentor } from "../types.js";
import { readDatabase, writeDatabase } from "../config/db.js";

export const readMentorDatabase = (): Promise<Database> => readDatabase();

export const writeMentorDatabase = (database: Database): Promise<void> => writeDatabase(database);

export const findMentorById = (database: Database, mentorId: string): Mentor | undefined => {
  return database.mentors.find((mentor) => mentor.id === mentorId);
};
