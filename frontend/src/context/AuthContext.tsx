import React, { createContext, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import { auth } from "../services/firebase"; // IMPORTANTE: Importe a instância já inicializada
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Listener oficial do Firebase para persistência de sessão
    // Usamos a instância 'auth' que já vem do initializeApp
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 1. Obtemos o Token atualizado para garantir que as chamadas à API funcionem
          const token = await firebaseUser.getIdToken();

          // Opcional: Atualizar o header do axios caso não esteja no interceptor
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // 2. Buscamos o perfil (unidadeId, role) no nosso Backend
          const { data } = await api.get("/auth/me");
          setUser(data);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
        logout();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, logout]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
