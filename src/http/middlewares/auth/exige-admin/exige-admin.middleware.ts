import { Request, Response, NextFunction } from 'express';
import { ErroNaoAutorizadoError } from '../../../../domain/errors/erro-nao-autorizado.error';
import { authMensagens } from '../../../../domain/errors/mensagens/auth.mensagens';

/**
 * Middleware que restringe o acesso a usuarios com papel `ADMIN`.
 *
 * Deve ser usado em conjunto com `verificarAutenticacao` (que garante que
 * `req.user` esteja preenchido). Lanca `ErroNaoAutorizadoError` (403) se o
 * papel do usuario nao for `ADMIN`.
 */
export function exigirAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    throw new ErroNaoAutorizadoError(authMensagens.semPermissao())
  }
  next()
}
