import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    // Schema generation is offline; production uses the Node runtime migrator.
    url: process.env.DATABASE_URL ?? "mysql://offline:offline@localhost:3306/kiran",
  },
});
