import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "./styles/theme"; // Certifique-se de que o caminho está correto
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 1. O ThemeProvider injeta sua "Lei Visual" em toda a árvore */}
      <ThemeProvider theme={theme}>
        {/* 2. O CssBaseline reseta o CSS do navegador e aplica o fundo do seu tema */}
        <CssBaseline />

        <AuthProvider>
          {/* 3. O Router renderiza as páginas dentro do contexto de Autenticação e Tema */}
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
