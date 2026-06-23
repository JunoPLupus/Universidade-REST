import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { SemestreMother } from '../../../../tests/test-helpers/semestre.mother';
import { SemestrePgRepositoryImpl } from './semestre-pg.repository.impl';

describe('Implementação PostgreSQL de Semestre Repository - Testes de integração', () => {
  const repository = new SemestrePgRepositoryImpl(prismaTest)
  const semestre = SemestreMother.criar()

  beforeEach(async () => {
    await limparTabelas()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo semestre', async () => {
      // Arrange & Act
      await repository.cadastrar(semestre)
      // Assert
      const encontrado = await repository.buscarPorCodigo(semestre.codigo)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.codigo).toBe(semestre.codigo)
      expect(encontrado?.ano).toBe(semestre.ano)
      expect(encontrado?.semestre).toBe(semestre.semestre)
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna o semestre cadastrado', async () => {
      // Arrange
      await repository.cadastrar(semestre)
      // Act
      const encontrado = await repository.buscarPorCodigo(semestre.codigo)
      // Assert
      expect(encontrado?.codigo).toBe(semestre.codigo)
    })

    it('retorna null quando não existe semestre com o código informado', async () => {
      // Arrange & Act
      const encontrado = await repository.buscarPorCodigo('9999.9')
      // Assert
      expect(encontrado).toBeNull()
    })
  })
})
