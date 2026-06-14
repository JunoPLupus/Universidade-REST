import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { CursoPgRepositoryImpl } from '../curso/curso-pg.repository.impl';
import { DisciplinaPgRepositoryImpl } from './disciplina-pg.repository.impl';

describe('Implementação PostgreSQL de Disciplina Repository - Testes de integração', () => {
  const cursoRepository = new CursoPgRepositoryImpl(prismaTest)
  const repository = new DisciplinaPgRepositoryImpl(prismaTest)

  beforeEach(async () => {
    await limparTabelas();
    // Disciplina depende de Curso (FK cod_curso), então o curso precisa
    // existir antes de qualquer disciplina ser cadastrada.
    await cursoRepository.cadastrar(CursoMother.criar())
  })

  afterAll(async () => {
    await limparTabelas();
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste uma nova disciplina', async () => {
      const disciplina = DisciplinaMother.criar()

      await repository.cadastrar(disciplina)

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
      const encontrada = await repository.buscarPorCodigo('999.999')
      expect(encontrada).toBeNull()
    })
  })

  describe('buscarPorNomeECurso', () => {
    it('retorna a disciplina cadastrada com o nome e curso informados', async () => {
      const disciplina = DisciplinaMother.criar({ nome: 'Cálculo I' })
      await repository.cadastrar(disciplina)

      const encontrada = await repository.buscarPorNomeECurso('Cálculo I', disciplina.codCurso)

      expect(encontrada?.codigo).toBe(disciplina.codigo)
    })

    it('retorna null quando não existe disciplina com o nome e curso informados', async () => {
      const encontrada = await repository.buscarPorNomeECurso('Disciplina Inexistente', CursoMother.props().codigo)
      expect(encontrada).toBeNull()
    })
  })

  describe('buscarUltimoCodigoDoCurso', () => {
    it('retorna null quando o curso não possui disciplinas cadastradas', async () => {
      const ultimoCodigo = await repository.buscarUltimoCodigoDoCurso(CursoMother.props().codigo)
      expect(ultimoCodigo).toBeNull()
    })

    it('retorna o maior código entre as disciplinas cadastradas no curso', async () => {
      const codCurso = CursoMother.props().codigo
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.001`, nome: 'Cálculo I' }))
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.002`, nome: 'Cálculo II' }))

      const ultimoCodigo = await repository.buscarUltimoCodigoDoCurso(codCurso)

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
      const disciplinas = await repository.buscar({})
      expect(disciplinas).toHaveLength(2)
    })

    it('filtra por código exato', async () => {
      const disciplinas = await repository.buscar({ codigo: `${codCurso}.001` })
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Cálculo I')
    })

    it('filtra por curso', async () => {
      const disciplinas = await repository.buscar({ codCurso })
      expect(disciplinas).toHaveLength(2)
    })

    it('filtra por parte do nome, sem diferenciar maiúsculas/minúsculas', async () => {
      const disciplinas = await repository.buscar({ nome: 'álgebra' })
      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Álgebra Linear')
    })

    it('filtra por carga horária exata', async () => {
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.003`, nome: 'Física I', cargaHoraria: 80 }))

      const disciplinas = await repository.buscar({ cargaHoraria: 80 })

      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Física I')
    })

    it('filtra por período exato', async () => {
      await repository.cadastrar(DisciplinaMother.criar({ codigo: `${codCurso}.003`, nome: 'Física I', periodo: 5 }))

      const disciplinas = await repository.buscar({ periodo: 5 })

      expect(disciplinas).toHaveLength(1)
      expect(disciplinas[0].nome).toBe('Física I')
    })
  })

  describe('editar', () => {
    it('atualiza os dados de uma disciplina existente', async () => {
      const disciplina = DisciplinaMother.criar()
      await repository.cadastrar(disciplina)

      const disciplinaAtualizada = DisciplinaMother.criar({
        codigo: disciplina.codigo,
        nome: 'Cálculo I - Atualizado',
        cargaHoraria: 80,
      })
      await repository.editar(disciplinaAtualizada)

      const encontrada = await repository.buscarPorCodigo(disciplina.codigo)
      expect(encontrada?.nome).toBe('Cálculo I - Atualizado')
      expect(encontrada?.cargaHoraria).toBe(80)
    })
  })

  describe('excluir', () => {
    it('remove a disciplina pelo código', async () => {
      const disciplina = DisciplinaMother.criar()
      await repository.cadastrar(disciplina)

      await repository.excluir(disciplina.codigo)

      const encontrada = await repository.buscarPorCodigo(disciplina.codigo)
      expect(encontrada).toBeNull()
    })
  })
})
