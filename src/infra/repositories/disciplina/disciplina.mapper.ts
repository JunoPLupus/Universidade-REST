import { Disciplina as DisciplinaModel } from '@prisma/client';
import { Disciplina } from '../../../domain/entities/disciplina/disciplina.entity';
import { DisciplinaProps } from '../../../domain/entities/disciplina/disciplina.props';

/**
 * Converte entre o registro do Prisma (tabela `disciplina`) e a entidade de
 * domínio `Disciplina`.
 */
export class DisciplinaMapper {
  /** Reconstitui a entidade de domínio a partir de um registro do banco. */
  static toDomain(raw: DisciplinaModel): Disciplina {
    return Disciplina.criar({
      codigo: raw.codigo,
      codCurso: raw.codCurso,
      periodo: raw.periodo,
      nome: raw.nome,
      cargaHoraria: raw.cargaHoraria,
    });
  }

  /** Converte a entidade de domínio para o formato aceito pelo Prisma. */
  static toPersistence(disciplina: Disciplina): DisciplinaProps {
    return {
      codigo: disciplina.codigo,
      codCurso: disciplina.codCurso,
      periodo: disciplina.periodo,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
    };
  }
}
