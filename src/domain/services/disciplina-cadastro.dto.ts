import { DisciplinaProps } from '../entities/disciplina/disciplina.props';

/**
 * Dados necessários para cadastrar uma nova disciplina.
 *
 * O `codigo` não faz parte do DTO: é gerado internamente pelo
 * `DisciplinaService` a partir do último código cadastrado no curso
 * informado em `codCurso`.
 */
export type DisciplinaCadastroDTO = Pick<DisciplinaProps, 'codCurso' | 'periodo' | 'nome' | 'cargaHoraria'>
