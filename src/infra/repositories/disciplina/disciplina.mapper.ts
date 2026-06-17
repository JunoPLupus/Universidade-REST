import { Disciplina as DisciplinaModel } from '@prisma/client';
import { Disciplina } from '../../../domain/entities/disciplina/disciplina.entity';
import { DisciplinaFactory } from '../../../domain/factories/disciplina.factory';

/**
 * Converte entre o registro do Prisma (tabela `disciplina`) e a entidade de
 * domínio `Disciplina`.
 */
export class DisciplinaMapper {
  /** Reconstitui a entidade de domínio a partir de um registro do banco. */
  static toDomain(raw: DisciplinaModel): Disciplina {
    return DisciplinaFactory.criar({
      codigo: raw.codigo,
      codCurso: raw.codCurso,
      periodo: raw.periodo,
      nome: raw.nome,
      cargaHoraria: raw.cargaHoraria,
    })
  }

  /** Converte a entidade de domínio para o formato aceito pelo Prisma. */
  static toPersistence(disciplina: Disciplina): Pick<Disciplina, 'codigo' | 'codCurso' | 'periodo' | 'nome' | 'cargaHoraria'> {
    return {
      codigo: disciplina.codigo,
      codCurso: disciplina.codCurso,
      periodo: disciplina.periodo,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
    }
  }
}
