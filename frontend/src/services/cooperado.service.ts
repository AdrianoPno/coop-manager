import api from "./api";
import { ICooperado } from "../types/cooperado.types";
import { CooperadoFormData } from "../schemas/cooperado.schema";

// Interface genérica para as respostas da sua API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const cooperadoService = {
  /**
   * Lista todos os cooperados (Geralmente filtrados pela unidade no Backend)
   */
  getAll: async (): Promise<ICooperado[]> => {
    const response = await api.get<ApiResponse<ICooperado[]>>("/cooperados");
    return response.data.data;
  },

  /**
   * Busca um cooperado específico pelo ID (Necessário para a Edição)
   */
  getById: async (id: string): Promise<ICooperado> => {
    const response = await api.get<ApiResponse<ICooperado>>(
      `/cooperados/${id}`,
    );
    return response.data.data;
  },

  /**
   * Cria um novo cooperado
   */
  create: async (data: CooperadoFormData): Promise<ICooperado> => {
    const response = await api.post<ApiResponse<ICooperado>>(
      "/cooperados",
      data,
    );
    return response.data.data;
  },

  /**
   * Atualiza dados de um cooperado existente
   */
  update: async (
    id: string,
    data: Partial<CooperadoFormData>,
  ): Promise<ICooperado> => {
    const response = await api.put<ApiResponse<ICooperado>>(
      `/cooperados/${id}`,
      data,
    );
    return response.data.data;
  },

  /**
   * Remove um cooperado (Delete físico ou lógico, dependendo do seu Backend)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/cooperados/${id}`);
  },
};
