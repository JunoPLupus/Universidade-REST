import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { CursoPgRepositoryImpl } from './curso-pg.repository.impl';

describe('Implementação PostgreSQL de Curso Repository - Testes de integração', () => {
  const repository = new CursoPgRepositoryImpl(prismaTest)

  beforeEach(async () => {
    await limparTabelas()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo curso', async () => {
      const curso = CursoMother.criar()

      await repository.cadastrar(curso)

      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.codigo).toBe(curso.codigo)
      expect(encontrado?.nome).toBe(curso.nome)
      expect(encontrado?.periodos).toBe(curso.periodos)
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna null quando não existe curso com o código informado', async () => {
      const encontrado = await repository.buscarPorCodigo('999')
      expect(encontrado).toBeNull()
    })
  })

  describe('buscarPorNome', () => {
    it('retorna o curso cadastrado com o nome exato informado', async () => {
      const curso = CursoMother.criar({ nome: 'Engenharia de Software' })
      await repository.cadastrar(curso)

      const encontrado = await repository.buscarPorNome('Engenharia de Software')

      expect(encontrado?.codigo).toBe(curso.codigo)
    })

    it('retorna null quando não existe curso com o nome informado', async () => {
      const encontrado = await repository.buscarPorNome('Curso Inexistente')
      expect(encontrado).toBeNull()
    })
  })

  describe('buscarUltimoCodigo', () => {
    it('retorna null quando não há cursos cadastrados', async () => {
      const ultimoCodigo = await repository.buscarUltimoCodigo()
      expect(ultimoCodigo).toBeNull()
    })

    it('retorna o maior código entre os cursos cadastrados', async () => {
      await repository.cadastrar(CursoMother.criar({ codigo: '001', nome: 'Curso 001' }))
      await repository.cadastrar(CursoMother.criar({ codigo: '002', nome: 'Curso 002' }))

      const ultimoCodigo = await repository.buscarUltimoCodigo()

      expect(ultimoCodigo).toBe('002')
    })
  })

  describe('buscar', () => {
    beforeEach(async () => {
      await repository.cadastrar(CursoMother.criar({ codigo: '001', nome: 'Ciência da Computação' }))
      await repository.cadastrar(CursoMother.criar({ codigo: '002', nome: 'Engenharia de Software' }))
    })

    it('retorna todos os cursos quando nenhum filtro é informado', async () => {
      const cursos = await repository.buscar({})
      expect(cursos).toHaveLength(2)
    })

    it('filtra por código exato', async () => {
      const cursos = await repository.buscar({ codigo: '001' })
      expect(cursos).toHaveLength(1)
      expect(cursos[0].codigo).toBe('001')
    })

    it('filtra por parte do nome, sem diferenciar maiúsculas/minúsculas', async () => {
      const cursos = await repository.buscar({ nome: 'engenharia' })
      expect(cursos).toHaveLength(1)
      expect(cursos[0].nome).toBe('Engenharia de Software')
    })
  })

  describe('editar', () => {
    it('atualiza os dados de um curso existente', async () => {
      const curso = CursoMother.criar()
      await repository.cadastrar(curso)

      const cursoAtualizado = CursoMother.criar({
        codigo: curso.codigo,
        nome: 'Ciência da Computação - Atualizado',
        periodos: 10,
      })
      await repository.editar(cursoAtualizado)

      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado?.nome).toBe('Ciência da Computação - Atualizado')
      expect(encontrado?.periodos).toBe(10)
    })
  })

  describe('excluir', () => {
    it('remove o curso pelo código', async () => {
      const curso = CursoMother.criar()
      await repository.cadastrar(curso)

      await repository.excluir(curso.codigo)

      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado).toBeNull()
    })
  })
})
