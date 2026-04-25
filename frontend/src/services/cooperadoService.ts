import type { ICooperado } from "../types/cooperado.types";
import api from "./api";

// Tipos para as requisições (Data Transfer Objects no Front)
export type CreateCooperadoData = Omit<
  ICooperado,
  "id" | "criadoEm" | "atualizadoEm" | "unidadeId"
>;
export type UpdateCooperadoData = Partial<CreateCooperadoData>;

export const cooperadoService = {
  /**
   * Lista todos os cooperados da unidade do usuário logado
   */
  async getAll(): Promise<ICooperado[]> {
    const { data } = await api.get<ICooperado[]>("/cooperados");
    return data;
  },

  /**
   * Busca um cooperado específico por ID
   */
  async getById(id: string): Promise<ICooperado> {
    const { data } = await api.get<ICooperado>(`/cooperados/${id}`);
    return data;
  },

  /**
   * Cria um novo cooperado
   */
  async create(cooperado: CreateCooperadoData): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/cooperados", cooperado);
    return data;
  },

  /**
   * Atualiza os dados de um cooperado
   */
  async update(id: string, cooperado: UpdateCooperadoData): Promise<void> {
    await api.put(`/cooperados/${id}`, cooperado);
  },

  /**
   * Deleta (ou inativa) um cooperado
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/cooperados/${id}`);
  },
};
