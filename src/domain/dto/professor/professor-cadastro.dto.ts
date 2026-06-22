/**
 * Dados necessários para cadastrar um novo professor.
 *
 * A `matricula` não faz parte do DTO: é gerada internamente pelo
 * `ProfessorService` a partir do último número sequencial do ano corrente.
 * `especialidade` e `titulacao` são opcionais no momento do cadastro.
 */
export type ProfessorCadastroDTO = {
  email: string
  cpf: string
  nome: string
  senha: string
  especialidade?: string
  titulacao?: string
}
