import { limparTabelas, prismaTest } from '../../../../tests/test-helpers/prisma-test-client';
import { Usuario } from "../../../domain/entities/usuario/usuario.entity";
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { UsuarioPgRepositoryImpl } from './usuario-pg.repository.impl';

describe('Implementacao PostgreSQL de Usuario Repository - Testes de integracao', () => {
  const repository = new UsuarioPgRepositoryImpl(prismaTest)
  let usuario: Usuario

  beforeEach(async () => {
    await limparTabelas()

    usuario = UsuarioMother.criar()
  })

  afterAll(async () => {
    await limparTabelas()
    await prismaTest.$disconnect()
  })

  describe('cadastrar', () => {
    it('persiste um novo usuario', async () => {
      await repository.cadastrar(usuario)

      const encontrado = await repository.buscarPorEmail(usuario.email)
      expect(encontrado).not.toBeNull()
      expect(encontrado?.email).toBe(usuario.email)
      expect(encontrado?.cpf).toBe(usuario.cpf)
      expect(encontrado?.nome).toBe(usuario.nome)
      expect(encontrado?.role).toBe(usuario.role)
    })
  })

  describe('buscarPorEmail', () => {
    it('retorna null quando nao existe usuario com o email informado', async () => {
      const encontrado = await repository.buscarPorEmail('inexistente@email.com')
      expect(encontrado).toBeNull()
    })

    it('retorna o usuario cadastrado com o email informado', async () => {
      await repository.cadastrar(usuario)

      const encontrado = await repository.buscarPorEmail(usuario.email)
      expect(encontrado?.email).toBe(usuario.email)
    })
  })

  describe('buscarPorCpf', () => {
    it('retorna null quando nao existe usuario com o CPF informado', async () => {
      const encontrado = await repository.buscarPorCpf('529.982.247-25')
      expect(encontrado).toBeNull()
    })

    it('retorna o usuario cadastrado com o CPF informado', async () => {
      await repository.cadastrar(usuario)

      const encontrado = await repository.buscarPorCpf(usuario.cpf)
      expect(encontrado?.cpf).toBe(usuario.cpf)
    })
  })

  describe('existePorEmail', () => {
    it('retorna false quando nao existe usuario com o email informado', async () => {
      const existe = await repository.existePorEmail('inexistente@email.com')
      expect(existe).toBe(false)
    })

    it('retorna true quando existe usuario com o email informado', async () => {
      await repository.cadastrar(usuario)

      const existe = await repository.existePorEmail(usuario.email)
      expect(existe).toBe(true)
    })
  })

  describe('existePorCpf', () => {
    it('retorna false quando nao existe usuario com o CPF informado', async () => {
      const existe = await repository.existePorCpf('529.982.247-25')
      expect(existe).toBe(false)
    })

    it('retorna true quando existe usuario com o CPF informado', async () => {
      await repository.cadastrar(usuario)

      const existe = await repository.existePorCpf(usuario.cpf)
      expect(existe).toBe(true)
    })
  })

  describe('atualizar', () => {
    it('atualiza os dados de um usuario existente', async () => {
      await repository.cadastrar(usuario)

      const usuarioAtualizado = UsuarioMother.criar({ nome: 'Nome Atualizado' })

      await repository.atualizar(usuarioAtualizado)

      const encontrado = await repository.buscarPorEmail(usuario.email)
      expect(encontrado?.nome).toBe('Nome Atualizado')
    })
  })

  describe('excluir', () => {
    it('remove o usuario pelo email', async () => {
      await repository.cadastrar(usuario)

      await repository.excluir(usuario.email)

      const encontrado = await repository.buscarPorEmail(usuario.email)
      expect(encontrado).toBeNull()
    })
  })
})
