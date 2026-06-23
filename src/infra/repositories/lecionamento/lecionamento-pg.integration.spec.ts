import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { SemestreMother } from '../../../../tests/test-helpers/semestre.mother';
import { LecionamentoMother } from '../../../../tests/test-helpers/lecionamento.mother';
import { Lecionamento } from '../../../domain/entities/lecionamento/lecionamento.entity';
import { CursoPgRepositoryImpl } from '../curso/curso-pg.repository.impl';
import { DisciplinaPgRepositoryImpl } from '../disciplina/disciplina-pg.repository.impl';
import { ProfessorPgRepositoryImpl } from '../professor/professor-pg.repository.impl';
import { SemestrePgRepositoryImpl } from '../semestre/semestre-pg.repository.impl';
import { LecionamentoPgRepositoryImpl } from './lecionamento-pg.repository.impl';

describe('Implementação PostgreSQL de Lecionamento Repository - Testes de integração', () => {
  const cursoRepository = new CursoPgRepositoryImpl(prismaTest)
  const disciplinaRepository = new DisciplinaPgRepositoryImpl(prismaTest)
  const professorRepository = new ProfessorPgRepositoryImpl(prismaTest)
  const semestreRepository = new SemestrePgRepositoryImpl(prismaTest)
  const repository = new LecionamentoPgRepositoryImpl(prismaTest)

  let lecionamento: Lecionamento

  beforeEach(async () => {
    await limparTabelas()

    // Lecionamento depende de Disciplina, Professor e Semestre
    await cursoRepository.cadastrar(CursoMother.criar())
    await disciplinaRepository.cadastrar(DisciplinaMother.criar())
    await professorRepository.cadastrar(ProfessorMother.criar(), UsuarioMother.criar())
    await semestreRepository.cadastrar(SemestreMother.criar())

    lecionamento = LecionamentoMother.criar()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo lecionamento', async () => {
      // Arrange & Act
      await repository.cadastrar(lecionamento)
      // Assert
      const encontrado = await repository.buscarPorCodigo(lecionamento.codigo)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.codigo).toBe(lecionamento.codigo)
      expect(encontrado?.codDisciplina).toBe(lecionamento.codDisciplina)
      expect(encontrado?.matProfessor).toBe(lecionamento.matProfessor)
      expect(encontrado?.codSemestre).toBe(lecionamento.codSemestre)
      expect(encontrado?.turno).toBe(lecionamento.turno)
      expect(encontrado?.diaSemana).toBe(lecionamento.diaSemana)
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna null quando não existe lecionamento com o código informado', async () => {
      // Arrange & Act
      const encontrado = await repository.buscarPorCodigo('9999.9.999.999')
      // Assert
      expect(encontrado).toBeNull()
    })
  })

  describe('buscarUltimoCodigoDoSemestreCurso', () => {
    it('retorna null quando não existem lecionamentos para o semestre e curso', async () => {
      // Arrange & Act
      const codigo = await repository.buscarUltimoCodigoDoSemestreCurso(
        SemestreMother.props().codigo,
        CursoMother.props().codigo,
      )
      // Assert
      expect(codigo).toBeNull()
    })

    it('retorna o maior código entre os lecionamentos do semestre e curso', async () => {
      // Arrange
      const semCod = SemestreMother.props().codigo
      const curCod = CursoMother.props().codigo
      const disciplina2 = DisciplinaMother.criar({ codigo: `${curCod}.002`, nome: 'Álgebra Linear' })
      await disciplinaRepository.cadastrar(disciplina2)

      await repository.cadastrar(LecionamentoMother.criar({
        codigo: `${semCod}.${curCod}.001`,
        codDisciplina: `${curCod}.001`,
      }))
      await repository.cadastrar(LecionamentoMother.criar({
        codigo: `${semCod}.${curCod}.002`,
        codDisciplina: `${curCod}.002`,
        diaSemana: 'Ter',
      }))
      // Act
      const ultimoCodigo = await repository.buscarUltimoCodigoDoSemestreCurso(semCod, curCod)
      // Assert
      expect(ultimoCodigo).toBe(`${semCod}.${curCod}.002`)
    })
  })

  describe('buscar', () => {
    beforeEach(async () => {
      await repository.cadastrar(lecionamento)
    })

    it('retorna todos os lecionamentos quando nenhum filtro é informado', async () => {
      // Arrange & Act
      const resultado = await repository.buscar({})
      // Assert
      expect(resultado).toHaveLength(1)
    })

    it('filtra por código exato', async () => {
      // Arrange & Act
      const resultado = await repository.buscar({ codigo: lecionamento.codigo })
      // Assert
      expect(resultado).toHaveLength(1)
      expect(resultado[0].codigo).toBe(lecionamento.codigo)
    })

    it('filtra por turno', async () => {
      // Arrange & Act
      const resultado = await repository.buscar({ turno: lecionamento.turno })
      // Assert
      expect(resultado).toHaveLength(1)
    })

    it('retorna lista vazia quando o filtro não bate com nenhum registro', async () => {
      // Arrange & Act
      const resultado = await repository.buscar({ turno: 'Noite' })
      // Assert
      expect(resultado).toHaveLength(0)
    })
  })

  describe('editar', () => {
    it('atualiza os dados de um lecionamento existente', async () => {
      // Arrange
      await repository.cadastrar(lecionamento)
      const atualizado = LecionamentoMother.criar({
        codigo: lecionamento.codigo,
        turno: 'Noite',
        diaSemana: 'Sex',
      })
      // Act
      await repository.editar(atualizado)
      // Assert
      const encontrado = await repository.buscarPorCodigo(lecionamento.codigo)
      expect(encontrado?.turno).toBe('Noite')
      expect(encontrado?.diaSemana).toBe('Sex')
    })
  })

  describe('excluir', () => {
    it('remove o lecionamento pelo código', async () => {
      // Arrange
      await repository.cadastrar(lecionamento)
      // Act
      await repository.excluir(lecionamento.codigo)
      // Assert
      const encontrado = await repository.buscarPorCodigo(lecionamento.codigo)
      expect(encontrado).toBeNull()
    })
  })

  describe('existePorDisciplina', () => {
    it('retorna true quando existe lecionamento vinculado à disciplina', async () => {
      // Arrange
      await repository.cadastrar(lecionamento)
      // Act
      const existe = await repository.existePorDisciplina(lecionamento.codDisciplina)
      // Assert
      expect(existe).toBe(true)
    })

    it('retorna false quando não existe lecionamento vinculado à disciplina', async () => {
      // Arrange & Act
      const existe = await repository.existePorDisciplina('999.999')
      // Assert
      expect(existe).toBe(false)
    })
  })

  describe('existePorProfessor', () => {
    it('retorna true quando existe lecionamento vinculado ao professor', async () => {
      // Arrange
      await repository.cadastrar(lecionamento)
      // Act
      const existe = await repository.existePorProfessor(lecionamento.matProfessor)
      // Assert
      expect(existe).toBe(true)
    })

    it('retorna false quando não existe lecionamento vinculado ao professor', async () => {
      // Arrange & Act
      const existe = await repository.existePorProfessor('9999.999')
      // Assert
      expect(existe).toBe(false)
    })
  })
})
