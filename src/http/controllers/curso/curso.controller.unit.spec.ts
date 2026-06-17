import { Request, Response } from 'express';
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { CursoService } from '../../../domain/services/curso.service';
import { CursoController } from './curso.controller';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { CursoRespostaMapper } from '../../mappers/curso-resposta.mapper';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';

describe('Curso Controller - Testes unitários', () => {
  let cursoService: jest.Mocked<CursoService>
  let controller: CursoController
  let res: Response
  const curso : Curso = CursoMother.criar()

  beforeEach(() => {
    cursoService = CursoMother.criarServiceMock()

    controller = new CursoController(cursoService)

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('buscar', () => {
    it('deve retornar 200 com a lista de cursos no formato de resposta', async () => {
      // Arrange
      cursoService.buscar.mockResolvedValue([curso])
      const req = { query: { nome: 'Ciência', codigo: '001' } } as unknown as Request
      // Act
      await controller.buscar(req, res)
      // Assert
      expect(cursoService.buscar).toHaveBeenCalledWith({ nome: 'Ciência', codigo: '001' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([CursoRespostaMapper.paraResposta(curso)])
    })
  })

  describe('buscarPorCodigo', () => {
    it('deve retornar 200 com o curso no formato de resposta', async () => {
      // Arrange
      cursoService.buscarPorCodigo.mockResolvedValue(curso)
      const req = { params: { codigo: curso.codigo } } as unknown as Request
      // Act
      await controller.buscarPorCodigo(req, res)
      // Assert
      expect(cursoService.buscarPorCodigo).toHaveBeenCalledWith(curso.codigo)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso))
    })
  })

  describe('cadastrar', () => {
    it('deve retornar 201 com o curso cadastrado no formato de resposta', async () => {
      // Arrange
      cursoService.cadastrar.mockResolvedValue(curso)
      const dto = { nome: curso.nome, periodos: curso.periodos }
      const req = { body: dto } as unknown as Request
      // Act
      await controller.cadastrar(req, res)
      // Assert
      expect(cursoService.cadastrar).toHaveBeenCalledWith(dto)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "nome" está ausente', async () => {
      // Arrange
      const req = { body: { periodos: 8 } } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(cursoService.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroDadosInvalidosError quando o campo "periodos" não é um número', async () => {
      // Arrange
      const req = { body: { nome: 'Ciência da Computação', periodos: '8' } } as unknown as Request
      // Act & Assert
      await expect(controller.cadastrar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(cursoService.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('editar', () => {
    it('deve retornar 200 com o curso editado no formato de resposta', async () => {
      // Arrange
      cursoService.editar.mockResolvedValue(curso)
      const dto = { nome: curso.nome, periodos: curso.periodos }
      const req = { params: { codigo: curso.codigo }, body: dto } as unknown as Request
      // Act
      await controller.editar(req, res)
      // Assert
      expect(cursoService.editar).toHaveBeenCalledWith(curso.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso))
    })

    it('permite editar apenas um campo (ex: apenas "periodos")', async () => {
      // Arrange
      cursoService.editar.mockResolvedValue(curso)
      const dto = { periodos: 8 }
      const req = { params: { codigo: curso.codigo }, body: dto } as unknown as Request
      // Act
      await controller.editar(req, res)
      // Assert
      expect(cursoService.editar).toHaveBeenCalledWith(curso.codigo, dto)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(CursoRespostaMapper.paraResposta(curso))
    })

    it('lança ErroDadosInvalidosError quando o campo "periodos" não é um número', async () => {
      // Arrange
      const req = {
        params: { codigo: '001' },
        body: { nome: 'Ciência da Computação', periodos: '8' },
      } as unknown as Request
      // Act & Assert
      await expect(controller.editar(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(cursoService.editar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('deve retornar 204 sem corpo', async () => {
      // Arrange
      cursoService.excluir.mockResolvedValue(undefined)
      const req = { params: { codigo: '001' } } as unknown as Request
      // Act
      await controller.excluir(req, res)
      // Assert
      expect(cursoService.excluir).toHaveBeenCalledWith('001')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
