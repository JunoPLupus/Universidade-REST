import { DisciplinaProps } from '../entities/disciplina/disciplina.props';

/**
 * Dados necessários para editar uma disciplina existente.
 *
 * A disciplina a ser editada é identificada pelo `codigo` informado
 * separadamente ao `DisciplinaService.editar`. O curso (`codCurso`) ao
 * qual a disciplina pertence não pode ser alterado por aqui.
 */
export type DisciplinaEdicaoDTO = Pick<DisciplinaProps, 'periodo' | 'nome' | 'cargaHoraria'>
