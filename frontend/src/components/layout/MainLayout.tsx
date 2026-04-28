import React from "react";
import { Outlet } from "react-router-dom"; // IMPORTANTE
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";
import { Box, Container } from "@mui/material";

// Remova o { children } da tipagem e da desestruturação
export const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box
        component="div"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* O Topbar agora controla o cabeçalho, incluindo os breadcrumbs */}
        <Topbar />

        <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
