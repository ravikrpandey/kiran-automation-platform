import mysql, { type Pool } from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";

let pool: Pool | null = null;
let db: MySql2Database<typeof schema> | null = null;

function mysqlOptions() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  const parsed = new URL(url);
  const localHost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  const production = process.env.NODE_ENV === "production";
  const ca = process.env.MYSQL_SSL_CA;
  if (production && !ca) throw new Error("MYSQL_SSL_CA is required in production");
  if (production && !localHost && !ca) throw new Error("Database TLS is required in production");
  if (!production && !localHost && !ca) throw new Error("For non-local development databases, configure MYSQL_SSL_CA");

  const ssl = ca ? { ca, rejectUnauthorized: true } : undefined;
  return {
    uri: url,
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 2,
    idleTimeout: 30_000,
    queueLimit: 20,
    connectTimeout: 10_000,
    enableKeepAlive: true,
    ssl,
  } as mysql.PoolOptions;
}

export function getPool(): Pool {
  if (!pool) {
    const options = mysqlOptions();
    pool = mysql.createPool(options);
    db = drizzle(pool, { schema, mode: "default" });
  }
  return pool;
}

export function getDb(): MySql2Database<typeof schema> {
  getPool();
  if (!db) throw new Error("Database unavailable");
  return db;
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export function resetDatabaseForTests() {
  pool = null;
  db = null;
}
