import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Typography,
  Card,
  CardContent,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";
import { PageContainer } from "../../components/layout/PageContainer";
import {
  dashboardService,
  IDashboardStats,
} from "../../services/dashboardService";

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

  // Helper para definir a cor baseada no volume de alertas
  const getAlertColor = (count: number): string => {
    if (count > 5) return "error.main";
    if (count > 0) return "warning.main";
    return "primary.main";
  };

  // State: Error
  if (error) {
    return (
      <PageContainer
        title="Painel de Controle"
        subtitle="Visão geral dos indicadores e atividades da cooperativa."
      >
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Erro ao carregar painel</AlertTitle>
          Não foi possível buscar os dados do dashboard. —{" "}
          <strong>{error?.message || "Erro desconhecido"}</strong>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Painel de Controle"
      subtitle="Visão geral dos indicadores e atividades da cooperativa."
    >
      <Grid container spacing={3}>
        {isLoading ? (
          /* Skeletons seguindo o mesmo padrão dos Cards */
          [1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton
                variant="rectangular"
                height={140}
                sx={{ borderRadius: 4 }}
              />
            </Grid>
          ))
        ) : (
          <>
            {/* KPI: Cooperados Ativos */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      letterSpacing: 1,
                    }}
                  >
                    Cooperados Ativos
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    {stats?.overview.totalCooperados ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* KPI: Novos Cooperados */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      letterSpacing: 1,
                    }}
                  >
                    Novos este mês
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {stats?.overview.newCooperadosThisMonth ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* KPI: Alertas */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      letterSpacing: 1,
                    }}
                  >
                    Alertas Críticos
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: getAlertColor(stats?.alerts.total ?? 0),
                    }}
                  >
                    {stats?.alerts.total ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Área de Gráficos (Placeholder Padronizado) */}
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  minHeight: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: "divider",
                  bgcolor: "transparent",
                  boxShadow: "none",
                }}
              >
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  Gráficos de Tendência e Conformidade (Próxima Sprint)
                </Typography>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </PageContainer>
  );
};

export default DashboardPage;
