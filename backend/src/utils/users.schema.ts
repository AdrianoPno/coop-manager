import { z } from "zod";

const params = z.object({
  id: z.string({ required_error: "O ID do usuário é obrigatório." }),
});

export const createUserSchema = z.object({
  body: z.object({
    uid: z.string({ required_error: "O UID do usuário é obrigatório." }),
    nome: z.string().min(1, "O nome é obrigatório."),
    email: z.string().email("O email fornecido é inválido."),
    role: z.enum(["ADMIN", "USER"], {
      errorMap: () => ({ message: "A role deve ser 'ADMIN' ou 'USER'." }),
    }),
  }),
});

export const updateUserSchema = z.object({
  params,
  body: z
    .object({
      nome: z.string().min(1),
      unidadeId: z.string(),
      role: z.enum(["ADMIN", "USER"]),
      ativo: z.boolean(),
    })
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "Pelo menos um campo deve ser fornecido para atualização.",
    ),
});

export const deleteUserSchema = z.object({
  params,
});
