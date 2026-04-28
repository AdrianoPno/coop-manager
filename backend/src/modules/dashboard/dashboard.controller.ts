import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { DashboardService } from "./dashboard.service";
import logger from "../../config/logger";

export class DashboardController {
  private dashboardService = new DashboardService();

  async getStats(req: AuthRequest, res: Response) {
    try {
      // O service usa o req.user para determinar o escopo dos dados (global ou por unidade)
      const stats = await this.dashboardService.getDashboardStats(req.user);

      return res.status(200).json({
        success: true,
        data: stats,
        message: "Estatísticas do dashboard recuperadas com sucesso.",
      });
    } catch (error: any) {
      logger.error({ err: error }, "Erro ao buscar estatísticas do dashboard");
      return res.status(500).json({
        success: false,
        message: error.message || "Erro interno ao processar estatísticas.",
      });
    }
  }
}
