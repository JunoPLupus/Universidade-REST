import { Request, Response } from 'express';
import { Lecionamento } from '../../../domain/entities/lecionamento/lecionamento.entity';
import { Disciplina } from '../../../domain/entities/disciplina/disciplina.entity';
import { Professor } from '../../../domain/entities/professor/professor.entity';
import { Curso } from '../../../domain/entities/curso/curso.entity';
import { LecionamentoService } from '../../../domain/services/lecionamento/lecionamento.service';
import { DisciplinaService } from '../../../domain/services/disciplina/disciplina.service';
import { ProfessorService } from '../../../domain/services/professor/professor.service';
import { CursoService } from '../../../domain/services/curso/curso.service';
import { LecionamentoController } from './lecionamento.controller';
import { LecionamentoRespostaMapper } from '../../mappers/lecionamento-resposta.mapper';
import { LecionamentoMother } from '../../../../tests/test-helpers/lecionamento.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';

describe('Lecionamento Controller - Testes unitários', () => {
  let lecionamentoService: jest.Mocked<LecionamentoService>
  let disciplinaService: jest.Mocked<DisciplinaService>
  let professorService: jest.Mocked<ProfessorService>
  let cursoService: jest.Mocked<CursoService>
  let controller: LecionamentoController
  let res: Response
  let lecionamento: Lecionamento
  let disciplina: Disciplina
  let professor: Professor
  let curso: Curso

  beforeEach(() => {
    lecionamento = LecionamentoMother.criar()
    disciplina = DisciplinaMother.criar()
    professor = ProfessorMother.criar()
    curso = CursoMother.criar()

    lecionamentoService = LecionamentoMother.criarServiceMock()
    disciplinaService = DisciplinaMother.criarServiceMock()
    professorService = ProfessorMother.criarServiceMock(professor)
    cursoService = CursoMother.criarServiceMock(curso)

    disciplinaService.buscarPorCodigo.mockResolvedValue(disciplina)

    controller = new LecionamentoController(
      lecionamentoService,
      disciplinaService,
      professorService,
      cursoService,
    )

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('buscar', () => {
    it('retorna 200 com a lista de lecionamentos no formato de resposta', async () => {
      // Arrange
      lecionamentoService.buscar.mockResolvedValue([lecionamento])
      const req = {
        query: { turno: 'Manhã', diaSemana: 'Seg' },
      } as unknown as Request
      // Act
      await controller.buscar(req, res)
      // Assert
      expect(lecionamentoService.buscar).toHaveBeenCalledWith({
        codigo: undefined,
        codDisciplina: undefined,
        matProfessor: undefined,
        codSemestre: undefined,
        turno: 'Manhã',
        diaSemana: 'Seg',
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([
        LecionamentoRespostaMapper.paraResposta(lecionamento, disciplina, professor, curso),
      ])
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna 200 com o lecionamento no formato de resposta', async () => {
      // Arrange
      lecionamentoService.buscarPorCodigo.mockResolvedValue(lecionamento)
      const req = { params: { codigo: lecionamento.codigo } } as unknown as Request
      // Act
      await controller.buscarPorCodigo(req, res)
      // Assert
      expect(lecionamentoService.buscarPorCodigo).toHaveBeenCalledWith(lecionamento.codigo)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        LecionamentoRespostaMapper.paraResposta(lecionamento, disciplina, professor, curso),
      )
    })
  })

  describe('cadastrar', () => {
    it('retorna 201 com o lecionamento cadastrado no formato de resposta', async () => {
      // Arrange
      lecionamentoService.cadastrar.mockResolvedValue(lecionamento)
      const dto = {
        codDisciplina: lecionamento.codDisciplina,
        matProfessor: lecionamento.matProfessor,
        codSemestre: lecionamento.codSemestre,
        turno: lecionamento.turno,
        diaSemana: lecionamento.diaSemana,
      }
      const req = { body: dto } as unknown as Request
      // Act
      await controller.cadastrar(req, res)
      // Assert
      expect(lecionamentoService.cadastrar).toHaveBeenCalledWith(dto)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        LecionamentoRespostaMapper.paraResposta(lecionamento, disciplina, professor, curso),
      )
    })

    it('lança ErroDadosInvalidosError quando "codDisciplina" está ausente', async () => {
      // Arrange
      const req = {
        body: { matProfessor: '2026.001', codSemestre: '2026.1', turno: 'Manhã', diaSemana: 'Seg' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(lecionamentoService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando "turno" está ausente', async () => {
      // Arrange
      const req = {
        body: { codDisciplina: '001.001', matProfessor: '2026.001', codSemestre: '2026.1', diaSemana: 'Seg' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(lecionamentoService.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('editar', () => {
    it('retorna 200 com o lecionamento editado no formato de resposta', async () => {
      // Arrange
      lecionamentoService.editar.mockResolvedValue(lecionamento)
      const dto = { turno: 'Tarde' }
      const req = { params: { codigo: lecionamento.codigo }, body: dto } as unknown as Request
      // Act
      await controller.editar(req, res)
      // Assert
      expect(lecionamentoService.editar).toHaveBeenCalledWith(lecionamento.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('lança ErroDadosInvalidosError quando "turno" não é string', async () => {
      // Arrange
      const req = {
        params: { codigo: lecionamento.codigo },
        body: { turno: 123 },
      } as unknown as Request
      // Act & Assert
      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(lecionamentoService.editar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('retorna 204 sem corpo', async () => {
      // Arrange
      lecionamentoService.excluir.mockResolvedValue(undefined)
      const req = { params: { codigo: lecionamento.codigo } } as unknown as Request
      // Act
      await controller.excluir(req, res)
      // Assert
      expect(lecionamentoService.excluir).toHaveBeenCalledWith(lecionamento.codigo)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
