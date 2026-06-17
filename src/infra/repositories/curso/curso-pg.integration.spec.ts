import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { CursoMother } from '../../../../tests/test-helpers/curso.mother';
import { CursoPgRepositoryImpl } from './curso-pg.repository.impl';

describe('Implementação PostgreSQL de Curso Repository - Testes de integração', () => {
  const repository = new CursoPgRepositoryImpl(prismaTest)
  let curso : Curso = CursoMother.criar()

  beforeEach(async () => {
    await limparTabelas()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo curso', async () => {
      // Act
      await repository.cadastrar(curso)
      // Assert
      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.codigo).toBe(curso.codigo)
      expect(encontrado?.nome).toBe(curso.nome)
      expect(encontrado?.periodos).toBe(curso.periodos)
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna null quando não existe curso com o código informado', async () => {
      // Arrange & Act
      const encontrado = await repository.buscarPorCodigo('999')
      // Assert
      expect(encontrado).toBeNull()
    })
  })

  describe('buscarPorNome', () => {
    it('retorna o curso cadastrado com o nome exato informado', async () => {
      // Arrange
      curso = CursoMother.criar({ nome: 'Engenharia de Software' })
      await repository.cadastrar(curso)
      // Act
      const encontrado = await repository.buscarPorNome('Engenharia de Software')
      // Assert
      expect(encontrado?.codigo).toBe(curso.codigo)
    })

    it('retorna null quando não existe curso com o nome informado', async () => {
      // Arrange & Act
      const encontrado = await repository.buscarPorNome('Curso Inexistente')
      // Assert
      expect(encontrado).toBeNull()
    })
  })

  describe('buscarUltimoCodigo', () => {
    it('retorna null quando não há cursos cadastrados', async () => {
      // Arrange & Act
      const ultimoCodigo = await repository.buscarUltimoCodigo()
      // Assert
      expect(ultimoCodigo).toBeNull()
    })

    it('retorna o maior código entre os cursos cadastrados', async () => {
      // Arrange
      await repository.cadastrar(CursoMother.criar({ codigo: '001', nome: 'Curso 001' }))
      await repository.cadastrar(CursoMother.criar({ codigo: '002', nome: 'Curso 002' }))
      // Act
      const ultimoCodigo = await repository.buscarUltimoCodigo()
      // Assert
      expect(ultimoCodigo).toBe('002')
    })
  })

  describe('buscar', () => {
    beforeEach(async () => {
      await repository.cadastrar(CursoMother.criar({ codigo: '001', nome: 'Ciência da Computação' }))
      await repository.cadastrar(CursoMother.criar({ codigo: '002', nome: 'Engenharia de Software' }))
    })

    it('retorna todos os cursos quando nenhum filtro é informado', async () => {
      // Arrange & Act
      const cursos = await repository.buscar({})
      // Assert
      expect(cursos).toHaveLength(2)
    })

    it('filtra por código exato', async () => {
      // Arrange & Act
      const cursos = await repository.buscar({ codigo: '001' })
      // Assert
      expect(cursos).toHaveLength(1)
      expect(cursos[0].codigo).toBe('001')
    })

    it('filtra por parte do nome, sem diferenciar maiúsculas/minúsculas', async () => {
      // Arrange & Act
      const cursos = await repository.buscar({ nome: 'engenharia' })
      // Assert
      expect(cursos).toHaveLength(1)
      expect(cursos[0].nome).toBe('Engenharia de Software')
    })
  })

  describe('editar', () => {
    it('atualiza os dados de um curso existente', async () => {
      // Arrange
      await repository.cadastrar(curso)
      const cursoAtualizado = CursoMother.criar({
        codigo: curso.codigo,
        nome: 'Ciência da Computação - Atualizado',
        periodos: 10,
      })
      // Act
      await repository.editar(cursoAtualizado)
      // Assert
      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado?.nome).toBe('Ciência da Computação - Atualizado')
      expect(encontrado?.periodos).toBe(10)
    })
  })

  describe('excluir', () => {
    it('remove o curso pelo código', async () => {
      // Arrange
      await repository.cadastrar(curso)
      // Act
      await repository.excluir(curso.codigo)
      // Assert
      const encontrado = await repository.buscarPorCodigo(curso.codigo)
      expect(encontrado).toBeNull()
    })
  })
})
