import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { MainLayout } from "../components/layout/MainLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cooperados from "../pages/Cooperados";
import Unidades from "../pages/Unidades";
import Usuarios from "../pages/Usuarios";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // Valida se está logado
    children: [
      {
        path: "/",
        element: <MainLayout />, // Sem children aqui
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "cooperados", element: <Cooperados /> },
          {
            path: "unidades",
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />, // Proteção extra nível rota
            children: [{ path: "", element: <Unidades /> }],
          },
          {
            path: "usuarios",
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
            children: [{ path: "", element: <Usuarios /> }],
          },
          { path: "", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];
