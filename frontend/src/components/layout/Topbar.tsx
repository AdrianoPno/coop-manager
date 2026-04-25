import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, UserCircle, ChevronRight } from "lucide-react";
import { useLocation, Link, NavLink } from "react-router-dom";

// Função para capitalizar a primeira letra
const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const Topbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  // Gera breadcrumbs a partir da URL. Ex: /cooperados/novo -> ['Cooperados', 'Novo']
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center text-sm text-gray-500"
        aria-label="Breadcrumb"
      >
        <NavLink to="/dashboard" className="hover:text-gray-700">
          Dashboard
        </NavLink>
        {pathnames.map((name, index) => {
          // Ignora 'dashboard' pois já é o link inicial
          if (name.toLowerCase() === "dashboard") return null;

          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={name}>
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-gray-800">
                  {capitalize(name)}
                </span>
              ) : (
                <NavLink to={routeTo} className="hover:text-gray-700">
                  {capitalize(name)}
                </NavLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* User menu */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-gray-500" />
          {user?.nome || "Usuário"}
        </span>
        <button
          onClick={logout}
          className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 mr-1" />
          Sair
        </button>
      </div>
    </header>
  );
};

export default Topbar;
