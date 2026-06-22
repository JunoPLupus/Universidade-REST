import { ErroValidacaoError } from '../../errors/erro-validacao.error';

/**
 * Funções utilitárias usadas pelos value objects do domínio para checar
 * limites de tamanho/valor, evitando repetir essas comparações em cada VO.
 */

/** @return `true` se `valor` for menor que `limiteMinimo` (quando informado). */
export function isAbaixoDoLimite(valor: number, limiteMinimo?: number): boolean {
  return limiteMinimo !== undefined && valor < limiteMinimo
}

/** @return `true` se `valor` for maior que `limiteMaximo` (quando informado). */
export function isAcimaDoLimite(valor: number, limiteMaximo?: number): boolean {
  return limiteMaximo !== undefined && valor > limiteMaximo
}

/**
 * Aplica `trim()` em `valor` e garante que o tamanho resultante esteja
 * dentro de `[limiteMinimo, limiteMaximo]`.
 *
 * @throws ErroValidacaoError se o tamanho estiver fora dos limites.
 */
export function validarTexto(
  valor: string,
  mensagemInvalida: string,
  limiteMinimo?: number,
  limiteMaximo?: number,
): string {
  const texto = valor.trim()

  if (isAbaixoDoLimite(texto.length, limiteMinimo) || isAcimaDoLimite(texto.length, limiteMaximo)) {
    throw new ErroValidacaoError(mensagemInvalida)
  }

  return texto
}
