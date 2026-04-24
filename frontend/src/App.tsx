import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import type { JSX } from "react";
import { CooperadosList } from "./pages/Cooperados/List";
import { CooperadoForm } from "./pages/Cooperados/Form";

// Componente para Proteção de Rotas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Dashboard - Cooperados</h1>
                {/* Aqui entrará o componente de listagem futuramente */}
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/cooperados"
          element={
            <PrivateRoute>
              <CooperadosList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cooperados/novo"
          element={
            <PrivateRoute>
              <CooperadoForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/cooperados/editar/:id"
          element={
            <PrivateRoute>
              <CooperadoForm />
            </PrivateRoute>
          }
        />
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
