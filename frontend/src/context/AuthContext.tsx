import React, { createContext, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import { auth } from "../services/firebase";
import api from "../services/api";

// Definindo uma interface simples para o Context, embora o estado real resida no Zustand
const AuthContext = createContext<null | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Iniciamos o loading como true ao montar o provider
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // O interceptor em 'services/api.ts' já é responsável por injetar
          // o token de autorização em todas as requisições.
          const { data } = await api.get("/auth/me");

          // O 'data' da resposta da API contém { success, data, message }. O perfil está em 'data.data'.
          setUser(data.data);
        } else {
          logout();
        }
      } catch (error) {
        // O erro já é tratado pelo logout, que limpa o estado.
        logout(); // Limpa estado se a API falhar
      } finally {
        // Garantia final de que o app sairá do estado de loading
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, logout]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
