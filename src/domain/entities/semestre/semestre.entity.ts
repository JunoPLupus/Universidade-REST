import { SemestreProps } from './semestre.props';

/**
 * Entidade Semestre.
 *
 * Representa um semestre letivo no formato "Ano.Semestre" (ex: "2026.2").
 * O construtor é privado: a única forma de obter uma instância é via
 * `criarSemestre`, e a única forma de montar `SemestreProps` válidas é
 * via `SemestreFactory`.
 */
export class Semestre {
  private constructor(private readonly props: SemestreProps) {}

  static criarSemestre(props: SemestreProps): Semestre {
    return new Semestre(props)
  }

  get codigo(): string {
    return this.props.codigo
  }

  get ano(): number {
    return this.props.ano.valor
  }

  get semestre(): number {
    return this.props.semestre.valor
  }
}
