import type { Database, Meeting } from "../types.js";
import { readDatabase, writeDatabase } from "../config/db.js";

export const readMeetingDatabase = (): Promise<Database> => readDatabase();

export const writeMeetingDatabase = (database: Database): Promise<void> => writeDatabase(database);

export const findMeetingById = (database: Database, meetingId: string): Meeting | undefined => {
  return database.meetings.find((meeting) => meeting.id === meetingId);
};
