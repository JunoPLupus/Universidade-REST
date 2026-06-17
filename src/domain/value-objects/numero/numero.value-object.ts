import { ValorDominioBase } from '../value-object.base';

/**
 * Value Object que representa um número validado do domínio (ex: períodos de
 * um curso, período/carga horária de uma disciplina).
 *
 * Garante que o valor esteja dentro do intervalo `[limiteMinimo, limiteMaximo]`
 * informado (quando fornecidos). A instância só existe se o valor for válido —
 * caso contrário, o construtor lança `mensagemInvalida`.
 */
export class Numero extends ValorDominioBase {
  /** Valor já validado. */
  readonly valor: number

  /**
   * @throws ErroValidacaoError se o valor for menor que `limiteMinimo` ou
   * maior que `limiteMaximo`.
   */
  constructor(valor: number, mensagemInvalida: string, limiteMinimo?: number, limiteMaximo?: number) {
    super(limiteMinimo, limiteMaximo)
    this.valor = this.validarNumero(valor, mensagemInvalida)
  }
}
