import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unidadesService } from "../services/unidadesService";
import { ICreateUnidadeDTO } from "../types/unidade.types";

// Schema para validação

const unidadeSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  sigla: z
    .string()
    .min(2, "A sigla deve ter de 2 a 5 caracteres.")
    .max(5, "A sigla deve ter de 2 a 5 caracteres.")
    .transform((val) => val.toUpperCase()),
});

interface UnidadeFormProps {
  onSuccess: () => void;
}

export const UnidadeForm: React.FC<UnidadeFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUnidadeDTO>({
    resolver: zodResolver(unidadeSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ICreateUnidadeDTO) => unidadesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      onSuccess();
    },
  });

  const onSubmit = (data: ICreateUnidadeDTO) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{(error as any).message}</Alert>}
        <TextField
          label="Nome da Unidade"
          {...register("nome")}
          error={!!errors.nome}
          helperText={errors.nome?.message}
          required
          fullWidth
        />
        <TextField
          label="Sigla"
          {...register("sigla")}
          error={!!errors.sigla}
          helperText={errors.sigla?.message}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Salvar Unidade"
          )}
        </Button>
      </Stack>
    </form>
  );
};
