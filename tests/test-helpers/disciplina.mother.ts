import { Disciplina } from '../../src/domain/entities/disciplina/disciplina.entity';
import { DisciplinaProps } from '../../src/domain/entities/disciplina/disciplina.props';
import { CursoMother } from './curso.mother';

/**
 * Object Mother para a entidade Disciplina.
 *
 * Centraliza a criação de dados válidos de Disciplina para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 * Por padrão, `codCurso` aponta para o curso gerado por `CursoMother`.
 */
export class DisciplinaMother {
  /** Retorna um conjunto de props válidas, com possibilidade de sobrescrita. */
  static props(override: Partial<DisciplinaProps> = {}): DisciplinaProps {
    return {
      codigo: `${CursoMother.props().codigo}.001`,
      codCurso: CursoMother.props().codigo,
      periodo: 3,
      nome: 'Cálculo I',
      cargaHoraria: 60,
      ...override,
    }
  }

  /** Retorna uma instância de Disciplina válida, com possibilidade de sobrescrita. */
  static criar(override: Partial<DisciplinaProps> = {}): Disciplina {
    return Disciplina.criar(this.props(override))
  }
}
