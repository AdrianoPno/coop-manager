import api from "./api";
import {
  IUnidade,
  ICreateUnidadeDTO,
  IUpdateUnidadeDTO,
} from "../types/unidade.types";

export const unidadesService = {
  /**
   * Busca todas as unidades.
   */
  getAll: async (): Promise<IUnidade[]> => {
    const { data } = await api.get("/unidades");
    return data.data;
  },

  /**
   * Busca uma unidade pelo ID.
   */
  getById: async (id: string): Promise<IUnidade> => {
    const { data } = await api.get(`/unidades/${id}`);
    return data.data;
  },

  /**
   * Cria uma nova unidade.
   */
  create: async (unidadeData: ICreateUnidadeDTO): Promise<IUnidade> => {
    const { data } = await api.post("/unidades", unidadeData);
    return data.data;
  },

  /**
   * Atualiza uma unidade existente.
   */
  update: async (
    id: string,
    unidadeData: IUpdateUnidadeDTO,
  ): Promise<IUnidade> => {
    const { data } = await api.patch(`/unidades/${id}`, unidadeData);
    return data.data;
  },
};
