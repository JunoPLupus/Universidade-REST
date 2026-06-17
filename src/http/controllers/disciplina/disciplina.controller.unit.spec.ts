import { Request, Response } from 'express';
import { Disciplina } from "../../../domain/entities/disciplina/disciplina.entity";
import { DisciplinaService } from '../../../domain/services/disciplina.service';
import { DisciplinaController } from './disciplina.controller';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { DisciplinaRespostaMapper } from '../../mappers/disciplina-resposta.mapper';
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { CursoService } from '../../../domain/services/curso.service';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';

describe('Disciplina Controller - Testes unitários', () => {
  let disciplinaService: jest.Mocked<DisciplinaService>
  let cursoService: jest.Mocked<CursoService>
  let controller: DisciplinaController
  let res: Response
  const curso : Curso = CursoMother.criar()
  const disciplina : Disciplina = DisciplinaMother.criar()

  beforeEach(() => {
    disciplinaService = DisciplinaMother.criarServiceMock()

    cursoService = CursoMother.criarServiceMock(curso)

    controller = new DisciplinaController(disciplinaService, cursoService)

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('buscar', () => {
    it('deve retornar 200 com a lista de disciplinas no formato de resposta, incluindo o nome do curso', async () => {
      // Arrange
      disciplinaService.buscar.mockResolvedValue([disciplina])
      const req = {
        query: { nome: 'Cálculo', codCurso: '001', codigo: '001.001', cargaHoraria: '60', periodo: '3' },
      } as unknown as Request
      // Act
      await controller.buscar(req, res)
      // Assert
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
      // Arrange
      disciplinaService.buscar.mockResolvedValue([disciplina])
      const req = { query: { cargaHoraria: 'abc', periodo: 'xyz' } } as unknown as Request
      // Act
      await controller.buscar(req, res)
      // Assert
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
      // Arrange
      disciplinaService.buscarPorCodigo.mockResolvedValue(disciplina)
      const req = { params: { codigo: disciplina.codigo } } as unknown as Request
      // Act
      await controller.buscarPorCodigo(req, res)
      // Assert
      expect(disciplinaService.buscarPorCodigo).toHaveBeenCalledWith(disciplina.codigo)
      expect(cursoService.buscarPorCodigo).toHaveBeenCalledWith(disciplina.codCurso)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })
  })

  describe('cadastrar', () => {
    it('deve retornar 201 com a disciplina cadastrada no formato de resposta', async () => {
      // Arrange
      disciplinaService.cadastrar.mockResolvedValue(disciplina)
      const dto = {
        codCurso: disciplina.codCurso,
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
      }
      const req = { body: dto } as unknown as Request
      // Act
      await controller.cadastrar(req, res)
      // Assert
      expect(disciplinaService.cadastrar).toHaveBeenCalledWith(dto)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "codCurso" está ausente', async () => {
      // Arrange
      const req = { body: { periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 } } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "periodo" não é um número', async () => {
      // Arrange
      const req = {
        body: { codCurso: '001', periodo: '3', nome: 'Cálculo I', cargaHoraria: 60 },
      } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "nome" está ausente', async () => {
      // Arrange
      const req = { body: { codCurso: '001', periodo: 3, cargaHoraria: 60 } } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "cargaHoraria" não é um número', async () => {
      // Arrange
      const req = {
        body: { codCurso: '001', periodo: 3, nome: 'Cálculo I', cargaHoraria: '60' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('editar', () => {
    it('deve retornar 200 com a disciplina editada no formato de resposta', async () => {
      // Arrange
      disciplinaService.editar.mockResolvedValue(disciplina)
      const dto = {
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
      }
      const req = { params: { codigo: disciplina.codigo }, body: dto } as unknown as Request
      // Act
      await controller.editar(req, res)
      // Assert
      expect(disciplinaService.editar).toHaveBeenCalledWith(disciplina.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "periodo" não é um número', async () => {
      // Arrange
      const req = {
        params: { codigo: '001.001' },
        body: { periodo: '3', nome: 'Cálculo I', cargaHoraria: 60 },
      } as unknown as Request
      // Act & Assert
      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.editar).not.toHaveBeenCalled()
    })

    it('permite editar apenas alguns campos (ex: "periodo" e "cargaHoraria")', async () => {
      // Arrange
      disciplinaService.editar.mockResolvedValue(disciplina)
      const dto = { periodo: disciplina.periodo, cargaHoraria: disciplina.cargaHoraria }
      const req = { params: { codigo: disciplina.codigo }, body: dto } as unknown as Request
      // Act
      await controller.editar(req, res)
      // Assert
      expect(disciplinaService.editar).toHaveBeenCalledWith(disciplina.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(DisciplinaRespostaMapper.paraResposta(disciplina, curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "cargaHoraria" não é um número', async () => {
      // Arrange
      const req = {
        params: { codigo: '001.001' },
        body: { periodo: 3, nome: 'Cálculo I', cargaHoraria: '60' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(disciplinaService.editar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('deve retornar 204 sem corpo', async () => {
      // Arrange
      disciplinaService.excluir.mockResolvedValue(undefined)
      const req = { params: { codigo: '001.001' } } as unknown as Request
      // Act
      await controller.excluir(req, res)
      // Assert
      expect(disciplinaService.excluir).toHaveBeenCalledWith('001.001')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })

  describe('excluirPorCurso', () => {
    it('deve retornar 204 sem corpo', async () => {
      // Arrange
      disciplinaService.excluirPorCurso.mockResolvedValue(undefined)
      const req = { params: { codigo: '001' } } as unknown as Request
      // Act
      await controller.excluirPorCurso(req, res)
      // Assert
      expect(disciplinaService.excluirPorCurso).toHaveBeenCalledWith('001')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
