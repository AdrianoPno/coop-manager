import React, { useEffect, useState } from "react";
import type { ICooperado } from "../../types/cooperado";
import { cooperadoService } from "../../services/cooperadoService";
import { useNavigate } from "react-router-dom";

export const CooperadosList: React.FC = () => {
  const [cooperados, setCooperados] = useState<ICooperado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Resolvido: Débito de estado
  const navigate = useNavigate();

  useEffect(() => {
    loadCooperados();
  }, []);

  const loadCooperados = async () => {
    try {
      const data = await cooperadoService.getAll();
      setCooperados(data);
    } catch (error) {
      console.error("Erro ao carregar cooperados", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoização da busca (Case Insensitive)
  const filteredCooperados = cooperados.filter(
    (coop) =>
      coop.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.cpf.includes(searchTerm),
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando cooperados...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cooperados</h1>
        <button
          onClick={() => navigate("/cooperados/novo")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Novo Cooperado
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-left text-xs uppercase font-bold tracking-wider">
              <th className="px-5 py-4">Nome</th>
              <th className="px-5 py-4">CPF</th>
              <th className="px-5 py-4">Vínculo</th>
              <th className="px-5 py-4">Função</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCooperados.length > 0 ? (
              filteredCooperados.map((coop) => (
                <tr
                  key={coop.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-900">
                    {coop.nome}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {coop.cpf}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        coop.tipoVinculo === "COOP"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {coop.tipoVinculo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {coop.cargo}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        coop.status === "ATIVO"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coop.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-center">
                    <button
                      onClick={() => navigate(`/cooperados/editar/${coop.id}`)}
                      className="text-blue-600 hover:text-blue-900 font-bold"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500 italic"
                >
                  Nenhum cooperado encontrado para "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
