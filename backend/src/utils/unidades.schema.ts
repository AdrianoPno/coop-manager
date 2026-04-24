import { z } from "zod";

const UnidadeStatus = z.enum(["ATIVO", "INATIVO"]);

const params = z.object({
  id: z.string({ required_error: "O ID da unidade é obrigatório." }),
});

export const createUnidadeSchema = z.object({
  body: z.object({
    nome: z.string().min(1, "O nome é obrigatório."),
    sigla: z.string().min(1, "A sigla é obrigatória."),
    status: UnidadeStatus.optional(),
  }),
});

export const updateUnidadeSchema = z.object({
  params,
  body: z
    .object({
      nome: z.string().min(1),
      sigla: z.string().min(1),
      status: UnidadeStatus,
    })
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "Pelo menos um campo deve ser fornecido para atualização.",
    ),
});

export const getUnidadeSchema = z.object({
  params,
});

export const deleteUnidadeSchema = z.object({
  params,
});
