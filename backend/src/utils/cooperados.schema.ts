import { z } from "zod";

const params = z.object({
  id: z.string({ required_error: "O ID do cooperado é obrigatório." }),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato YYYY-MM-DD.");

const cooperadoBodyBase = z.object({
  ID_COOPERADO: z.string().min(1, "A matrícula (ID_COOPERADO) é obrigatória."),
  nome: z.string().min(1, "O nome é obrigatório."),
  cpf: z.string().min(1, "O CPF é obrigatório."),
  dataNascimento: dateSchema,
  sexo: z.enum(["Masculino", "Feminino", "Outro"]),
  etnia: z.string().min(1, "A etnia é obrigatória."),
  escolaridade: z.string().min(1, "A escolaridade é obrigatória."),
  cargo: z.string().min(1, "O cargo é obrigatório."),
  tipoVinculo: z.enum(["COOP", "RPA"]),
  dataEntrada: dateSchema,
  dataSaida: dateSchema.nullable().optional(),
  status: z.enum(["ATIVO", "INATIVO"]),
});

export const createCooperadoSchema = z.object({
  body: cooperadoBodyBase,
});

export const updateCooperadoSchema = z.object({
  params,
  body: cooperadoBodyBase
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "Pelo menos um campo deve ser fornecido para atualização.",
    ),
});

export const getCooperadoSchema = z.object({
  params,
});

export const deleteCooperadoSchema = z.object({
  params,
});
