import "dotenv/config";
import { initializeDatabase } from "./config/db.js";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4000);

export const startServer = async (): Promise<void> => {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

const runningInTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

if (!runningInTest) {
  void startServer().catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
}
