import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">
          Bem-vindo, {user?.nome || "Usuário"}!
        </h1>
        <p className="text-slate-500">
          Unidade:{" "}
          <span className="font-medium text-blue-600">
            {user?.unidadeId || "Não vinculada"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards de Resumo Rápido */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-blue-600 border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">
            Cooperados Ativos
          </p>
          <p className="text-3xl font-bold text-slate-800">--</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-green-600 border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">
            Nova Unidade
          </p>
          <p className="text-3xl font-bold text-slate-800">{user?.role}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-orange-600 border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">
            Alertas
          </p>
          <p className="text-3xl font-bold text-slate-800">0</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-slate-400 mb-4 text-center">
          <p className="text-lg font-medium">Lista de Cooperados</p>
          <p className="text-sm">
            Os dados serão carregados assim que integrarmos o hook
            useCooperados.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Atualizar Dados
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
