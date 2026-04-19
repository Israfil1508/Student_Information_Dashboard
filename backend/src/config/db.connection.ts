import { MongoClient, type Db } from "mongodb";
import type { MongoMemoryServer } from "mongodb-memory-server";
import {
  resolveMongoDatabaseName,
  resolveMongoUri,
  resolveServerSelectionTimeoutMs,
} from "./db.settings.js";
import { getErrorMessage, isSrvLookupError, toSafeMongoUri } from "./db.utils.js";

let mongoClient: MongoClient | null = null;
let mongoDatabase: Db | null = null;
let inMemoryServer: MongoMemoryServer | null = null;

const connectMongoClient = async (uri: string): Promise<MongoClient> => {
  const client = new MongoClient(uri, {
    // Keep startup responsive while allowing enough time for Atlas TLS/DNS resolution.
    serverSelectionTimeoutMS: resolveServerSelectionTimeoutMs(),
  });
  await client.connect();
  return client;
};

export const getClient = async (): Promise<MongoClient> => {
  if (mongoClient) {
    return mongoClient;
  }

  const configuredUri = resolveMongoUri();
  const safeConfiguredUri = toSafeMongoUri(configuredUri);

  try {
    mongoClient = await connectMongoClient(configuredUri);
    return mongoClient;
  } catch (primaryError) {
    if (process.env.NODE_ENV === "production") {
      throw primaryError;
    }

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      inMemoryServer = await MongoMemoryServer.create();
      mongoClient = await connectMongoClient(inMemoryServer.getUri());
      const errorMessage = getErrorMessage(primaryError);
      const srvHint = isSrvLookupError(configuredUri, primaryError)
        ? "Hint: your network may be blocking DNS SRV lookups for mongodb+srv URIs. Use Atlas standard mongodb:// URI or allow SRV DNS lookups."
        : undefined;

      console.warn(
        `MongoDB connection failed for ${safeConfiguredUri}. Falling back to in-memory MongoDB for local development. Reason: ${errorMessage}${srvHint ? ` ${srvHint}` : ""}`,
      );
      return mongoClient;
    } catch {
      throw primaryError;
    }
  }
};

export const getDatabase = async (): Promise<Db> => {
  if (mongoDatabase) {
    return mongoDatabase;
  }

  const client = await getClient();
  mongoDatabase = client.db(resolveMongoDatabaseName());

  return mongoDatabase;
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
  mongoDatabase = null;

  if (inMemoryServer) {
    await inMemoryServer.stop();
    inMemoryServer = null;
  }
};