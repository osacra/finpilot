import { describe, expect, it } from "vitest";
import { parseCsv } from "./db";

describe("finance CSV import", () => {
  it("accepts the documented transaction columns", () => {
    const result = parseCsv("type,amount,date,description,accountid,categoryid\nincome,1250.50,2026-08-19,Recebimento NF 0291,3,4");
    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({ type: "income", amount: 1250.5, description: "Recebimento NF 0291", accountid: "3", categoryid: "4" });
  });

  it("rejects invalid amounts and transaction types", () => {
    const result = parseCsv("type,amount,date,description,accountid,categoryid\nrefund,nope,2026-08-19,Teste,3,4");
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual(["Linha 2: type deve ser income ou expense.", "Linha 2: amount inválido."]);
  });

  it("reports missing columns instead of silently importing incomplete data", () => {
    const result = parseCsv("date,description\n2026-08-19,Sem conta");
    expect(result.rows).toEqual([]);
    expect(result.errors[0]).toContain("Colunas ausentes");
  });
});
