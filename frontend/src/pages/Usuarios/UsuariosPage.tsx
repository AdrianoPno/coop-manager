import React, { useState, useMemo } from "react";
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
import { UserPlus as InviteIcon } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { useUsuarios } from "../../hooks/useUsuarios";
import { useUnidades } from "../../hooks/useUnidades";
import { UsuarioForm } from "./components/UsuarioForm";
import { UsuarioTable } from "./components/UsuarioTable";

const UsuariosPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError,
    error,
  } = useUsuarios();

  const { data: unidades, isLoading: isLoadingUnidades } = useUnidades();

  const handleInvite = () => {
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

  // ✅ CORREÇÃO: Enriquecendo os dados para a tabela
  const enrichedUsers = useMemo(() => {
    if (!users) return [];
    if (!unidades) return users;

    const unidadesMap = new Map(unidades.map((u) => [u.id, u.nome]));

    return users.map((user) => ({
      ...user,
      unidadeNome: unidadesMap.get(user.unidadeId) || "Não vinculada",
    }));
  }, [users, unidades]);

  const isLoading = isLoadingUsers || isLoadingUnidades;

  return (
    <PageContainer
      title="Controle de Acessos"
      subtitle="Gerencie usuários, permissões e níveis de acesso ao sistema."
      action={
        <Button
          variant="contained"
          startIcon={<InviteIcon />}
          onClick={handleInvite}
        >
          Convidar Usuário
        </Button>
      }
    >
      {/* Drawer Padronizado */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
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
          {selectedId ? "Editar Usuário" : "Convidar Novo Usuário"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {selectedId
            ? "Atualize as permissões ou dados deste usuário."
            : "Preencha os dados para enviar um convite de acesso à plataforma."}
        </Typography>

        <UsuarioForm onSuccess={handleCloseDrawer} initialId={selectedId} />
      </Drawer>

      {/* Estados de Feedback */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Erro ao carregar usuários</AlertTitle>
          {(error as any)?.message || "Ocorreu um erro desconhecido."}
        </Alert>
      ) : (
        /* ✅ CORREÇÃO: Passando enrichedUsers em vez de users */
        <Paper sx={{ overflow: "hidden" }}>
          <UsuarioTable users={enrichedUsers} onEdit={handleEdit} />
        </Paper>
      )}
    </PageContainer>
  );
};

export default UsuariosPage;
