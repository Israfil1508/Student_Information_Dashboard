import type { Database } from "../types.js";

export type DatabaseDocument = Database & {
  _id: string;
};