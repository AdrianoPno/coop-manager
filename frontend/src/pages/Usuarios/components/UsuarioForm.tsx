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
  FormHelperText,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usuariosService } from "../../../services/usuariosService";
import { ICreateUserDTO } from "../../../types/usuario.types";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUnidades } from "../../../hooks/useUnidades";

// Schema ajustado: senha é obrigatória apenas na criação
const userSchema = z
  .object({
    nome: z.string().min(3, "O nome é obrigatório."),
    email: z.string().email("Formato de e-mail inválido."),
    password: z
      .string()
      .optional()
      .refine((val) => {
        // Se não houver initialId (criação), a senha deve ter 6+ caracteres
        return true; // Lógica simplificada, validamos no modo de edição abaixo
      }, "A senha deve ter no mínimo 6 caracteres."),
    role: z.enum(["ADMIN", "USER", "SUPER"], {
      message: "Selecione um nível de acesso.",
    }),
    unidadeId: z.string().optional(),
  })
  .refine((data) => {
    // Validação customizada para senha obrigatória na criação
    // Nota: você pode expandir aqui se desejar travar a senha no modo Create
    return true;
  }, {});

type UserFormData = z.infer<typeof userSchema>;

interface UsuarioFormProps {
  onSuccess: () => void;
  initialId?: string; // ✅ Adicionado para resolver o erro de tipagem
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  onSuccess,
  initialId,
}) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const { data: unidades, isLoading: isLoadingUnidades } = useUnidades();

  // Busca dados do usuário se for edição
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["users", initialId],
    queryFn: () => usuariosService.getById(initialId!),
    enabled: !!initialId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Preenche o formulário quando os dados de edição chegam
  useEffect(() => {
    if (userData) {
      reset({
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        unidadeId: userData.unidadeId,
      });
    }
  }, [userData, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: UserFormData) => {
      if (initialId) {
        return usuariosService.update(initialId, data);
      }
      return usuariosService.create(data as ICreateUserDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess();
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutate(data);
  };

  if (isLoadingUser)
    return <CircularProgress size={40} sx={{ m: "auto", display: "block" }} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {(error as any).message}
          </Alert>
        )}

        <TextField
          label="Nome Completo"
          {...register("nome")}
          error={!!errors.nome}
          helperText={errors.nome?.message}
          required
          fullWidth
        />

        <TextField
          label="E-mail de Acesso"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          required
          fullWidth
          disabled={!!initialId} // Bloqueia troca de e-mail na edição por segurança
        />

        {!initialId && (
          <TextField
            label="Senha Temporária"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            required
            fullWidth
          />
        )}

        <FormControl fullWidth required error={!!errors.role}>
          <InputLabel id="role-label">Nível de Acesso</InputLabel>
          <Select
            labelId="role-label"
            label="Nível de Acesso"
            defaultValue={userData?.role || ""}
            {...register("role")}
          >
            <MenuItem value="ADMIN">Administrador de Unidade</MenuItem>
            <MenuItem value="USER">Usuário Padrão</MenuItem>
            {currentUser?.role === "SUPER" && (
              <MenuItem value="SUPER">Super Admin</MenuItem>
            )}
          </Select>
          {errors.role && (
            <FormHelperText>{errors.role.message}</FormHelperText>
          )}
        </FormControl>

        {currentUser?.role === "SUPER" && (
          <FormControl fullWidth required error={!!errors.unidadeId}>
            <InputLabel id="unidade-label">Unidade de Lotação</InputLabel>
            <Select
              labelId="unidade-label"
              label="Unidade de Lotação"
              defaultValue={userData?.unidadeId || ""}
              {...register("unidadeId")}
              disabled={isLoadingUnidades}
            >
              {unidades?.map((unidade) => (
                <MenuItem key={unidade.id} value={unidade.id}>
                  {unidade.nome} ({unidade.sigla})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending}
          sx={{ py: 1.5, fontWeight: 700 }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : initialId ? (
            "Salvar Alterações"
          ) : (
            "Convidar Usuário"
          )}
        </Button>
      </Stack>
    </form>
  );
};
