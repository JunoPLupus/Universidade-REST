import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../../../shared/config';
import { ErroNaoAutenticadoError } from '../../../domain/errors/erro-nao-autenticado.error';
import { authMensagens } from '../../../domain/errors/mensagens/auth.mensagens';

/**
 * Middleware que verifica se a requisicao possui um token JWT valido no
 * cabecalho `Authorization: Bearer <token>`.
 *
 * Em caso de sucesso, popula `req.user` com `{ email, role }` extraidos do
 * payload do token e chama `next()`. Caso contrario, lanca
 * `ErroNaoAutenticadoError` (401), capturado pelo middleware global de erros.
 */
export function verificarAutenticacao(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ErroNaoAutenticadoError(authMensagens.naoAutenticado())
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role: string }
    req.user = { email: payload.sub, role: payload.role }
    next()
  } catch {
    throw new ErroNaoAutenticadoError(authMensagens.naoAutenticado())
  }
}
