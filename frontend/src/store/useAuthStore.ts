import { create } from "zustand";

interface User {
  uid: string;
  email: string;
  nome?: string;
  role?: string;
  unidadeId?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean; // ADICIONE ESTA LINHA
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void; // ADICIONE ESTA LINHA
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true, // Começa como true para o listener do Firebase trabalhar
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, loading: false }),
}));
