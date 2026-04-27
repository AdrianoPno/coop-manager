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
  Box,
} from "@mui/material";
import { Edit } from "lucide-react";
import { IUser } from "../../../types/usuario.types";

interface UsuarioTableProps {
  users: IUser[] | undefined;
  onEdit: (id: string) => void;
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
  users,
  onEdit,
}) => {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell>Nível</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow hover key={user.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {user.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.unidadeNome || user.unidadeId}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.ativo ? "Ativo" : "Inativo"}
                      size="small"
                      color={user.ativo ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onEdit(user.id)}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">
                    Nenhum usuário encontrado.
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
