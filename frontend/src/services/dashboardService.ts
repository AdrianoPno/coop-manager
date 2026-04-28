import api from "./api";

// This interface must match the backend's `dashboard.types.ts`
export interface IDashboardStats {
  overview: {
    totalCooperados: number;
    complianceRate: number;
    newCooperadosThisMonth: number;
  };
  alerts: {
    inactivity: number;
    documentation: number;
    total: number;
  };
  charts: {
    statusDistribution: Record<string, number>;
    // Data for SUPER Admin charts
    unitDistribution: Array<{ name: string; value: number }>;
    docFunnel: Array<{ name: string; COMPLETA: number; PENDENTE: number }>;
    monthlyGrowth: Array<{ month: string; total: number }>;
  };
  lastUpdate: string;
}

export const dashboardService = {
  getStats: async (): Promise<IDashboardStats> => {
    const { data } = await api.get("/dashboard/stats");
    return data.data; // A resposta da API segue o padrão { success, data, message }
  },
};
