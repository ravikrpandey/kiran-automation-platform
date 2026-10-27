import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { migrate } from "drizzle-orm/mysql2/migrator";
import fs from "node:fs";
import path from "node:path";
import { publicPlatformScript } from "./publicConfig";
import { bootstrapAdmin, createApiRouter } from "../api";
import { checkDatabase, getDb, getPool } from "../db";

const production = process.env.NODE_ENV === "production";
let productionMigrationsReady = !production;
const app = express();
if (production) app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
  frameguard: production ? { action: "sameorigin" } : false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      ...(production ? { frameAncestors: ["'self'"] } : {}),
      ...(production ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: "16kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "8kb", parameterLimit: 40 }));

// Liveness intentionally does not depend on MySQL or private storage.
app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));
app.get("/api/ready", async (_req, res) => {
  if (!productionMigrationsReady || !await checkDatabase()) return res.status(503).json({ ok: false, ready: false, error: "Service unavailable" });
  return res.status(200).json({ ok: true, ready: true });
});
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.get("/api/platform/config.js", (_req, res) => {
  res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
});
app.use("/api", createApiRouter());
app.use("/api", (_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

if (production) {
  const publicDirectory = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(publicDirectory, {
    fallthrough: true,
    index: "index.html",
    redirect: false,
    dotfiles: "deny",
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
    },
  }));
  app.use((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") return res.status(404).json({ ok: false, error: "Not found" });
    const snapshot404 = path.join(publicDirectory, "404.html");
    if (fs.existsSync(snapshot404)) return res.status(404).sendFile(snapshot404);
    return res.status(404).json({ ok: false, error: "Not found" });
  });
} else {
  // Vite runs independently on port 3000 and proxies /api to this API-only process.
  app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = typeof err === "object" && err !== null && "type" in err && err.type === "entity.too.large" ? 413 : 400;
  res.status(status).json({ ok: false, error: status === 413 ? "Request body is too large" : "Invalid request" });
});

async function migrateWithRetries() {
  const delays = [1000, 2000, 4000, 8000, 10000, 10000];
  let lastError: unknown;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      await migrate(getDb(), { migrationsFolder: path.resolve(process.cwd(), "drizzle/migrations") });
      await bootstrapAdmin();
      productionMigrationsReady = true;
      return;
    } catch (error) {
      lastError = error;
      if (attempt < delays.length) await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }
  // Deliberately omit driver error details; connection strings and server metadata are sensitive.
  console.error("Startup migration/bootstrap failed after bounded retries.");
  if (lastError) void lastError;
  process.exitCode = 1;
  server.close(() => { void getPool().end().finally(() => process.exit(1)); });
}

const rawPort = production ? process.env.PORT || process.env.API_PORT || "4000" : process.env.API_PORT || "4000";
const port = Number(rawPort);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid API_PORT");
const server = app.listen(port, "0.0.0.0", () => {
  // Do not log request contents or environment values.
  console.log(`API listening on port ${port}`);
  if (production) void migrateWithRetries();
});
server.on("error", () => { console.error("API server failed to start."); process.exit(1); });

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      if (process.env.DATABASE_URL) void getPool().end().finally(() => process.exit(0));
      else process.exit(0);
    });
  });
}
