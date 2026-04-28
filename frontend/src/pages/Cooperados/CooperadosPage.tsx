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
import { Add, Edit } from "@mui/icons-material";
import { useCooperados } from "../../hooks/useCooperados";
import { ICooperado } from "../../types/cooperado.types";
import { PageContainer } from "../../components/layout/PageContainer";
import { CooperadoForm } from "./components/CooperadosForm";

const CooperadosPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // ✅ CORREÇÃO: Removida a asserção de tipo desnecessária.
  // O hook `useCooperados` já fornece a tipagem correta via TanStack Query.
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

  if (isLoading) {
    return (
      <PageContainer
        title="Cooperados"
        subtitle="Gestão de membros e registros da unidade"
      >
        <Box display="flex" justifyContent="center" alignItems="center" p={5}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer
        title="Cooperados"
        subtitle="Gestão de membros e registros da unidade"
      >
        <Alert severity="error">
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          Não foi possível buscar a lista de cooperados. —{" "}
          <strong>{error?.message || "Erro desconhecido"}</strong>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Cooperados"
      subtitle="Gestão de membros e registros da unidade"
      action={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Cooperado
        </Button>
      }
    >
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "100%", maxWidth: 500, p: 3 } }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          {selectedId ? "Editar Cooperado" : "Cadastrar Novo Cooperado"}
        </Typography>
        {/* O formulário é renderizado dentro do Drawer do MUI */}
        <CooperadoForm initialId={selectedId} onSuccess={handleCloseDrawer} />
      </Drawer>

      <Paper sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="tabela de cooperados">
            <TableHead>
              <TableRow>
                <TableCell>Nome / E-mail</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cooperados?.map((cooperado) => (
                <TableRow hover key={cooperado.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {cooperado.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cooperado.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{cooperado.matricula}</TableCell>
                  <TableCell>{cooperado.cpf}</TableCell>
                  <TableCell>
                    <Chip
                      label={cooperado.status}
                      size="small"
                      color={
                        cooperado.status === "ATIVO" ? "success" : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(cooperado.id)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </PageContainer>
  );
};

export default CooperadosPage;
