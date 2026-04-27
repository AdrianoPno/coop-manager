import React, { useEffect, useState } from "react";
import { AlertCircle, Bell, TrendingUp, Users } from "lucide-react";
import {
  dashboardService,
  IDashboardStats,
} from "../../services/dashboardService";

// Retorna classes de cor do Tailwind com base na contagem de alertas
const getAlertColorClasses = (count: number): string => {
  if (count > 5) return "text-red-600";
  if (count > 0) return "text-amber-600";
  return "text-slate-800";
};

const DashboardPage = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      } catch (err) {
        console.error("Falha ao carregar dados do dashboard:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 p-8 rounded-xl border border-red-100">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Erro ao carregar painel</h2>
          <p className="text-center opacity-80 mb-4">
            Não foi possível buscar os dados do dashboard.
          </p>
          <div className="text-xs font-mono bg-white p-3 rounded border border-red-200">
            {error?.message || "Erro desconhecido"}
          </div>
        </div>
      </div>
    );
  }
  const totalAlerts = stats?.alerts.total ?? 0;

  interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    valueColor?: string;
  }

  const KpiCard = ({
    title,
    value,
    icon,
    valueColor = "text-slate-800",
  }: KpiCardProps) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        {icon}
      </div>
      <p className={`text-4xl font-extrabold mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
  const KpiCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-slate-300 rounded w-1/2"></div>
    </div>
  );
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-slate-500 mt-1">
          Visão geral dos indicadores e atividades da cooperativa.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              title="Cooperados Ativos"
              value={stats?.overview.totalCooperados ?? 0}
              icon={<Users className="text-slate-400" />}
            />
            <KpiCard
              title="Novos Cooperados (Mês)"
              value={stats?.overview.newCooperadosThisMonth ?? 0}
              icon={<TrendingUp className="text-slate-400" />}
            />
            <KpiCard
              title="Alertas"
              value={totalAlerts}
              icon={<Bell className="text-slate-400" />}
              valueColor={getAlertColorClasses(totalAlerts)}
            />
          </>
        )}
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Cadastros Recentes
          </h2>
          <p className="text-slate-500 mt-1">
            Últimos cooperados adicionados ao sistema.
          </p>
        </div>
        <div className="px-6 pb-6 text-center text-slate-400">
          [A tabela de cooperados recentes será implementada aqui]
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
