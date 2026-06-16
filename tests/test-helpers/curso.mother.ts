import { Curso } from '../../src/domain/entities/curso/curso.entity';
import { CursoFactory } from '../../src/domain/factories/curso.factory';

type CursoRawProps = Pick<Curso, 'codigo' | 'nome' | 'periodos'>

/**
 * Object Mother para a entidade Curso.
 *
 * Centraliza a criação de dados válidos de Curso para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 */
export class CursoMother {
  /** Retorna um conjunto de props válidas, com possibilidade de sobrescrita. */
  static props(override: Partial<CursoRawProps> = {}): CursoRawProps {
    return {
      codigo: '001',
      nome: 'Ciência da Computação',
      periodos: 8,
      ...override,
    }
  }

  /** Retorna uma instância de Curso válida, com possibilidade de sobrescrita. */
  static criar(override: Partial<CursoRawProps> = {}): Curso {
    return CursoFactory.criar(this.props(override))
  }
}
