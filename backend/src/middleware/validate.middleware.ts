import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // LOG DE ENTRADA: Se isso não aparecer, a requisição nem chegou aqui!
    console.log(
      `\n🔍 [VALIDATE] Recebendo ${req.method} para ${req.originalUrl}`,
    );
    console.log(`📦 [PARAMS]:`, req.params);

    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      console.log(`✅ [VALIDATE] Sucesso!`);
      // Anexa os dados validados ao res.locals para uso no controller,
      // evitando a mutação do objeto `req` que causa o erro.
      res.locals.validatedData = validatedData;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // LOG DE ERRO DETALHADO
        console.log(
          "❌ [ERRO DE VALIDAÇÃO]:",
          JSON.stringify(error.flatten().fieldErrors, null, 2),
        );

        return res.status(400).json({
          success: false,
          message: "Dados inválidos.",
          errors: error.flatten().fieldErrors,
        });
      }

      console.error("🔥 [SYSTEM ERROR]:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
      });
    }
  };
