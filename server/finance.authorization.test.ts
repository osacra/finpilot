import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function unauthenticatedContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("finance authorization", () => {
  it("rejects organization and transaction reads without an authenticated session", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.workspace.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.transactions.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
