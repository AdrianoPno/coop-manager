import React from "react";

const Unidades: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestão de Unidades
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nova Unidade
        </button>
      </div>
      <div className="border-2 border-dashed border-slate-200 rounded-lg h-64 flex items-center justify-center text-slate-400">
        Módulo de Unidades em desenvolvimento...
      </div>
    </div>
  );
};

export default Unidades;
