import { Texto } from '../../value-objects/texto/texto.value-object';

/**
 * Props da entidade `Lecionamento`.
 *
 * `turno` e `diaSemana` chegam como value objects validados; os demais campos
 * são strings simples (códigos de relacionamento). A `LecionamentoFactory` é
 * responsável por montar esse objeto.
 */
export type LecionamentoProps = {
  codigo: string,
  codDisciplina: string,
  matProfessor: string,
  codSemestre: string,
  turno: Texto,
  diaSemana: Texto
}
