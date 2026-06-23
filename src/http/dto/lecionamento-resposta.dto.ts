/**
 * Formato de resposta de Lecionamento retornado pela API.
 *
 * Inclui projeções parciais de Disciplina e Professor para evitar
 * ciclos de serialização JSON (Lecionamento → Disciplina → Lecionamento).
 */
export type LecionamentoRespostaDTO = {
  codigo: string,
  disciplina: {
    codigo: string,
    curso: string,
    nome: string,
    periodo: number
  },
  professor: {
    matricula: string,
    nome: string
  },
  semestre: string,
  turno: string,
  diaSemana: string
}
