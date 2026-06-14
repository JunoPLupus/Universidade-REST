import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './error-handler.middleware';
import { ErroNaoEncontrado } from '../../../domain/errors/erro-nao-encontrado';
import { ErroConflito } from '../../../domain/errors/erro-conflito';
import { ErroValidacao } from '../../../domain/errors/erro-validacao';

describe('Error Handler Middleware - Testes unitários', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('responde com 404 e a mensagem do erro quando recebe um ErroNaoEncontrado', () => {
    const erro = new ErroNaoEncontrado('Curso não encontrado.');

    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Curso não encontrado.' });
  });

  it('responde com 409 e a mensagem do erro quando recebe um ErroConflito', () => {
    const erro = new ErroConflito('Já existe um curso com esse nome.');

    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Já existe um curso com esse nome.' });
  });

  it('responde com 400 e a mensagem do erro quando recebe um ErroValidacao', () => {
    const erro = new ErroValidacao('O nome do curso deve ter entre 5 e 100 caracteres.');

    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'O nome do curso deve ter entre 5 e 100 caracteres.' });
  });

  it('responde com 500 e uma mensagem genérica quando recebe um erro inesperado', () => {
    const erro = new Error('Falha de conexão com o banco de dados');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro interno do servidor.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith(erro);

    consoleErrorSpy.mockRestore();
  });
});
