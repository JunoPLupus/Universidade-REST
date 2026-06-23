import { Lecionamento } from '../../entities/lecionamento/lecionamento.entity';

/**
 * DTO de edição de Lecionamento.
 *
 * Todos os campos são opcionais; campos não informados mantêm o valor atual.
 */
export type LecionamentoEdicaoDTO = Partial<
  Pick<Lecionamento, 'codDisciplina' | 'matProfessor' | 'codSemestre' | 'turno' | 'diaSemana'>
>
