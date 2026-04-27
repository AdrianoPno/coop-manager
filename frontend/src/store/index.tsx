import { Skeleton, Typography, Box } from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";

const UserProfileDisplay = () => {
  const { user, loading: isLoading } = useAuthStore();

  const getUnitDisplay = () => {
    if (!user) return "Não vinculada";
    if (user.role === "SUPER") return "Administração Global";
    // O `unidadeNome` agora vem populado pelo back-end e com tipo correto
    return user.unidadeNome || user.unidadeId;
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={150} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={180} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6">Bem-vindo, {user?.nome || "Usuário"}</Typography>
      <Typography variant="body2" color="text.secondary">
        {getUnitDisplay()}
      </Typography>
    </Box>
  );
};

export default UserProfileDisplay;
