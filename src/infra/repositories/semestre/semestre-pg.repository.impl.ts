import { PrismaClient } from '@prisma/client';
import { ISemestreRepository } from '../../../domain/repositories/semestre.repository';
import { Semestre } from '../../../domain/entities/semestre/semestre.entity';
import { SemestreMapper } from './semestre.mapper';

/**
 * Implementação do ISemestreRepository utilizando Prisma/PostgreSQL.
 */
export class SemestrePgRepositoryImpl implements ISemestreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscarPorCodigo(codigo: string): Promise<Semestre | null> {
    const registro = await this.prisma.semestre.findUnique({ where: { codigo } })
    return registro ? SemestreMapper.toDomain(registro) : null
  }

  async cadastrar(semestre: Semestre): Promise<void> {
    await this.prisma.semestre.create({ data: SemestreMapper.toPersistence(semestre) })
  }
}
