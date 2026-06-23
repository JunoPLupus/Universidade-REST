/**
 * Dados necessarios para editar um professor existente.
 *
 * O professor a ser editado e identificado pela `matricula` informada
 * separadamente ao `ProfessorService.atualizar`. Matricula, e-mail, CPF e role
 * sao imutaveis apos o cadastro. Todos os campos sao opcionais: apenas os
 * informados sao alterados.
 */
export type ProfessorEdicaoDTO = {
  nome?: string
  especialidade?: string
  titulacao?: string
  senha?: string
}
