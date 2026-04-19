import { afterAll, beforeAll, beforeEach, describe } from "vitest";
import type { Server } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  closeDatabaseConnection,
  initializeDatabase,
  writeDatabase,
} from "../src/config/db.js";
import { buildSeedDatabase } from "../src/seedData.js";
import { registerEnrollmentTransitionApiTests } from "./integration/scenarios/enrollment-transition.scenario.js";
import { registerHealthApiTests } from "./integration/scenarios/health.scenario.js";
import { registerStudentLifecycleApiTests } from "./integration/scenarios/student-lifecycle.scenario.js";

describe("API integration", () => {
  let mongoServer: MongoMemoryServer;
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URL = mongoServer.getUri();
    process.env.MONGODB_DB_NAME = "scholarship_management_test";
    process.env.MONGODB_COLLECTION = "app_state";

    await initializeDatabase();

    const { app } = await import("../src/app.js");
    server = app.listen(0);

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Failed to allocate an ephemeral test port");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(async () => {
    await writeDatabase(buildSeedDatabase());
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await closeDatabaseConnection();
    await mongoServer.stop();
    delete process.env.MONGODB_URL;
    delete process.env.MONGODB_DB_NAME;
    delete process.env.MONGODB_COLLECTION;
  });

  registerHealthApiTests(() => baseUrl);
  registerStudentLifecycleApiTests(() => baseUrl);
  registerEnrollmentTransitionApiTests(() => baseUrl);
});
