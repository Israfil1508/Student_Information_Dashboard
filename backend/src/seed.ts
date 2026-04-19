/* Initial Comment: Student Information Dashboard repository file. */
import "dotenv/config";
import { closeDatabaseConnection, initializeDatabase, writeDatabase } from "./config/db.js";
import { buildSeedDatabase } from "./seedData.js";

const run = async (): Promise<void> => {
  const database = buildSeedDatabase();
  await initializeDatabase();
  await writeDatabase(database);

  console.log("Seeded MongoDB database");
  console.log(`Students: ${database.students.length}`);
  console.log(`Mentors: ${database.mentors.length}`);
  console.log(`Scholarships: ${database.scholarships.length}`);
  console.log(`Meetings: ${database.meetings.length}`);

  await closeDatabaseConnection();
};

run().catch((error) => {
  console.error("Failed to seed database", error);
  process.exit(1);
});
