import { ProfessorService } from './professor.service';
import { IProfessorRepository } from '../../repositories/professor.repository';
import { IUsuarioRepository } from '../../repositories/usuario.repository';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { ErroNaoEncontradoError } from '../../errors/erro-nao-encontrado.error';
import { ErroConflitoError } from '../../errors/erro-conflito.error';

jest.mock('../../factories/usuario.factory')
import { UsuarioFactory } from '../../factories/usuario.factory';

describe('Professor Service - Testes unitarios', () => {
  let professorRepository: jest.Mocked<IProfessorRepository>
  let usuarioRepository: jest.Mocked<IUsuarioRepository>
  let service: ProfessorService

  const anoAtual = new Date().getFullYear()
  const professor = ProfessorMother.criar()
  const usuario = UsuarioMother.criar()

  beforeEach(() => {
    professorRepository = ProfessorMother.criarRepositoryMock()
    usuarioRepository = UsuarioMother.criarRepositoryMock()
    service = new ProfessorService(professorRepository, usuarioRepository)
    ;(UsuarioFactory.criar as jest.Mock).mockResolvedValue(usuario)
  })

  describe('cadastrar', () => {
    it('cadastra um professor com a primeira matricula do ano quando nao ha registros no ano', async () => {
      // Arrange
      usuarioRepository.buscarPorEmail.mockResolvedValue(null)
      usuarioRepository.buscarPorCpf.mockResolvedValue(null)
      professorRepository.buscarUltimaMatriculaDoAno.mockResolvedValue(null)
      // Act
      const criado = await service.cadastrar({
        email: professor.emailUsuario,
        cpf: professor.cpf,
        nome: professor.nome,
        senha: 'senha123',
        especialidade: professor.especialidade ?? undefined,
        titulacao: professor.titulacao ?? undefined,
      })
      // Assert
      expect(criado.matricula).toBe(`${anoAtual}.001`)
      expect(professorRepository.cadastrar).toHaveBeenCalledWith(criado, usuario)
    })

    it('gera o proximo numero sequencial a partir da ultima matricula do ano', async () => {
      // Arrange
      usuarioRepository.buscarPorEmail.mockResolvedValue(null)
      usuarioRepository.buscarPorCpf.mockResolvedValue(null)
      professorRepository.buscarUltimaMatriculaDoAno.mockResolvedValue(`${anoAtual}.003`)
      // Act
      const criado = await service.cadastrar({
        email: professor.emailUsuario,
        cpf: professor.cpf,
        nome: professor.nome,
        senha: 'senha123',
      })
      // Assert
      expect(criado.matricula).toBe(`${anoAtual}.004`)
    })

    it('lanca ErroConflitoError se o e-mail ja estiver em uso', async () => {
      // Arrange
      usuarioRepository.buscarPorEmail.mockResolvedValue(usuario)
      // Act & Assert
      await expect(service.cadastrar({
        email: professor.emailUsuario,
        cpf: professor.cpf,
        nome: professor.nome,
        senha: 'senha123',
      })).rejects.toThrow(ErroConflitoError)
      expect(professorRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lanca ErroConflitoError se o CPF ja estiver em uso', async () => {
      // Arrange
      usuarioRepository.buscarPorEmail.mockResolvedValue(null)
      usuarioRepository.buscarPorCpf.mockResolvedValue(usuario)
      // Act & Assert
      await expect(service.cadastrar({
        email: professor.emailUsuario,
        cpf: professor.cpf,
        nome: professor.nome,
        senha: 'senha123',
      })).rejects.toThrow(ErroConflitoError)
      expect(professorRepository.cadastrar).not.toHaveBeenCalled()
    })
  })

  describe('buscar', () => {
    it('delega a busca para o repositorio', async () => {
      // Arrange
      professorRepository.buscar.mockResolvedValue([professor])
      // Act
      const resultado = await service.buscar({ titulacao: 'MESTRE' })
      // Assert
      expect(resultado).toEqual([professor])
      expect(professorRepository.buscar).toHaveBeenCalledWith({ titulacao: 'MESTRE' })
    })
  })

  describe('buscarPorMatricula', () => {
    it('retorna o professor quando ele existe', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      // Act
      const resultado = await service.buscarPorMatricula(professor.matricula)
      // Assert
      expect(resultado).toBe(professor)
    })

    it('lanca ErroNaoEncontradoError quando o professor nao existe', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(null)
      // Act & Assert
      await expect(service.buscarPorMatricula('9999.999')).rejects.toThrow(ErroNaoEncontradoError)
    })
  })

  describe('atualizar', () => {
    it('atualiza especialidade e titulacao do professor existente', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      // Act
      const atualizado = await service.atualizar(professor.matricula, {
        titulacao: 'DOUTOR',
        especialidade: 'Inteligencia Artificial',
      })
      // Assert
      expect(atualizado.titulacao).toBe('DOUTOR')
      expect(atualizado.especialidade).toBe('Inteligencia Artificial')
      expect(professorRepository.atualizar).toHaveBeenCalledWith(atualizado)
      expect(usuarioRepository.atualizar).not.toHaveBeenCalled()
    })

    it('atualiza a senha do usuario vinculado quando senha e informada', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      usuarioRepository.buscarPorEmail.mockResolvedValue(usuario)
      // Act
      await service.atualizar(professor.matricula, { senha: 'novaSenha123' })
      // Assert
      expect(UsuarioFactory.criar).toHaveBeenCalledWith(expect.objectContaining({
        email: professor.emailUsuario,
        senha: 'novaSenha123',
      }))
      expect(usuarioRepository.atualizar).toHaveBeenCalledWith(usuario)
    })

    it('mantém os valores atuais para campos nao informados no DTO', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      // Act
      const atualizado = await service.atualizar(professor.matricula, { titulacao: 'DOUTOR' })
      // Assert
      expect(atualizado.titulacao).toBe('DOUTOR')
      expect(atualizado.especialidade).toBe(professor.especialidade)
    })

    it('lanca ErroNaoEncontradoError ao atualizar professor inexistente', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(null)
      // Act & Assert
      await expect(service.atualizar('9999.999', { titulacao: 'DOUTOR' })).rejects.toThrow(ErroNaoEncontradoError)
      expect(professorRepository.atualizar).not.toHaveBeenCalled()
    })
  })

  describe('excluir', () => {
    it('remove um professor existente', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      // Act
      await service.excluir(professor.matricula)
      // Assert
      expect(professorRepository.excluir).toHaveBeenCalledWith(professor.matricula)
    })

    it('lanca ErroNaoEncontradoError ao excluir professor inexistente', async () => {
      // Arrange
      professorRepository.buscarPorMatricula.mockResolvedValue(null)
      // Act & Assert
      await expect(service.excluir('9999.999')).rejects.toThrow(ErroNaoEncontradoError)
      expect(professorRepository.excluir).not.toHaveBeenCalled()
    })
  })
})
