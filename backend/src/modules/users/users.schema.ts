import { z } from "zod";

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "O ID do usuário é obrigatório."),
  }),
});
