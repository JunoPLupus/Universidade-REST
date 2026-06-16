import { Disciplina } from '../entities/disciplina/disciplina.entity';

/**
 * Dados necessários para cadastrar uma nova disciplina.
 *
 * O `codigo` não faz parte do DTO: é gerado internamente pelo
 * `DisciplinaService` a partir do último código cadastrado no curso
 * informado em `codCurso`.
 */
export type DisciplinaCadastroDTO = Pick<Disciplina, 'codCurso' | 'periodo' | 'nome' | 'cargaHoraria'>
