import { LecionamentoProps } from './lecionamento.props';

/**
 * Entidade Lecionamento.
 *
 * Representa o vínculo entre uma Disciplina, um Professor e um Semestre,
 * com informações de turno e dia da semana. O construtor é privado: a
 * única forma de obter uma instância é via `criarLecionamento`, e a única
 * forma de montar `LecionamentoProps` válidas é via `LecionamentoFactory`.
 */
export class Lecionamento {
  private constructor(private readonly props: LecionamentoProps) {}

  static criarLecionamento(props: LecionamentoProps): Lecionamento {
    return new Lecionamento(props)
  }

  get codigo(): string {
    return this.props.codigo
  }

  get codDisciplina(): string {
    return this.props.codDisciplina
  }

  get matProfessor(): string {
    return this.props.matProfessor
  }

  get codSemestre(): string {
    return this.props.codSemestre
  }

  get turno(): string {
    return this.props.turno.valor
  }

  get diaSemana(): string {
    return this.props.diaSemana.valor
  }
}
