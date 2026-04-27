import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Drawer,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
} from "@mui/material";
import { Plus as Add } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { useUnidades } from "../../hooks/useUnidades";
import { UnidadeForm } from "./components/UnidadeForm";
import { UnidadeTable } from "./components/UnidadeTable";

const UnidadesPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const { data: unidades, isLoading, isError, error } = useUnidades();

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

  return (
    <PageContainer
      title="Gestão de Unidades"
      subtitle="Gerencie as bases operacionais e centros de coleta da cooperativa."
      action={
        <Button
          variant="contained"
          startIcon={<Add size={20} />}
          onClick={handleCreate}
        >
          Nova Unidade
        </Button>
      }
    >
      {/* Drawer para Formulário */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        // Padronizado com a página de Cooperados
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxWidth: 500,
              p: 3,
            },
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
        >
          {selectedId ? "Editar Unidade" : "Cadastrar Nova Unidade"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {selectedId
            ? "Altere os dados da unidade abaixo."
            : "Preencha os dados para registrar uma nova base operacional."}
        </Typography>

        <UnidadeForm onSuccess={handleCloseDrawer} initialId={selectedId} />
      </Drawer>

      {/* Estados de Carregamento e Erro */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Erro ao carregar unidades</AlertTitle>
          {(error as any)?.message ||
            "Ocorreu um erro ao buscar os dados das unidades."}
        </Alert>
      ) : (
        /* Tabela Padronizada */
        <Paper sx={{ overflow: "hidden" }}>
          <UnidadeTable unidades={unidades || []} onEdit={handleEdit} />
        </Paper>
      )}
    </PageContainer>
  );
};

export default UnidadesPage;
