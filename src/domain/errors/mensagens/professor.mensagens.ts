/**
 * Mensagens de erro relacionadas a Professor.
 *
 * Centraliza os textos usados pelas entidades e services, evitando strings
 * hardcoded espalhadas pelo codigo e facilitando alteracoes futuras de
 * texto em um unico lugar. Use aspas simples ao redor de valores
 * interpolados (ex: matriculas) para evitar `\"` na resposta JSON.
 */
export const professorMensagens = {
  naoEncontrado: (matricula: string): string =>
    `Professor com matricula '${matricula}' nao encontrado.`,

  especialidadeInvalida: (min: number, max: number): string =>
    `A especialidade deve ter entre ${min} e ${max} caracteres.`,

  titulacaoInvalida: (): string =>
    'A titulacao deve ser: LICENCIADO, ESPECIALISTA, MESTRE ou DOUTOR.',
}
