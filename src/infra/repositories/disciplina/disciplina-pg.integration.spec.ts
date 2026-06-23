import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { Disciplina } from "../../../domain/entities/disciplina/disciplina.entity";
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { SemestreMother } from '../../../../tests/test-helpers/semestre.mother';
import { LecionamentoMother } from '../../../../tests/test-helpers/lecionamento.mother';
import { CursoPgRepositoryImpl } from '../curso/curso-pg.repository.impl';
import { DisciplinaPgRepositoryImpl } from './disciplina-pg.repository.impl';
import { ProfessorPgRepositoryImpl } from '../professor/professor-pg.repository.impl';
import { SemestrePgRepositoryImpl } from '../semestre/semestre-pg.repository.impl';
import { LecionamentoPgRepositoryImpl } from '../lecionamento/lecionamento-pg.repository.impl';

describe('Implementação PostgreSQL de Disciplina Repository - Testes de integração', () => {
  const cursoRepository = new CursoPgRepositoryImpl(prismaTest)
  const professorRepository = new ProfessorPgRepositoryImpl(prismaTest)
  const semestreRepository = new SemestrePgRepositoryImpl(prismaTest)
  const lecionamentoRepository = new LecionamentoPgRepositoryImpl(prismaTest)
  const repository = new DisciplinaPgRepositoryImpl(prismaTest)
  let disciplina : Disciplina = DisciplinaMother.criar()

  beforeEach(async () => {
    await limparTabelas()
    /* Disciplina depende de Curso (FK cod_curso), então o curso precisa
       existir antes de qualquer disciplina ser cadastrada. */
    await cursoRepository.cadastrar(CursoMother.criar())
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste uma nova disciplina', async () => {
      // Arrange & Act
      await repository.cadastrar(disciplina)
      // Assert
      const encontrada = await repository.buscarPorCodigo(disciplina.codigo)
      expect(encontrada).not.toBeNull()
      expect(encontrada?.codigo).toBe(disciplina.codigo)
      expect(encontrada?.codCurso).toBe(disciplina.codCurso)
      expect(encontrada?.periodo).toBe(disciplina.periodo)
      expect(encontrada?.nome).toBe(disciplina.nome)
      expect(encontrada?.cargaHoraria).toBe(disciplina.cargaHoraria)
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna null quando não existe disciplina com o código informado', async () => {
      // Arrange & Act
      const encontrada = await repository.buscarPorCodigo('999.999')
      // Assert
      expect(encontrada).toBeNull()
    })
  })

  describe('buscarPorNomeECurso', () => {
    it('retorna a disciplina cadastrada com o nome e curso informados', async () => {
      // Arrange
      disciplina = DisciplinaMother.criar({ nome: 'Cálculo I' })
      await repository.cadastrar(disciplina)
      // Act
      const encontrada = await repository.buscarPorNomeECurso('Cálculo I', disciplina.codCurso)
      // Assert
      expect(encontrada?.codigo).toBe(disciplina.codigo)
    })

    it('retorna null quando não existe disciplina com o nome e curso informados', async () => {
      // Arrange & Act
      const encontrada = await repository.buscarPorNomeECurso('Disciplina Inexistente', CursoMother.props().codigo)
      // Assert
      expect(encontrada).toBeNull()
    })
  })

  describe('buscarUltimoCodigoDoCurso', () => {
    it('retorna null quando o curso não possui disciplinas cadastradas', async () => {
      // Arrange & Act
      const ultimoCodigo = await repository.buscarUltimoCodigoDoCurso(CursoMother.props().codigo)
      // Assert
      expect(ultimoCodigo).toBeNull()
    })

    it('retorna o maior código entre as disciplinas cadastradas no curso', async () => {
      // Arrange
      const codCurso = CursoMother.props().codigo
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.001`, nome: 'Cálculo I' }))
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.002`, nome: 'Cálculo II' }))
      // Act
      const ultimoCodigo = await repository.buscarUltimoCodigoDoCurso(codCurso)
      // Assert
      expect(ultimoCodigo).toBe(`${codCurso}.002`)
    })
  })

  describe('buscar', () => {
    const codCurso = CursoMother.props().codigo

    beforeEach(async () => {
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.001`, nome: 'Cálculo I' }))
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.002`, nome: 'Álgebra Linear' }))
    })

    it('retorna todas as disciplinas quando nenhum filtro é informado', async () => {
      // Arrange & Act
      const disciplinas = await repository.buscar({})
      // Assert
      expect(disciplinas).toHaveLength(2)
    })

    it('filtra por código exato', async () => {
      // Arrange & Act
      const disciplinas = await repository.buscar({ codigo: `${codCurso}.001` })
      // Assert
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Cálculo I')
    })

    it('filtra por curso', async () => {
      // Arrange & Act
      const disciplinas = await repository.buscar({ codCurso })
      // Assert
      expect(disciplinas).toHaveLength(2)
    })

    it('filtra por parte do nome, sem diferenciar maiúsculas/minúsculas', async () => {
      // Arrange & Act
      const disciplinas = await repository.buscar({ nome: 'álgebra' })
      // Assert
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Álgebra Linear')
    })

    it('filtra por carga horária exata', async () => {
      // Arrange
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.003`, nome: 'Física I', cargaHoraria: 80 }))
      // Act
      const disciplinas = await repository.buscar({ cargaHoraria: 80 })
      // Assert
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Física I')
    })

    it('filtra por período exato', async () => {
      // Arrange
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.003`, nome: 'Física I', periodo: 5 }))
      // Act
      const disciplinas = await repository.buscar({ periodo: 5 })
      // Assert
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Física I')
    })
  })

  describe('editar', () => {
    it('atualiza os dados de uma disciplina existente', async () => {
      // Arrange
      await repository.cadastrar(disciplina)
      const disciplinaAtualizada = DisciplinaMother.criar({
        codigo: disciplina.codigo,
        nome: 'Cálculo I - Atualizado',
        cargaHoraria: 80,
      })
      // Act
      await repository.editar(disciplinaAtualizada)
      // Assert
      const encontrada = await repository.buscarPorCodigo(disciplina.codigo)
      expect(encontrada?.nome).toBe('Cálculo I - Atualizado')
      expect(encontrada?.cargaHoraria).toBe(80)
    })
  })

  describe('excluir', () => {
    it('remove a disciplina pelo código', async () => {
      // Arrange
      await repository.cadastrar(disciplina)
      // Act
      await repository.excluir(disciplina.codigo)
      // Assert
      const encontrada = await repository.buscarPorCodigo(disciplina.codigo)
      expect(encontrada).toBeNull()
    })
  })

  describe('excluirPorCurso', () => {
    it('remove todas as disciplinas vinculadas ao curso informado', async () => {
      // Arrange
      const codCurso = CursoMother.props().codigo
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.001`, nome: 'Cálculo I' }))
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.002`, nome: 'Álgebra Linear' }))
      // Act
      await repository.excluirPorCurso(codCurso)
      // Assert
      const disciplinas = await repository.buscar({ codCurso })
      expect(disciplinas).toHaveLength(0)
    })
  })

  describe('existeLecionamentoVinculado', () => {
    it('retorna false quando nenhum lecionamento está vinculado à disciplina', async () => {
      // Arrange
      await repository.cadastrar(disciplina)
      // Act
      const existe = await repository.existeLecionamentoVinculado(disciplina.codigo)
      // Assert
      expect(existe).toBe(false)
    })

    it('retorna true quando existe ao menos um lecionamento vinculado à disciplina', async () => {
      // Arrange
      await repository.cadastrar(disciplina)
      const professor = ProfessorMother.criar()
      await professorRepository.cadastrar(professor, UsuarioMother.criar())
      await semestreRepository.cadastrar(SemestreMother.criar())
      await lecionamentoRepository.cadastrar(LecionamentoMother.criar())
      // Act
      const existe = await repository.existeLecionamentoVinculado(disciplina.codigo)
      // Assert
      expect(existe).toBe(true)
    })
  })
})
