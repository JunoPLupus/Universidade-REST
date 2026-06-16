/**
 * Converte um valor de query string para `string`, aplicando `trim()` e
 * retornando `undefined` caso o valor não tenha sido informado, não seja uma
 * string, ou fique vazio após o `trim()` (nesse caso, equivale a "sem filtro").
 */
export function paraFiltroString(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined

  const texto = valor.trim()

  return texto.length > 0 ? texto : undefined
}

/**
 * Converte um valor de query string para `number`, retornando `undefined`
 * caso o valor não tenha sido informado ou não represente um número válido.
 */
export function paraFiltroNumerico(valor: unknown): number | undefined {
  if (typeof valor !== 'string') return undefined

  const numero = Number(valor.trim())

  return Number.isNaN(numero) ? undefined : numero
}
