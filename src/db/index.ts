import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required");
  }

  return databaseUrl;
}

export function getPool() {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return globalForDb.__arenaNextJsPostgresqlPool;
}

export function getDb() {
  return drizzle(getPool());
}
