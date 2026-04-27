import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit } from "lucide-react";
import { IUnidade } from "../../../types/unidade.types";

interface UnidadeTableProps {
  unidades: IUnidade[] | undefined;
  onEdit: (id: string) => void;
}

export const UnidadeTable: React.FC<UnidadeTableProps> = ({
  unidades,
  onEdit,
}) => {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Unidade</TableCell>
              <TableCell>Sigla</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unidades && unidades.length > 0 ? (
              unidades.map((unidade) => (
                <TableRow hover key={unidade.id}>
                  <TableCell>{unidade.nome}</TableCell>
                  <TableCell>{unidade.sigla}</TableCell>
                  <TableCell>
                    <Chip
                      label={unidade.status}
                      size="small"
                      color={unidade.status === "ATIVO" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onEdit(unidade.id)}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">
                    Nenhuma unidade encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
