import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  financialAccounts,
  financialTransactions,
  InsertUser,
  organizationMembers,
  organizations,
  transactionCategories,
  transactionAuditLogs,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getOrCreateDefaultOrganization(userId: number, userName?: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const memberships = await db.select({ organization: organizations, membership: organizationMembers }).from(organizationMembers).innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id)).where(eq(organizationMembers.userId, userId)).limit(1);
  if (memberships[0]) return memberships[0];
  const baseName = userName?.trim() ? `${userName.trim()} Workspace` : "Meu workspace";
  const slug = `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${userId}`;
  const orgInsert = await db.insert(organizations).values({ name: baseName, slug, createdBy: userId });
  const organizationId = Number((orgInsert as unknown as { insertId: number }).insertId);
  await db.insert(organizationMembers).values({ organizationId, userId, role: "admin" });
  const created = await db.select({ organization: organizations, membership: organizationMembers }).from(organizationMembers).innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id)).where(and(eq(organizationMembers.userId, userId), eq(organizationMembers.organizationId, organizationId))).limit(1);
  if (!created[0]) throw new Error("Failed to create organization");
  return created[0];
}

export async function listOrganizations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ organization: organizations, membership: organizationMembers }).from(organizationMembers).innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id)).where(eq(organizationMembers.userId, userId)).orderBy(organizations.name);
}

export async function getOrganizationForUser(userId: number, organizationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({ organization: organizations, membership: organizationMembers }).from(organizationMembers).innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id)).where(and(eq(organizationMembers.userId, userId), eq(organizationMembers.organizationId, organizationId))).limit(1);
  return result[0];
}

export async function listMembers(organizationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ membership: organizationMembers, user: users }).from(organizationMembers).innerJoin(users, eq(organizationMembers.userId, users.id)).where(eq(organizationMembers.organizationId, organizationId)).orderBy(users.name);
}

export async function listAccounts(organizationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(financialAccounts).where(and(eq(financialAccounts.organizationId, organizationId), sql`${financialAccounts.archivedAt} IS NULL`)).orderBy(desc(financialAccounts.createdAt));
}

export async function listCategories(organizationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactionCategories).where(eq(transactionCategories.organizationId, organizationId)).orderBy(transactionCategories.name);
}

export async function listTransactions(organizationId: number, filters?: { from?: Date; to?: Date; accountId?: number; categoryId?: number; type?: "income" | "expense" }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(financialTransactions.organizationId, organizationId)];
  if (filters?.from) conditions.push(gte(financialTransactions.transactionDate, filters.from));
  if (filters?.to) conditions.push(lte(financialTransactions.transactionDate, filters.to));
  if (filters?.accountId) conditions.push(eq(financialTransactions.accountId, filters.accountId));
  if (filters?.categoryId) conditions.push(eq(financialTransactions.categoryId, filters.categoryId));
  if (filters?.type) conditions.push(eq(financialTransactions.type, filters.type));
  return db.select({ transaction: financialTransactions, account: financialAccounts, category: transactionCategories }).from(financialTransactions).innerJoin(financialAccounts, eq(financialTransactions.accountId, financialAccounts.id)).innerJoin(transactionCategories, eq(financialTransactions.categoryId, transactionCategories.id)).where(and(...conditions)).orderBy(desc(financialTransactions.transactionDate), desc(financialTransactions.id));
}

export async function getAuditLogs(organizationId: number, transactionId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(transactionAuditLogs.organizationId, organizationId)];
  if (transactionId) conditions.push(eq(transactionAuditLogs.transactionId, transactionId));
  return db.select({ audit: transactionAuditLogs, actor: users }).from(transactionAuditLogs).innerJoin(users, eq(transactionAuditLogs.actorUserId, users.id)).where(and(...conditions)).orderBy(desc(transactionAuditLogs.createdAt));
}

export async function getDashboardSummary(organizationId: number, from: Date, to: Date) {
  const db = await getDb();
  if (!db) return { balance: "0.00", income: "0.00", expense: "0.00", net: "0.00", accounts: 0 };
  const [accounts, totals] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(financialAccounts).where(and(eq(financialAccounts.organizationId, organizationId), sql`${financialAccounts.archivedAt} IS NULL`)),
    db.select({ type: financialTransactions.type, total: sql<string>`coalesce(sum(${financialTransactions.amount}), 0)` }).from(financialTransactions).where(and(eq(financialTransactions.organizationId, organizationId), gte(financialTransactions.transactionDate, from), lte(financialTransactions.transactionDate, to))).groupBy(financialTransactions.type),
  ]);
  const income = Number(totals.find(row => row.type === "income")?.total ?? 0);
  const expense = Number(totals.find(row => row.type === "expense")?.total ?? 0);
  const accountRows = await db.select({ initialBalance: financialAccounts.initialBalance }).from(financialAccounts).where(and(eq(financialAccounts.organizationId, organizationId), sql`${financialAccounts.archivedAt} IS NULL`));
  const balance = accountRows.reduce((sum, row) => sum + Number(row.initialBalance), 0) + income - expense;
  return { balance: balance.toFixed(2), income: income.toFixed(2), expense: expense.toFixed(2), net: (income - expense).toFixed(2), accounts: Number(accounts[0]?.count ?? 0) };
}

export async function getDailyEvolution(organizationId: number, from: Date, to: Date) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ day: sql<string>`date(${financialTransactions.transactionDate})`, type: financialTransactions.type, total: sql<string>`coalesce(sum(${financialTransactions.amount}), 0)` }).from(financialTransactions).where(and(eq(financialTransactions.organizationId, organizationId), gte(financialTransactions.transactionDate, from), lte(financialTransactions.transactionDate, to))).groupBy(sql`date(${financialTransactions.transactionDate})`, financialTransactions.type).orderBy(sql`date(${financialTransactions.transactionDate})`);
  return rows;
}

export async function getFinancialReport(organizationId: number, filters?: { from?: Date; to?: Date; accountId?: number; categoryId?: number; type?: "income" | "expense" }) {
  const rows = await listTransactions(organizationId, filters);
  const income = rows.filter(row => row.transaction.type === "income").reduce((sum, row) => sum + Number(row.transaction.amount), 0);
  const expense = rows.filter(row => row.transaction.type === "expense").reduce((sum, row) => sum + Number(row.transaction.amount), 0);
  const byCategory = new Map<string, number>();
  for (const row of rows) byCategory.set(row.category.name, (byCategory.get(row.category.name) ?? 0) + Number(row.transaction.amount) * (row.transaction.type === "expense" ? -1 : 1));
  return { totals: { income: income.toFixed(2), expense: expense.toFixed(2), net: (income - expense).toFixed(2), count: rows.length }, byCategory: Array.from(byCategory.entries()).map(([category, total]) => ({ category, total: total.toFixed(2) })), rows };
}

export async function createAuditLog(values: typeof transactionAuditLogs.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(transactionAuditLogs).values(values);
}

type CsvRow = Record<string, string> & { amount: number };

export function parseCsv(text: string): { rows: CsvRow[]; errors: string[] } {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], errors: ["O arquivo precisa conter um cabeçalho e ao menos uma linha."] };
  const headers = lines[0].split(",").map(value => value.trim().toLowerCase());
  const required = ["type", "amount", "date", "description", "accountid", "categoryid"];
  const missing = required.filter(field => !headers.includes(field));
  if (missing.length) return { rows: [], errors: [`Colunas ausentes: ${missing.join(", ")}`] };
  const errors: string[] = [];
  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(",").map(value => value.trim());
    const record = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""]));
    const amount = Number(record.amount);
    if (!["income", "expense"].includes(record.type)) errors.push(`Linha ${index + 2}: type deve ser income ou expense.`);
    if (!Number.isFinite(amount) || amount <= 0) errors.push(`Linha ${index + 2}: amount inválido.`);
    if (!record.date || !record.description) errors.push(`Linha ${index + 2}: date e description são obrigatórios.`);
    return { ...record, amount } as CsvRow;
  });
  return { rows: errors.length ? [] : rows, errors };
}

export function transactionsToCsv(rows: Awaited<ReturnType<typeof listTransactions>>) {
  const header = "date,type,amount,description,account,category";
  const body = rows.map(({ transaction, account, category }) => [transaction.transactionDate.toISOString().slice(0, 10), transaction.type, transaction.amount, transaction.description, account.name, category.name].map(value => `"${String(value).replace(/"/g, '""')}"`).join(","));
  return [header, ...body].join("\n");
}
