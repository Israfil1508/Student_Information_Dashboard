/* Initial Comment: Student Information Dashboard repository file. */
import { MongoClient, type Db } from "mongodb";
import { buildSeedDatabase } from "./seedData.js";
import type { Database } from "./types.js";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_MONGODB_DB_NAME = "scholarship_management";
const DEFAULT_MONGODB_COLLECTION = "app_state";
const PRIMARY_DOCUMENT_ID = "primary";

type DatabaseDocument = Database & {
  _id: string;
};

let mongoClient: MongoClient | null = null;
let mongoDatabase: Db | null = null;

export const resolveMongoUri = (): string => {
  return process.env.MONGODB_URI?.trim() || DEFAULT_MONGODB_URI;
};

export const resolveMongoDatabaseName = (): string => {
  return process.env.MONGODB_DB_NAME?.trim() || DEFAULT_MONGODB_DB_NAME;
};

export const resolveMongoCollectionName = (): string => {
  return process.env.MONGODB_COLLECTION?.trim() || DEFAULT_MONGODB_COLLECTION;
};

const getClient = async (): Promise<MongoClient> => {
  if (mongoClient) {
    return mongoClient;
  }

  mongoClient = new MongoClient(resolveMongoUri());
  await mongoClient.connect();

  return mongoClient;
};

const getDatabase = async (): Promise<Db> => {
  if (mongoDatabase) {
    return mongoDatabase;
  }

  const client = await getClient();
  mongoDatabase = client.db(resolveMongoDatabaseName());

  return mongoDatabase;
};

const getCollection = async () => {
  const database = await getDatabase();
  return database.collection<DatabaseDocument>(resolveMongoCollectionName());
};

const ensureSeedDocument = async (): Promise<void> => {
  const collection = await getCollection();
  const existing = await collection.findOne({ _id: PRIMARY_DOCUMENT_ID });

  if (!existing) {
    const seed = buildSeedDatabase();
    await collection.insertOne({ _id: PRIMARY_DOCUMENT_ID, ...seed });
  }
};

export const initializeDatabase = async (): Promise<void> => {
  await ensureSeedDocument();
};

export const readDatabase = async (): Promise<Database> => {
  await ensureSeedDocument();
  const collection = await getCollection();

  const document = await collection.findOne({ _id: PRIMARY_DOCUMENT_ID });

  if (!document) {
    throw new Error("Database seed document not found");
  }

  const { _id: _ignoredId, ...database } = document;
  return database;
};

export const writeDatabase = async (database: Database): Promise<void> => {
  await ensureSeedDocument();
  const collection = await getCollection();

  await collection.updateOne(
    { _id: PRIMARY_DOCUMENT_ID },
    { $set: database },
    { upsert: true },
  );
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
  mongoDatabase = null;
};
