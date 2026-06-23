import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../../../../shared/config';

/**
 * Middleware de autenticação opcional.
 *
 * Diferente de `verificarAutenticacao`, nunca bloqueia a requisição:
 * - Se um token JWT válido estiver presente no cabeçalho `Authorization`,
 *   popula `req.user` com `{ email, role }` e chama `next()`.
 * - Se o cabeçalho estiver ausente ou o token for inválido/expirado,
 *   simplesmente chama `next()` sem preencher `req.user`.
 *
 * Usado em rotas públicas que exibem dados diferentes dependendo
 * do contexto de autenticação (ex: GET /professores/:mat).
 */
export function tentarAutenticacao(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7)
      const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role: string }
      req.user = { email: payload.sub, role: payload.role }
    } catch {
      // Token inválido ou expirado — trata como não autenticado
    }
  }

  next()
}
