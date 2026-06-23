import { Lecionamento } from '../../entities/lecionamento/lecionamento.entity';

/**
 * DTO de cadastro de Lecionamento.
 *
 * Todos os campos são obrigatórios: o admin informa o código do semestre
 * (ex: "2026.2"), que é criado automaticamente caso não exista ainda.
 */
export type LecionamentoCadastroDTO = Pick<
  Lecionamento,
  'codDisciplina' | 'matProfessor' | 'codSemestre' | 'turno' | 'diaSemana'
>
