import React from "react";
import { useAuthStore } from "../../store/useAuthStore"; // Ajustado o caminho relativo
import {
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  ChevronRight,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Breadcrumbs,
  IconButton,
} from "@mui/material";
import { useLocation, NavLink } from "react-router-dom";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const Topbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<ChevronRight fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography
            component={NavLink}
            to="/dashboard"
            variant="body2"
            sx={{ textDecoration: "none", color: "text.secondary" }}
          >
            Dashboard
          </Typography>
          {pathnames.map((name, index) => {
            if (name.toLowerCase() === "dashboard") return null;
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <Typography key={name} variant="body2" color="text.primary">
                {capitalize(name)}
              </Typography>
            ) : (
              <Typography
                key={name}
                component={NavLink}
                to={routeTo}
                variant="body2"
                sx={{ textDecoration: "none", color: "text.secondary" }}
              >
                {capitalize(name)}
              </Typography>
            );
          })}
        </Breadcrumbs>

        {/* User & Context Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user?.unidadeNome && (
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                bgcolor: "grey.100",
                borderRadius: 2,
              }}
            >
              <AccountBalanceIcon
                sx={{ fontSize: 20, color: "primary.main" }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {user.role === "SUPER" ? "Visão Global" : "Unidade"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                  {user.unidadeNome}
                </Typography>
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AccountCircleIcon sx={{ fontSize: 36, color: "grey.400" }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {user?.nome || "Usuário"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={logout}
            title="Sair"
            sx={{
              "&:hover": { bgcolor: "error.lighter", color: "error.main" },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
