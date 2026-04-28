import { z } from "zod";

export const cooperadoSchema = z.object({
  nome: z.string().trim().min(3, "Nome completo é obrigatório"),
  email: z.string().trim().lowercase().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  cargo: z.string().min(2, "O cargo é obrigatório"),
  // Remova o .optional() e garanta o enum estrito
  status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]),
  dataEntrada: z.string().min(1, "A data de entrada é obrigatória."),
});

export type CooperadoFormData = z.infer<typeof cooperadoSchema>;
