import { PrismaClient } from '@prisma/client';
import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { Usuario } from '../../../domain/entities/usuario/usuario.entity';
import { UsuarioMapper } from './usuario.mapper';

/**
 * Implementacao do IUsuarioRepository utilizando Prisma/PostgreSQL.
 */
export class UsuarioPgRepositoryImpl implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({ where: { email } })
    return registro ? UsuarioMapper.toDomain(registro) : null
  }

  async buscarPorCpf(cpf: string): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({ where: { cpf } })
    return registro ? UsuarioMapper.toDomain(registro) : null
  }

  async existePorEmail(email: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({ where: { email } })
    return count > 0
  }

  async existePorCpf(cpf: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({ where: { cpf } })
    return count > 0
  }

  async cadastrar(usuario: Usuario): Promise<void> {
    await this.prisma.usuario.create({ data: UsuarioMapper.toPersistence(usuario) })
  }

  async atualizar(usuario: Usuario): Promise<void> {
    await this.prisma.usuario.update({
      where: { email: usuario.email },
      data: UsuarioMapper.toPersistence(usuario),
    })
  }

  async excluir(email: string): Promise<void> {
    await this.prisma.usuario.delete({ where: { email } })
  }
}
