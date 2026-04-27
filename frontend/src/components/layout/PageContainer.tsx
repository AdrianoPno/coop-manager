import React from "react";
import { Box, Typography, Stack } from "@mui/material";

interface PageContainerProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <Box
      component="main"
      sx={{
        p: { xs: 2, sm: 4 },
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 5, // Aumentado levemente para destacar o conteúdo
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800, // Um pouco mais pesado para autoridade visual
              color: "primary.main", // Garante o uso do azul do seu tema
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {action && (
          <Box
            sx={{
              mt: { xs: 1, sm: 0 },
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          >
            {action}
          </Box>
        )}
      </Stack>

      {/* Área do conteúdo principal */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};
