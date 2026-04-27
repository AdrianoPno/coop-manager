import { getFirestore } from "firebase-admin/firestore";

interface ICooperado {
  id: string;
  unidadeId: string;
  status: "ATIVO" | "INATIVO" | "SUSPENSO";
  documentacao?: {
    status: "COMPLETA" | "PENDENTE" | "VENCIDA";
    ultimaVerificacao?: FirebaseFirestore.Timestamp;
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export class DashboardService {
  private db = getFirestore();
  private cooperadosCollection = this.db.collection("cooperados");

  public async getDashboardStats(user: any) {
    if (!user) throw new Error("Usuário não autenticado.");

    // 1. Query Base com Filtro de Unidade (Multi-tenant)
    let query: FirebaseFirestore.Query = this.cooperadosCollection;
    if (user.role === "ADMIN" && user.unidadeId) {
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.get();
    const cooperados = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ICooperado,
    );

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- INDICADORES ---

    // 2. Alertas de Inatividade e Docs
    const inactivityAlerts = cooperados.filter((c) => {
      const date = c.updatedAt?.toDate ? c.updatedAt.toDate() : null;
      return date && date < thirtyDaysAgo;
    }).length;

    const documentationAlerts = cooperados.filter(
      (c) =>
        c.documentacao?.status === "PENDENTE" ||
        c.documentacao?.status === "VENCIDA",
    ).length;

    // 3. Distribuição de Status (Para Gráfico de Pizza)
    const statusDistribution = cooperados.reduce(
      (acc, c) => {
        const s = c.status || "INDEFINIDO";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 4. Índice de Conformidade (Métrica de Qualidade)
    const totalCooperados = cooperados.length;
    const docsCompletos = cooperados.filter(
      (c) => c.documentacao?.status === "COMPLETA",
    ).length;
    const complianceRate =
      totalCooperados > 0
        ? Math.round((docsCompletos / totalCooperados) * 100)
        : 0;

    // 5. Tendência: Novos membros no mês vs Total
    const newThisMonth = cooperados.filter(
      (c) => c.createdAt?.toDate && c.createdAt.toDate() >= startOfMonth,
    ).length;

    // 6. Ranking de Unidades (Apenas para SUPER)
    let topUnidades: { unidadeId: string; count: number }[] = [];
    if (user.role === "SUPER") {
      const counts = cooperados.reduce(
        (acc, c) => {
          acc[c.unidadeId] = (acc[c.unidadeId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      topUnidades = Object.entries(counts)
        .map(([unidadeId, count]) => ({ unidadeId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    return {
      overview: {
        totalCooperados,
        complianceRate, // % de cooperados com docs em dia
        newCooperadosThisMonth: newThisMonth,
      },
      alerts: {
        inactivity: inactivityAlerts,
        documentation: documentationAlerts,
        total: inactivityAlerts + documentationAlerts,
      },
      charts: {
        statusDistribution, // Ex: { ATIVO: 50, INATIVO: 10 }
      },
      superAdminData: user.role === "SUPER" ? { topUnidades } : null,
      lastUpdate: now.toISOString(),
    };
  }
}
