import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronRight, Download, MoreHorizontal, Plus, RefreshCw, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const movementRows = [
  { label: "Fornecedor — aço e insumos", category: "Matéria-prima", account: "Itaú · Operacional", date: "Hoje, 09:42", value: "− R$ 8.420,00", type: "expense" },
  { label: "Recebimento NF 0291", category: "Vendas", account: "Itaú · Operacional", date: "Ontem, 16:18", value: "+ R$ 14.860,00", type: "income" },
  { label: "Energia elétrica · julho", category: "Infraestrutura", account: "Nubank · Despesas", date: "Ontem, 10:05", value: "− R$ 1.284,70", type: "expense" },
  { label: "Contrato manutenção prensa", category: "Serviços", account: "Itaú · Operacional", date: "17 ago, 14:30", value: "− R$ 2.190,00", type: "expense" },
];

const bars = [38, 52, 42, 68, 54, 76, 61, 88, 72, 95, 68, 84];

function Metric({ label, value, detail, trend, positive = true }: { label: string; value: string; detail: string; trend: string; positive?: boolean }) {
  return <div className="border border-[#b8b8b3] bg-[#f1f1ee] p-5 shadow-[4px_4px_0_#c3c3be]">
    <div className="flex items-start justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.19em] text-[#696965]">{label}</span><span className="border border-[#c0c0bb] p-1.5 text-[#484844]"><Wallet size={14} strokeWidth={1.5} /></span></div>
    <div className="mt-6 font-display text-[30px] font-black tracking-[-0.055em] text-[#151515]">{value}</div>
    <div className="mt-4 flex items-center justify-between border-t border-[#d1d1cc] pt-3"><span className="text-[11px] text-[#656560]">{detail}</span><span className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] ${positive ? "text-[#30302e]" : "text-[#686864]"}`}>{positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{trend}</span></div>
  </div>;
}

export default function Home() {
  const { user } = useAuth();
  const { data } = trpc.dashboard.summary.useQuery(undefined, { enabled: Boolean(user), retry: false });
  const summary = data?.summary;
  const formatCurrency = (value: string | undefined, fallback: string) => value ? Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : fallback;
  const income = formatCurrency(summary?.income, "R$ 62.840,00");
  const expense = formatCurrency(summary?.expense, "R$ 31.284,70");
  const balance = formatCurrency(summary?.balance, "R$ 184.620,40");
  const net = formatCurrency(summary?.net, "R$ 31.555,30");
  const displayBars = data?.evolution?.length ? data.evolution.slice(-12).map(row => Math.min(100, Math.max(12, Number(row.total) / 100))) : bars;
  return <DashboardLayout>
    <div className="mx-auto max-w-[1540px] px-5 py-8 lg:px-9 lg:py-10">
      <div className="flex flex-col justify-between gap-6 border-b border-[#aeadA8] pb-8 md:flex-row md:items-end"><div><div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#656560]">Painel / Visão geral</div><h1 className="font-display text-4xl font-black uppercase leading-[0.92] tracking-[-0.065em] sm:text-6xl">Bom dia,<br /><span className="text-[#777772]">{data?.organization.name || "Oficina Norte"}.</span></h1></div><div className="flex gap-2"><button className="flex items-center gap-2 border border-[#90908b] bg-[#f0f0ed] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-white"><CalendarDays size={15} />01 — 31 AGO</button><button className="flex items-center gap-2 bg-[#171717] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white hover:bg-[#30302e]"><Plus size={15} />Lançar</button></div></div>

      <section className="grid gap-5 py-7 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Saldo consolidado" value={balance} detail={`${summary?.accounts ?? 4} contas ativas`} trend="+ 8,4%" /><Metric label="Receitas do período" value={income} detail="vs. R$ 58.120 anterior" trend="+ 8,1%" /><Metric label="Despesas do período" value={expense} detail="vs. R$ 28.910 anterior" trend="+ 8,2%" positive={false} /><Metric label="Resultado líquido" value={net} detail="margem de 50,2%" trend="+ 12,4%" /></section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="border border-[#b8b8b3] bg-[#f1f1ee] p-5 shadow-[4px_4px_0_#c3c3be] sm:p-7"><div className="flex items-start justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#696965]">Fluxo de caixa</div><div className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">Movimentação acumulada</div></div><button className="border border-[#c5c5c0] p-2 text-[#5c5c57] hover:bg-white"><MoreHorizontal size={17} /></button></div><div className="mt-9 flex h-[210px] items-end gap-2 border-b border-l border-[#c6c6c1] px-3 pb-0 sm:gap-4 sm:px-5">{displayBars.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full ${index > 8 ? "bg-[#191919]" : "bg-[#969692]"} transition-all group-hover:bg-[#4e4e4a]`} style={{ height: `${height}%` }} /><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#858580]">{String(index + 1).padStart(2, "0")}</span></div>)}</div><div className="mt-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[#777772]"><span>01 AGO</span><span>Período atual · 31 dias</span><span>31 AGO</span></div></div>
        <div className="relative overflow-hidden border border-[#242424] bg-[#242424] p-6 text-[#f1f1ed] shadow-[4px_4px_0_#a7a7a2]"><div className="absolute -right-12 -top-12 h-40 w-40 border-[24px] border-[#3c3c3a]" /><div className="relative"><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9d9d98]">Leitura do período</div><div className="mt-12 font-display text-5xl font-black tracking-[-0.08em]">50,2<span className="text-2xl">%</span></div><p className="mt-3 max-w-[210px] text-sm leading-6 text-[#b8b8b3]">da receita permaneceu disponível depois das despesas operacionais da organização.</p><div className="mt-10 border-t border-[#525250] pt-4"><div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.12em]"><span className="text-[#9d9d98]">Eficiência</span><span>Acima da meta</span></div><div className="mt-3 h-2 bg-[#4b4b49]"><div className="h-full w-[72%] bg-[#dadad5]" /></div></div></div></div>
      </section>

      <section className="mt-7 border border-[#b8b8b3] bg-[#f1f1ee] shadow-[4px_4px_0_#c3c3be]"><div className="flex flex-col justify-between gap-4 border-b border-[#c8c8c3] p-5 sm:flex-row sm:items-center sm:p-7"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#696965]">Livro-caixa / Últimos registros</div><div className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">Movimentações recentes</div></div><div className="flex gap-2"><button className="flex items-center gap-2 border border-[#aaa9a4] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-white"><RefreshCw size={13} />Atualizar</button><button className="flex items-center gap-2 border border-[#aaa9a4] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-white"><Download size={13} />Exportar</button></div></div><div className="divide-y divide-[#d2d2cd]">{movementRows.map(row => <div key={row.label} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.5fr_1fr_1fr_110px_24px] sm:items-center sm:px-7"><div><div className="text-[13px] font-semibold">{row.label}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#7d7d78]">{row.category}</div></div><div className="hidden text-[11px] text-[#686863] sm:block">{row.account}</div><div className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-[#777772] sm:block">{row.date}</div><div className={`text-[13px] font-semibold sm:text-right ${row.type === "income" ? "text-[#30302e]" : "text-[#444440]"}`}>{row.type === "income" ? <ArrowUpRight size={14} className="mr-1 inline" /> : <ArrowDownRight size={14} className="mr-1 inline" />}{row.value}</div><ChevronRight size={16} className="hidden text-[#999994] sm:block" /></div>)}</div><button className="flex w-full items-center justify-center gap-2 border-t border-[#c8c8c3] py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#656560] hover:bg-white">Ver todas as movimentações <ChevronRight size={14} /></button></section>

      <footer className="flex flex-col justify-between gap-2 py-7 font-mono text-[9px] uppercase tracking-[0.18em] text-[#858580] sm:flex-row"><span>FinPilot / Ambiente de produção</span><span>Controle com clareza.</span></footer>
    </div>
  </DashboardLayout>;
}
