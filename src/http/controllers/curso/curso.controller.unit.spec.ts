import { Request, Response } from 'express';
import { CursoController } from './curso.controller';
import { CursoService } from '../../../domain/services/curso.service';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { CursoRespostaMapper } from '../../mappers/curso-resposta.mapper';

describe('Curso Controller - Testes unitários', () => {
  let cursoService: jest.Mocked<CursoService>;
  let controller: CursoController;
  let res: Response;

  beforeEach(() => {
    cursoService = {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<CursoService>;

    controller = new CursoController(cursoService);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe('buscar', () => {
    it('deve retornar 200 com a lista de cursos no formato de resposta', async () => {
      const curso = CursoMother.criar();
      cursoService.buscar.mockResolvedValue([curso]);

      const req = { query: { nome: 'Ciência', codigo: '001' } } as unknown as Request;

      await controller.buscar(req, res);

      expect(cursoService.buscar).toHaveBeenCalledWith({ nome: 'Ciência', codigo: '001' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([CursoRespostaMapper.paraResposta(curso)]);
    });
  });

  describe('buscarPorCodigo', () => {
    it('deve retornar 200 com o curso no formato de resposta', async () => {
      const curso = CursoMother.criar();
      cursoService.buscarPorCodigo.mockResolvedValue(curso);

      const req = { params: { codigo: curso.codigo } } as unknown as Request;

      await controller.buscarPorCodigo(req, res);

      expect(cursoService.buscarPorCodigo).toHaveBeenCalledWith(curso.codigo);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso));
    });
  });

  describe('cadastrar', () => {
    it('deve retornar 201 com o curso cadastrado no formato de resposta', async () => {
      const curso = CursoMother.criar();
      cursoService.cadastrar.mockResolvedValue(curso);

      const dto = { nome: curso.nome, periodos: curso.periodos };
      const req = { body: dto } as unknown as Request;

      await controller.cadastrar(req, res);

      expect(cursoService.cadastrar).toHaveBeenCalledWith(dto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso));
    });
  });

  describe('editar', () => {
    it('deve retornar 200 com o curso editado no formato de resposta', async () => {
      const curso = CursoMother.criar();
      cursoService.editar.mockResolvedValue(curso);

      const dto = { nome: curso.nome, periodos: curso.periodos };
      const req = { params: { codigo: curso.codigo }, body: dto } as unknown as Request;

      await controller.editar(req, res);

      expect(cursoService.editar).toHaveBeenCalledWith(curso.codigo, dto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso));
    });
  });

  describe('excluir', () => {
    it('deve retornar 204 sem corpo', async () => {
      cursoService.excluir.mockResolvedValue(undefined);

      const req = { params: { codigo: '001' } } as unknown as Request;

      await controller.excluir(req, res);

      expect(cursoService.excluir).toHaveBeenCalledWith('001');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
