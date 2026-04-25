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
          const token = await firebaseUser.getIdToken();

          // Garante que o header esteja atualizado para a chamada /auth/me
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const { data } = await api.get("/auth/me");

          // setUser na store já deve atualizar o loading para false internamente se você seguiu o passo anterior
          setUser(data);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
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
