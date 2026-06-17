import { Disciplina } from "../entities/disciplina/disciplina.entity";
import { IDisciplinaRepository } from '../repositories/disciplina.repository';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaMother } from '../../../tests/test-helpers/disciplina.mother';
import { Curso } from "../entities/curso/curso.entity";
import { ICursoRepository } from '../repositories/curso.repository';
import { CursoMother } from '../../../tests/test-helpers/curso.mother';
import { ErroNaoEncontradoError } from '../errors/erro-nao-encontrado.error';
import { ErroConflitoError } from '../errors/erro-conflito.error';
import { ErroValidacaoError } from '../errors/erro-validacao.error';

describe('Disciplina Service - Testes unitários', () => {
  let disciplinaRepository: jest.Mocked<IDisciplinaRepository>
  let cursoRepository: jest.Mocked<ICursoRepository>
  let service: DisciplinaService
  let curso : Curso
  let disciplina : Disciplina

  beforeEach(() => {
    disciplinaRepository = DisciplinaMother.criarRepositoryMock()

    cursoRepository = CursoMother.criarRepositoryMock()

    service = new DisciplinaService(disciplinaRepository, cursoRepository)

    curso = CursoMother.criar()
    disciplina = DisciplinaMother.criar()
  })

  describe('cadastrar', () => {
    it('cadastra uma disciplina com o código "<codCurso>.001" quando o curso não tem disciplinas', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: '001', periodos: 8 })
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null)
      disciplinaRepository.buscarUltimoCodigoDoCurso.mockResolvedValue(null)
      // Act
      disciplina = await service.cadastrar({
        codCurso: '001',
        periodo: 3,
        nome: 'Cálculo I',
        cargaHoraria: 60,
      })
      // Assert
      expect(disciplina.codigo).toBe('001.001')
      expect(disciplinaRepository.cadastrar).toHaveBeenCalledWith(disciplina)
    })

    it('gera o próximo código sequencial a partir do último código cadastrado no curso', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: '001', periodos: 8 })
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null)
      disciplinaRepository.buscarUltimoCodigoDoCurso.mockResolvedValue('001.002')
      // Act
      disciplina = await service.cadastrar({
        codCurso: '001',
        periodo: 3,
        nome: 'Álgebra Linear',
        cargaHoraria: 60,
      })
      // Assert
      expect(disciplina.codigo).toBe('001.003')
    })

    it('lança ErroNaoEncontradoError quando o curso informado não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({ codCurso: '999', periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroNaoEncontradoError)
      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroValidacaoError quando o período excede o total de períodos do curso', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: '001', periodos: 4 })
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      // Act & Assert
      await expect(
        service.cadastrar({ codCurso: '001', periodo: 5, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroValidacaoError)
      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroConflitoError ao cadastrar uma disciplina com nome já usado no mesmo curso', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: '001', periodos: 8 })
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(DisciplinaMother.criar())
      // Act & Assert
      await expect(
        service.cadastrar({ codCurso: '001', periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroConflitoError)
      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('buscar', () => {
    it('delega a busca para o repositório', async () => {
      // Arrange
      const disciplinas = [DisciplinaMother.criar()]
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscar.mockResolvedValue(disciplinas)
      // Act
      const resultado = await service.buscar({ codCurso: '001' })
      // Assert
      expect(resultado).toBe(disciplinas)
      expect(disciplinaRepository.buscar).toHaveBeenCalledWith({ codCurso: '001' })
    })

    it('delega a busca para o repositório incluindo os filtros de cargaHoraria e periodo', async () => {
      // Arrange
      const disciplinas = [DisciplinaMother.criar()]
      disciplinaRepository.buscar.mockResolvedValue(disciplinas)
      // Act
      const resultado = await service.buscar({ cargaHoraria: 60, periodo: 3 })
      // Assert
      expect(resultado).toBe(disciplinas)
      expect(disciplinaRepository.buscar).toHaveBeenCalledWith({ cargaHoraria: 60, periodo: 3 })
    })

    it('lança ErroNaoEncontradoError quando o curso não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.buscar({ codCurso: 'Inexistente' })).rejects.toThrow(ErroNaoEncontradoError)
      expect(disciplinaRepository.buscar).not.toHaveBeenCalled()
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna a disciplina quando ela existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      // Act
      const resultado = await service.buscarPorCodigo(disciplina.codigo)
      // Assert
      expect(resultado).toBe(disciplina)
    })

    it('lança ErroNaoEncontradoError quando a disciplina não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.buscarPorCodigo('999.999')).rejects.toThrow(ErroNaoEncontradoError)
    })
  })

  describe('editar', () => {
    it('atualiza os dados de uma disciplina existente', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 })
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null)
      // Act
      const atualizada = await service.editar(disciplina.codigo, {
        periodo: 4,
        nome: 'Cálculo I - Atualizado',
        cargaHoraria: 80,
      })
      // Assert
      expect(atualizada.nome).toBe('Cálculo I - Atualizado')
      expect(atualizada.cargaHoraria).toBe(80)
      expect(atualizada.codCurso).toBe(disciplina.codCurso)
      expect(disciplinaRepository.editar).toHaveBeenCalledWith(atualizada)
    })

    it('lança ErroNaoEncontradoError ao editar uma disciplina que não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.editar('999.999', { periodo: 3, nome: 'Inexistente', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroNaoEncontradoError)
    })

    it('lança ErroValidacaoError quando o novo período excede o total de períodos do curso', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 4 })
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      // Act & Assert
      await expect(
        service.editar(disciplina.codigo, { periodo: 5, nome: disciplina.nome, cargaHoraria: 60 }),
      ).rejects.toThrow(ErroValidacaoError)
      expect(disciplinaRepository.editar).not.toHaveBeenCalled()
    })

    it('lança ErroConflitoError ao renomear para um nome já usado por outra disciplina do mesmo curso', async () => {
      // Arrange
      disciplina = DisciplinaMother.criar({ codigo: '001.001', nome: 'Cálculo I' })
      const outraDisciplina = DisciplinaMother.criar({ codigo: '001.002', nome: 'Álgebra Linear' })
      curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 })

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(outraDisciplina)
      // Act & Assert
      await expect(
        service.editar(disciplina.codigo, { periodo: 3, nome: 'Álgebra Linear', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroConflitoError)
      expect(disciplinaRepository.editar).not.toHaveBeenCalled()
    })

    it('permite manter o nome atual da própria disciplina', async () => {
      // Arrange
      curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 })

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(disciplina)
      // Act
      const atualizada = await service.editar(disciplina.codigo, {
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: 80,
      })
      // Assert
      expect(atualizada.cargaHoraria).toBe(80)
    })
  })

  describe('excluir', () => {
    it('remove uma disciplina existente', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      // Act
      await service.excluir(disciplina.codigo)
      // Assert
      expect(disciplinaRepository.excluir).toHaveBeenCalledWith(disciplina.codigo)
    })

    it('lança ErroNaoEncontradoError ao excluir uma disciplina que não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act
      await expect(service.excluir('999.999')).rejects.toThrow(ErroNaoEncontradoError)
      // Assert
      expect(disciplinaRepository.excluir).not.toHaveBeenCalled()
    })
  })

  describe('excluirPorCurso', () => {
    it('remove todas as disciplinas vinculadas ao curso informado', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso)
      // Act
      await service.excluirPorCurso(curso.codigo)
      // Assert
      expect(disciplinaRepository.excluirPorCurso).toHaveBeenCalledWith(curso.codigo)
    })

    it('lança ErroNaoEncontradoError quando o curso não existe', async () => {
      // Arrange
      cursoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act
      await expect(service.excluirPorCurso('999')).rejects.toThrow(ErroNaoEncontradoError)
      // Assert
      expect(disciplinaRepository.excluirPorCurso).not.toHaveBeenCalled()
    })
  })
})
