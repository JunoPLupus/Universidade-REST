import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tentarAutenticacao } from './tentar-autenticacao.middleware';

jest.mock('jsonwebtoken')
jest.mock('../../../../shared/config', () => ({ env: { jwtSecret: 'segredo-teste' } }))

describe('tentarAutenticacao Middleware - Testes unitarios', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()
  })

  it('chama next() sem preencher req.user quando o header Authorization esta ausente', () => {
    tentarAutenticacao(req as Request, res as Response, next)
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('chama next() sem preencher req.user quando o header nao inicia com Bearer', () => {
    req.headers = { authorization: 'Basic abc123' }
    tentarAutenticacao(req as Request, res as Response, next)
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('chama next() sem preencher req.user quando o token e invalido ou expirado', () => {
    req.headers = { authorization: 'Bearer token-invalido' }
    ;(jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid token') })
    tentarAutenticacao(req as Request, res as Response, next)
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('popula req.user e chama next() quando o token e valido', () => {
    req.headers = { authorization: 'Bearer token-valido' }
    ;(jwt.verify as jest.Mock).mockReturnValue({ sub: 'prof@uni.edu.br', role: 'PROFESSOR' })
    tentarAutenticacao(req as Request, res as Response, next)
    expect(req.user).toEqual({ email: 'prof@uni.edu.br', role: 'PROFESSOR' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
