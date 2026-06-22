/**
 * Formato de resposta de Professor retornado pela API.
 */
export type ProfessorRespostaDTO = {
  matricula: string;
  email: string;
  nome: string;
  cpf: string;
  especialidade: string | null;
  titulacao: string | null;
}
