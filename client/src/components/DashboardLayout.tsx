import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Building2, ChevronDown, FileBarChart2, LayoutDashboard, LogOut, Menu, Settings2, Tags, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const navigation = [
  { label: "Visão geral", path: "/", icon: LayoutDashboard },
  { label: "Movimentações", path: "/transactions", icon: WalletCards },
  { label: "Contas", path: "/accounts", icon: Building2 },
  { label: "Categorias", path: "/categories", icon: Tags },
  { label: "Relatórios", path: "/reports", icon: FileBarChart2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const goTo = (path: string) => {
    setLocation(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#e7e7e4] text-[#171717]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-[#303030] bg-[#111111] text-[#f1f1ed] transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[92px] items-center justify-between border-b border-[#3b3b3b] px-6">
          <button onClick={() => goTo("/")} className="text-left" aria-label="Ir para visão geral">
            <div className="font-display text-[25px] font-black leading-none tracking-[-0.06em]">FINPILOT<span className="text-[#a3a3a0]">/</span></div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-[#8e8e8b]">Controle operacional</div>
          </button>
          <button className="rounded-md p-2 text-[#8e8e8b] hover:bg-[#282828] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={18} /></button>
        </div>

        <div className="border-b border-[#3b3b3b] px-4 py-5">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#777773]">Organização ativa</div>
          <button className="flex w-full items-center justify-between border border-[#414141] bg-[#202020] px-3 py-3 text-left hover:bg-[#292929]">
            <span><span className="block text-[13px] font-semibold">Oficina Norte</span><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-[#92928d]">Operações · BR</span></span>
            <ChevronDown size={15} className="text-[#9c9c97]" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6" aria-label="Navegação principal">
          <div className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#777773]">Workspace</div>
          <div className="space-y-1">
            {navigation.map(item => {
              const active = location === item.path;
              const Icon = item.icon;
              return <button key={item.path} onClick={() => goTo(item.path)} className={`group flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-[13px] transition-colors ${active ? "border-[#f0f0ec] bg-[#2a2a2a] text-[#f6f6f2]" : "border-transparent text-[#999994] hover:bg-[#202020] hover:text-[#f1f1ed]"}`}><Icon size={16} strokeWidth={1.7} /><span>{item.label}</span>{active && <span className="ml-auto h-1.5 w-1.5 bg-[#f0f0ec]" />}</button>;
            })}
          </div>
        </nav>

        <div className="border-t border-[#3b3b3b] p-4">
          <button onClick={() => goTo("/settings")} className="mb-2 flex w-full items-center gap-3 px-3 py-3 text-[12px] text-[#999994] hover:bg-[#202020] hover:text-[#f1f1ed]"><Settings2 size={16} strokeWidth={1.7} />Configurações</button>
          {user ? <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-3 text-[12px] text-[#999994] hover:bg-[#202020] hover:text-[#f1f1ed]"><LogOut size={16} strokeWidth={1.7} />Sair da sessão</button> : <button onClick={() => startLogin()} className="flex w-full items-center gap-3 px-3 py-3 text-[12px] text-[#999994] hover:bg-[#202020] hover:text-[#f1f1ed]"><LogOut size={16} strokeWidth={1.7} />Entrar na conta</button>}
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar navegação" />}
      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#c4c4c0] bg-[#e7e7e4]/95 px-5 backdrop-blur lg:px-9">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="border border-[#aaa9a4] p-2 lg:hidden" aria-label="Abrir menu"><Menu size={18} /></button><span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a65]">Quarta-feira, 19 de agosto de 2026</span></div>
          <div className="flex items-center gap-4"><span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#6a6a65] sm:block">Dados atualizados há 4 min</span><div className="flex h-9 w-9 items-center justify-center bg-[#171717] font-display text-sm font-bold text-white">{user?.name?.slice(0, 1).toUpperCase() || "O"}</div></div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
