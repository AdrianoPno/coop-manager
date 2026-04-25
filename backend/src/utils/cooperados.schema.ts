import { z } from "zod";

const params = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD");

const cooperadoBodyBase = z.object({
  ID_COOPERADO: z.string().min(1, "Matrícula é obrigatória."),
  nome: z.string().min(1, "Nome é obrigatório."),
  cpf: z.string().min(1, "CPF é obrigatório."),
  cargo: z.string().min(1, "O cargo/função é obrigatório."), // Ex: Presidente, Motorista
  tipoVinculo: z.enum(["COOP", "RPA"]),
  status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]),
  dataEntrada: dateSchema,
  dataSaida: dateSchema.nullable().optional(),
});

export const createCooperadoSchema = z.object({ body: cooperadoBodyBase });
export const updateCooperadoSchema = z.object({
  params,
  body: cooperadoBodyBase.partial(),
});
export const getCooperadoSchema = z.object({
  params,
  body: z.any().optional(),
});
export const deleteCooperadoSchema = z.object({ params });
