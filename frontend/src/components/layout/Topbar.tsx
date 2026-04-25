import React from "react";
import { useAuthStore } from "../../store/useAuthStore"; // Ajustado o caminho relativo
import { LogOut, UserCircle, ChevronRight, Landmark } from "lucide-react";
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
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
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
        {/* Unidade: Aparece para ADMIN (fixo) ou SUPER (contexto atual) */}
        {user && (user as any).unidadeNome && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 hidden sm:flex">
            <Landmark className="h-4 w-4 text-blue-500" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">
                {user.role === "SUPER" ? "Visão Global" : "Unidade"}
              </div>
              <div className="text-sm font-bold text-slate-700">
                {user && (user as any).unidadeNome}
              </div>
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-gray-200 hidden sm:block" />

        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-gray-400" />
          <div className="flex flex-col">
            <span className="leading-none">
              {user?.nome || (user as any)?.name || "Usuário"}
            </span>
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
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
