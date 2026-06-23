import { Lecionamento as LecionamentoModel } from '@prisma/client';
import { Lecionamento } from '../../../domain/entities/lecionamento/lecionamento.entity';
import { LecionamentoFactory } from '../../../domain/factories/lecionamento.factory';

/**
 * Converte entre o registro do Prisma (tabela `lecionamento`) e a entidade de
 * domínio `Lecionamento`.
 */
export class LecionamentoMapper {
  /** Reconstitui a entidade de domínio a partir de um registro do banco. */
  static toDomain(raw: LecionamentoModel): Lecionamento {
    return LecionamentoFactory.criar({
      codigo: raw.codigo,
      codDisciplina: raw.codDisciplina,
      matProfessor: raw.matProfessor,
      codSemestre: raw.codSemestre,
      turno: raw.turno,
      diaSemana: raw.diaSemana,
    })
  }

  /** Converte a entidade de domínio para o formato aceito pelo Prisma. */
  static toPersistence(lecionamento: Lecionamento): Pick<
    LecionamentoModel,
    'codigo' | 'codDisciplina' | 'matProfessor' | 'codSemestre' | 'turno' | 'diaSemana'
  > {
    return {
      codigo: lecionamento.codigo,
      codDisciplina: lecionamento.codDisciplina,
      matProfessor: lecionamento.matProfessor,
      codSemestre: lecionamento.codSemestre,
      turno: lecionamento.turno,
      diaSemana: lecionamento.diaSemana,
    }
  }
}
