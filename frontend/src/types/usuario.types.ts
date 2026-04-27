export type UserRole = "SUPER" | "ADMIN" | "USER";

export interface IUser {
  id: string;
  uid: string;
  nome: string;
  email: string;
  unidadeId: string;
  unidadeNome?: string;
  role: UserRole;
  ativo: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ICreateUserDTO {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
  unidadeId?: string;
}

export type IUpdateUserDTO = Partial<
  Omit<IUser, "id" | "uid" | "createdAt" | "unidadeNome">
>;
