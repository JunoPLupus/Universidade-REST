import { Request, Response, NextFunction } from 'express';
import { exigirAdmin } from './exige-admin.middleware';
import { ErroNaoAutorizadoError } from '../../../../domain/errors/erro-nao-autorizado.error';

describe('exigirAdmin Middleware - Testes unitarios', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {}
    next = jest.fn()
  })

  it('lanca ErroNaoAutorizadoError quando req.user nao esta definido', () => {
    expect(() => exigirAdmin(req as Request, res as Response, next)).toThrow(ErroNaoAutorizadoError)
    expect(next).not.toHaveBeenCalled()
  })

  it('lanca ErroNaoAutorizadoError quando o role do usuario nao e ADMIN', () => {
    req.user = { email: 'prof@uni.edu.br', role: 'PROFESSOR' }
    expect(() => exigirAdmin(req as Request, res as Response, next)).toThrow(ErroNaoAutorizadoError)
    expect(next).not.toHaveBeenCalled()
  })

  it('chama next() quando o usuario e ADMIN', () => {
    req.user = { email: 'admin@uni.edu.br', role: 'ADMIN' }
    exigirAdmin(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
