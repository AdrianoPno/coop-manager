import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unidadesService } from "../../../services/unidadesService";
import {
  ICreateUnidadeDTO,
  IUpdateUnidadeDTO,
} from "../../../types/unidade.types";

// Schema para validação
const unidadeSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  sigla: z
    .string()
    .min(2, "A sigla deve ter de 2 a 5 caracteres.")
    .max(5, "A sigla deve ter de 2 a 5 caracteres.")
    .transform((val) => val.toUpperCase()),
  status: z.enum(["ATIVO", "INATIVO"]).optional(),
});

type UnidadeFormData = z.infer<typeof unidadeSchema>;

interface UnidadeFormProps {
  onSuccess: () => void;
  initialId?: string;
}

export const UnidadeForm: React.FC<UnidadeFormProps> = ({
  onSuccess,
  initialId,
}) => {
  const queryClient = useQueryClient();

  // Busca dados da unidade para edição
  const { data: unidadeData, isLoading: isLoadingUnidade } = useQuery({
    queryKey: ["unidades", initialId],
    queryFn: () => unidadesService.getById(initialId!),
    enabled: !!initialId, // Só executa se initialId for fornecido
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeSchema),
  });

  // Popula o formulário quando os dados para edição são carregados
  useEffect(() => {
    if (unidadeData) {
      reset(unidadeData);
    }
  }, [unidadeData, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: UnidadeFormData) => {
      if (initialId) {
        return unidadesService.update(initialId, data as IUpdateUnidadeDTO);
      }
      return unidadesService.create(data as ICreateUnidadeDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      onSuccess();
    },
  });

  const onSubmit = (data: UnidadeFormData) => {
    mutate(data);
  };

  if (isLoadingUnidade) {
    return <CircularProgress />;
  }

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
        {initialId && (
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              defaultValue={unidadeData?.status || "ATIVO"}
              {...register("status")}
            >
              <MenuItem value="ATIVO">Ativo</MenuItem>
              <MenuItem value="INATIVO">Inativo</MenuItem>
            </Select>
          </FormControl>
        )}
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
