import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cooperadoSchema,
  CooperadoFormData,
} from "../../../schemas/cooperado.schema";
import { cooperadoService } from "../../../services/cooperado.service";

interface CooperadoFormProps {
  onSuccess: () => void;
  initialId?: string;
}

export const CooperadoForm: React.FC<CooperadoFormProps> = ({
  onSuccess,
  initialId,
}) => {
  const queryClient = useQueryClient();

  // Busca dados do cooperado para edição
  const { data: cooperadoData, isLoading: isLoadingCooperado } = useQuery({
    queryKey: ["cooperado", initialId],
    queryFn: () => cooperadoService.getById(initialId!),
    enabled: !!initialId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CooperadoFormData>({
    resolver: zodResolver(cooperadoSchema),
  });

  // Popula o formulário quando os dados de edição são carregados
  useEffect(() => {
    if (cooperadoData) {
      reset({
        ...cooperadoData,
        // Garante que a data esteja no formato YYYY-MM-DD para o input type="date"
        dataEntrada: cooperadoData.dataEntrada
          ? new Date(cooperadoData.dataEntrada).toISOString().split("T")[0]
          : "",
      });
    }
  }, [cooperadoData, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CooperadoFormData) => {
      if (initialId) {
        return cooperadoService.update(initialId, data);
      }
      return cooperadoService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperados"] });
      onSuccess();
    },
  });

  const onSubmit = (data: CooperadoFormData) => {
    mutate(data);
  };

  if (isLoadingCooperado) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{(error as any).message}</Alert>}
        <TextField
          label="Nome Completo"
          {...register("nome")}
          error={!!errors.nome}
          helperText={errors.nome?.message}
          fullWidth
          required
        />
        <TextField
          label="E-mail"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          required
        />
        <TextField
          label="CPF"
          {...register("cpf")}
          error={!!errors.cpf}
          helperText={errors.cpf?.message}
          fullWidth
          required
        />
        <TextField
          label="Matrícula"
          {...register("matricula")}
          error={!!errors.matricula}
          helperText={errors.matricula?.message}
          fullWidth
          required
        />
        <TextField
          label="Função (Cargo)"
          {...register("cargo")}
          error={!!errors.cargo}
          helperText={errors.cargo?.message}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            defaultValue={cooperadoData?.status || "ATIVO"}
            {...register("status")}
          >
            <MenuItem value="ATIVO">Ativo</MenuItem>
            <MenuItem value="INATIVO">Inativo</MenuItem>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Data de Entrada"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("dataEntrada")}
          error={!!errors.dataEntrada}
          helperText={errors.dataEntrada?.message}
          fullWidth
          required
        />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ pt: 2 }}
        >
          <Button onClick={onSuccess} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : initialId ? (
              "Salvar Alterações"
            ) : (
              "Salvar Cooperado"
            )}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
