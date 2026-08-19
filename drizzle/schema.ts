import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, index, unique } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ slugIdx: unique("organizations_slug_idx").on(table.slug), createdByIdx: index("organizations_created_by_idx").on(table.createdBy) }));

export const organizationMembers = mysqlTable("organization_members", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ membershipIdx: unique("organization_membership_idx").on(table.organizationId, table.userId), userIdx: index("organization_members_user_idx").on(table.userId) }));

export const organizationInvitations = mysqlTable("organization_invitations", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  token: varchar("token", { length: 96 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "revoked"]).default("pending").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  invitedBy: int("invitedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ tokenIdx: unique("organization_invitation_token_idx").on(table.token), orgEmailIdx: index("organization_invitation_org_email_idx").on(table.organizationId, table.email) }));

export const financialAccounts = mysqlTable("financial_accounts", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  name: varchar("name", { length: 140 }).notNull(),
  type: mysqlEnum("type", ["checking", "savings", "credit_card", "cash", "investment", "other"]).notNull(),
  initialBalance: decimal("initialBalance", { precision: 14, scale: 2 }).default("0.00").notNull(),
  color: varchar("color", { length: 32 }).default("slate").notNull(),
  archivedAt: timestamp("archivedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgIdx: index("financial_accounts_org_idx").on(table.organizationId) }));

export const transactionCategories = mysqlTable("transaction_categories", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["income", "expense", "both"]).default("both").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgNameIdx: unique("transaction_categories_org_name_idx").on(table.organizationId, table.name) }));

export const financialTransactions = mysqlTable("financial_transactions", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  accountId: int("accountId").notNull(),
  categoryId: int("categoryId").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  transactionDate: timestamp("transactionDate").notNull(),
  description: varchar("description", { length: 240 }).notNull(),
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgDateIdx: index("financial_transactions_org_date_idx").on(table.organizationId, table.transactionDate), accountIdx: index("financial_transactions_account_idx").on(table.accountId), categoryIdx: index("financial_transactions_category_idx").on(table.categoryId) }));

export const transactionAuditLogs = mysqlTable("transaction_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  transactionId: int("transactionId").notNull(),
  actorUserId: int("actorUserId").notNull(),
  action: mysqlEnum("action", ["created", "updated", "deleted", "imported"]).notNull(),
  beforeData: text("beforeData"),
  afterData: text("afterData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ transactionIdx: index("transaction_audit_transaction_idx").on(table.transactionId), orgIdx: index("transaction_audit_org_idx").on(table.organizationId) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
