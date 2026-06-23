import { Semestre as SemestreModel } from '@prisma/client';
import { Semestre } from '../../../domain/entities/semestre/semestre.entity';
import { SemestreFactory } from '../../../domain/factories/semestre.factory';

/**
 * Converte entre o registro do Prisma (tabela `semestre`) e a entidade de
 * domínio `Semestre`.
 */
export class SemestreMapper {
  /** Reconstitui a entidade de domínio a partir de um registro do banco. */
  static toDomain(raw: SemestreModel): Semestre {
    return SemestreFactory.criar({
      ano: raw.ano,
      semestre: raw.semestre,
    })
  }

  /** Converte a entidade de domínio para o formato aceito pelo Prisma. */
  static toPersistence(semestre: Semestre): Pick<SemestreModel, 'codigo' | 'ano' | 'semestre'> {
    return {
      codigo: semestre.codigo,
      ano: semestre.ano,
      semestre: semestre.semestre,
    }
  }
}
