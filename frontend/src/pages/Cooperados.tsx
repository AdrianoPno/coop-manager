import React, { useState } from "react";
import { useCooperados } from "../hooks/useCooperados";
import Loading from "../components/common/Loading";
import { PlusCircle, AlertCircle, Edit } from "lucide-react";
import { Drawer } from "../components/common/Drawer";
import { CooperadoForm } from "./Cooperados/components/CooperadosForm";
import { ICooperado } from "../types/cooperado.types";

const Cooperados: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Altere a linha do hook para:
  const {
    data: cooperados,
    isLoading,
    isError,
    error,
  } = useCooperados() as {
    data: ICooperado[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };

  // Função para abrir o drawer para criação
  const handleCreate = () => {
    setSelectedId(undefined); // Garante que o form venha vazio
    setIsDrawerOpen(true);
  };

  // Função para abrir o drawer para edição
  const handleEdit = (id: string) => {
    setSelectedId(id); // Define o ID para o formulário buscar os dados
    setIsDrawerOpen(true);
  };

  // Função para fechar e resetar
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedId(undefined);
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 p-8 rounded-xl border border-red-100">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
        <p className="text-center opacity-80 mb-4">
          Não foi possível buscar a lista de cooperados.
        </p>
        <div className="text-xs font-mono bg-white p-3 rounded border border-red-200">
          {(error as any)?.message || "Erro desconhecido"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Cooperados
          </h1>
          <p className="text-slate-500">
            Gestão de membros e registros da unidade
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 font-bold"
        >
          <PlusCircle size={20} />
          Novo Cooperado
        </button>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedId ? "Editar Cooperado" : "Cadastrar Novo Cooperado"}
      >
        <CooperadoForm initialId={selectedId} onSuccess={handleCloseDrawer} />
      </Drawer>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Nome / E-mail
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Matrícula
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                CPF
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {cooperados && cooperados.length > 0 ? (
              cooperados.map((cooperado) => (
                <tr
                  key={cooperado.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">
                      {cooperado.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {cooperado.matricula}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {cooperado.cpf}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        cooperado.status === "ATIVO"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {cooperado.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(cooperado.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  Nenhum cooperado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cooperados;
