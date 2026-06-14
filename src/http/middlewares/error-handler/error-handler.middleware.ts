import { Request, Response, NextFunction } from "express";
import { ErroDominio } from "../../../domain/errors/erro-dominio";

/**
 * Middleware global de tratamento de erros.
 *
 * Deve ser registrado por último na cadeia de middlewares do Express
 * (após todas as rotas), para capturar tanto erros lançados de forma
 * síncrona quanto erros encaminhados via `next(err)`.
 *
 * Erros de domínio (`ErroDominio` e suas subclasses — `ErroNaoEncontrado`,
 * `ErroConflito`, `ErroValidacao`) são convertidos em uma resposta JSON
 * `{ mensagem: string }` com o `statusCode` definido pela própria classe
 * do erro.
 *
 * Qualquer outro erro é tratado como inesperado: é registrado no console
 * do servidor e retornado ao cliente como HTTP 500, sem expor detalhes
 * internos.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ErroDominio) {
    res.status(err.statusCode).json({ mensagem: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
}
