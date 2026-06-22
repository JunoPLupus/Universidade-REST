/**
 * Dados necessários para editar um professor existente.
 *
 * O professor a ser editado é identificado pela `matricula` informada
 * separadamente ao `ProfessorService.atualizar`. E-mail e CPF são
 * imutáveis após o cadastro. Todos os campos são opcionais: apenas os
 * informados são alterados.
 */
export type ProfessorEdicaoDTO = {
  especialidade?: string
  titulacao?: string
  senha?: string
}
