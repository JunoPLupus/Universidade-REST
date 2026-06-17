import { Curso } from '../../entities/curso/curso.entity';

/**
 * Dados necessários para editar um curso existente.
 *
 * O curso a ser editado é identificado pelo `codigo` informado
 * separadamente ao `CursoService.editar`. Todos os campos são opcionais:
 * apenas os campos informados são alterados, os demais mantêm o valor atual.
 */
export type CursoEdicaoDTO = Partial<Pick<Curso, 'nome' | 'periodos'>>
