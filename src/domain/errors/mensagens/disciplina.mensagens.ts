/**
 * Mensagens de erro relacionadas a Disciplina.
 *
 * Centraliza os textos usados pelas entidades e services, evitando strings
 * hardcoded espalhadas pelo código e facilitando alterações futuras de
 * texto em um único lugar. Use aspas simples ao redor de valores
 * interpolados (ex: códigos, nomes) para evitar `\"` na resposta JSON.
 */
export const disciplinaMensagens = {
  naoEncontrada: (codigo: string): string => `Disciplina com código '${codigo}' não encontrada.`,

  nomeDuplicado: (nome: string): string =>
    `Já existe uma disciplina chamada '${nome}' cadastrada nesse curso.`,

  nomeInvalido: (): string => 'O nome da disciplina é obrigatório.',

  periodoInvalido: (min: number): string => `O período da disciplina deve ser no mínimo ${min}.`,

  periodoExcedeCurso: (totalPeriodos: number): string =>
    `O período da disciplina não pode ser maior que o total de períodos do curso (${totalPeriodos}).`,

  cargaHorariaInvalida: (): string => 'A carga horária deve ser maior que zero.',
}
