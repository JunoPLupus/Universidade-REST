import { ValorDominioBase } from '../value-object.base';

/**
 * Value Object que representa um texto validado do domínio (ex: nome de um
 * curso ou disciplina).
 *
 * Aplica `trim()` no valor recebido e garante que o tamanho resultante
 * esteja dentro do intervalo `[limiteMinimo, limiteMaximo]` informado
 * (quando fornecidos). A instância só existe se o valor for válido —
 * caso contrário, o construtor lança `mensagemInvalida`.
 */
export class Texto extends ValorDominioBase {
  /** Valor já validado e sem espaços nas extremidades. */
  readonly valor: string

  /**
   * @throws ErroValidacaoError se o texto (após `trim()`) tiver tamanho
   * menor que `limiteMinimo` ou maior que `limiteMaximo`.
   */
  constructor(valor: string, mensagemInvalida: string, limiteMinimo?: number, limiteMaximo?: number) {
    super(limiteMinimo, limiteMaximo)
    this.valor = this.validarTexto(valor, mensagemInvalida)
  }
}
