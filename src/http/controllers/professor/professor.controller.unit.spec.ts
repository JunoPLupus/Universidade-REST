import { Request, Response } from 'express';
import { ProfessorController } from './professor.controller';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { ProfessorRespostaMapper } from '../../mappers/professor-resposta.mapper';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';
import { ErroNaoAutorizadoError } from '../../../domain/errors/erro-nao-autorizado.error';

describe('Professor Controller - Testes unitarios', () => {
  const professor = ProfessorMother.criar()
  let professorService: ReturnType<typeof ProfessorMother.criarServiceMock>
  let controller: ProfessorController
  let res: Response

  beforeEach(() => {
    professorService = ProfessorMother.criarServiceMock(professor)
    controller = new ProfessorController(professorService)
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('buscar', () => {
    it('deve retornar 200 com a lista de professores', async () => {
      // Arrange
      professorService.buscar.mockResolvedValue([professor])
      const req = { query: { nome: 'Ana' } } as unknown as Request
      // Act
      await controller.buscar(req, res)
      // Assert
      expect(professorService.buscar).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Ana' }))
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([ProfessorRespostaMapper.paraResposta(professor)])
    })
  })

  describe('buscarPorMatricula', () => {
    it('deve retornar 200 com o professor', async () => {
      // Arrange
      const req = { params: { mat: professor.matricula } } as unknown as Request
      // Act
      await controller.buscarPorMatricula(req, res)
      // Assert
      expect(professorService.buscarPorMatricula).toHaveBeenCalledWith(professor.matricula)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(ProfessorRespostaMapper.paraResposta(professor))
    })
  })

  describe('cadastrar', () => {
    it('deve retornar 201 com o professor cadastrado', async () => {
      // Arrange
      professorService.cadastrar.mockResolvedValue(professor)
      const dto = {
        email: professor.emailUsuario,
        cpf: professor.cpf,
        nome: professor.nome,
        senha: 'Senha@123',
        especialidade: professor.especialidade,
        titulacao: professor.titulacao,
      }
      const req = { body: dto } as unknown as Request
      // Act
      await controller.cadastrar(req, res)
      // Assert
      expect(professorService.cadastrar).toHaveBeenCalledWith(dto)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(ProfessorRespostaMapper.paraResposta(professor))
    })

    it('lanca ErroDadosInvalidosError quando campo obrigatorio esta ausente', async () => {
      // Arrange
      const req = { body: { email: 'prof@uni.edu' } } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(professorService.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('atualizar', () => {
    it('admin pode editar qualquer professor', async () => {
      // Arrange
      professorService.atualizar.mockResolvedValue(professor)
      const dto = { titulacao: 'DOUTOR' }
      const req = {
        params: { mat: professor.matricula },
        body: dto,
        user: { email: 'admin@uni.edu', role: 'ADMIN' },
      } as unknown as Request
      // Act
      await controller.atualizar(req, res)
      // Assert
      expect(professorService.atualizar).toHaveBeenCalledWith(professor.matricula, dto)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('professor pode editar a si mesmo', async () => {
      // Arrange
      professorService.atualizar.mockResolvedValue(professor)
      const dto = { especialidade: 'Redes' }
      const req = {
        params: { mat: professor.matricula },
        body: dto,
        user: { email: professor.emailUsuario, role: 'PROFESSOR' },
      } as unknown as Request
      // Act
      await controller.atualizar(req, res)
      // Assert
      expect(professorService.atualizar).toHaveBeenCalledWith(professor.matricula, dto)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('lanca ErroNaoAutorizadoError quando professor tenta editar outro professor', async () => {
      // Arrange
      const req = {
        params: { mat: professor.matricula },
        body: { titulacao: 'DOUTOR' },
        user: { email: 'outro@uni.edu', role: 'PROFESSOR' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.atualizar(req, res)).rejects.toThrow(ErroNaoAutorizadoError)
      expect(professorService.atualizar).not.toHaveBeenCalled()
    })

    it('lanca ErroDadosInvalidosError quando campo opcional tem tipo invalido', async () => {
      // Arrange
      const req = {
        params: { mat: professor.matricula },
        body: { titulacao: 123 },
        user: { email: 'admin@uni.edu', role: 'ADMIN' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.atualizar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(professorService.atualizar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('deve retornar 204 sem corpo', async () => {
      // Arrange
      professorService.excluir.mockResolvedValue(undefined)
      const req = { params: { mat: professor.matricula } } as unknown as Request
      // Act
      await controller.excluir(req, res)
      // Assert
      expect(professorService.excluir).toHaveBeenCalledWith(professor.matricula)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
