export type UserRole = "ADMIN" | "USER";

export interface IUser {
  id?: string; // ID do documento no Firestore (mesmo que o UID)
  uid: string; // UID vindo do Firebase Auth
  nome: string;
  email: string;
  unidadeId: string; // Chave mestra para o isolamento multi-tenant
  role: UserRole;
  ativo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Data Transfer Object para criação de usuário.
 * Usado quando um ADMIN cadastra um novo colaborador no sistema.
 */
export interface ICreateUserDTO {
  uid: string;
  nome: string;
  email: string;
  unidadeId: string;
  role: UserRole;
}

/**
 * Data Transfer Object para atualização de perfil.
 */
export type IUpdateUserDTO = Partial<Omit<IUser, "id" | "uid" | "createdAt">>;
