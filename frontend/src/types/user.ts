export type UserRole = "SUPER" | "ADMIN" | "USER"; // Adicionado SUPER

export interface IUser {
  uid: string;
  nome: string;
  email: string;
  unidadeId?: string; // Opcional: SUPER pode não ter uma unidade fixa
  unidadeNome?: string; // Adicionado: Essencial para a Topbar
  role: UserRole;
  ativo: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

/**
 * Perfil resumido para contextos de UI (Topbar, Profile Card)
 */
export interface IUserProfile extends Pick<
  IUser,
  "nome" | "email" | "role" | "unidadeId" | "unidadeNome"
> {}
