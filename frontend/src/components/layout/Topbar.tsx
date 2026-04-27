import React from "react";
import { useAuthStore } from "../../store/useAuthStore"; // Ajustado o caminho relativo
import {
  LogOut as Logout,
  UserCircle as AccountCircle,
  ChevronRight,
  Building2 as AccountBalance,
} from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const Topbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center text-sm text-gray-500"
        aria-label="Breadcrumb"
      >
        <NavLink
          to="/dashboard"
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </NavLink>
        {pathnames.map((name, index) => {
          if (name.toLowerCase() === "dashboard") return null;
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={name}>
              <ChevronRight size={18} className="mx-1" />
              {isLast ? (
                <span className="font-medium text-gray-800">
                  {capitalize(name)}
                </span>
              ) : (
                <NavLink
                  to={routeTo}
                  className="hover:text-blue-600 transition-colors"
                >
                  {capitalize(name)}
                </NavLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* User & Context Menu */}
      <div className="flex items-center gap-6">
        {user?.unidadeNome && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 hidden sm:flex">
            <AccountBalance size={18} className="text-blue-600" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">
                {user.role === "SUPER" ? "Visão Global" : "Unidade"}
              </div>
              <div className="text-sm font-bold text-slate-700">
                {user.unidadeNome}
              </div>
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-gray-200 hidden sm:block" />

        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <AccountCircle size={28} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="leading-none">{user?.nome || "Usuário"}</span>
            <span className="text-[10px] text-gray-400 font-normal">
              {user?.role}
            </span>
          </div>
        </span>

        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
          title="Sair"
        >
          <Logout size={22} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
