/**
 * @openapi
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         alertsCount:
 *           type: object
 *           properties:
 *             inactivity:
 *               type: number
 *               description: "Número de cooperados sem atualização há mais de 30 dias."
 *             documentation:
 *               type: number
 *               description: "Número de cooperados com documentação pendente ou vencida."
 *             total:
 *               type: number
 *               description: "Soma total de alertas."
 *         newCooperadosThisMonth:
 *           type: number
 *           description: "Número de cooperados cadastrados no mês corrente."
 */
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
