import { CursoProps } from './curso.props';

/**
 * Entidade Curso.
 *
 * O construtor é privado: a única forma de obter uma instância é via
 * `criarCurso`, e a única forma de montar `CursoProps` válidas é via
 * `CursoFactory`. Assim, nenhuma instância de `Curso` pode existir em estado
 * inválido.
 */
export class Curso {
  private constructor(private readonly props: CursoProps) {}

  static criarCurso(props: CursoProps): Curso {
    return new Curso(props)
  }

  get codigo(): string {
    return this.props.codigo
  }

  get nome(): string {
    return this.props.nome.valor
  }

  get periodos(): number {
    return this.props.periodos.valor
  }
}
