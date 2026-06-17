import { DisciplinaProps } from './disciplina.props';

/**
 * Entidade Disciplina.
 *
 * Representa uma disciplina vinculada a um curso. O construtor é privado: a
 * única forma de obter uma instância é via `criarDisciplina`, e a única
 * forma de montar `DisciplinaProps` válidas é via `DisciplinaFactory`.
 * A regra "periodo não pode exceder o total de períodos do curso" depende de
 * outra entidade (Curso) e por isso é validada no service, não aqui.
 */
export class Disciplina {
  private constructor(private readonly props: DisciplinaProps) {}

  static criarDisciplina(props: DisciplinaProps): Disciplina {
    return new Disciplina(props)
  }

  get codigo(): string {
    return this.props.codigo
  }

  get codCurso(): string {
    return this.props.codCurso
  }

  get periodo(): number {
    return this.props.periodo.valor
  }

  get nome(): string {
    return this.props.nome.valor
  }

  get cargaHoraria(): number {
    return this.props.cargaHoraria.valor
  }
}
