import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Grid } from "@mui/material";
import { IDashboardStats } from "../../../services/dashboardService";

const COLORS = ["#1a237e", "#3f51b5", "#7986cb", "#c5cae9", "#e8eaf6"];

interface DashboardChartsProps {
  chartsData: IDashboardStats["charts"];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  chartsData,
}) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Gráfico de Distribuição por Unidade */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Cooperados por Unidade
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartsData.unitDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartsData.unitDistribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Gráfico de Funil de Documentação */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Status da Documentação por Unidade
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartsData.docFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="COMPLETA"
                stackId="a"
                fill="#4caf50"
                name="Completa"
              />
              <Bar
                dataKey="PENDENTE"
                stackId="a"
                fill="#ff9800"
                name="Pendente"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Gráfico de Crescimento Mensal */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Novos Cooperados (Últimos 6 Meses)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartsData.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1a237e"
                strokeWidth={3}
                name="Novos Cadastros"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};
