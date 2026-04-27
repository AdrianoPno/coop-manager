import React from "react";
import { Outlet } from "react-router-dom"; // IMPORTANTE
import { Sidebar } from "./Sidebar"; // Caminho corrigido para usar o componente de layout
import { useAuthStore } from "../../store/useAuthStore";

// Remova o { children } da tipagem e da desestruturação
export const MainLayout: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">/</span>
            <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Painel
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {user?.nome}
              </p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">
                {user?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user?.nome?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* O Outlet substitui o {children} no createBrowserRouter */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
