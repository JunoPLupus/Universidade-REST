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
