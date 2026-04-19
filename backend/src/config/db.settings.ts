import {
  DEFAULT_MONGODB_COLLECTION,
  DEFAULT_MONGODB_DB_NAME,
  DEFAULT_MONGODB_URL,
  DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
  MIN_SERVER_SELECTION_TIMEOUT_MS,
} from "./db.constants.js";

export const resolveMongoUri = (): string => {
  return process.env.MONGODB_URL?.trim() || DEFAULT_MONGODB_URL;
};

export const resolveMongoDatabaseName = (): string => {
  return process.env.MONGODB_DB_NAME?.trim() || DEFAULT_MONGODB_DB_NAME;
};

export const resolveMongoCollectionName = (): string => {
  return process.env.MONGODB_COLLECTION?.trim() || DEFAULT_MONGODB_COLLECTION;
};

export const resolveServerSelectionTimeoutMs = (): number => {
  const configuredTimeout = process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS?.trim();

  if (!configuredTimeout) {
    return DEFAULT_SERVER_SELECTION_TIMEOUT_MS;
  }

  const parsedTimeout = Number(configuredTimeout);

  if (!Number.isFinite(parsedTimeout) || parsedTimeout < MIN_SERVER_SELECTION_TIMEOUT_MS) {
    return DEFAULT_SERVER_SELECTION_TIMEOUT_MS;
  }

  return Math.floor(parsedTimeout);
};