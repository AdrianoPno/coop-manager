import React from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

interface Cooperado {
  id: string;
  nome: string;
  cpf: string;
  status: string;
  unidadeId: string;
}

interface ListProps {
  data: Cooperado[];
  loading: boolean;
}

export const CooperadosList: React.FC<ListProps> = ({ data, loading }) => {
  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Carregando dados...</div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
              Nome
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
              CPF
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-slate-900">
                {item.nome}
              </td>
              <td className="px-6 py-4 text-slate-600">{item.cpf}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    item.status === "Ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="text-slate-400 hover:text-blue-600">
                  <Eye size={18} />
                </button>
                <button className="text-slate-400 hover:text-amber-600">
                  <Edit2 size={18} />
                </button>
                <button className="text-slate-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
