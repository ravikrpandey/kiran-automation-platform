import "dotenv/config";
import { bootstrapAdmin } from "../server/api";
import { getPool } from "../server/db";

async function main() {
  if (!process.env.DATABASE_URL || !process.env.ADMIN_BOOTSTRAP_EMAIL || !process.env.ADMIN_BOOTSTRAP_PASSWORD_HASH) {
    throw new Error("Database and administrator bootstrap settings are required.");
  }

  try {
    await bootstrapAdmin();
    process.stdout.write("Administrator bootstrap completed or verified.\n");
  } catch {
    process.stderr.write("Administrator bootstrap failed. Check the private settings and migrated demo database.\n");
    process.exitCode = 1;
  } finally {
    try {
      await getPool().end();
    } catch {
      // The pool may not have been created if DATABASE_URL is malformed.
    }
  }
}

await main();
