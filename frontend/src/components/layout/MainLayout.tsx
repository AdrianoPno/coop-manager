import React from "react";
import { Outlet } from "react-router-dom"; // IMPORTANTE
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";

// Remova o { children } da tipagem e da desestruturação
export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* O Topbar agora controla o cabeçalho, incluindo os breadcrumbs */}
        <Topbar />

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
