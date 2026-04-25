import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Building2,
  LayoutDashboard,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-white text-xl font-bold">Coop Manager</h1>
        <div className="mt-2 py-1 px-2 bg-slate-800 rounded text-[10px] text-blue-400 font-bold uppercase w-fit">
          {user?.role}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink to="/cooperados" className={navLinkClass}>
          <Users size={20} />
          <span className="font-medium">Cooperados</span>
        </NavLink>

        {/* Links restritos para ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-500 uppercase">
              Administração
            </div>
            <NavLink to="/unidades" className={navLinkClass}>
              <Building2 size={20} />
              <span className="font-medium">Unidades</span>
            </NavLink>
            <NavLink to="/usuarios" className={navLinkClass}>
              <UserCog size={20} />
              <span className="font-medium">Usuários</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};
