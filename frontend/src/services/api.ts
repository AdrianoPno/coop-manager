import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  // Se estiver usando Vite, use import.meta.env. Se não, use process.env
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

/**
 * Interceptor de Requisição:
 * Executa antes de cada chamada ao backend.
 */
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Busca o token JWT atualizado do Firebase
      const token = await user.getIdToken();

      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor de Resposta:
 * Útil para tratar erros globais (Ex: 401 Unauthorized)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Lógica para deslogar o usuário se o token falhar no backend
      // Isso é útil se o token expirar e o Firebase ainda não o atualizou.
      console.error(
        "Sessão expirada ou não autorizada. Redirecionando para o login.",
      );
      // Para deslogar globalmente, você pode disparar um evento customizado
      // que o seu AuthProvider escuta para chamar a função de logout.
      window.dispatchEvent(new Event("auth-error"));
    }
    return Promise.reject(error);
  },
);

export default api;
