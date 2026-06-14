import { CursoProps } from '../entities/curso/curso.props';

/**
 * Dados necessários para editar um curso existente.
 *
 * O curso a ser editado é identificado pelo `codigo` informado
 * separadamente ao `CursoService.editar`.
 */
export type CursoEdicaoDTO = Pick<CursoProps, 'nome' | 'periodos'>
