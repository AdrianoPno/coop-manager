import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Building2,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Box, Typography } from "@mui/material";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Itens comuns (Dashboard e Cooperados)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Cooperados", path: "/cooperados", icon: Users },
  ];

  // Itens restritos: Unidades e Usuários (Apenas para SUPER)
  const superAdminItems = [
    { name: "Unidades", path: "/unidades", icon: Building2 },
    { name: "Usuários", path: "/usuarios", icon: UserCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Garantindo que a comparação ignore espaços ou cases diferentes
  const isSuper = user?.role?.trim().toUpperCase() === "SUPER";

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full">
      {/* Brand / Logo */}
      <div className="p-6">
        <h1 className="text-white text-xl font-bold tracking-tight">
          Coop Manager
        </h1>

        {/* Badge de Identificação de Nível */}
        <Box
          sx={{
            display: "inline-block",
            bgcolor: isSuper
              ? "rgba(59, 130, 246, 0.2)"
              : "rgba(148, 163, 184, 0.1)",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            mt: 1,
            border: "1px solid",
            borderColor: isSuper ? "blue.500" : "slate.700",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isSuper ? "#60a5fa" : "#94a3b8",
              fontWeight: 800,
              fontSize: "0.65rem",
              textTransform: "uppercase",
            }}
          >
            {user?.role || "Visitante"}
          </Typography>
        </Box>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {/* Renderiza itens gerais */}
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}

        {/* Seção Administrativa: Protegida pela role SUPER */}
        {isSuper && (
          <>
            <div className="pt-6 pb-2 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Administração Global
            </div>
            {superAdminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors group"
        >
          <LogOut
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};
