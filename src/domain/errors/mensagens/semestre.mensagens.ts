/**
 * Mensagens de erro relacionadas a Semestre.
 */
export const semestreMensagens = {
  naoEncontrado: (codigo: string): string =>
    `Semestre com código '${codigo}' não encontrado.`,

  codigoInvalido: (): string =>
    `O código do semestre deve estar no formato 'AAAA.S' onde S é 1 ou 2 (ex: '2026.2').`,

  anoInvalido: (): string =>
    `O ano do semestre deve ser um valor válido (maior que 2000).`,

  semestreInvalido: (): string =>
    `O semestre deve ser 1 ou 2.`,
}
