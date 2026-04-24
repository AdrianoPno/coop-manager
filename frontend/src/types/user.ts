export type UserRole = "ADMIN" | "USER";

export interface IUser {
  uid: string; // UID vindo do Firebase Auth
  nome: string;
  email: string;
  unidadeId: string; // Essencial para filtrar dados na UI se necessário
  role: UserRole;
  ativo: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

/**
 * Interface para representar o estado simplificado
 * caso você precise de um perfil resumido em algum componente
 */
export interface IUserProfile extends Pick<
  IUser,
  "nome" | "email" | "role" | "unidadeId"
> {}
