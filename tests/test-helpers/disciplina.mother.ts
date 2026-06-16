import { Disciplina } from '../../src/domain/entities/disciplina/disciplina.entity';
import { DisciplinaFactory } from '../../src/domain/factories/disciplina.factory';
import { CursoMother } from './curso.mother';

type DisciplinaRawProps = Pick<Disciplina, 'codigo' | 'codCurso' | 'periodo' | 'nome' | 'cargaHoraria'>

/**
 * Object Mother para a entidade Disciplina.
 *
 * Centraliza a criação de dados válidos de Disciplina para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 * Por padrão, `codCurso` aponta para o curso gerado por `CursoMother`.
 */
export class DisciplinaMother {
  /** Retorna um conjunto de props válidas, com possibilidade de sobrescrita. */
  static props(override: Partial<DisciplinaRawProps> = {}): DisciplinaRawProps {
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
  static criar(override: Partial<DisciplinaRawProps> = {}): Disciplina {
    return DisciplinaFactory.criar(this.props(override))
  }
}
