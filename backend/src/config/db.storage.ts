import { buildSeedDatabase } from "../seedData.js";
import type { Database } from "../types.js";
import { PRIMARY_DOCUMENT_ID } from "./db.constants.js";
import { getDatabase } from "./db.connection.js";
import { resolveMongoCollectionName } from "./db.settings.js";
import type { DatabaseDocument } from "./db.types.js";

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