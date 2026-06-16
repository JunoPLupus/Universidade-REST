import { ErroValidacaoError } from '../errors/erro-validacao.error';
import { isAbaixoDoLimite, isAcimaDoLimite } from './utils/value-objects.utils';

/**
 * Classe base para os value objects do domínio.
 *
 * Concentra a lógica de validação de limites (mínimo/máximo) para texto e
 * número, para que cada VO concreto (`Texto`, `Numero`, ...) só precise
 * chamar `validarTexto`/`validarNumero` com o valor recebido e a mensagem
 * de erro a ser usada caso o valor esteja fora dos limites.
 */
export abstract class ValorDominioBase {
  protected constructor(
    protected readonly limiteMinimo?: number,
    protected readonly limiteMaximo?: number,
  ) {}

  /**
   * Aplica `trim()` em `valor` e garante que o tamanho resultante esteja
   * dentro de `[limiteMinimo, limiteMaximo]`.
   *
   * @throws ErroValidacaoError se o tamanho estiver fora dos limites.
   */
  protected validarTexto(valor: string, mensagemInvalida: string): string {
    const texto = valor.trim()

    if (isAbaixoDoLimite(texto.length, this.limiteMinimo) || isAcimaDoLimite(texto.length, this.limiteMaximo)) {
      throw new ErroValidacaoError(mensagemInvalida)
    }

    return texto
  }

  /**
   * Garante que `valor` esteja dentro de `[limiteMinimo, limiteMaximo]`.
   *
   * @throws ErroValidacaoError se o valor estiver fora dos limites.
   */
  protected validarNumero(valor: number, mensagemInvalida: string): number {
    if (isAbaixoDoLimite(valor, this.limiteMinimo) || isAcimaDoLimite(valor, this.limiteMaximo)) {
      throw new ErroValidacaoError(mensagemInvalida)
    }

    return valor
  }
}
