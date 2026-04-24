import { ZodIssue } from "zod";
import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public errors: ZodIssue[];
  name: string;

  constructor(errors: ZodIssue[]) {
    super("Erro de validação", 400);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
