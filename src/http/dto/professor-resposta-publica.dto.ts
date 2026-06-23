/**
 * Visão pública de Professor — exposta a requisições não autenticadas
 * ou de professores que não são donos do registro.
 */
export type ProfessorRespostaPublicaDTO = {
  matricula: string;
  nome: string;
}
