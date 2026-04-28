import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const { setLoading, loading: isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setLoginError(
        error.message || "Falha na autenticação. Verifique suas credenciais.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default", // Usa o cinza claro do seu tema
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 4, // Herda ou reforça o padrão do tema
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Cabeçalho do Login */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}
            >
              Coop Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entre com suas credenciais para acessar
            </Typography>
          </Box>

          {/* Alerta de Erro */}
          {loginError && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 3, borderRadius: 2 }}
            >
              {loginError}
            </Alert>
          )}

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: (theme) =>
                  `0px 8px 20px ${theme.palette.primary.main}33`,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Acessar Sistema"
              )}
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          align="center"
          sx={{ mt: 4, color: "text.disabled", display: "block" }}
        >
          © 2026 Coop Manager - Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;
