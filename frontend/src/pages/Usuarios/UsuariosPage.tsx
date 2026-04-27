import React from "react";
import { Button, Paper, Typography, Box } from "@mui/material";
import { UserPlus as Invite } from "lucide-react"; // Ícone mais semântico para convite
import { PageContainer } from "../../components/layout/PageContainer";

const UsuariosPage: React.FC = () => {
  const handleInvite = () => {
    console.log("Abrir modal de convite de usuário");
  };

  return (
    <PageContainer
      title="Controle de Acessos"
      subtitle="Gerencie usuários, permissões e níveis de visualização do sistema."
      action={
        <Button
          variant="contained"
          startIcon={<Invite size={20} />}
          onClick={handleInvite}
        >
          Convidar Usuário
        </Button>
      }
    >
      <Paper
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: "divider",
          bgcolor: "transparent",
          boxShadow: "none",
        }}
      >
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 700 }}
          >
            Módulo de Usuários
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ maxWidth: 400 }}
          >
            Em breve você poderá gerenciar quem tem acesso à plataforma e
            definir papéis como Administrador, Operador ou Visualizador.
          </Typography>
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default UsuariosPage;
