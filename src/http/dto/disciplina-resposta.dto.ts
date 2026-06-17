/**
 * Formato de resposta de Disciplina retornado pela API.
 *
 * Em vez do código do curso (`codCurso`), expõe o nome do curso ao qual
 * a disciplina pertence (`curso`).
 */
export type DisciplinaRespostaDTO = {
  codigo: string;
  curso: string;
  periodo: number;
  nome: string;
  cargaHoraria: number;
}
