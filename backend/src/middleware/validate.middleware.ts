import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "../config/logger";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // LOG DE ENTRADA: Se isso não aparecer, a requisição nem chegou aqui!
    logger.debug(
      { method: req.method, url: req.originalUrl, params: req.params },
      `[VALIDATE] Recebendo requisição`,
    );

    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      logger.debug(`[VALIDATE] Sucesso na validação`);
      // Anexa os dados validados ao res.locals para uso no controller,
      // evitando a mutação do objeto `req` que causa o erro.
      res.locals.validatedData = validatedData;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.flatten().fieldErrors;
        logger.warn({ errors: validationErrors }, "❌ Erro de validação Zod");

        return res.status(400).json({
          success: false,
          message: "Dados inválidos.",
          errors: validationErrors,
        });
      }

      logger.error(
        { err: error },
        "🔥 Erro inesperado no middleware de validação",
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
      });
    }
  };
