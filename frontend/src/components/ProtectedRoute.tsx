// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "./common/Loading"; // Reutilizando o componente que criamos

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuthStore();

  // 1. Enquanto o AuthProvider/Firebase valida a sessão
  if (loading) {
    return <Loading />;
  }

  // 2. Se não houver usuário logado, vai para o Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. RBAC: Se a rota exige roles e o usuário não possui a necessária
  if (allowedRoles && !allowedRoles.includes(user.role || "")) {
    console.warn(
      `Acesso negado: Usuário ${user.role} tentou acessar rota restrita.`,
    );
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Se passou em tudo, renderiza a rota filha
  return <Outlet />;
};
