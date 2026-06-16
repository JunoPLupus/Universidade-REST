import { Request, Response } from 'express';
import { DisciplinaController } from './disciplina.controller';
import { DisciplinaService } from '../../../domain/services/disciplina.service';
import { CursoService } from '../../../domain/services/curso.service';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { DisciplinaRespostaMapper } from '../../mappers/disciplina-resposta.mapper';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';

describe('Disciplina Controller - Testes unitários', () => {
  let disciplinaService: jest.Mocked<DisciplinaService>
  let cursoService: jest.Mocked<CursoService>
  let controller: DisciplinaController
  let res: Response
  const curso = CursoMother.criar()

  beforeEach(() => {
    disciplinaService = {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
      excluirPorCurso: jest.fn(),
    } as unknown as jest.Mocked<DisciplinaService>

    cursoService = {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn().mockResolvedValue(curso),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<CursoService>

    controller = new DisciplinaController(disciplinaService, cursoService)

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('buscar', () => {
    it('deve retornar 200 com a lista de disciplinas no formato de resposta, incluindo o nome do curso', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.buscar.mockResolvedValue([disciplina])

      const req = {
        query: { nome: 'Cálculo', codCurso: '001', codigo: '001.001', cargaHoraria: '60', periodo: '3' },
      } as unknown as Request

      await controller.buscar(req, res)

      expect(disciplinaService.buscar).toHaveBeenCalledWith({
        nome: 'Cálculo',
        codCurso: '001',
        codigo: '001.001',
        cargaHoraria: 60,
        periodo: 3,
      })
      expect(cursoService.buscarPorCodigo).toHaveBeenCalledWith(disciplina.codCurso)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([DisciplinaRespostaMapper.paraResposta(disciplina, curso)])
    })

    it('trata cargaHoraria/periodo inválidos ou ausentes na query como filtro não informado', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.buscar.mockResolvedValue([disciplina])

      const req = { query: { cargaHoraria: 'abc', periodo: 'xyz' } } as unknown as Request

      await controller.buscar(req, res)

      expect(disciplinaService.buscar).toHaveBeenCalledWith({
        nome: undefined,
        codCurso: undefined,
        codigo: undefined,
        cargaHoraria: undefined,
        periodo: undefined,
      })
    })
  })

  describe('buscarPorCodigo', () => {
    it('deve retornar 200 com a disciplina no formato de resposta, incluindo o nome do curso', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.buscarPorCodigo.mockResolvedValue(disciplina)

      const req = { params: { codigo: disciplina.codigo } } as unknown as Request

      await controller.buscarPorCodigo(req, res)

      expect(disciplinaService.buscarPorCodigo).toHaveBeenCalledWith(disciplina.codigo)
      expect(cursoService.buscarPorCodigo).toHaveBeenCalledWith(disciplina.codCurso)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })
  })

  describe('cadastrar', () => {
    it('deve retornar 201 com a disciplina cadastrada no formato de resposta', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.cadastrar.mockResolvedValue(disciplina)

      const dto = {
        codCurso: disciplina.codCurso,
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
      }
      const req = { body: dto } as unknown as Request

      await controller.cadastrar(req, res)

      expect(disciplinaService.cadastrar).toHaveBeenCalledWith(dto)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "codCurso" está ausente', async () => {
      const req = { body: { periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 } } as unknown as Request

      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "periodo" não é um número', async () => {
      const req = {
        body: { codCurso: '001', periodo: '3', nome: 'Cálculo I', cargaHoraria: 60 },
      } as unknown as Request

      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "nome" está ausente', async () => {
      const req = { body: { codCurso: '001', periodo: 3, cargaHoraria: 60 } } as unknown as Request

      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "cargaHoraria" não é um número', async () => {
      const req = {
        body: { codCurso: '001', periodo: 3, nome: 'Cálculo I', cargaHoraria: '60' },
      } as unknown as Request

      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('editar', () => {
    it('deve retornar 200 com a disciplina editada no formato de resposta', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.editar.mockResolvedValue(disciplina)

      const dto = {
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
      }
      const req = { params: { codigo: disciplina.codigo }, body: dto } as unknown as Request

      await controller.editar(req, res)

      expect(disciplinaService.editar).toHaveBeenCalledWith(disciplina.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "periodo" não é um número', async () => {
      const req = {
        params: { codigo: '001.001' },
        body: { periodo: '3', nome: 'Cálculo I', cargaHoraria: 60 },
      } as unknown as Request

      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.editar).not.toHaveBeenCalled()
    })

    it('permite editar apenas alguns campos (ex: "periodo" e "cargaHoraria")', async () => {
      const disciplina = DisciplinaMother.criar()
      disciplinaService.editar.mockResolvedValue(disciplina)

      const dto = { periodo: disciplina.periodo, cargaHoraria: disciplina.cargaHoraria }
      const req = { params: { codigo: disciplina.codigo }, body: dto } as unknown as Request

      await controller.editar(req, res)

      expect(disciplinaService.editar).toHaveBeenCalledWith(disciplina.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "cargaHoraria" não é um número', async () => {
      const req = {
        params: { codigo: '001.001' },
        body: { periodo: 3, nome: 'Cálculo I', cargaHoraria: '60' },
      } as unknown as Request

      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.editar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('deve retornar 204 sem corpo', async () => {
      disciplinaService.excluir.mockResolvedValue(undefined)

      const req = { params: { codigo: '001.001' } } as unknown as Request

      await controller.excluir(req, res)

      expect(disciplinaService.excluir).toHaveBeenCalledWith('001.001')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })

  describe('excluirPorCurso', () => {
    it('deve retornar 204 sem corpo', async () => {
      disciplinaService.excluirPorCurso.mockResolvedValue(undefined)

      const req = { params: { codigo: '001' } } as unknown as Request

      await controller.excluirPorCurso(req, res)

      expect(disciplinaService.excluirPorCurso).toHaveBeenCalledWith('001')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
