import { Curso } from "../entities/curso/curso.entity";
import { CursoService } from './curso.service';
import { ICursoRepository } from '../repositories/curso.repository';
import { CursoMother } from '../../../tests/test-helpers/curso.mother';
import { IDisciplinaRepository } from '../repositories/disciplina.repository';
import { DisciplinaMother } from '../../../tests/test-helpers/disciplina.mother';
import { ErroNaoEncontradoError } from '../errors/erro-nao-encontrado.error';
import { ErroConflitoError } from '../errors/erro-conflito.error';
import { ErroValidacaoError } from '../errors/erro-validacao.error';

describe('Curso Service - Testes unitários', () => {
  let cursoRepository: jest.Mocked<ICursoRepository>
  let disciplinaRepository: jest.Mocked<IDisciplinaRepository>
  let service: CursoService
  let curso : Curso

  beforeEach(() => {
    cursoRepository = CursoMother.criarRepositoryMock()

    disciplinaRepository = DisciplinaMother.criarRepositoryMock()

    service = new CursoService(cursoRepository, disciplinaRepository)

    curso = CursoMother.criar()
  })

  describe('cadastrar', () => {
    it('cadastra um curso com o código "001" quando não há cursos cadastrados', async () => {
      // Arrange
      cursoRepository.buscarPorNome.mockResolvedValue(null)
      cursoRepository.buscarUltimoCodigo.mockResolvedValue(null)
      // Act
      curso = await service.cadastrar({ nome: 'Ciência da Computação', periodos: 8 })
      // Assert
      expect(curso.codigo).toBe('001')
      expect(cursoRepository.cadastrar).toHaveBeenCalledWith(curso)
    })

    it('gera o próximo código sequencial a partir do último código cadastrado', async () => {
      // Arrange
      cursoRepository.buscarPorNome.mockResolvedValue(null)
      cursoRepository.buscarUltimoCodigo.mockResolvedValue('003')
      // Act
      curso = await service.cadastrar({ nome: 'Engenharia de Software', periodos: 8 })
      // Assert
      expect(curso.codigo).toBe('004')
    })

    it('lança ErroConflitoError ao tentar cadastrar um curso com nome já existente', async () => {
      // Arrange
      cursoRepository.buscarPorNome.mockResolvedValue(CursoMother.criar())
      // Act & Assert
      await expect(service.cadastrar({ nome: 'Ciência da Computação', periodos: 8 })).rejects.toThrow(
        ErroConflitoError,
      )
      expect(cursoRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('propaga o ErroValidacaoError lançado pela entidade quando os dados são inválidos', async () => {
      // Arrange
      cursoRepository.buscarPorNome.mockResolvedValue(null)
      cursoRepository.buscarUltimoCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.cadastrar({ nome: 'abc', periodos: 8 })).rejects.toThrow(ErroValidacaoError)
      expect(cursoRepository.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('buscar', () => {
    it('delega a busca para o repositório', async () => {
      // Arrange
      const cursos = [CursoMother.criar()]
      cursoRepository.buscar.mockResolvedValue(cursos)
      // Act
      const resultado = await service.buscar({ nome: 'Ciência' })
      // Assert
      expect(resultado).toBe(cursos)
      expect(cursoRepository.buscar).toHaveBeenCalledWith({ nome: 'Ciência' })
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna o curso quando ele existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      // Act
      const resultado = await service.buscarPorCodigo(curso.codigo)
      // Assert
      expect(resultado).toBe(curso)
    })

    it('lança ErroNaoEncontradoError quando o curso não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.buscarPorCodigo('999')).rejects.toThrow(ErroNaoEncontradoError)
    })
  })

  describe('editar', () => {
    it('atualiza os dados de um curso existente', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      cursoRepository.buscarPorNome.mockResolvedValue(null)
      // Act
      const atualizado = await service.editar(curso.codigo, {
        nome: 'Ciência da Computação - Atualizado',
        periodos: 10,
      })
      // Assert
      expect(atualizado.nome).toBe('Ciência da Computação - Atualizado')
      expect(atualizado.periodos).toBe(10)
      expect(cursoRepository.editar).toHaveBeenCalledWith(atualizado)
    })

    it('lança ErroNaoEncontradoError ao editar um curso que não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.editar('999', { nome: 'Curso Inexistente', periodos: 8 })).rejects.toThrow(
        ErroNaoEncontradoError,
      )
    })

    it('lança ErroConflitoError ao tentar renomear para um nome já usado por outro curso', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: '001' })
      const outroCurso = CursoMother.criar({ codigo: '002', nome: 'Engenharia de Software' })

      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      cursoRepository.buscarPorNome.mockResolvedValue(outroCurso)
      // Act & Assert
      await expect(service.editar(curso.codigo, { nome: 'Engenharia de Software', periodos: 8 })).rejects.toThrow(
        ErroConflitoError,
      )
      expect(cursoRepository.editar).not.toHaveBeenCalled()
    })

    it('permite manter o nome atual do próprio curso', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      cursoRepository.buscarPorNome.mockResolvedValue(curso)
      // Act
      const atualizado = await service.editar(curso.codigo, { nome: curso.nome, periodos: 10 })
      // Assert
      expect(atualizado.periodos).toBe(10)
      expect(cursoRepository.editar).toHaveBeenCalledWith(atualizado)
    })
  })

  describe('excluir', () => {
    it('remove um curso existente', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscar.mockResolvedValue([])
      // Act
      await service.excluir(curso.codigo)
      // Assert
      expect(cursoRepository.excluir).toHaveBeenCalledWith(curso.codigo)
    })

    it('lança ErroNaoEncontradoError ao excluir um curso que não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act
      await expect(service.excluir('999')).rejects.toThrow(ErroNaoEncontradoError)
      // Assert
      expect(cursoRepository.excluir).not.toHaveBeenCalled()
    })

    it('lança ErroConflitoError ao excluir um curso que possui disciplinas cadastradas', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscar.mockResolvedValue([DisciplinaMother.criar()])
      // Act & Assert
      await expect(service.excluir(curso.codigo)).rejects.toThrow(ErroConflitoError)
      expect(cursoRepository.excluir).not.toHaveBeenCalled()
    })
  })
})
