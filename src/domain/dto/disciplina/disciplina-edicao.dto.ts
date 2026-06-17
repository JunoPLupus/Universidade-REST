import { Disciplina } from '../../entities/disciplina/disciplina.entity';

/**
 * Dados necessários para editar uma disciplina existente.
 *
 * A disciplina a ser editada é identificada pelo `codigo` informado
 * separadamente ao `DisciplinaService.editar`. O curso (`codCurso`) ao
 * qual a disciplina pertence não pode ser alterado por aqui. Todos os campos
 * são opcionais: apenas os campos informados são alterados, os demais mantêm
 * o valor atual.
 */
export type DisciplinaEdicaoDTO = Partial<Pick<Disciplina, 'periodo' | 'nome' | 'cargaHoraria'>>
