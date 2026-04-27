import { create } from "zustand";

// Tipagem alinhada com o backend (IUser em usuario.types.ts)
export type UserRole = "SUPER" | "ADMIN" | "USER";

export interface User {
  id?: string;
  uid: string;
  nome: string;
  email: string;
  unidadeId: string;
  unidadeNome?: string; // Populado pelo backend
  role: UserRole;
  ativo: boolean;
  createdAt: string; // Datas via JSON são strings
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true, // Começa como true para o listener do Firebase trabalhar
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, loading: false }),
}));
