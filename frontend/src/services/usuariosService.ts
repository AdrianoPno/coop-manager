import api from "./api";
import { IUser, ICreateUserDTO, IUpdateUserDTO } from "../types/usuario.types";

export const usuariosService = {
  /**
   * Busca todos os usuários, respeitando o escopo do usuário logado (SUPER ou ADMIN).
   */
  getAll: async (): Promise<IUser[]> => {
    const { data } = await api.get("/users");
    return data.data;
  },

  /**
   * Busca um usuário pelo seu ID.
   */
  getById: async (id: string): Promise<IUser> => {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },

  /**
   * Cria (convida) um novo usuário no sistema.
   */
  create: async (userData: ICreateUserDTO): Promise<IUser> => {
    const { data } = await api.post("/users", userData);
    return data.data;
  },

  /**
   * Atualiza um usuário existente.
   */
  update: async (id: string, userData: IUpdateUserDTO): Promise<IUser> => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data.data;
  },
};
