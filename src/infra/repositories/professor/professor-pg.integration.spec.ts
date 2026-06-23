import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { Professor } from '../../../domain/entities/professor/professor.entity';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { SemestreMother } from '../../../../tests/test-helpers/semestre.mother';
import { LecionamentoMother } from '../../../../tests/test-helpers/lecionamento.mother';
import { ProfessorPgRepositoryImpl } from './professor-pg.repository.impl';
import { CursoPgRepositoryImpl } from '../curso/curso-pg.repository.impl';
import { DisciplinaPgRepositoryImpl } from '../disciplina/disciplina-pg.repository.impl';
import { SemestrePgRepositoryImpl } from '../semestre/semestre-pg.repository.impl';
import { LecionamentoPgRepositoryImpl } from '../lecionamento/lecionamento-pg.repository.impl';

describe('Implementacao PostgreSQL de Professor Repository - Testes de integracao', () => {
  const repository = new ProfessorPgRepositoryImpl(prismaTest)
  const cursoRepository = new CursoPgRepositoryImpl(prismaTest)
  const disciplinaRepository = new DisciplinaPgRepositoryImpl(prismaTest)
  const semestreRepository = new SemestrePgRepositoryImpl(prismaTest)
  const lecionamentoRepository = new LecionamentoPgRepositoryImpl(prismaTest)
  let professor: Professor

  beforeEach(async () => {
    await limparTabelas()
    professor = ProfessorMother.criar()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo professor e o usuario vinculado', async () => {
      // Arrange
      const usuario = UsuarioMother.criar()
      // Act
      await repository.cadastrar(professor, usuario)
      // Assert
      const encontrado = await repository.buscarPorMatricula(professor.matricula)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.matricula).toBe(professor.matricula)
      expect(encontrado?.emailUsuario).toBe(professor.emailUsuario)
      expect(encontrado?.nome).toBe(professor.nome)
      expect(encontrado?.cpf).toBe(professor.cpf)
      expect(encontrado?.especialidade).toBe(professor.especialidade)
      expect(encontrado?.titulacao).toBe(professor.titulacao)
    })
  })

  describe('buscarPorMatricula', () => {
    it('retorna null quando nao existe professor com a matricula informada', async () => {
      // Arrange & Act
      const encontrado = await repository.buscarPorMatricula('9999.99')
      // Assert
      expect(encontrado).toBeNull()
    })

    it('retorna o professor cadastrado com a matricula informada', async () => {
      // Arrange
      await repository.cadastrar(professor, UsuarioMother.criar())
      // Act
      const encontrado = await repository.buscarPorMatricula(professor.matricula)
      // Assert
      expect(encontrado?.matricula).toBe(professor.matricula)
    })
  })

  describe('buscarUltimaMatriculaDoAno', () => {
    it('retorna null quando nao ha professores cadastrados no ano', async () => {
      // Arrange & Act
      const ultima = await repository.buscarUltimaMatriculaDoAno(2026)
      // Assert
      expect(ultima).toBeNull()
    })

    it('retorna a matricula com o maior numero sequencial do ano', async () => {
      // Arrange
      const usuario1 = UsuarioMother.criar({ email: 'prof1@uni.edu.br', cpf: '529.982.247-25' })
      const usuario2 = UsuarioMother.criar({ email: 'prof2@uni.edu.br', cpf: '853.513.468-93' })
      await repository.cadastrar(ProfessorMother.criar({ matricula: '2026.1', emailUsuario: usuario1.email, cpf: usuario1.cpf }), usuario1)
      await repository.cadastrar(ProfessorMother.criar({ matricula: '2026.2', emailUsuario: usuario2.email, cpf: usuario2.cpf, nome: 'Maria Santos' }), usuario2)
      // Act
      const ultima = await repository.buscarUltimaMatriculaDoAno(2026)
      // Assert
      expect(ultima).toBe('2026.2')
    })
  })

  describe('buscar', () => {
    beforeEach(async () => {
      const u1 = UsuarioMother.criar({ email: 'joao@uni.edu.br', cpf: '529.982.247-25' })
      const u2 = UsuarioMother.criar({ email: 'maria@uni.edu.br', cpf: '853.513.468-93', nome: 'Maria Santos' })
      await repository.cadastrar(
        ProfessorMother.criar({ matricula: '2026.1', emailUsuario: u1.email, cpf: u1.cpf, titulacao: 'MESTRE' }),
        u1,
      )
      await repository.cadastrar(
        ProfessorMother.criar({ matricula: '2026.2', emailUsuario: u2.email, cpf: u2.cpf, nome: u2.nome, titulacao: 'DOUTOR', especialidade: 'Banco de Dados' }),
        u2,
      )
    })

    it('retorna todos os professores quando nenhum filtro e informado', async () => {
      // Arrange & Act
      const professores = await repository.buscar({})
      // Assert
      expect(professores).toHaveLength(2)
    })

    it('filtra por matricula exata', async () => {
      // Arrange & Act
      const professores = await repository.buscar({ matricula: '2026.1' })
      // Assert
      expect(professores).toHaveLength(1)
      expect(professores[0].matricula).toBe('2026.1')
    })

    it('filtra por email do usuario vinculado', async () => {
      // Arrange & Act
      const professores = await repository.buscar({ email: 'joao@uni.edu.br' })
      // Assert
      expect(professores).toHaveLength(1)
      expect(professores[0].emailUsuario).toBe('joao@uni.edu.br')
    })

    it('filtra por parte do nome, sem diferenciar maiusculas/minusculas', async () => {
      // Arrange & Act
      const professores = await repository.buscar({ nome: 'maria' })
      // Assert
      expect(professores).toHaveLength(1)
      expect(professores[0].nome).toBe('Maria Santos')
    })

    it('filtra por titulacao', async () => {
      // Arrange & Act
      const professores = await repository.buscar({ titulacao: 'DOUTOR' })
      // Assert
      expect(professores).toHaveLength(1)
      expect(professores[0].titulacao).toBe('DOUTOR')
    })

    it('filtra por parte da especialidade, sem diferenciar maiusculas/minusculas', async () => {
      // Arrange & Act
      const professores = await repository.buscar({ especialidade: 'banco' })
      // Assert
      expect(professores).toHaveLength(1)
      expect(professores[0].especialidade).toBe('Banco de Dados')
    })
  })

  describe('atualizar', () => {
    it('atualiza especialidade e titulacao do professor', async () => {
      // Arrange
      await repository.cadastrar(professor, UsuarioMother.criar())
      const atualizado = ProfessorMother.criar({
        matricula: professor.matricula,
        titulacao: 'DOUTOR',
        especialidade: 'Inteligencia Artificial',
      })
      // Act
      await repository.atualizar(atualizado)
      // Assert
      const encontrado = await repository.buscarPorMatricula(professor.matricula)
      expect(encontrado?.titulacao).toBe('DOUTOR')
      expect(encontrado?.especialidade).toBe('Inteligencia Artificial')
    })
  })

  describe('excluir', () => {
    it('remove o professor e o usuario vinculado', async () => {
      // Arrange
      await repository.cadastrar(professor, UsuarioMother.criar())
      // Act
      await repository.excluir(professor.matricula)
      // Assert
      const encontrado = await repository.buscarPorMatricula(professor.matricula)
      expect(encontrado).toBeNull()
      const usuarioNoDb = await prismaTest.usuario.findUnique({ where: { email: professor.emailUsuario } })
      expect(usuarioNoDb).toBeNull()
    })

    it('nao lanca erro ao tentar excluir matricula inexistente', async () => {
      // Arrange & Act & Assert
      await expect(repository.excluir('9999.99')).resolves.not.toThrow()
    })
  })

  describe('existeLecionamentoVinculado', () => {
    it('retorna false quando nenhum lecionamento esta vinculado ao professor', async () => {
      // Arrange
      await repository.cadastrar(professor, UsuarioMother.criar())
      // Act
      const existe = await repository.existeLecionamentoVinculado(professor.matricula)
      // Assert
      expect(existe).toBe(false)
    })

    it('retorna true quando existe ao menos um lecionamento vinculado ao professor', async () => {
      // Arrange
      await repository.cadastrar(professor, UsuarioMother.criar())
      await cursoRepository.cadastrar(CursoMother.criar())
      await disciplinaRepository.cadastrar(DisciplinaMother.criar())
      await semestreRepository.cadastrar(SemestreMother.criar())
      await lecionamentoRepository.cadastrar(LecionamentoMother.criar())
      // Act
      const existe = await repository.existeLecionamentoVinculado(professor.matricula)
      // Assert
      expect(existe).toBe(true)
    })
  })
})
