import "../env.js";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";
import * as schema from "./schema.js";
let database;
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (!database) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
    if (process.env.VERCEL) attachDatabasePool(pool);
    database = drizzle(pool, { schema });
  }
  return database;
}
