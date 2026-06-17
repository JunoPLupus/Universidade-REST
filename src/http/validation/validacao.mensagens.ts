/**
 * Mensagens de erro usadas pelo `Validador` ao checar o formato do corpo da
 * requisição (presença e tipo dos campos).
 *
 * Centraliza os textos para evitar strings hardcoded espalhadas e facilitar
 * alterações futuras de texto em um único lugar. Use aspas simples ao redor
 * de valores interpolados (ex: nomes de campo) para evitar `\"` na resposta JSON.
 */
export const validacaoMensagens = {
  campoObrigatorio: (campo: string): string => `O campo '${campo}' é obrigatório.`,

  campoDeveSerTexto: (campo: string): string => `O campo '${campo}' deve ser um texto.`,

  campoDeveSerNumero: (campo: string): string => `O campo '${campo}' deve ser um número.`,
}
