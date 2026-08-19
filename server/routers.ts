import { COOKIE_NAME } from "@shared/const";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { financialAccounts, financialTransactions, organizationInvitations, organizationMembers, transactionCategories } from "../drizzle/schema";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createAuditLog, getAuditLogs, getDashboardSummary, getDb, getFinancialReport, getOrCreateDefaultOrganization, getOrganizationForUser, listAccounts, listCategories, listMembers, listTransactions, parseCsv, transactionsToCsv } from "./db";

const dateInput = z.coerce.date();

async function resolveWorkspace(userId: number, organizationId?: number) {
  if (organizationId) {
    const selected = await getOrganizationForUser(userId, organizationId);
    if (selected) return selected;
  }
  return getOrCreateDefaultOrganization(userId);
}

async function requireAdmin(userId: number, organizationId: number) {
  const workspace = await getOrganizationForUser(userId, organizationId);
  if (!workspace || workspace.membership.role !== "admin") throw new Error("Admin permission required");
  return workspace;
}

const transactionInput = z.object({ organizationId: z.number(), accountId: z.number(), categoryId: z.number(), type: z.enum(["income", "expense"]), amount: z.coerce.number().positive(), transactionDate: dateInput, description: z.string().min(2).max(240) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  workspace: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const workspace = await getOrCreateDefaultOrganization(ctx.user.id, ctx.user.name);
      const [accounts, categories] = await Promise.all([listAccounts(workspace.organization.id), listCategories(workspace.organization.id)]);
      const db = await getDb();
      if (db && accounts.length === 0) await db.insert(financialAccounts).values([{ organizationId: workspace.organization.id, name: "Itaú · Operacional", type: "checking", initialBalance: "0.00", color: "graphite" }, { organizationId: workspace.organization.id, name: "Nubank · Despesas", type: "credit_card", initialBalance: "0.00", color: "steel" }]);
      if (db && categories.length === 0) await db.insert(transactionCategories).values([{ organizationId: workspace.organization.id, name: "Vendas", type: "income" }, { organizationId: workspace.organization.id, name: "Matéria-prima", type: "expense" }, { organizationId: workspace.organization.id, name: "Infraestrutura", type: "expense" }, { organizationId: workspace.organization.id, name: "Serviços", type: "both" }]);
      return { organization: workspace.organization, membership: workspace.membership };
    }),
    members: protectedProcedure.input(z.object({ organizationId: z.number().optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); return listMembers(workspace.organization.id); }),
    updateRole: protectedProcedure.input(z.object({ organizationId: z.number(), userId: z.number(), role: z.enum(["admin", "member"]) })).mutation(async ({ ctx, input }) => { await requireAdmin(ctx.user.id, input.organizationId); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const target = await db.select().from(organizationMembers).where(and(eq(organizationMembers.organizationId, input.organizationId), eq(organizationMembers.userId, input.userId))).limit(1); if (!target[0]) throw new Error("Member not found in organization"); await db.update(organizationMembers).set({ role: input.role }).where(eq(organizationMembers.id, target[0].id)); return { success: true } as const; }),
    invite: protectedProcedure.input(z.object({ organizationId: z.number(), email: z.string().email(), role: z.enum(["admin", "member"]).default("member") })).mutation(async ({ ctx, input }) => { await requireAdmin(ctx.user.id, input.organizationId); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`; await db.insert(organizationInvitations).values({ organizationId: input.organizationId, email: input.email.toLowerCase(), role: input.role, token, expiresAt: new Date(Date.now() + 7 * 86400000), invitedBy: ctx.user.id }); return { success: true } as const; }),
  }),
  accounts: router({
    list: protectedProcedure.input(z.object({ organizationId: z.number().optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); return listAccounts(workspace.organization.id); }),
    create: protectedProcedure.input(z.object({ organizationId: z.number(), name: z.string().min(2).max(140), type: z.enum(["checking", "savings", "credit_card", "cash", "investment", "other"]), initialBalance: z.coerce.number().default(0) })).mutation(async ({ ctx, input }) => { await requireAdmin(ctx.user.id, input.organizationId); const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(financialAccounts).values({ organizationId: input.organizationId, name: input.name, type: input.type, initialBalance: input.initialBalance.toFixed(2) }); return { success: true } as const; }),
  }),
  categories: router({
    list: protectedProcedure.input(z.object({ organizationId: z.number().optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); return listCategories(workspace.organization.id); }),
    create: protectedProcedure.input(z.object({ organizationId: z.number(), name: z.string().min(2).max(100), type: z.enum(["income", "expense", "both"]).default("both") })).mutation(async ({ ctx, input }) => { await requireAdmin(ctx.user.id, input.organizationId); const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(transactionCategories).values(input); return { success: true } as const; }),
  }),
  transactions: router({
    list: protectedProcedure.input(z.object({ organizationId: z.number().optional(), from: dateInput.optional(), to: dateInput.optional(), accountId: z.number().optional(), categoryId: z.number().optional(), type: z.enum(["income", "expense"]).optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); return listTransactions(workspace.organization.id, input); }),
    create: protectedProcedure.input(transactionInput).mutation(async ({ ctx, input }) => { const membership = await getOrganizationForUser(ctx.user.id, input.organizationId); if (!membership) throw new Error("Organization access denied"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const account = await db.select().from(financialAccounts).where(and(eq(financialAccounts.id, input.accountId), eq(financialAccounts.organizationId, input.organizationId))).limit(1); const category = await db.select().from(transactionCategories).where(and(eq(transactionCategories.id, input.categoryId), eq(transactionCategories.organizationId, input.organizationId))).limit(1); if (!account[0] || !category[0]) throw new Error("Account or category does not belong to organization"); const inserted = await db.insert(financialTransactions).values({ organizationId: input.organizationId, accountId: input.accountId, categoryId: input.categoryId, type: input.type, amount: input.amount.toFixed(2), transactionDate: input.transactionDate, description: input.description, createdBy: ctx.user.id, updatedBy: ctx.user.id }); const transactionId = Number((inserted as unknown as { insertId: number }).insertId); await createAuditLog({ organizationId: input.organizationId, transactionId, actorUserId: ctx.user.id, action: "created", afterData: JSON.stringify(input) }); return { success: true, transactionId } as const; }),
    update: protectedProcedure.input(z.object({ id: z.number(), ...transactionInput.shape })).mutation(async ({ ctx, input }) => { const membership = await getOrganizationForUser(ctx.user.id, input.organizationId); if (!membership) throw new Error("Organization access denied"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const existing = await db.select().from(financialTransactions).where(and(eq(financialTransactions.id, input.id), eq(financialTransactions.organizationId, input.organizationId))).limit(1); if (!existing[0]) throw new Error("Transaction not found"); await db.update(financialTransactions).set({ accountId: input.accountId, categoryId: input.categoryId, type: input.type, amount: input.amount.toFixed(2), transactionDate: input.transactionDate, description: input.description, updatedBy: ctx.user.id }).where(eq(financialTransactions.id, input.id)); await createAuditLog({ organizationId: input.organizationId, transactionId: input.id, actorUserId: ctx.user.id, action: "updated", beforeData: JSON.stringify(existing[0]), afterData: JSON.stringify(input) }); return { success: true } as const; }),
    remove: protectedProcedure.input(z.object({ organizationId: z.number(), id: z.number() })).mutation(async ({ ctx, input }) => { const membership = await getOrganizationForUser(ctx.user.id, input.organizationId); if (!membership) throw new Error("Organization access denied"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const existing = await db.select().from(financialTransactions).where(and(eq(financialTransactions.id, input.id), eq(financialTransactions.organizationId, input.organizationId))).limit(1); if (!existing[0]) throw new Error("Transaction not found"); await db.delete(financialTransactions).where(eq(financialTransactions.id, input.id)); await createAuditLog({ organizationId: input.organizationId, transactionId: input.id, actorUserId: ctx.user.id, action: "deleted", beforeData: JSON.stringify(existing[0]) }); return { success: true } as const; }),
    audit: protectedProcedure.input(z.object({ organizationId: z.number(), transactionId: z.number().optional() })).query(async ({ ctx, input }) => { const membership = await getOrganizationForUser(ctx.user.id, input.organizationId); if (!membership) throw new Error("Organization access denied"); return getAuditLogs(input.organizationId, input.transactionId); }),
    importCsv: protectedProcedure.input(z.object({ organizationId: z.number(), csv: z.string().min(1) })).mutation(async ({ ctx, input }) => { const membership = await getOrganizationForUser(ctx.user.id, input.organizationId); if (!membership) throw new Error("Organization access denied"); const parsed = parseCsv(input.csv); if (parsed.errors.length) return { success: false, imported: 0, errors: parsed.errors } as const; const db = await getDb(); if (!db) throw new Error("Database unavailable"); let imported = 0; const validationErrors: string[] = []; for (let index = 0; index < parsed.rows.length; index += 1) { const row = parsed.rows[index]; const account = await db.select().from(financialAccounts).where(and(eq(financialAccounts.id, Number(row.accountid)), eq(financialAccounts.organizationId, input.organizationId))).limit(1); const category = await db.select().from(transactionCategories).where(and(eq(transactionCategories.id, Number(row.categoryid)), eq(transactionCategories.organizationId, input.organizationId))).limit(1); if (!account[0] || !category[0]) { validationErrors.push(`Linha ${index + 2}: conta ou categoria não pertence à organização.`); continue; } const inserted = await db.insert(financialTransactions).values({ organizationId: input.organizationId, accountId: Number(row.accountid), categoryId: Number(row.categoryid), type: row.type as "income" | "expense", amount: row.amount.toFixed(2), transactionDate: new Date(row.date), description: row.description, createdBy: ctx.user.id, updatedBy: ctx.user.id }); const transactionId = Number((inserted as unknown as { insertId: number }).insertId); await createAuditLog({ organizationId: input.organizationId, transactionId, actorUserId: ctx.user.id, action: "imported", afterData: JSON.stringify(row) }); imported += 1; } return { success: validationErrors.length === 0, imported, errors: validationErrors } as const; }),
  }),
  reports: router({
    filtered: protectedProcedure.input(z.object({ organizationId: z.number().optional(), from: dateInput.optional(), to: dateInput.optional(), accountId: z.number().optional(), categoryId: z.number().optional(), type: z.enum(["income", "expense"]).optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); return getFinancialReport(workspace.organization.id, input); }),
    exportCsv: protectedProcedure.input(z.object({ organizationId: z.number().optional(), from: dateInput.optional(), to: dateInput.optional(), accountId: z.number().optional(), categoryId: z.number().optional(), type: z.enum(["income", "expense"]).optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); const rows = await listTransactions(workspace.organization.id, input); return { filename: `finpilot-${new Date().toISOString().slice(0, 10)}.csv`, csv: transactionsToCsv(rows) }; }),
  }),
  dashboard: router({
    summary: protectedProcedure.input(z.object({ organizationId: z.number().optional(), from: dateInput.optional(), to: dateInput.optional() }).optional()).query(async ({ ctx, input }) => { const workspace = await resolveWorkspace(ctx.user.id, input?.organizationId); const now = new Date(); const from = input?.from ?? new Date(now.getFullYear(), now.getMonth(), 1); const to = input?.to ?? now; return { organization: workspace.organization, membership: workspace.membership, summary: await getDashboardSummary(workspace.organization.id, from, to) }; }),
  }),
});

export type AppRouter = typeof appRouter;
