import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IUser } from "../types/user";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "@coop-manager:auth", // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
      // Opcional: Persistir apenas o campo 'user'
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
