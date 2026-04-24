import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cooperadoService,
  type CreateCooperadoData,
} from "../../services/cooperadoService";

import { differenceInHours } from "date-fns";
export const CooperadoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [isLocked, setIsLocked] = useState(false);
  const [formData, setFormData] = useState<CreateCooperadoData>({
    ID_COOPERADO: "",
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "Masculino",
    etnia: "",
    escolaridade: "",
    cargo: "",
    tipoVinculo: "COOP",
    dataEntrada: new Date().toISOString().split("T")[0],
    status: "ATIVO",
  });

  useEffect(() => {
    if (isEdit) {
      loadCooperado();
    }
  }, [id]);

  const loadCooperado = async () => {
    try {
      const data = await cooperadoService.getById(id!);
      setFormData(data);

      // Regra de Negócio: Bloqueia campos se criado há mais de 48h
      const hoursSinceCreation = differenceInHours(
        new Date(),
        new Date(data.criadoEm),
      );
      if (hoursSinceCreation >= 48) {
        setIsLocked(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
      navigate("/cooperados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await cooperadoService.update(id!, formData);
      } else {
        await cooperadoService.create(formData);
      }
      navigate("/cooperados");
    } catch (error) {
      alert("Erro ao salvar cooperado.");
    }
  };

  if (loading) return <div className="p-8">Carregando dados...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Editar Cooperado" : "Novo Cooperado"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow rounded-lg"
      >
        {/* Campo Bloqueável após 48h */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            disabled={isLocked}
            className="mt-1 w-full p-2 border rounded disabled:bg-gray-100"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <input
            type="text"
            disabled={isLocked}
            className="mt-1 w-full p-2 border rounded disabled:bg-gray-100"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            required
          />
        </div>

        {/* Campos SEMPRE editáveis (Regra de Negócio) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cargo/Função
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded"
            value={formData.cargo}
            onChange={(e) =>
              setFormData({ ...formData, cargo: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Vínculo
          </label>
          <select
            className="mt-1 w-full p-2 border rounded"
            value={formData.tipoVinculo}
            onChange={(e) =>
              setFormData({
                ...formData,
                tipoVinculo: e.target.value as "COOP" | "RPA",
              })
            }
          >
            <option value="COOP">COOP</option>
            <option value="RPA">RPA</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/cooperados")}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};
