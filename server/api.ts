import { randomBytes, createHash, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import path from "node:path";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { careerApplications, enquiries, adminSessions, adminUsers, leadStatuses } from "../drizzle/schema";
import { careerFormSchema, enquirySchema, leadStatusSchema, loginSchema, passwordChangeSchema } from "../shared/lead-contracts";
import { getDb } from "./db";

const scrypt = (password: string, salt: Buffer, length: number) => new Promise<Buffer>((resolve, reject) => {
  scryptCallback(password, salt, length, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key as Buffer));
});
const SESSION_COOKIE = "kiran_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const SUCCESS_NOTE = "Your submission has been stored. Email acknowledgements and notifications are not configured.";
const EXCEL_FORMULA_PREFIX = /^[=+\-@\t\r]/;
let s3Client: S3Client | null = null;

function jsonError(res: Response, status: number, error: string, fieldErrors?: Record<string, string>) {
  return res.status(status).json({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) });
}
function validationErrors(issues: readonly { path: PropertyKey[]; message: string }[]) {
  const result: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    if (!result[field]) result[field] = issue.message;
  }
  return result;
}
function sameOrigin(req: Request): boolean {
  const origin = req.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    const forwardedHost = process.env.NODE_ENV === "production" ? req.get("x-forwarded-host") : undefined;
    const requestHost = (forwardedHost ?? req.get("host"))?.split(",")[0].trim().toLowerCase();
    if (!requestHost || parsed.username || parsed.password || !["http:", "https:"].includes(parsed.protocol)) return false;
    // The Preview edge may terminate HTTPS before the local API process receives the request.
    return parsed.host.toLowerCase() === requestHost && req.get("sec-fetch-site") !== "cross-site";
  } catch { return false; }
}
function csrf(req: Request, res: Response, next: NextFunction) {
  if (!sameOrigin(req)) return jsonError(res, 403, "Request origin was not accepted");
  next();
}
function parseCookie(req: Request, name: string): string | undefined {
  for (const item of (req.headers.cookie ?? "").split(";")) {
    const index = item.indexOf("=");
    if (index < 0 || item.slice(0, index).trim() !== name) continue;
    try { return decodeURIComponent(item.slice(index + 1).trim()); } catch { return undefined; }
  }
  return undefined;
}
function cookieOptions(req: Request) {
  const secure = process.env.NODE_ENV === "production" || req.get("origin")?.startsWith("https://") === true;
  const sameSite: "none" | "lax" = secure ? "none" : "lax";
  return { httpOnly: true, sameSite, secure, path: "/api/admin", maxAge: SESSION_TTL_MS };
}
function sha256(value: string) { return createHash("sha256").update(value).digest("hex"); }
function s3Configuration() {
  const { R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  if (!s3Client) s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
  return { client: s3Client, bucket: R2_BUCKET };
}

export function normalizeEmail(value: string): string { return value.trim().toLowerCase(); }
export function verifyResumeMagic(buffer: Buffer, extension: string): boolean {
  const ext = extension.toLowerCase();
  if (ext === ".pdf") return buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  if (ext === ".doc") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  if (ext === ".docx") return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && ((buffer[2] === 0x03 && buffer[3] === 0x04) || (buffer[2] === 0x05 && buffer[3] === 0x06) || (buffer[2] === 0x07 && buffer[3] === 0x08)) && buffer.includes(Buffer.from("word/document.xml"));
  return false;
}
async function makePasswordHash(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}
async function passwordMatches(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split("$");
  const usable = parts.length === 3 && parts[0] === "scrypt";
  const salt = usable ? Buffer.from(parts[1], "base64url") : Buffer.from("kiran-invalid-hash-salt");
  const expected = usable ? Buffer.from(parts[2], "base64url") : Buffer.alloc(64, 0x4a);
  const actual = await scrypt(password, salt, 64);
  return usable && expected.length === actual.length && timingSafeEqual(actual, expected);
}
function safeOriginalFileName(name: string, ext: string): string {
  const stem = path.basename(name, path.extname(name)).replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 150).trim() || "resume";
  return `${stem}${ext.toLowerCase()}`;
}
function getResumeUpload() {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_RESUME_BYTES, files: 1, fields: 8, fieldSize: 6000, parts: 9 },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowed = [".pdf", ".doc", ".docx"].includes(extension);
      if (allowed) cb(null, true);
      else cb(new Error("RESUME_TYPE"));
    },
  });
}

interface AuthenticatedRequest extends Request { adminId?: number; adminEmail?: string }
function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  void (async () => {
    const token = parseCookie(req, SESSION_COOKIE);
    if (!token || token.length < 32 || token.length > 128) return jsonError(res, 401, "Authentication required");
    try {
      const [session] = await getDb().select({ adminId: adminSessions.adminId, email: adminUsers.email })
        .from(adminSessions).innerJoin(adminUsers, eq(adminSessions.adminId, adminUsers.id))
        .where(and(eq(adminSessions.tokenHash, sha256(token)), isNull(adminSessions.revokedAt), gt(adminSessions.expiresAt, new Date())))
        .limit(1);
      if (!session) return jsonError(res, 401, "Authentication required");
      req.adminId = session.adminId; req.adminEmail = session.email; next();
    } catch { jsonError(res, 503, "Service unavailable"); }
  })();
}

const publicEnquiryLimit = rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: "Too many submissions. Try again later." } });
const publicCareerLimit = rateLimit({ windowMs: 15 * 60_000, limit: 4, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: "Too many submissions. Try again later." } });
const loginLimit = rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: "Too many sign-in attempts. Try again later." } });
const adminWriteLimit = rateLimit({ windowMs: 15 * 60_000, limit: 60, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: "Too many requests. Try again later." } });
const jsonUpload = getResumeUpload();

export function createApiRouter() {
  const router = express.Router();
  router.get("/public/form-status", (_req, res) => res.json({ ok: true, careerUploadsReady: Boolean(s3Configuration()), emailReady: false }));

  router.post("/public/enquiries", csrf, publicEnquiryLimit, async (req, res) => {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) return jsonError(res, 422, "Please correct the highlighted fields", validationErrors(parsed.error.issues));
    const input = parsed.data;
    if (input.website) return res.status(201).json({ ok: true, message: SUCCESS_NOTE });
    try {
      await getDb().insert(enquiries).values({
        name: input.name, email: input.email, mobile: input.mobile, subject: input.subject,
        message: input.message, productSlug: input.productSlug || null, consent: true, notificationStatus: "not_configured",
      });
      return res.status(201).json({ ok: true, message: SUCCESS_NOTE });
    } catch { return jsonError(res, 503, "We could not store your submission. Please try again later."); }
  });

  router.post("/public/careers", csrf, publicCareerLimit, (req, res, next) => {
    jsonUpload.single("resume")(req, res, (error: unknown) => {
      if (!error) return next();
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") return jsonError(res, 413, "Resume must be no larger than 5 MiB", { resume: "Maximum file size is 5 MiB" });
      if (error instanceof Error && error.message === "RESUME_TYPE") return jsonError(res, 422, "Resume must be a PDF, DOC or DOCX file", { resume: "Unsupported file type" });
      return jsonError(res, 400, "Invalid multipart form data");
    });
  }, async (req: Request, res: Response) => {
    const input = careerFormSchema.safeParse(req.body);
    if (!input.success) return jsonError(res, 422, "Please correct the highlighted fields", validationErrors(input.error.issues));
    if (!req.file) return jsonError(res, 422, "Resume file is required", { resume: "Choose a PDF, DOC or DOCX file" });
    if (input.data.website) return res.status(201).json({ ok: true, message: SUCCESS_NOTE });
    const extension = path.extname(req.file.originalname).toLowerCase();
    if (!verifyResumeMagic(req.file.buffer, extension)) return jsonError(res, 422, "Resume file contents do not match its extension", { resume: "Choose a valid PDF, DOC or DOCX file" });
    const storage = s3Configuration();
    if (!storage) return jsonError(res, 503, "Career uploads are temporarily unavailable because private file storage is not configured");
    const objectKey = `resumes/${randomBytes(32).toString("hex")}${extension}`;
    const mime = extension === ".pdf" ? "application/pdf" : extension === ".doc" ? "application/msword" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    try {
      await storage.client.send(new PutObjectCommand({ Bucket: storage.bucket, Key: objectKey, Body: req.file.buffer, ContentLength: req.file.size, ContentType: mime }));
      try {
        await getDb().insert(careerApplications).values({
          name: input.data.name, email: input.data.email, address: input.data.address, mobile: input.data.mobile,
          experienceArea: input.data.experienceArea, consent: true, notificationStatus: "not_configured", resumeObjectKey: objectKey,
          resumeOriginalName: safeOriginalFileName(req.file.originalname, extension), resumeMimeType: mime,
        });
      } catch {
        await storage.client.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: objectKey })).catch(() => undefined);
        return jsonError(res, 503, "We could not store your application. Please try again later.");
      }
      return res.status(201).json({ ok: true, message: SUCCESS_NOTE });
    } catch { return jsonError(res, 503, "Private resume storage is temporarily unavailable. Please try again later."); }
  });

  router.post("/admin/login", csrf, loginLimit, async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return jsonError(res, 422, "Enter valid sign-in details", validationErrors(parsed.error.issues));
    try {
      const email = normalizeEmail(parsed.data.email);
      const [user] = await getDb().select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
      const match = await passwordMatches(parsed.data.password, user?.passwordHash ?? "invalid");
      if (!user || !match) return jsonError(res, 401, "Email or password was not accepted");
      const rawToken = randomBytes(32).toString("base64url");
      await getDb().delete(adminSessions).where(and(eq(adminSessions.adminId, user.id), sql`${adminSessions.expiresAt} < ${new Date()}`));
      await getDb().insert(adminSessions).values({ adminId: user.id, tokenHash: sha256(rawToken), expiresAt: new Date(Date.now() + SESSION_TTL_MS) });
      res.cookie(SESSION_COOKIE, rawToken, cookieOptions(req));
      return res.json({ ok: true, admin: { email: user.email }, expiresIn: SESSION_TTL_MS / 1000 });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.post("/admin/logout", csrf, adminWriteLimit, requireAdmin, async (req: AuthenticatedRequest, res) => {
    const token = parseCookie(req, SESSION_COOKIE);
    try {
      if (token) await getDb().update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.tokenHash, sha256(token)));
      res.clearCookie(SESSION_COOKIE, { ...cookieOptions(req), maxAge: undefined });
      return res.json({ ok: true });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.get("/admin/session", requireAdmin, (req: AuthenticatedRequest, res) => res.json({ ok: true, authenticated: true, admin: { email: req.adminEmail } }));

  router.get("/admin/leads", requireAdmin, async (req: AuthenticatedRequest, res) => {
    const kind = req.query.kind;
    const status = req.query.status;
    const pageRaw = typeof req.query.page === "string" ? req.query.page : "1";
    const page = Number(pageRaw);
    if (kind !== "enquiry" && kind !== "career") return jsonError(res, 400, "kind must be enquiry or career");
    if (status !== undefined && (typeof status !== "string" || !leadStatuses.includes(status as typeof leadStatuses[number]))) return jsonError(res, 400, "Invalid status filter");
    if (!Number.isInteger(page) || page < 1 || page > 100_000) return jsonError(res, 400, "Invalid page number");
    const table = kind === "enquiry" ? enquiries : careerApplications;
    const filters = status ? eq(table.status, status as typeof leadStatuses[number]) : undefined;
    const where = filters ? and(filters) : undefined;
    try {
      const [rows, countRows] = await Promise.all([
        getDb().select().from(table).where(where).orderBy(desc(table.createdAt)).limit(50).offset((page - 1) * 50),
        getDb().select({ count: sql<number>`count(*)` }).from(table).where(where),
      ]);
      const count = Number(countRows[0]?.count ?? 0);
      const pages = Math.ceil(count / 50);
      const leads = kind === "career" ? (rows as Array<Record<string, unknown>>).map(({ resumeObjectKey: _key, ...row }) => row) : rows;
      return res.json({ ok: true, kind, leads, pagination: { page, pageSize: 50, total: count, pages, totalPages: pages } });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.get("/admin/leads/:kind/:id", requireAdmin, async (req, res) => {
    const kind = req.params.kind;
    const id = Number(req.params.id);
    if ((kind !== "enquiry" && kind !== "career") || !Number.isSafeInteger(id) || id < 1) return jsonError(res, 400, "Invalid lead reference");
    try {
      if (kind === "enquiry") {
        const [lead] = await getDb().select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
        return lead ? res.json({ ok: true, kind, lead }) : jsonError(res, 404, "Lead not found");
      }
      const [lead] = await getDb().select().from(careerApplications).where(eq(careerApplications.id, id)).limit(1);
      if (!lead) return jsonError(res, 404, "Lead not found");
      const { resumeObjectKey: _key, ...safeLead } = lead;
      return res.json({ ok: true, kind, lead: safeLead });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.patch("/admin/leads/:kind/:id/status", csrf, adminWriteLimit, requireAdmin, async (req, res) => {
    const kind = req.params.kind;
    const id = Number(req.params.id);
    if ((kind !== "enquiry" && kind !== "career") || !Number.isSafeInteger(id) || id < 1) return jsonError(res, 400, "Invalid lead reference");
    const parsed = leadStatusSchema.safeParse(req.body);
    if (!parsed.success) return jsonError(res, 422, "Choose a valid lead status", validationErrors(parsed.error.issues));
    try {
      const table = kind === "enquiry" ? enquiries : careerApplications;
      const [existing] = await getDb().select({ id: table.id }).from(table).where(eq(table.id, id)).limit(1);
      if (!existing) return jsonError(res, 404, "Lead not found");
      const result = await getDb().update(table).set({ status: parsed.data.status }).where(eq(table.id, id));
      void result;
      return res.json({ ok: true, status: parsed.data.status });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.get("/admin/export.csv", requireAdmin, async (req, res) => {
    const status = req.query.status;
    if (status !== undefined && (typeof status !== "string" || !leadStatuses.includes(status as typeof leadStatuses[number]))) return jsonError(res, 400, "Invalid status filter");
    const escape = (value: unknown) => {
      let text = value instanceof Date ? value.toISOString() : value === null || value === undefined ? "" : String(value);
      if (EXCEL_FORMULA_PREFIX.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    try {
      const whereE = status ? eq(enquiries.status, status as typeof leadStatuses[number]) : undefined;
      const whereC = status ? eq(careerApplications.status, status as typeof leadStatuses[number]) : undefined;
      const [es, cs] = await Promise.all([
        getDb().select().from(enquiries).where(whereE).orderBy(desc(enquiries.createdAt)).limit(5000),
        getDb().select().from(careerApplications).where(whereC).orderBy(desc(careerApplications.createdAt)).limit(5000),
      ]);
      const headers = ["kind", "id", "createdAt", "status", "notificationStatus", "name", "email", "mobile", "subject", "message", "productSlug", "address", "experienceArea", "resumeOriginalName"];
      const lines = [headers.map(escape).join(",")];
      for (const row of es) lines.push(["enquiry", row.id, row.createdAt, row.status, row.notificationStatus, row.name, row.email, row.mobile, row.subject, row.message, row.productSlug, "", "", ""].map(escape).join(","));
      for (const row of cs) lines.push(["career", row.id, row.createdAt, row.status, row.notificationStatus, row.name, row.email, row.mobile, "", "", "", row.address, row.experienceArea, row.resumeOriginalName].map(escape).join(","));
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="kiran-leads.csv"');
      res.setHeader("Cache-Control", "no-store");
      return res.send(`\uFEFF${lines.join("\r\n")}\r\n`);
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });

  router.get("/admin/careers/:id/resume", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return jsonError(res, 400, "Invalid application reference");
    const storage = s3Configuration();
    if (!storage) return jsonError(res, 503, "Private file storage is not configured");
    try {
      const [application] = await getDb().select({ key: careerApplications.resumeObjectKey, filename: careerApplications.resumeOriginalName }).from(careerApplications).where(eq(careerApplications.id, id)).limit(1);
      if (!application) return jsonError(res, 404, "Application not found");
      const filename = application.filename.replace(/["\\\r\n]/g, "_");
      const url = await getSignedUrl(storage.client, new (await import("@aws-sdk/client-s3")).GetObjectCommand({ Bucket: storage.bucket, Key: application.key, ResponseContentDisposition: `attachment; filename="${filename}"` }), { expiresIn: 60 });
      return res.json({ ok: true, url, expiresIn: 60 });
    } catch { return jsonError(res, 503, "Resume download is temporarily unavailable"); }
  });

  router.post("/admin/password", csrf, adminWriteLimit, requireAdmin, async (req: AuthenticatedRequest, res) => {
    const parsed = passwordChangeSchema.safeParse(req.body);
    if (!parsed.success) return jsonError(res, 422, "Choose a password of at least 12 characters with upper/lowercase letters, a number and a symbol", validationErrors(parsed.error.issues));
    try {
      const [admin] = await getDb().select().from(adminUsers).where(eq(adminUsers.id, req.adminId!)).limit(1);
      if (!admin || !await passwordMatches(parsed.data.currentPassword, admin.passwordHash)) return jsonError(res, 401, "Current password was not accepted", { currentPassword: "Check your current password" });
      const passwordHash = await makePasswordHash(parsed.data.newPassword);
      await getDb().transaction(async (tx) => {
        await tx.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, admin.id));
        await tx.delete(adminSessions).where(eq(adminSessions.adminId, admin.id));
      });
      res.clearCookie(SESSION_COOKIE, { ...cookieOptions(req), maxAge: undefined });
      return res.json({ ok: true, message: "Password updated. Sign in again with the new password." });
    } catch { return jsonError(res, 503, "Service unavailable"); }
  });
  return router;
}

export async function bootstrapAdmin(): Promise<void> {
  const emailValue = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const passwordHash = process.env.ADMIN_BOOTSTRAP_PASSWORD_HASH;
  if (!emailValue && !passwordHash) return;
  if (!emailValue || !passwordHash || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) throw new Error("Admin bootstrap configuration is incomplete");
  const parts = passwordHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt" || Buffer.from(parts[1], "base64url").length < 16 || Buffer.from(parts[2], "base64url").length !== 64) throw new Error("Admin bootstrap hash format is invalid");
  const email = normalizeEmail(emailValue);
  await getDb().transaction(async (tx) => {
    const admins = await tx.select({ id: adminUsers.id, email: adminUsers.email }).from(adminUsers).limit(2);
    if (admins.length === 0) {
      await tx.insert(adminUsers).values({ email, passwordHash });
      return;
    }
    if (admins.length !== 1 || admins[0].email !== email) throw new Error("Bootstrap administrator does not match the existing single administrator");
  });
}
