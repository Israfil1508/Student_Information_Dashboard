import { readMeetingDatabase } from "../repositories/meeting.repository.js";

export const meetingServiceHealth = async () => {
  const database = await readMeetingDatabase();

  return {
    totalMeetings: database.meetings.length,
  };
};
