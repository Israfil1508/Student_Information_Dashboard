import { readMentorDatabase } from "../repositories/mentor.repository.js";

export const mentorServiceHealth = async () => {
  const database = await readMentorDatabase();

  return {
    totalMentors: database.mentors.length,
  };
};
