import { readScholarshipDatabase } from "../repositories/scholarship.repository.js";

export const scholarshipServiceHealth = async () => {
  const database = await readScholarshipDatabase();

  return {
    totalScholarships: database.scholarships.length,
  };
};
