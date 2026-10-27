import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const leadStatuses = ["new", "reviewing", "contacted", "closed"] as const;
export const notificationStatuses = ["not_configured", "pending", "sent", "failed"] as const;
export const experienceAreas = ["Sales", "Production", "Editorial", "Accounts", "DTP & Designing", "HR"] as const;

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 254 }).notNull(),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ emailUnique: uniqueIndex("admin_users_email_unique").on(table.email) }));

export const adminSessions = mysqlTable("admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({ tokenUnique: uniqueIndex("admin_sessions_token_hash_unique").on(table.tokenHash), adminIndex: index("admin_sessions_admin_id_idx").on(table.adminId), expiryIndex: index("admin_sessions_expires_at_idx").on(table.expiresAt) }));

export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  mobile: varchar("mobile", { length: 24 }).notNull(),
  subject: varchar("subject", { length: 180 }).notNull(),
  message: text("message").notNull(),
  productSlug: varchar("product_slug", { length: 100 }),
  consent: boolean("consent").notNull(),
  notificationStatus: mysqlEnum("notification_status", notificationStatuses).default("not_configured").notNull(),
  status: mysqlEnum("status", leadStatuses).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ statusCreatedIdx: index("enquiries_status_created_at_idx").on(table.status, table.createdAt), emailIdx: index("enquiries_email_idx").on(table.email) }));

export const careerApplications = mysqlTable("career_applications", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  mobile: varchar("mobile", { length: 24 }).notNull(),
  experienceArea: mysqlEnum("experience_area", experienceAreas).notNull(),
  consent: boolean("consent").notNull(),
  notificationStatus: mysqlEnum("notification_status", notificationStatuses).default("not_configured").notNull(),
  resumeObjectKey: varchar("resume_object_key", { length: 100 }).notNull(),
  resumeOriginalName: varchar("resume_original_name", { length: 180 }).notNull(),
  resumeMimeType: varchar("resume_mime_type", { length: 100 }).notNull(),
  status: mysqlEnum("status", leadStatuses).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ statusCreatedIdx: index("career_apps_status_created_at_idx").on(table.status, table.createdAt), emailIdx: index("career_apps_email_idx").on(table.email) }));

export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type CareerApplication = typeof careerApplications.$inferSelect;
