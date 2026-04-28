import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  dashboardService,
  IDashboardStats,
} from "../../services/dashboardService";
import { PageContainer } from "../../components/layout/PageContainer";

// Retorna a cor do MUI com base na contagem de alertas
const getAlertColor = (count: number): "error" | "warning" | "inherit" => {
  if (count > 5) return "error";
  if (count > 0) return "warning";
  return "inherit";
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
        // O erro já é tratado visualmente pelo componente de Alerta.
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <PageContainer
        title="Painel de Controle"
        subtitle="Visão geral dos indicadores e atividades da cooperativa."
      >
        <Alert severity="error">
          <AlertTitle>Erro ao carregar painel</AlertTitle>
          Não foi possível buscar os dados do dashboard. —{" "}
          <strong>{error?.message || "Erro desconhecido"}</strong>
        </Alert>
      </PageContainer>
    );
  }

  const totalAlerts = stats?.alerts.total ?? 0;

  interface KpiCardProps {
    title: string;
    value: string | number;
    color?: "error" | "warning" | "inherit";
  }

  const KpiCard = ({ title, value, color = "inherit" }: KpiCardProps) => (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="p" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <PageContainer
      title="Painel de Controle"
      subtitle="Visão geral dos indicadores e atividades da cooperativa."
    >
      <Grid container spacing={3}>
        {isLoading ? (
          Array.from(new Array(3)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Cooperados Ativos"
                value={stats?.overview.totalCooperados ?? 0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Novos Cooperados (Mês)"
                value={stats?.overview.newCooperadosThisMonth ?? 0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Alertas"
                value={totalAlerts}
                color={getAlertColor(totalAlerts)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </PageContainer>
  );
};

export default DashboardPage;
