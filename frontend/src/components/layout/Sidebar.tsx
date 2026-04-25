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

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Cooperados", path: "/cooperados", icon: Users },
  ];

  // Itens visíveis apenas para ADMIN
  const adminItems = [
    { name: "Unidades", path: "/unidades", icon: Building2 },
    { name: "Usuários", path: "/usuarios", icon: UserCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-white text-xl font-bold tracking-tight">
          Coop Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase">
          Sistema de Gestão
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
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

        {user?.role === "ADMIN" && (
          <>
            <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Administração
            </div>
            {adminItems.map((item) => (
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

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};
