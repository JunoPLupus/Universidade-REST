/**
 * Mensagens de erro relacionadas a Curso.
 *
 * Centraliza os textos usados pelas entidades e services, evitando strings
 * hardcoded espalhadas pelo código e facilitando alterações futuras de
 * texto em um único lugar. Use aspas simples ao redor de valores
 * interpolados (ex: códigos, nomes) para evitar `\"` na resposta JSON.
 */
export const cursoMensagens = {
  naoEncontrado: (codigo: string): string => `Curso com código '${codigo}' não encontrado.`,

  nomeDuplicado: (nome: string): string => `Já existe um curso cadastrado com o nome '${nome}'.`,

  nomeInvalido: (min: number, max: number): string =>
    `O nome do curso deve ter entre ${min} e ${max} caracteres.`,

  periodosInvalido: (min: number, max: number): string =>
    `O curso deve ter entre ${min} e ${max} períodos.`,

  possuiDisciplinasVinculadas: (): string =>
    'Não é possível excluir um curso que possui disciplinas cadastradas.',
}
