import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    nome: z
      .string({ required_error: "O nome é obrigatório." })
      .min(1, "O nome não pode estar vazio."),
    email: z
      .string({ required_error: "O e-mail é obrigatório." })
      .email("Formato de e-mail inválido."),
    password: z
      .string({ required_error: "A senha é obrigatória." })
      .min(6, "A senha deve ter no mínimo 6 caracteres."),
    role: z.enum(["ADMIN", "USER"], {
      required_error: "A role é obrigatória.",
    }),
    unidadeId: z.string().optional(), // Opcional no body, a lógica de serviço validará a necessidade
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "O ID do usuário é obrigatório." }),
  }),
  body: z
    .object({
      nome: z.string().optional(),
      unidadeId: z.string().optional(),
      role: z.enum(["ADMIN", "USER"]).optional(),
      ativo: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Pelo menos um campo deve ser fornecido para atualização.",
    ),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "O ID do usuário é obrigatório." }),
  }),
});
