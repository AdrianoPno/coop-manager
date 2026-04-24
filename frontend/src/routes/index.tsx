import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import type { JSX } from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};
