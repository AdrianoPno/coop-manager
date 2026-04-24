import React, { createContext, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const auth = getAuth();

    // Listener oficial do Firebase para persistência de sessão
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 1. O usuário está autenticado no Firebase, agora buscamos o perfil (unidadeId, role) no nosso Backend
          const { data } = await api.get("/auth/me");
          setUser(data);
        } else {
          // 2. Não há usuário logado
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
