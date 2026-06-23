import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verificarAutenticacao } from './verifica-autenticacao.middleware';
import { ErroNaoAutenticadoError } from '../../../../domain/errors/erro-nao-autenticado.error';

jest.mock('jsonwebtoken')
jest.mock('../../../../shared/config', () => ({ env: { jwtSecret: 'segredo-teste' } }))

describe('verificarAutenticacao Middleware - Testes unitarios', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()
  })

  it('lanca ErroNaoAutenticadoError quando o header Authorization esta ausente', () => {
    expect(() => verificarAutenticacao(req as Request, res as Response, next)).toThrow(ErroNaoAutenticadoError)
    expect(next).not.toHaveBeenCalled()
  })

  it('lanca ErroNaoAutenticadoError quando o header nao inicia com Bearer', () => {
    req.headers = { authorization: 'Basic abc123' }
    expect(() => verificarAutenticacao(req as Request, res as Response, next)).toThrow(ErroNaoAutenticadoError)
    expect(next).not.toHaveBeenCalled()
  })

  it('lanca ErroNaoAutenticadoError quando o token e invalido ou expirado', () => {
    req.headers = { authorization: 'Bearer token-invalido' }
    ;(jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid token') })
    expect(() => verificarAutenticacao(req as Request, res as Response, next)).toThrow(ErroNaoAutenticadoError)
    expect(next).not.toHaveBeenCalled()
  })

  it('popula req.user e chama next() quando o token e valido', () => {
    req.headers = { authorization: 'Bearer token-valido' }
    ;(jwt.verify as jest.Mock).mockReturnValue({ sub: 'admin@uni.edu.br', role: 'ADMIN' })
    verificarAutenticacao(req as Request, res as Response, next)
    expect(req.user).toEqual({ email: 'admin@uni.edu.br', role: 'ADMIN' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
