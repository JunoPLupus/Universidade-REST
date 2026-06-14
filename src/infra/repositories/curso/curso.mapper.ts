import { Curso as CursoModel } from '@prisma/client';
import { Curso } from '../../../domain/entities/curso/curso.entity';
import { CursoProps } from '../../../domain/entities/curso/curso.props';

/**
 * Converte entre o registro do Prisma (tabela `curso`) e a entidade de
 * domínio `Curso`.
 */
export class CursoMapper {
  /** Reconstitui a entidade de domínio a partir de um registro do banco. */
  static toDomain(raw: CursoModel): Curso {
    return Curso.criar({
      codigo: raw.codigo,
      nome: raw.nome,
      periodos: raw.periodos,
    });
  }

  /** Converte a entidade de domínio para o formato aceito pelo Prisma. */
  static toPersistence(curso: Curso): CursoProps {
    return {
      codigo: curso.codigo,
      nome: curso.nome,
      periodos: curso.periodos,
    };
  }
}
