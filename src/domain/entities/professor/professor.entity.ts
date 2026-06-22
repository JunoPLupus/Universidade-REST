import { ProfessorProps } from './professor.props';

/**
 * Entidade Professor.
 *
 * Agrega os dados do usuario vinculado (nome, cpf) para evitar joins
 * adicionais nas camadas superiores. O construtor e privado: a unica forma de
 * obter uma instancia e via `Professor.criar`, alimentado pela `ProfessorFactory`.
 */
export class Professor {
  private constructor(private readonly props: ProfessorProps) {}

  /**
   * Cria uma instancia de `Professor` a partir de props ja validadas.
   * Deve ser chamado exclusivamente pela `ProfessorFactory` ou pelo mapper.
   *
   * @param props - Props com todos os value objects ja construidos e validados.
   */
  static criar(props: ProfessorProps): Professor {
    return new Professor(props)
  }

  /** Matricula do professor (chave primaria). Formato: `AnoAtual.N`. */
  get matricula(): string { return this.props.matricula }

  /** E-mail do usuario vinculado (chave estrangeira para `usuario`). */
  get emailUsuario(): string { return this.props.emailUsuario.valor }

  /** Nome completo do professor (vindo do usuario vinculado). */
  get nome(): string { return this.props.nome.valor }

  /** CPF formatado como `000.000.000-00` (vindo do usuario vinculado). */
  get cpf(): string { return this.props.cpf.valor }

  /** Area de especializacao do professor, ou `null` se nao informada. */
  get especialidade(): string | null { return this.props.especialidade?.valor ?? null }

  /** Titulacao academica do professor, ou `null` se nao informada. */
  get titulacao(): string | null { return this.props.titulacao }
}
