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
  };
  superAdminData: {
    topUnidades: Array<{ unidadeId: string; count: number }>;
  } | null;
  lastUpdate: string;
}

export const dashboardService = {
  getStats: async (): Promise<IDashboardStats> => {
    const { data } = await api.get("/dashboard/stats");
    return data.data; // A resposta da API segue o padrão { success, data, message }
  },
};
