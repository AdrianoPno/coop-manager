import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Drawer,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Plus as Add, Pencil as Edit } from "lucide-react";
import { useCooperados } from "../../hooks/useCooperados";
import { PageContainer } from "../../components/layout/PageContainer";
import { CooperadoForm } from "./components/CooperadosForm";

const CooperadosPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Hook consumindo os tipos automaticamente do TanStack Query
  const { data: cooperados, isLoading, isError, error } = useCooperados();

  const handleCreate = () => {
    setSelectedId(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedId(undefined);
  };

  // Feedback: Carregamento
  if (isLoading) {
    return (
      <PageContainer
        title="Cooperados"
        subtitle="Gestão de membros e registros da unidade"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Feedback: Erro
  if (isError) {
    return (
      <PageContainer
        title="Cooperados"
        subtitle="Gestão de membros e registros da unidade"
      >
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          Não foi possível buscar a lista de cooperados. —{" "}
          <strong>{(error as any)?.message || "Erro desconhecido"}</strong>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Cooperados"
      subtitle="Gestão de membros e registros da unidade"
      action={
        <Button
          variant="contained"
          startIcon={<Add size={20} />}
          onClick={handleCreate}
        >
          Novo Cooperado
        </Button>
      }
    >
      {/* Drawer para Cadastro/Edição */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxWidth: 500,
              p: 4,
              borderRadius: "16px 0 0 16px",
            },
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
        >
          {selectedId ? "Editar Cooperado" : "Cadastrar Novo"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Preencha os dados abaixo. Todos os campos com * são obrigatórios.
        </Typography>

        <CooperadoForm initialId={selectedId} onSuccess={handleCloseDrawer} />
      </Drawer>

      {/* Tabela de Resultados */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          elevation: 0,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="tabela de cooperados">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#f8f9fa" }}>
                  Nome / E-mail
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#f8f9fa" }}>
                  Matrícula
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#f8f9fa" }}>
                  CPF
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#f8f9fa" }}>
                  Status
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, backgroundColor: "#f8f9fa" }}
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cooperados && cooperados.length > 0 ? (
                cooperados.map((cooperado) => (
                  <TableRow hover key={cooperado.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cooperado.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cooperado.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{cooperado.matricula}</TableCell>
                    <TableCell>{cooperado.cpf}</TableCell>
                    <TableCell>
                      <Chip
                        label={cooperado.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          backgroundColor: (theme) =>
                            cooperado.status === "ATIVO"
                              ? `${theme.palette.success.light}33`
                              : `${theme.palette.warning.light}33`,
                          color: (theme) =>
                            cooperado.status === "ATIVO"
                              ? theme.palette.success.dark
                              : theme.palette.warning.dark,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(cooperado.id)}
                        size="small"
                        sx={{
                          backgroundColor: "#f0f2ff",
                          "&:hover": { backgroundColor: "#e0e4ff" },
                        }}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="text.secondary">
                      Nenhum cooperado encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </PageContainer>
  );
};

export default CooperadosPage;
