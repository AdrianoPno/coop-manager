import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard as DashboardIcon,
  Users as PeopleIcon,
  Building2 as ApartmentIcon,
  UserCog as GroupIcon,
  LogOut as LogoutIcon,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Chip,
} from "@mui/material";

const SIDEBAR_WIDTH = 260;

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Itens comuns (Dashboard e Cooperados)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { name: "Cooperados", path: "/cooperados", icon: PeopleIcon },
  ];

  // Itens restritos: Unidades e Usuários (Apenas para SUPER)
  const superAdminItems = [
    { name: "Unidades", path: "/unidades", icon: ApartmentIcon },
    { name: "Usuários", path: "/usuarios", icon: GroupIcon },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Garantindo que a comparação ignore espaços ou cases diferentes
  const isSuper = user?.role?.trim().toUpperCase() === "SUPER";

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h5"
          sx={{ color: "common.white", fontWeight: 800 }}
        >
          Coop Manager
        </Typography>

        {/* Badge de Identificação de Nível */}
        <Chip
          sx={{
            mt: 1,
            height: "auto",
            "& .MuiChip-label": { py: 0.5, px: 1 },
            color: isSuper ? "primary.light" : "grey.400",
            borderColor: isSuper ? "primary.dark" : "grey.700",
            bgcolor: isSuper ? "primary.dark" : "grey.800",
          }}
          label={user?.role || "Visitante"}
          size="small"
          variant="outlined"
        />
      </Box>

      <List component="nav" sx={{ flexGrow: 1, px: 2 }}>
        {/* Renderiza itens gerais */}
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Seção Administrativa: Protegida pela role SUPER */}
        {isSuper && (
          <>
            <ListSubheader
              component="div"
              sx={{ bgcolor: "transparent", color: "grey.500", mt: 2 }}
            >
              Administração
            </ListSubheader>
            {superAdminItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>

      {/* Logout Area */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2, borderColor: "grey.800" }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: "error.light",
            "&:hover": { bgcolor: "rgba(255, 82, 82, 0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair do Sistema" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#1e293b", // Cor correspondente ao slate-800
          color: "grey.300",
          borderRight: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
